"""Alarm-Logik von Safe Home.

Der Controller hält den Zustand der Alarmanlage, überwacht Sensoren und
Personen, steuert Verzögerungen, Sirenen, Licht, Sprachausgabe und
Benachrichtigungen. Alle Entitäten der Integration lesen ihren Zustand
von hier und werden über ein Dispatcher-Signal aktualisiert.
"""

from __future__ import annotations

from collections import deque
from collections.abc import Callable
from datetime import datetime, time, timedelta
import logging
from typing import Any

from homeassistant.components.alarm_control_panel import AlarmControlPanelState
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    ATTR_ENTITY_ID,
    STATE_HOME,
    STATE_OFF,
    STATE_ON,
    STATE_UNAVAILABLE,
    STATE_UNKNOWN,
)
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    ACTION_DISARM,
    ACTION_SILENCE,
    CONF_ALARM_LIGHTS,
    CONF_AUTO_ARM,
    CONF_AUTO_ARM_DELAY,
    CONF_AUTO_DISARM,
    CONF_AWAY_SENSORS,
    CONF_CAMERAS,
    CONF_CRITICAL,
    CONF_DELAYED_SENSORS,
    CONF_ENTRY_DELAY_AWAY,
    CONF_ENTRY_DELAY_NIGHT,
    CONF_EXIT_DELAY_AWAY,
    CONF_EXIT_DELAY_NIGHT,
    CONF_MEDIA_PLAYERS,
    CONF_NIGHT_AUTO,
    CONF_NIGHT_END,
    CONF_NIGHT_ONLY_HOME,
    CONF_NIGHT_SENSORS,
    CONF_NIGHT_START,
    CONF_NOTIFY_DISARM_ACTION,
    CONF_NOTIFY_SERVICES,
    CONF_NOTIFY_STATE_CHANGES,
    CONF_NOTIFY_WRONG_CODE,
    CONF_OPEN_POLICY,
    CONF_PERSONS,
    CONF_REARM,
    CONF_SIRENS,
    CONF_TAMPER_NOTIFY,
    CONF_TRIGGER_TIME,
    CONF_TTS_ENTITY,
    DEFAULTS,
    DOMAIN,
    EVENT_STATE_CHANGED,
    EVENT_TRIGGERED,
    MAX_EVENTS,
    MODE_AWAY,
    MODE_LABELS,
    MODE_NIGHT,
    NAME,
    OPEN_POLICY_BLOCK,
    STORAGE_VERSION,
    signal_update,
)

_LOGGER = logging.getLogger(__name__)

S = AlarmControlPanelState
ARMED_STATES = {S.ARMED_AWAY, S.ARMED_NIGHT}
MODE_TO_STATE = {MODE_AWAY: S.ARMED_AWAY, MODE_NIGHT: S.ARMED_NIGHT}
STATE_TO_MODE = {S.ARMED_AWAY: MODE_AWAY, S.ARMED_NIGHT: MODE_NIGHT}
INVALID_STATES = {None, STATE_UNAVAILABLE, STATE_UNKNOWN}


def _parse_time(value: str | None, fallback: str) -> time:
    """'HH:MM[:SS]' in ein time-Objekt wandeln."""
    for candidate in (value, fallback):
        if not candidate:
            continue
        try:
            parts = [int(p) for p in str(candidate).split(":")]
            while len(parts) < 3:
                parts.append(0)
            return time(parts[0], parts[1], parts[2])
        except (ValueError, IndexError):
            continue
    return time(0, 0, 0)


