"""Teilbereiche (z. B. Garage, Nebengebäude) – bis zu drei je Safe-Home-Instanz.

Ein Teilbereich kennt nur „Scharf“ und „Unscharf“, hat eigene Sensoren, eigene Ein- und
Ausgangsverzögerung, optional einen Zeitplan (Kernzeiten mit Wochentagen) und eine eigene
Anwesenheits-Automatik. Alarme laufen über die gemeinsamen Ausgänge der Alarmanlage
(Sirene, Push, WhatsApp, Licht) und nennen immer den Namen des Teilbereichs.
"""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime, timedelta
import logging
from typing import TYPE_CHECKING, Any

from homeassistant.components.alarm_control_panel import AlarmControlPanelState
from homeassistant.const import STATE_HOME, STATE_OFF, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, callback
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.util import dt as dt_util

if TYPE_CHECKING:
    from .controller import SafeHomeController

_LOGGER = logging.getLogger(__name__)

S = AlarmControlPanelState
INVALID = {None, STATE_UNAVAILABLE, STATE_UNKNOWN}
MAX_ZONES = 3
ZONE_IDS = ("z1", "z2", "z3")

ZONE_DEFAULTS: dict[str, Any] = {
    "name": "",
    "sensors": [],
    "delayed_sensors": [],
    "exit_delay": 30,
    "entry_delay": 15,
    "schedule_enabled": False,
    "arm_time": "22:00:00",
    "disarm_time": "06:00:00",
    "days": [0, 1, 2, 3, 4, 5, 6],  # 0 = Montag
    "presence_enabled": False,
    "persons": [],
}


def _parse(value: str, fallback: str):
    from .controller import _parse_time  # noqa: PLC0415 – Hilfsfunktion der Alarmanlage

    return _parse_time(value, fallback)


class SafeHomeZone:
    """Ein Teilbereich mit eigenem Zustand."""

    def __init__(self, ctrl: SafeHomeController, cfg: dict[str, Any]) -> None:
        self.ctrl = ctrl
        self.hass = ctrl.hass
        self.cfg = {**ZONE_DEFAULTS, **cfg}
        self.id: str = str(cfg["id"])
        self.name: str = str(self.cfg["name"] or self.id)
        self.state: AlarmControlPanelState = S.DISARMED
        self.delay_until: datetime | None = None
        self.delay_total: int = 0
        self.trigger_cause: str | None = None
        self.trigger_sensors: list[str] = []
        self.triggered_at: datetime | None = None
        self.bypassed: set[str] = set()
        self.armed_by_automation: bool = False
        self.last_changed_by: str | None = None
        self.silent_reason: str | None = None
        self._persons_home: dict[str, bool] = {}
        self._unsubs: list[Callable[[], None]] = []
        self._timer_delay: Callable[[], None] | None = None
        self._timer_alarm: Callable[[], None] | None = None
        self._timer_siren: Callable[[], None] | None = None
        self._timer_auto_arm: Callable[[], None] | None = None

    # ------------------------------------------------------------------ Eigenschaften
    @property
    def sensors(self) -> list[str]:
        return list(self.cfg["sensors"] or [])

    @property
    def delayed(self) -> list[str]:
        return [s for s in self.cfg["delayed_sensors"] or [] if s in self.sensors]

    @property
    def persons(self) -> list[str]:
        return list(self.cfg["persons"] or []) if self.cfg["presence_enabled"] else []

    @property
    def people_home(self) -> int:
        return sum(1 for v in self._persons_home.values() if v)

    def t(self, de: str, **kw) -> str:
        return self.ctrl.t(de, **kw)

    def _log(self, kind: str, message: str) -> None:
        self.ctrl._log(kind, f"{self.name}: {message}")  # noqa: SLF001

    def _update(self) -> None:
        self.ctrl._async_update()  # noqa: SLF001

    def open_sensors(self) -> list[str]:
        return [s for s in self.sensors if (st := self.hass.states.get(s)) is not None and st.state == STATE_ON]

    def attributes(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "state": str(self.state),
            "delay_until": self.delay_until.isoformat() if self.delay_until else None,
            "delay_total": self.delay_total,
            "trigger_cause": self.trigger_cause,
            "triggered_sensors": list(self.trigger_sensors),
            "open_sensors": self.open_sensors(),
            "bypassed_sensors": sorted(self.bypassed),
            "sensors": self.sensors,
            "silent_alarm": bool(self.silent_reason) and self.state == S.TRIGGERED,
            "changed_by": self.last_changed_by,
            "schedule": (
                f"{str(self.cfg['arm_time'])[:5]}–{str(self.cfg['disarm_time'])[:5]}" if self.cfg["schedule_enabled"] else None
            ),
            "people_home": self.people_home if self.persons else None,
        }

    def save_data(self) -> dict[str, Any]:
        return {"state": str(self.state), "armed_by_automation": self.armed_by_automation}

    # ------------------------------------------------------------------ Start / Stopp
    @callback
    def start(self, stored: dict[str, Any] | None) -> None:
        stored = stored or {}
        if stored.get("state") in (S.ARMED_AWAY, S.ARMING, S.PENDING, S.TRIGGERED):
            self.state = S.ARMED_AWAY
            self.armed_by_automation = bool(stored.get("armed_by_automation"))
            self._log("info", self.t("Nach Neustart wiederhergestellt: scharf"))
        for p in self.persons:
            st = self.hass.states.get(p)
            self._persons_home[p] = bool(st and st.state == STATE_HOME)
        if self.sensors:
            self._unsubs.append(async_track_state_change_event(self.hass, self.sensors, self._handle_sensor))
        if self.persons:
            self._unsubs.append(async_track_state_change_event(self.hass, self.persons, self._handle_person))
        if self.cfg["schedule_enabled"]:
            arm = _parse(self.cfg["arm_time"], ZONE_DEFAULTS["arm_time"])
            off = _parse(self.cfg["disarm_time"], ZONE_DEFAULTS["disarm_time"])
            self._unsubs.append(
                async_track_time_change(self.hass, self._schedule_arm, hour=arm.hour, minute=arm.minute, second=arm.second)
            )
            self._unsubs.append(
                async_track_time_change(self.hass, self._schedule_disarm, hour=off.hour, minute=off.minute, second=off.second)
            )

    @callback
    def stop(self) -> None:
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        self._cancel_delay()
        self._cancel_alarm_timers()
        self._cancel_auto_arm()

    # ------------------------------------------------------------------ Schalten
    async def async_arm(self, source: str | None = None, skip_delay: bool = False, auto: bool = False) -> bool:
        source = source or self.t("Manuell")
        if self.state in (S.TRIGGERED, S.PENDING):
            return False
        if self.state in (S.ARMED_AWAY, S.ARMING):
            return True
        self._cancel_auto_arm()
        open_now = self.open_sensors()
        if open_now:
            names = ", ".join(self.ctrl.friendly(e) for e in open_now)
            if self.ctrl.opt("open_sensor_policy") == "block":
                self._log("warning", self.t("Scharfschalten blockiert – offen: {names}", names=names))
                await self.ctrl._async_notify(  # noqa: SLF001
                    self.t("⚠️ {zone}: Scharfschalten blockiert", zone=self.name),
                    self.t("Offen: {names} ({source})", names=names, source=source),
                )
                self._update()
                return False
            self.bypassed = set(open_now)
            self._log("bypass", self.t("Überbrückt (offen): {names}", names=names))
        else:
            self.bypassed = set()
        self.armed_by_automation = auto
        self.last_changed_by = source
        delay = 0 if skip_delay else int(self.cfg["exit_delay"] or 0)
        if delay > 0:
            self.state = S.ARMING
            self._start_delay(delay, self._finish_arming)
            self._log("arming", self.t("wird in {delay} s scharf ({source})", delay=delay, source=source))
            self._update()
        else:
            self._set_armed(source)
        return True

    @callback
    def _finish_arming(self, _now: datetime | None = None) -> None:
        self._timer_delay = None
        self._set_armed(self.last_changed_by or self.t("Manuell"))

    @callback
    def _set_armed(self, source: str) -> None:
        self.state = S.ARMED_AWAY
        self.delay_until = None
        self.delay_total = 0
        self._log("armed", self.t("scharf ({source})", source=source))
        self._update()

    async def async_skip_exit_delay(self, source: str | None = None) -> bool:
        if self.state != S.ARMING:
            return False
        self._cancel_delay()
        self._log("info", self.t("Ausgangsverzögerung übersprungen ({source})", source=source or self.t("Manuell")))
        self._set_armed(source or self.t("Manuell"))
        return True

    async def async_disarm(self, source: str | None = None) -> None:
        source = source or self.t("Manuell")
        previous = self.state
        self._cancel_delay()
        self._cancel_alarm_timers()
        self._cancel_auto_arm()
        self.state = S.DISARMED
        self.trigger_cause = None
        self.trigger_sensors = []
        self.silent_reason = None
        self.bypassed = set()
        self.armed_by_automation = False
        self.last_changed_by = source
        await self.ctrl.async_zone_alarm_end(self, source, was_alarm=previous in (S.TRIGGERED, S.PENDING))
        if previous != S.DISARMED:
            self._log("disarmed", self.t("unscharf ({source})", source=source))
        self._update()

    async def async_trigger(self, cause: str) -> None:
        if self.state == S.TRIGGERED:
            return
        self._cancel_delay()
        self.state = S.TRIGGERED
        self.trigger_cause = cause
        self.triggered_at = dt_util.utcnow()
        self._log("triggered", self.t("ALARM: {cause}", cause=cause))
        self._update()
        await self.ctrl.async_zone_alarm(self, cause)
        self._start_alarm_timers()

    # ------------------------------------------------------------------ Alarmdauer / Sirene
    @callback
    def _start_alarm_timers(self) -> None:
        self._cancel_alarm_timers()
        alarm = self.ctrl.alarm_duration()
        siren = self.ctrl.siren_duration()
        if alarm > 0:
            self._timer_alarm = async_call_later(self.hass, alarm, self._alarm_elapsed)
        if siren > 0 and (alarm == 0 or siren < alarm):
            self._timer_siren = async_call_later(self.hass, siren, self._siren_elapsed)

    @callback
    def _siren_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_siren = None
        if self.state == S.TRIGGERED:
            self._log("info", self.t("Akustischer Alarm beendet – Alarm bleibt still bestehen"))
            self.hass.async_create_task(self.ctrl._async_sirens(False, self.id))  # noqa: SLF001
            self._update()

    @callback
    def _alarm_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_alarm = None
        self._cancel_alarm_timers()
        if self.state != S.TRIGGERED:
            return
        self.hass.async_create_task(self.ctrl._async_sirens(False, self.id))  # noqa: SLF001
        if self.ctrl.opt("rearm_after_trigger"):
            self.bypassed |= set(self.open_sensors())
            self.state = S.ARMED_AWAY
            self.trigger_cause = None
            self._log("armed", self.t("Alarmzeit abgelaufen – wieder scharf"))
        else:
            self._log("info", self.t("Alarmzeit abgelaufen – Sirene aus, Alarm bleibt bestehen"))
        self._update()

    @callback
    def _cancel_alarm_timers(self) -> None:
        for name in ("_timer_alarm", "_timer_siren"):
            unsub = getattr(self, name)
            if unsub:
                unsub()
                setattr(self, name, None)

    # ------------------------------------------------------------------ Verzögerung
    @callback
    def _start_delay(self, seconds: int, action: Callable[[datetime], None]) -> None:
        self._cancel_delay()
        self.delay_total = seconds
        self.delay_until = dt_util.utcnow() + timedelta(seconds=seconds)
        self._timer_delay = async_call_later(self.hass, seconds, action)

    @callback
    def _cancel_delay(self) -> None:
        if self._timer_delay:
            self._timer_delay()
            self._timer_delay = None
        self.delay_until = None
        self.delay_total = 0

    @callback
    def _cancel_auto_arm(self) -> None:
        if self._timer_auto_arm:
            self._timer_auto_arm()
            self._timer_auto_arm = None

    # ------------------------------------------------------------------ Sensoren
    @callback
    def _handle_sensor(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        old = event.data.get("old_state")
        new = event.data.get("new_state")
        old_state = old.state if old else None
        new_state = new.state if new else None
        if new_state == STATE_UNAVAILABLE and old_state not in INVALID and self.state == S.ARMED_AWAY:
            name = self.ctrl.friendly(entity_id)
            self._log("warning", self.t("Sensor nicht erreichbar: {name}", name=name))
            if self.ctrl.opt("tamper_notify"):
                self.hass.async_create_task(
                    self.ctrl._async_notify(  # noqa: SLF001
                        self.t("📡 {zone}: Sensor nicht erreichbar", zone=self.name),
                        self.t("{name} meldet sich nicht mehr, während {zone} scharf ist.", name=name, zone=self.name),
                    )
                )
            self._update()
            return
        if new_state == STATE_OFF and entity_id in self.bypassed:
            self.bypassed.discard(entity_id)
            self._update()
            return
        if not (old_state == STATE_OFF and new_state == STATE_ON) or entity_id in self.bypassed:
            self._update()
            return
        if self.state == S.TRIGGERED:
            if entity_id not in self.trigger_sensors:
                self.trigger_sensors = [*self.trigger_sensors, entity_id]
            self._update()
            return
        if self.state != S.ARMED_AWAY:
            return
        name = self.ctrl.friendly(entity_id)
        self.trigger_sensors = [entity_id]
        cause = self.t("{name} ausgelöst", name=name)
        entry = int(self.cfg["entry_delay"] or 0)
        if entity_id in self.delayed and entry > 0:
            self.state = S.PENDING
            self.trigger_cause = cause
            self._start_delay(entry, self._entry_elapsed)
            self._log("pending", self.t("Eingangsverzögerung {delay} s: {name}", delay=entry, name=name))
            self._update()
            return
        self.hass.async_create_task(self.async_trigger(cause))

    @callback
    def _entry_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_delay = None
        if self.state == S.PENDING:
            self.hass.async_create_task(self.async_trigger(self.trigger_cause or self.t("Eingangsverzögerung abgelaufen")))

    # ------------------------------------------------------------------ Anwesenheit
    @callback
    def _handle_person(self, event: Event[EventStateChangedData]) -> None:
        new = event.data.get("new_state")
        if new is None or new.state in INVALID:
            return
        before = self.people_home
        self._persons_home[event.data["entity_id"]] = new.state == STATE_HOME
        after = self.people_home
        name = self.ctrl.friendly(event.data["entity_id"])
        if after == 0 and before > 0 and self.state == S.DISARMED:
            delay = int(self.ctrl.opt("auto_arm_delay") or 0)
            self._cancel_auto_arm()
            self._log("info", self.t("Alle haben das Haus verlassen (zuletzt {name})", name=name))
            if delay > 0:
                self._timer_auto_arm = async_call_later(self.hass, delay, self._auto_arm_elapsed)
            else:
                self.hass.async_create_task(self.async_arm(self.t("Automatik: Alle unterwegs"), skip_delay=True, auto=True))
        elif after > before:
            self._cancel_auto_arm()
            if self.state in (S.ARMED_AWAY, S.ARMING, S.PENDING, S.TRIGGERED):
                self.hass.async_create_task(self.async_disarm(self.t("Automatik: {name} ist zuhause", name=name)))
        self._update()

    @callback
    def _auto_arm_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_auto_arm = None
        if self.people_home == 0 and self.state == S.DISARMED:
            self.hass.async_create_task(self.async_arm(self.t("Automatik: Alle unterwegs"), skip_delay=True, auto=True))

    # ------------------------------------------------------------------ Zeitplan (Kernzeiten)
    @callback
    def _schedule_arm(self, now: datetime) -> None:
        day = dt_util.as_local(now or dt_util.utcnow()).weekday()
        if day not in (self.cfg["days"] or []) or self.state != S.DISARMED:
            return
        if self.persons and self.people_home > 0:
            self._log("info", self.t("Zeitplan: jemand ist da – bleibt unscharf"))
            self._update()
            return
        self.hass.async_create_task(self.async_arm(self.t("Zeitplan"), auto=True))

    @callback
    def _schedule_disarm(self, _now: datetime) -> None:
        if self.state in (S.ARMED_AWAY, S.ARMING):
            self.hass.async_create_task(self.async_disarm(self.t("Zeitplan")))