class SafeHomeController:
    """Zentrale Logik einer Safe-Home-Instanz."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        self.hass = hass
        self.entry = entry
        self.name: str = entry.title or NAME
        self._store: Store = Store(
            hass, STORAGE_VERSION, f"{DOMAIN}.{entry.entry_id}"
        )

        self.state: AlarmControlPanelState = S.DISARMED
        self.armed_mode: str | None = None  # Modus während armed/pending/triggered
        self.arming_target: str | None = None  # Ziel während Ausgangsverzögerung
        self.delay_until: datetime | None = None
        self.delay_total: int = 0
        self.trigger_cause: str | None = None
        self.triggered_at: datetime | None = None
        self.siren_active: bool = False
        self.bypassed: set[str] = set()
        self.events: deque[dict[str, Any]] = deque(maxlen=MAX_EVENTS)
        self.last_changed_by: str | None = None

        self.auto_mode: bool = True
        self.night_auto: bool = False

        self._persons_home: dict[str, bool] = {}
        self._lights_on_by_alarm: list[str] = []
        self._unsubs: list[Callable[[], None]] = []
        self._timer_delay: Callable[[], None] | None = None
        self._timer_siren: Callable[[], None] | None = None
        self._timer_auto_arm: Callable[[], None] | None = None

    # ------------------------------------------------------------------
    # Konfiguration
    # ------------------------------------------------------------------
    def opt(self, key: str) -> Any:
        """Option mit Standardwert lesen."""
        value = self.entry.options.get(key, DEFAULTS.get(key))
        if value is None:
            return DEFAULTS.get(key)
        return value

    @property
    def away_sensors(self) -> list[str]:
        return list(self.opt(CONF_AWAY_SENSORS) or [])

    @property
    def night_sensors(self) -> list[str]:
        return list(self.opt(CONF_NIGHT_SENSORS) or [])

    @property
    def delayed_sensors(self) -> list[str]:
        return list(self.opt(CONF_DELAYED_SENSORS) or [])

    @property
    def persons(self) -> list[str]:
        return list(self.opt(CONF_PERSONS) or [])

    @property
    def all_sensors(self) -> list[str]:
        return sorted(set(self.away_sensors) | set(self.night_sensors))

    def sensors_for_mode(self, mode: str | None) -> list[str]:
        if mode == MODE_AWAY:
            return self.away_sensors
        if mode == MODE_NIGHT:
            return self.night_sensors
        return []

    @property
    def active_mode(self) -> str | None:
        """Modus, dessen Sensoren gerade relevant sind."""
        if self.state == S.ARMING:
            return self.arming_target
        if self.state in (S.ARMED_AWAY, S.ARMED_NIGHT, S.PENDING, S.TRIGGERED):
            return self.armed_mode
        return None

    @property
    def mode_label(self) -> str:
        if self.state == S.DISARMED:
            return MODE_LABELS["disarmed"]
        return MODE_LABELS.get(self.active_mode or "", "")

    @property
    def people_home(self) -> int:
        return sum(1 for home in self._persons_home.values() if home)

    def open_sensors(self, mode: str | None = None) -> list[str]:
        """Aktuell offene / aktive Sensoren (optional nur für einen Modus)."""
        sensors = self.sensors_for_mode(mode) if mode else self.all_sensors
        result = []
        for entity_id in sensors:
            st = self.hass.states.get(entity_id)
            if st is not None and st.state == STATE_ON:
                result.append(entity_id)
        return result

    def friendly(self, entity_id: str) -> str:
        st = self.hass.states.get(entity_id)
        if st is not None and st.attributes.get("friendly_name"):
            return str(st.attributes["friendly_name"])
        return entity_id

    # ------------------------------------------------------------------
    # Start / Stop
    # ------------------------------------------------------------------
    async def async_start(self) -> None:
        """Gespeicherten Zustand laden und Listener registrieren."""
        stored = await self._store.async_load() or {}
        self.auto_mode = bool(
            stored.get(
                "auto_mode",
                bool(self.opt(CONF_AUTO_ARM) or self.opt(CONF_AUTO_DISARM)),
            )
        )
        self.night_auto = bool(stored.get("night_auto", self.opt(CONF_NIGHT_AUTO)))
        for item in stored.get("events", [])[-MAX_EVENTS:]:
            self.events.append(item)

        restored_mode = stored.get("armed_mode")
        if stored.get("state") in (
            S.ARMED_AWAY,
            S.ARMED_NIGHT,
            S.PENDING,
            S.TRIGGERED,
            S.ARMING,
        ) and restored_mode in MODE_TO_STATE:
            self.armed_mode = restored_mode
            self.state = MODE_TO_STATE[restored_mode]
            self._log(
                "info",
                f"Nach Neustart wiederhergestellt: {MODE_LABELS[restored_mode]}",
            )

        # Personen initialisieren
        for entity_id in self.persons:
            st = self.hass.states.get(entity_id)
            self._persons_home[entity_id] = bool(st and st.state == STATE_HOME)

        if self.all_sensors:
            self._unsubs.append(
                async_track_state_change_event(
                    self.hass, self.all_sensors, self._handle_sensor_event
                )
            )
        if self.persons:
            self._unsubs.append(
                async_track_state_change_event(
                    self.hass, self.persons, self._handle_person_event
                )
            )

        start = _parse_time(self.opt(CONF_NIGHT_START), DEFAULTS[CONF_NIGHT_START])
        end = _parse_time(self.opt(CONF_NIGHT_END), DEFAULTS[CONF_NIGHT_END])
        self._unsubs.append(
            async_track_time_change(
                self.hass,
                self._handle_night_start,
                hour=start.hour,
                minute=start.minute,
                second=start.second,
            )
        )
        self._unsubs.append(
            async_track_time_change(
                self.hass,
                self._handle_night_end,
                hour=end.hour,
                minute=end.minute,
                second=end.second,
            )
        )
        self._unsubs.append(
            self.hass.bus.async_listen(
                "mobile_app_notification_action", self._handle_notification_action
            )
        )
        self._async_update(save=False)

    async def async_stop(self) -> None:
        """Listener und Timer entfernen."""
        for unsub in self._unsubs:
            unsub()
        self._unsubs.clear()
        self._cancel_delay()
        self._cancel_siren_timer()
        self._cancel_auto_arm()
        await self._async_save()

    # ------------------------------------------------------------------
    # Öffentliche Aktionen
    # ------------------------------------------------------------------
    async def async_arm(
        self, mode: str, source: str = "Manuell", skip_delay: bool = False
    ) -> bool:
        """Alarmanlage in einen Modus schalten. Gibt False zurück, wenn blockiert."""
        if mode not in MODE_TO_STATE:
            return False
        if self.state in (S.TRIGGERED, S.PENDING):
            self._log("warning", "Scharfschalten nicht möglich: Alarm/Eingangsverzögerung aktiv")
            self._async_update()
            return False

        self._cancel_auto_arm()
        open_now = self.open_sensors(mode)
        if open_now:
            names = ", ".join(self.friendly(e) for e in open_now)
            if self.opt(CONF_OPEN_POLICY) == OPEN_POLICY_BLOCK:
                self._log(
                    "warning",
                    f"{MODE_LABELS[mode]} blockiert – offen: {names}",
                )
                await self._async_notify(
                    "⚠️ Scharfschalten blockiert",
                    f"{MODE_LABELS[mode]} konnte nicht aktiviert werden ({source}). "
                    f"Offen: {names}",
                )
                self._async_update()
                return False
            self.bypassed = set(open_now)
            self._log("bypass", f"Überbrückt (offen): {names}")
        else:
            self.bypassed = set()

        self._cancel_delay()
        self.last_changed_by = source
        delay = 0 if skip_delay else int(
            self.opt(CONF_EXIT_DELAY_AWAY if mode == MODE_AWAY else CONF_EXIT_DELAY_NIGHT)
            or 0
        )

        if delay > 0:
            self.state = S.ARMING
            self.arming_target = mode
            self._start_delay(delay, self._finish_arming)
            self._log(
                "arming",
                f"{MODE_LABELS[mode]} wird in {delay} s aktiviert ({source})",
            )
            self._async_update()
        else:
            self._set_armed(mode, source)

        if open_now and self.opt(CONF_OPEN_POLICY) != OPEN_POLICY_BLOCK:
            await self._async_notify(
                "⚠️ Sensoren überbrückt",
                f"Beim Aktivieren von {MODE_LABELS[mode]} waren offen: "
                f"{', '.join(self.friendly(e) for e in open_now)}. "
                "Sie werden überwacht, sobald sie geschlossen sind.",
            )
        return True

    async def async_disarm(self, source: str = "Manuell") -> None:
        """Alarmanlage ausschalten (Zuhause)."""
        previous = self.state
        self._cancel_delay()
        self._cancel_siren_timer()
        self._cancel_auto_arm()
        await self._async_sirens(False)
        await self._async_restore_lights()
        self.state = S.DISARMED
        self.armed_mode = None
        self.arming_target = None
        self.trigger_cause = None
        self.bypassed = set()
        self.last_changed_by = source
        if previous != S.DISARMED:
            self._log("disarmed", f"Zuhause – unscharf ({source})")
            self._fire_state_event()
            if previous in (S.TRIGGERED, S.PENDING) or self.opt(
                CONF_NOTIFY_STATE_CHANGES
            ):
                await self._async_notify(
                    "🏠 Safe Home unscharf",
                    f"Modus Zuhause aktiv. Ausgelöst durch: {source}",
                    critical=False,
                )
        self._async_update()

    async def async_trigger(self, cause: str, source: str = "Sensor") -> None:
        """Alarm auslösen."""
        if self.state == S.TRIGGERED:
            return
        self._cancel_delay()
        if self.armed_mode is None:
            self.armed_mode = self.active_mode
        self.state = S.TRIGGERED
        self.trigger_cause = cause
        self.triggered_at = dt_util.utcnow()
        self.last_changed_by = source
        self._log("triggered", f"ALARM: {cause}")
        self._fire_state_event()
        self.hass.bus.async_fire(
            EVENT_TRIGGERED,
            {
                "entry_id": self.entry.entry_id,
                "name": self.name,
                "cause": cause,
                "mode": self.armed_mode,
            },
        )
        self._async_update()

        await self._async_sirens(True)
        await self._async_alarm_lights()
        await self._async_speak(
            f"Alarm! {cause}. Die Bewohner werden benachrichtigt."
        )
        await self._async_persistent(
            "🚨 Safe Home Alarm",
            f"{cause} – {dt_util.as_local(self.triggered_at).strftime('%d.%m.%Y %H:%M:%S')}",
        )
        await self._async_notify(
            "🚨 ALARM – Safe Home",
            f"{cause}. Modus: {MODE_LABELS.get(self.armed_mode or '', '-')}.",
            critical=True,
            with_actions=True,
            with_camera=True,
        )

        trigger_time = int(self.opt(CONF_TRIGGER_TIME) or 0)
        if trigger_time > 0:
            self._timer_siren = async_call_later(
                self.hass, trigger_time, self._trigger_time_elapsed
            )

    async def async_panic(self, source: str = "Panik-Taste") -> None:
        """Sofortalarm unabhängig vom Modus."""
        await self.async_trigger(f"Panikalarm ({source})", source=source)

    async def async_silence(self, source: str = "Manuell") -> None:
        """Sirenen stummschalten, Alarmzustand bleibt erhalten."""
        self._cancel_siren_timer()
        if self.siren_active:
            await self._async_sirens(False)
            self._log("info", f"Sirene stummgeschaltet ({source})")
            self._async_update()

    async def async_wrong_code(self, action: str) -> None:
        """Falsche PIN protokollieren und ggf. melden."""
        self._log("warning", f"Falscher PIN bei: {action}")
        self._async_update()
        if self.opt(CONF_NOTIFY_WRONG_CODE):
            await self._async_notify(
                "🔐 Falscher PIN",
                f"Es wurde ein falscher PIN eingegeben ({action}).",
                critical=False,
            )

    async def async_test(self, kind: str) -> str:
        """Ausgänge testen (von der Safe-Home-Seite). Gibt eine Rückmeldung zurück."""
        if kind == "notify":
            if not self.opt(CONF_NOTIFY_SERVICES):
                return "Kein Benachrichtigungsdienst ausgewählt"
            await self._async_notify(
                "🧪 Safe Home Test",
                "Diese Testbenachrichtigung kommt von deiner Alarmanlage.",
                critical=False,
                with_camera=True,
            )
            self._log("info", "Testbenachrichtigung gesendet")
            self._async_update()
            return "Testbenachrichtigung gesendet"
        if kind == "siren":
            sirens = list(self.opt(CONF_SIRENS) or [])
            if not sirens:
                return "Keine Sirene ausgewählt"
            if self.state == S.TRIGGERED:
                return "Während eines Alarms nicht möglich"
            await self.hass.services.async_call(
                "homeassistant", "turn_on", {ATTR_ENTITY_ID: sirens}, blocking=False
            )

            @callback
            def _off(_now: datetime) -> None:
                if self.state != S.TRIGGERED:
                    self.hass.async_create_task(
                        self.hass.services.async_call(
                            "homeassistant", "turn_off", {ATTR_ENTITY_ID: sirens}, blocking=False
                        )
                    )

            async_call_later(self.hass, 3, _off)
            self._log("info", "Sirenentest (3 Sekunden)")
            self._async_update()
            return "Sirene läuft 3 Sekunden"
        if kind == "tts":
            if not self.opt(CONF_TTS_ENTITY) or not self.opt(CONF_MEDIA_PLAYERS):
                return "Sprachausgabe und Lautsprecher auswählen"
            await self._async_speak("Dies ist ein Test von Safe Home.")
            return "Testansage gesendet"
        if kind == "lights":
            lights = list(self.opt(CONF_ALARM_LIGHTS) or [])
            if not lights:
                return "Kein Alarmlicht ausgewählt"
            await self._async_alarm_lights()
            self._lights_on_by_alarm, restore = [], list(self._lights_on_by_alarm)

            @callback
            def _restore(_now: datetime) -> None:
                if restore and self.state != S.TRIGGERED:
                    self.hass.async_create_task(
                        self.hass.services.async_call(
                            "light", "turn_off", {ATTR_ENTITY_ID: restore}, blocking=False
                        )
                    )

            async_call_later(self.hass, 5, _restore)
            return "Alarmlicht 5 Sekunden an"
        return "Unbekannter Test"

    @callback
    def set_auto_mode(self, enabled: bool) -> None:
        self.auto_mode = enabled
        if not enabled:
            self._cancel_auto_arm()
        self._log("info", f"Anwesenheits-Automatik {'an' if enabled else 'aus'}")
        self._async_update()

    @callback
    def set_night_auto(self, enabled: bool) -> None:
        self.night_auto = enabled
        self._log("info", f"Nacht-Automatik {'an' if enabled else 'aus'}")
        self._async_update()

    # ------------------------------------------------------------------
    # Interne Zustandswechsel
    # ------------------------------------------------------------------
    @callback
    def _set_armed(self, mode: str, source: str) -> None:
        self.state = MODE_TO_STATE[mode]
        self.armed_mode = mode
        self.arming_target = None
        self.delay_until = None
        self.delay_total = 0
        self._log("armed", f"{MODE_LABELS[mode]} – scharf ({source})")
        self._fire_state_event()
        self._async_update()
        if self.opt(CONF_NOTIFY_STATE_CHANGES):
            icon = "🌙" if mode == MODE_NIGHT else "🛡️"
            self.hass.async_create_task(
                self._async_notify(
                    f"{icon} Safe Home: {MODE_LABELS[mode]}",
                    f"Alarmanlage ist scharf ({source}). "
                    f"{len(self.sensors_for_mode(mode)) - len(self.bypassed)} Sensoren aktiv.",
                    critical=False,
                )
            )

    @callback
    def _finish_arming(self, _now: datetime | None = None) -> None:
        self._timer_delay = None
        if self.state != S.ARMING or not self.arming_target:
            return
        self._set_armed(self.arming_target, self.last_changed_by or "Automatik")

    @callback
    def _entry_delay_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_delay = None
        if self.state == S.PENDING:
            cause = self.trigger_cause or "Eingangsverzögerung abgelaufen"
            self.hass.async_create_task(self.async_trigger(cause))

    @callback
    def _trigger_time_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_siren = None
        self.hass.async_create_task(self._async_after_trigger())

    async def _async_after_trigger(self) -> None:
        if self.state != S.TRIGGERED:
            return
        await self._async_sirens(False)
        if self.opt(CONF_REARM) and self.armed_mode in MODE_TO_STATE:
            mode = self.armed_mode
            # Noch offene Sensoren überbrücken, damit der Alarm nicht sofort erneut auslöst
            self.bypassed |= set(self.open_sensors(mode))
            self.state = MODE_TO_STATE[mode]
            self.trigger_cause = None
            self._log("armed", f"Alarmzeit abgelaufen – wieder {MODE_LABELS[mode]}")
            self._fire_state_event()
        else:
            self._log("info", "Alarmzeit abgelaufen – Sirene aus, Alarm bleibt bestehen")
        self._async_update()

    # ------------------------------------------------------------------
    # Listener
    # ------------------------------------------------------------------
    @callback
    def _handle_sensor_event(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        old = event.data.get("old_state")
        new = event.data.get("new_state")
        old_state = old.state if old else None
        new_state = new.state if new else None

        mode = self.active_mode
        relevant = mode is not None and entity_id in self.sensors_for_mode(mode)

        # Sabotage / Funkverlust
        if (
            new_state == STATE_UNAVAILABLE
            and old_state not in INVALID_STATES
            and relevant
            and self.state in ARMED_STATES
        ):
            self._log("warning", f"Sensor nicht erreichbar: {self.friendly(entity_id)}")
            if self.opt(CONF_TAMPER_NOTIFY):
                self.hass.async_create_task(
                    self._async_notify(
                        "📡 Sensor nicht erreichbar",
                        f"{self.friendly(entity_id)} meldet sich nicht mehr, "
                        "während Safe Home scharf ist.",
                        critical=False,
                    )
                )
            self._async_update()
            return

        # Überbrückter Sensor wird geschlossen -> wieder überwachen
        if new_state == STATE_OFF and entity_id in self.bypassed:
            self.bypassed.discard(entity_id)
            self._log("info", f"{self.friendly(entity_id)} geschlossen – wird wieder überwacht")
            self._async_update()
            return

        # Nur echte Auslösung off -> on (verhindert Fehlalarme beim Neustart)
        if not (old_state == STATE_OFF and new_state == STATE_ON):
            self._async_update(save=False)
            return

        if not relevant or entity_id in self.bypassed:
            self._async_update(save=False)
            return

        if self.state not in ARMED_STATES:
            # ARMING: Ausgangsverzögerung läuft, PENDING/TRIGGERED: bereits aktiv
            self._async_update(save=False)
            return

        name = self.friendly(entity_id)
        entry_delay = int(
            self.opt(CONF_ENTRY_DELAY_AWAY if mode == MODE_AWAY else CONF_ENTRY_DELAY_NIGHT)
            or 0
        )
        if entity_id in self.delayed_sensors and entry_delay > 0:
            self.state = S.PENDING
            self.trigger_cause = f"{name} ausgelöst"
            self._start_delay(entry_delay, self._entry_delay_elapsed)
            self._log("pending", f"Eingangsverzögerung {entry_delay} s: {name}")
            self._fire_state_event()
            self._async_update()
            self.hass.async_create_task(
                self._async_speak(
                    f"Bitte Alarmanlage innerhalb von {entry_delay} Sekunden ausschalten."
                )
            )
            return

        self.hass.async_create_task(self.async_trigger(f"{name} ausgelöst"))

    @callback
    def _handle_person_event(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        new = event.data.get("new_state")
        if new is None or new.state in INVALID_STATES:
            return
        before = self.people_home
        self._persons_home[entity_id] = new.state == STATE_HOME
        after = self.people_home
        if before == after:
            self._async_update(save=False)
            return

        name = self.friendly(entity_id)
        if after == 0 and before > 0:
            self._log("info", f"Alle haben das Haus verlassen (zuletzt {name})")
            if (
                self.auto_mode
                and self.opt(CONF_AUTO_ARM)
                and self.state in (S.DISARMED, S.ARMED_NIGHT)
            ):
                delay = int(self.opt(CONF_AUTO_ARM_DELAY) or 0)
                self._cancel_auto_arm()
                if delay > 0:
                    self._log("info", f"Automatisches Scharfschalten in {delay} s")
                    self._timer_auto_arm = async_call_later(
                        self.hass, delay, self._auto_arm_elapsed
                    )
                else:
                    self.hass.async_create_task(
                        self.async_arm(MODE_AWAY, "Automatik: Alle unterwegs", skip_delay=True)
                    )
        elif before == 0 and after > 0:
            self._cancel_auto_arm()
            if (
                self.auto_mode
                and self.opt(CONF_AUTO_DISARM)
                and (
                    self.state in (S.ARMED_AWAY, S.PENDING, S.TRIGGERED)
                    or (self.state == S.ARMING and self.arming_target == MODE_AWAY)
                )
                and self.active_mode == MODE_AWAY
            ):
                self.hass.async_create_task(
                    self.async_disarm(f"Automatik: {name} ist zuhause")
                )
        self._async_update()

    @callback
    def _auto_arm_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_auto_arm = None
        if self.people_home == 0 and self.state in (S.DISARMED, S.ARMED_NIGHT):
            # Exit-Verzögerung überspringen: Bewohner sind bereits weg
            self.hass.async_create_task(
                self.async_arm(MODE_AWAY, "Automatik: Alle unterwegs", skip_delay=True)
            )

    @callback
    def _handle_night_start(self, _now: datetime) -> None:
        if not self.night_auto or self.state != S.DISARMED:
            return
        if self.opt(CONF_NIGHT_ONLY_HOME) and self.persons and self.people_home == 0:
            return
        self.hass.async_create_task(
            self.async_arm(MODE_NIGHT, "Automatik: Nachtzeit")
        )

    @callback
    def _handle_night_end(self, _now: datetime) -> None:
        if not self.night_auto or self.state != S.ARMED_NIGHT:
            return
        self.hass.async_create_task(self.async_disarm("Automatik: Guten Morgen"))

    @callback
    def _handle_notification_action(self, event: Event) -> None:
        action = event.data.get("action", "")
        if action == f"{ACTION_SILENCE}_{self.entry.entry_id}":
            self.hass.async_create_task(self.async_silence("Benachrichtigung"))
        elif action == f"{ACTION_DISARM}_{self.entry.entry_id}" and self.opt(
            CONF_NOTIFY_DISARM_ACTION
        ):
            self.hass.async_create_task(self.async_disarm("Benachrichtigung"))

    # ------------------------------------------------------------------
    # Ausgänge: Sirene, Licht, Sprache, Benachrichtigung
    # ------------------------------------------------------------------
    async def _async_sirens(self, on: bool) -> None:
        sirens = list(self.opt(CONF_SIRENS) or [])
        self.siren_active = on and bool(sirens)
        if not sirens:
            return
        try:
            await self.hass.services.async_call(
                "homeassistant",
                "turn_on" if on else "turn_off",
                {ATTR_ENTITY_ID: sirens},
                blocking=False,
            )
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning("Sirene konnte nicht geschaltet werden: %s", err)

    async def _async_alarm_lights(self) -> None:
        lights = list(self.opt(CONF_ALARM_LIGHTS) or [])
        self._lights_on_by_alarm = []
        for light in lights:
            st = self.hass.states.get(light)
            if st is not None and st.state == STATE_OFF:
                self._lights_on_by_alarm.append(light)
            modes = (st.attributes.get("supported_color_modes") or []) if st else []
            data: dict[str, Any] = {ATTR_ENTITY_ID: light, "brightness": 255}
            if any(m in modes for m in ("hs", "rgb", "rgbw", "rgbww", "xy")):
                data["rgb_color"] = [255, 0, 0]
            try:
                await self.hass.services.async_call(
                    "light", "turn_on", data, blocking=False
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Alarmlicht %s: %s", light, err)

    async def _async_restore_lights(self) -> None:
        if not self._lights_on_by_alarm:
            return
        try:
            await self.hass.services.async_call(
                "light",
                "turn_off",
                {ATTR_ENTITY_ID: self._lights_on_by_alarm},
                blocking=False,
            )
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning("Alarmlicht ausschalten: %s", err)
        self._lights_on_by_alarm = []

    async def _async_speak(self, message: str) -> None:
        tts_entity = self.opt(CONF_TTS_ENTITY)
        players = list(self.opt(CONF_MEDIA_PLAYERS) or [])
        if not tts_entity or not players:
            return
        try:
            await self.hass.services.async_call(
                "tts",
                "speak",
                {
                    ATTR_ENTITY_ID: tts_entity,
                    "media_player_entity_id": players,
                    "message": message,
                    "cache": True,
                },
                blocking=False,
            )
        except Exception as err:  # noqa: BLE001
            _LOGGER.warning("Sprachausgabe fehlgeschlagen: %s", err)

    async def _async_persistent(self, title: str, message: str) -> None:
        try:
            await self.hass.services.async_call(
                "persistent_notification",
                "create",
                {
                    "title": title,
                    "message": message,
                    "notification_id": f"{DOMAIN}_{self.entry.entry_id}_alarm",
                },
                blocking=False,
            )
        except Exception as err:  # noqa: BLE001
            _LOGGER.debug("Persistente Benachrichtigung fehlgeschlagen: %s", err)

    async def _async_notify(
        self,
        title: str,
        message: str,
        critical: bool = False,
        with_actions: bool = False,
        with_camera: bool = False,
    ) -> None:
        services = list(self.opt(CONF_NOTIFY_SERVICES) or [])
        if not services:
            return
        cameras = list(self.opt(CONF_CAMERAS) or [])
        use_critical = critical and bool(self.opt(CONF_CRITICAL))

        for service in services:
            service = str(service).removeprefix("notify.")
            payload: dict[str, Any] = {"title": title, "message": message}
            if service.startswith("mobile_app_"):
                data: dict[str, Any] = {
                    "tag": f"{DOMAIN}_{self.entry.entry_id}",
                    "group": "safe_home",
                    "clickAction": "/lovelace",
                    "url": "/lovelace",
                }
                if use_critical:
                    data.update(
                        {
                            "ttl": 0,
                            "priority": "high",
                            "channel": "alarm_stream",
                            "push": {
                                "sound": {
                                    "name": "default",
                                    "critical": 1,
                                    "volume": 1.0,
                                },
                                "interruption-level": "critical",
                            },
                        }
                    )
                if with_camera and cameras:
                    data["image"] = f"/api/camera_proxy/{cameras[0]}"
                if with_actions:
                    actions = [
                        {
                            "action": f"{ACTION_SILENCE}_{self.entry.entry_id}",
                            "title": "Sirene stumm",
                        }
                    ]
                    if self.opt(CONF_NOTIFY_DISARM_ACTION):
                        actions.append(
                            {
                                "action": f"{ACTION_DISARM}_{self.entry.entry_id}",
                                "title": "Entschärfen",
                                "authenticationRequired": True,
                                "destructive": True,
                            }
                        )
                    data["actions"] = actions
                payload["data"] = data
            if not self.hass.services.has_service("notify", service):
                _LOGGER.warning("Benachrichtigungsdienst notify.%s existiert nicht", service)
                continue
            try:
                await self.hass.services.async_call(
                    "notify", service, payload, blocking=False
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Benachrichtigung über %s fehlgeschlagen: %s", service, err)

    # ------------------------------------------------------------------
    # Hilfsfunktionen
    # ------------------------------------------------------------------
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
    def _cancel_siren_timer(self) -> None:
        if self._timer_siren:
            self._timer_siren()
            self._timer_siren = None

    @callback
    def _cancel_auto_arm(self) -> None:
        if self._timer_auto_arm:
            self._timer_auto_arm()
            self._timer_auto_arm = None

    @callback
    def _log(self, kind: str, message: str) -> None:
        self.events.append(
            {"time": dt_util.utcnow().isoformat(), "type": kind, "message": message}
        )
        _LOGGER.info("[%s] %s", self.name, message)

    @callback
    def _fire_state_event(self) -> None:
        self.hass.bus.async_fire(
            EVENT_STATE_CHANGED,
            {
                "entry_id": self.entry.entry_id,
                "name": self.name,
                "state": str(self.state),
                "mode": self.active_mode,
                "changed_by": self.last_changed_by,
            },
        )

    @callback
    def _async_update(self, save: bool = True) -> None:
        async_dispatcher_send(self.hass, signal_update(self.entry.entry_id))
        if save:
            self._store.async_delay_save(self._data_to_save, 2)

    @callback
    def _data_to_save(self) -> dict[str, Any]:
        return {
            "state": str(self.state),
            "armed_mode": self.armed_mode or self.arming_target,
            "auto_mode": self.auto_mode,
            "night_auto": self.night_auto,
            "events": list(self.events),
        }

    async def _async_save(self) -> None:
        await self._store.async_save(self._data_to_save())

    @property
    def auto_arm_pending(self) -> bool:
        return self._timer_auto_arm is not None
