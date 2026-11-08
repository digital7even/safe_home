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

from . import whatsapp as wa
from .zone import SafeHomeZone
from .i18n import date_format, is_german, tr

from .sensor_types import CAUSE as SENSOR_CAUSE, SPEECH as SENSOR_SPEECH, TYPES as SENSOR_TYPES, infer_type
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
    CONF_NIGHT_REARM_DELAY,
    CONF_NIGHT_SENSORS,
    CONF_NIGHT_START,
    CONF_NOTIFY_DISARM_ACTION,
    CONF_NOTIFY_SERVICES,
    CONF_NOTIFY_STATE_CHANGES,
    CONF_NOTIFY_WRONG_CODE,
    CONF_OPEN_POLICY,
    CONF_PERSONS,
    CONF_REARM,
    CONF_SIREN_EXCLUDED,
    CONF_SIREN_MODES,
    CONF_SIREN_TIME_ENABLED,
    CONF_SIREN_TIME_END,
    CONF_SIREN_TIME_START,
    CONF_SIRENS,
    CONF_TAMPER_NOTIFY,
    CONF_HH_ENABLED,
    CONF_HH_NOTIFY,
    CONF_HH_RESOLVED,
    CONF_HH_SENSORS,
    CONF_HH_WHATSAPP,
    CONF_SIREN_DURATION,
    CONF_TRIGGER_TIME,
    CONF_TTS_ENTITY,
    CONF_TTS_ENABLED,
    CONF_ALEXA_ENABLED,
    CONF_ALEXA_DEVICES,
    ALEXA_PLATFORM,
    CONF_TTS_ENTRY_WARNING,
    CONF_TTS_HOUSEHOLD,
    CONF_TTS_SILENT,
    CONF_TTS_ENTRY_REPEAT,
    CONF_PINS,
    CONF_CODE,
    CONF_BATTERY_ENABLED,
    CONF_BATTERY_THRESHOLD,
    CONF_BATTERY_NOTIFY,
    CONF_SILENCE_CODE,
    CONF_CODE_MAX_ATTEMPTS,
    CONF_CODE_LOCKOUT,
    CONF_WEEK_ENABLED,
    CONF_WEEK_PLAN,
    CONF_SENSOR_TYPES,
    CONF_WA_ALL_CLEAR,
    CONF_WA_ENABLED,
    CONF_WA_MESSAGE,
    CONF_WA_OTHER,
    CONF_WA_RECIPIENTS,
    CONF_ZONES,
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
        self.trigger_sensors: list[str] = []  # tatsächlich ausgelöste Melder
        self.household_alerts: set[str] = set()  # Haushalts-Sensoren, die gerade melden
        # Von der Einstellungsseite ausgelöster Alarm (läuft wie echt, „Rückstellung“ stellt den Zustand davor wieder her)
        self.drill: dict[str, Any] | None = None
        self.triggered_at: datetime | None = None
        self.siren_active: bool = False
        self.silent_reason: str | None = None  # Grund, warum die Sirene bei diesem Alarm schweigt
        self._silenced: bool = False  # Sirene wurde von Hand stummgeschaltet
        # wer gerade welche Sirenen braucht: "main" oder Teilbereich-ID -> Entitäten
        self._siren_sources: dict[str, list[str]] = {}
        self.zones: dict[str, SafeHomeZone] = {}
        self._wa_zone: dict[str, dict[str, Any]] = {}  # WhatsApp-Eskalation je Teilbereich
        self.bypassed: set[str] = set()
        self.events: deque[dict[str, Any]] = deque(maxlen=MAX_EVENTS)
        self.last_changed_by: str | None = None

        self.auto_mode: bool = True
        self.night_auto: bool = False

        self._persons_home: dict[str, bool] = {}
        self._lights_on_by_alarm: list[str] = []
        self._unsubs: list[Callable[[], None]] = []
        self._timer_delay: Callable[[], None] | None = None
        self._timer_siren: Callable[[], None] | None = None  # Ende des akustischen Alarms
        self._timer_alarm: Callable[[], None] | None = None  # Ende der Alarmdauer
        self._timer_auto_arm: Callable[[], None] | None = None
        self._timer_night_rearm: Callable[[], None] | None = None
        self.armed_by_automation: bool = False  # wurde der aktuelle Modus von der Automatik gesetzt?
        self.armed_by_week: bool = False  # wurde der aktuelle Modus vom Wochenplan (Kernzeiten) gesetzt?
        self._week: tuple[dict[int, str], set[int]] = ({}, set())
        self._entry_timers: dict[str, Callable[[], None]] = {}
        self._wrong_codes: int = 0  # falsche PIN-Eingaben in Folge
        self._battery_map: dict[str, str] = {}  # Batterie-Entität -> überwachter Sensor
        self.battery_low: dict[str, int | None] = {}  # Sensor -> Ladestand (None = nur „schwach“)
        self._battery_notified: set[str] = set()
        self.code_locked_until: datetime | None = None  # PIN-Eingabe gesperrt bis
        self._entry_gen: dict[str, int] = {}
        # WhatsApp: Eskalations-Timer und bereits benachrichtigte Empfänger des laufenden Alarms
        self._wa_timers: list[Callable[[], None]] = []
        self._wa_alarm_active: bool = False
        self._wa_notified: list[wa.Recipient] = []

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

    def t(self, de: str, **kwargs) -> str:
        """Text in der Systemsprache von Home Assistant."""
        return tr(self.hass, de, **kwargs)

    def ml(self, mode: str | None) -> str:
        """Name eines Modus in der Systemsprache."""
        return self.t(MODE_LABELS[mode]) if mode in MODE_LABELS else "-"

    @property
    def mode_label(self) -> str:
        if self.state == S.DISARMED:
            return self.ml("disarmed")
        return self.ml(self.active_mode) if self.active_mode else ""

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

    # -- Art der Sensoren und passende Texte ------------------------------
    @property
    def tts_enabled(self) -> bool:
        if CONF_TTS_ENABLED in self.entry.options:
            return bool(self.entry.options[CONF_TTS_ENABLED])
        # ältere Installationen: aktiv, sobald Dienst und Lautsprecher gewählt sind
        return bool(self.opt(CONF_TTS_ENTITY)) and bool(self.opt(CONF_MEDIA_PLAYERS))

    def sensor_type(self, entity_id: str) -> str:
        chosen = (self.opt(CONF_SENSOR_TYPES) or {}).get(entity_id)
        if chosen in SENSOR_TYPES:
            return chosen
        st = self.hass.states.get(entity_id)
        return infer_type(entity_id, st.attributes.get("device_class") if st else None)

    def sensor_cause(self, entity_id: str) -> str:
        """Ursache passend zur Art, z. B. „Fenster geöffnet: Küche“."""
        return self.t(SENSOR_CAUSE[self.sensor_type(entity_id)], name=self.friendly(entity_id))

    def alarm_speech(self, sensors: list[str], cause: str, zone: str | None = None) -> str:
        """Durchsage bei Alarm – je nach Art des auslösenden Melders."""
        tail = self.t("Die Bewohner werden benachrichtigt.")
        if not sensors:
            head = self.t("Achtung, Alarm im Bereich {zone}!", zone=zone) if zone else self.t("Achtung, Alarm!")
            return f"{head} {cause}. {tail}"
        eid = sensors[0]
        typ = self.sensor_type(eid)
        if typ == "water":
            head = self.t("Achtung, Wasseralarm im Bereich {zone}!", zone=zone) if zone else self.t("Achtung, Wasseralarm!")
        else:
            head = self.t("Achtung, möglicher Einbruch im Bereich {zone}!", zone=zone) if zone else self.t("Achtung, möglicher Einbruch!")
        detail = self.t(SENSOR_SPEECH[typ], name=self.friendly(eid))
        return f"{head} {detail} {tail}"

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
        # Je Modul gibt es genau EINEN An/Aus-Schalter („Home-Zone“ bzw. „Nachtzeit“). Die Werte aus
        # der Einrichtung sind nur der Startwert einer neuen Installation.
        self.auto_mode = bool(stored.get("auto_mode", bool(self.opt(CONF_AUTO_ARM) or self.opt(CONF_AUTO_DISARM))))
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
            self.armed_by_automation = bool(stored.get("armed_by_automation", False))
            self.armed_by_week = bool(stored.get("armed_by_week", False))
            self._log(
                "info",
                self.t("Nach Neustart wiederhergestellt: {mode}", mode=self.ml(restored_mode)),
            )

        try:
            locked = dt_util.parse_datetime(stored.get("code_locked_until") or "")
        except (TypeError, ValueError):
            locked = None
        if locked and locked > dt_util.utcnow():
            self.code_locked_until = locked  # Sperre übersteht einen Neustart
        self._wrong_codes = int(stored.get("wrong_codes", 0) or 0) if locked else 0

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
        for cfg in self.opt(CONF_ZONES) or []:
            if isinstance(cfg, dict) and cfg.get("id"):
                zone = SafeHomeZone(self, cfg)
                self.zones[zone.id] = zone
                zone.start((stored.get("zones") or {}).get(zone.id))
        self._battery_notified = set(stored.get("battery_notified", []))
        self._setup_battery()
        hh = [item["entity"] for item in self.household_items()]
        if hh:
            self._unsubs.append(
                async_track_state_change_event(self.hass, hh, self._handle_household_event)
            )
            # Aktuellen Stand übernehmen (ohne Meldung beim Start)
            for item in self.household_items():
                st = self.hass.states.get(item["entity"])
                if st is not None and st.state == item["state"]:
                    self.household_alerts.add(item["entity"])

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
        self._week = self._week_transitions()
        if self._week[0] or self._week[1]:
            self._unsubs.append(async_track_time_change(self.hass, self._handle_week_tick, second=0))
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
        self._cancel_alarm_timer()
        self._cancel_auto_arm()
        self._cancel_night_rearm()
        self._wa_cancel()
        self._stop_entry_announcements()
        for zone in self.zones.values():
            zone.stop()
        for tr in self._wa_zone.values():
            for unsub in tr["timers"]:
                unsub()
        await self._async_save()

    # ------------------------------------------------------------------
    # Öffentliche Aktionen
    # ------------------------------------------------------------------
    async def async_arm(
        self, mode: str, source: str | None = None, skip_delay: bool = False, auto: bool = False
    ) -> bool:
        """Alarmanlage in einen Modus schalten. Gibt False zurück, wenn blockiert."""
        source = source or self.t("Manuell")
        self._cancel_night_rearm()
        self.armed_by_automation = auto
        self.armed_by_week = False
        if mode not in MODE_TO_STATE:
            return False
        if self.state in (S.TRIGGERED, S.PENDING):
            self._log("warning", self.t("Scharfschalten nicht möglich: Alarm/Eingangsverzögerung aktiv"))
            self._async_update()
            return False

        self._cancel_auto_arm()
        open_now = self.open_sensors(mode)
        if open_now:
            names = ", ".join(self.friendly(e) for e in open_now)
            if self.opt(CONF_OPEN_POLICY) == OPEN_POLICY_BLOCK:
                self._log(
                    "warning",
                    self.t("{mode} blockiert – offen: {names}", mode=self.ml(mode), names=names),
                )
                await self._async_notify(
                    self.t("⚠️ Scharfschalten blockiert"),
                    self.t(
                        "{mode} konnte nicht aktiviert werden ({source}). Offen: {names}",
                        mode=self.ml(mode),
                        source=source,
                        names=names,
                    ),
                )
                self._async_update()
                return False
            self.bypassed = set(open_now)
            self._log("bypass", self.t("Überbrückt (offen): {names}", names=names))
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
                self.t("{mode} wird in {delay} s aktiviert ({source})", mode=self.ml(mode), delay=delay, source=source),
            )
            self._async_update()
        else:
            self._set_armed(mode, source)

        if open_now and self.opt(CONF_OPEN_POLICY) != OPEN_POLICY_BLOCK:
            await self._async_notify(
                self.t("⚠️ Sensoren überbrückt"),
                self.t(
                    "Beim Aktivieren von {mode} waren offen: {names}. Sie werden überwacht, sobald sie geschlossen sind.",
                    mode=self.ml(mode),
                    names=", ".join(self.friendly(e) for e in open_now),
                ),
            )
        return True

    async def async_disarm(self, source: str | None = None) -> None:
        """Alarmanlage ausschalten (Zuhause)."""
        source = source or self.t("Manuell")
        previous = self.state
        self._cancel_delay()
        self._cancel_siren_timer()
        self._cancel_alarm_timer()
        self._cancel_auto_arm()
        await self._async_sirens(False)
        if not self.any_zone_alarm():
            await self._async_restore_lights()
        if self.drill and self.drill["kind"] == "alarm" and not self.drill.get("zone"):
            self.drill = None
        self.state = S.DISARMED
        self.armed_mode = None
        self.arming_target = None
        self.trigger_cause = None
        self.trigger_sensors = []
        self.armed_by_automation = False
        self.armed_by_week = False
        self._cancel_night_rearm()
        self.silent_reason = None
        self._silenced = False
        self.bypassed = set()
        self.last_changed_by = source
        self._wa_cancel()
        if self._wa_alarm_active:
            self._wa_alarm_active = False
            if self.opt(CONF_WA_ALL_CLEAR) and self._wa_notified:
                text = self.t(
                    "✅ Entwarnung: {name} wurde um {time} Uhr ausgeschaltet ({source}).",
                    name=self.name,
                    time=dt_util.as_local(dt_util.utcnow()).strftime("%H:%M"),
                    source=source,
                )
                for rec in list(self._wa_notified):
                    self.hass.async_create_task(self._wa_send(rec, text))
            self._wa_notified = []
        if previous != S.DISARMED:
            self._log("disarmed", self.t("Zuhause – unscharf ({source})", source=source))
            self._fire_state_event()
            if previous in (S.TRIGGERED, S.PENDING) or self.opt(
                CONF_NOTIFY_STATE_CHANGES
            ):
                await self._async_notify(
                    self.t("🏠 Safe Home unscharf"),
                    self.t("Modus Zuhause aktiv. Ausgelöst durch: {source}", source=source),
                    critical=False,
                )
        self._async_update()

    async def async_trigger(self, cause: str, source: str | None = None, panic: bool = False) -> None:
        """Alarm auslösen."""
        source = source or self.t("Sensor")
        if self.state == S.TRIGGERED:
            return
        self._cancel_delay()
        if self.armed_mode is None:
            self.armed_mode = self.active_mode
        self.state = S.TRIGGERED
        self.trigger_cause = cause
        self.triggered_at = dt_util.utcnow()
        self.last_changed_by = source
        self._log("triggered", self.t("ALARM: {cause}", cause=cause))
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

        # Akustischer Alarm nur, wenn Modus, Zeitfenster und Melder es erlauben
        self._silenced = False
        reason = self.siren_block_reason(self.trigger_sensors, panic=panic)
        self.silent_reason = reason
        if reason is None:
            await self._async_sirens(True)
        else:
            self.siren_active = False
            self._log("info", self.t("Stiller Alarm – Sirene bleibt aus: {reason}", reason=reason))
            self._async_update()
        await self._async_alarm_lights()
        await self._async_alarm_announcement(self.alarm_speech(list(self.trigger_sensors), cause), reason)
        await self._async_persistent(
            self.t("🚨 Safe Home Alarm"),
            f"{cause} – {dt_util.as_local(self.triggered_at).strftime(date_format(self.hass))}",
        )
        await self._async_notify(
            self.t("🚨 ALARM – Safe Home"),
            self.t("{cause}. Modus: {mode}.", cause=cause, mode=self.ml(self.armed_mode)),
            critical=True,
            with_actions=True,
            with_camera=True,
            whatsapp=False,
        )
        self._wa_start_alarm()

        self._start_alarm_timers()

    async def async_panic(self, source: str | None = None) -> None:
        """Sofortalarm unabhängig vom Modus."""
        source = source or self.t("Panik-Taste")
        if self.state != S.TRIGGERED:
            self.trigger_sensors = []
        await self.async_trigger(self.t("Panikalarm ({source})", source=source), source=source, panic=True)

    async def async_skip_exit_delay(self, source: str | None = None) -> bool:
        """Laufende Ausgangsverzögerung überspringen und sofort scharf schalten."""
        if self.state != S.ARMING or self.arming_target not in MODE_TO_STATE:
            return False
        source = source or self.t("Manuell")
        mode = self.arming_target
        self._cancel_delay()
        self._log("info", self.t("Ausgangsverzögerung übersprungen ({source})", source=source))
        self._set_armed(mode, source)
        return True

    async def async_silence(self, source: str | None = None) -> None:  # noqa: D401
        """Sirenen stummschalten, Alarmzustand bleibt erhalten."""
        source = source or self.t("Manuell")
        self._cancel_siren_timer()
        self._silenced = True
        if self.siren_active:
            await self._async_sirens(False, "*")
            self._log("info", self.t("Sirene stummgeschaltet ({source})", source=source))
            self._async_update()

    # -- PINs ----------------------------------------------------------
    def _pins(self) -> list[dict[str, Any]]:
        return [p for p in (self.opt(CONF_PINS) or []) if isinstance(p, dict) and p.get("code")]

    @staticmethod
    def pin_covers(pin: dict[str, Any], area: str) -> bool:
        areas = pin.get("areas")
        return areas is None or area in areas

    def code_required_for(self, area: str = "main") -> bool:
        """Braucht dieser Bereich einen PIN? Nein, wenn die PIN-Funktion aus ist, der Bereich ausgenommen ist
        oder kein aktiver PIN für ihn gilt."""
        if self.opt("pins_enabled") is False or area in (self.opt("pin_areas_off") or []):
            return False
        pins = self._pins()
        if pins:
            return any(p.get("enabled", True) is not False and self.pin_covers(p, area) for p in pins)
        return bool(self.opt(CONF_CODE))

    @property
    def code_set(self) -> bool:
        """PIN für den Hauptbereich nötig?"""
        return self.code_required_for("main")

    def code_numeric_for(self, area: str = "main") -> bool:
        codes = [str(p["code"]) for p in self._pins() if self.pin_covers(p, area)] or [str(self.opt(CONF_CODE) or "")]
        return all(c.isdigit() for c in codes if c)

    @property
    def code_numeric(self) -> bool:
        return self.code_numeric_for("main")

    def area_name(self, area: str) -> str:
        return self.zones[area].name if area in self.zones else self.t("Hauptbereich")

    @staticmethod
    def pin_status(pin: dict[str, Any], now: datetime) -> str:
        """active | scheduled | expired | off – Zeitraum in Ortszeit (YYYY-MM-DDTHH:MM)."""
        if pin.get("enabled", True) is False:
            return "off"
        stamp = now.strftime("%Y-%m-%dT%H:%M")
        if pin.get("start") and stamp < pin["start"]:
            return "scheduled"
        if pin.get("end") and stamp >= pin["end"]:
            return "expired"
        return "active"

    def verify_pin(self, code: str | None, area: str = "main") -> tuple[bool, str | None]:
        """(gültig, Name des PIN-Inhabers). Ohne persönliche PINs gilt der allgemeine PIN."""
        code = (code or "").strip()
        pins = self._pins()
        if not pins:
            legacy = str(self.opt(CONF_CODE) or "")
            return (not legacy or code == legacy), None
        now = dt_util.as_local(dt_util.utcnow())
        for pin in pins:
            if str(pin["code"]) != code:
                continue
            status = self.pin_status(pin, now)
            if status == "active" and not self.pin_covers(pin, area):
                self._log("warning", self.t("PIN von {name} gilt nicht für {area}", name=pin.get("name"), area=self.area_name(area)))
                return False, pin.get("name")
            if status == "active":
                return True, pin.get("name")
            reason = {"scheduled": "PIN von {name} gilt erst ab {start}", "expired": "PIN von {name} ist abgelaufen", "off": "PIN von {name} ist deaktiviert"}[status]
            try:
                start = datetime.fromisoformat(pin["start"]).strftime(date_format(self.hass)) if pin.get("start") else ""
            except (TypeError, ValueError):
                start = str(pin.get("start") or "")
            self._log("warning", self.t(reason, name=pin.get("name"), start=start))
            return False, pin.get("name")
        return False, None

    # -- Batterien der überwachten Sensoren --------------------------------
    def _battery_candidates(self, sensor: str) -> list[str]:
        """Batterie-Entitäten desselben Geräts (sensor mit device_class battery bzw. binary_sensor „Batterie schwach“)."""
        try:
            from homeassistant.helpers import entity_registry as er  # noqa: PLC0415

            reg = er.async_get(self.hass)
            ent = reg.async_get(sensor)
            if ent is None or not getattr(ent, "device_id", None):
                return []
            out = []
            for other in er.async_entries_for_device(reg, ent.device_id):
                if other.entity_id == sensor or other.disabled_by:
                    continue
                st = self.hass.states.get(other.entity_id)
                dc = (st.attributes.get("device_class") if st else None) or other.device_class or other.original_device_class
                if dc == "battery" and other.entity_id.split(".")[0] in ("sensor", "binary_sensor"):
                    out.append(other.entity_id)
            return out
        except Exception:  # noqa: BLE001 – ohne Registry (Test) keine Gerätezuordnung
            return []

    @callback
    def _setup_battery(self) -> None:
        self._battery_map = {}
        self.battery_low = {}
        if not self.opt(CONF_BATTERY_ENABLED):
            return
        sensors = set(self.all_sensors) | {e for z in self.zones.values() for e in z.sensors}
        for sensor in sorted(sensors):
            for bat in self._battery_candidates(sensor):
                self._battery_map[bat] = sensor
        watch = sorted(set(self._battery_map) | sensors)  # Sensoren selbst: Attribut battery_level / battery
        for sensor in sensors:
            self._battery_map.setdefault(sensor, sensor)
        if watch:
            self._unsubs.append(async_track_state_change_event(self.hass, watch, self._handle_battery_event))
        for ent in watch:
            self._check_battery(ent, startup=True)

    def _battery_level(self, entity_id: str) -> tuple[bool | None, int | None]:
        """(schwach?, Prozent) – None, wenn die Entität keine Batterieangabe hat."""
        st = self.hass.states.get(entity_id)
        if st is None or st.state in INVALID_STATES:
            return None, None
        threshold = int(self.opt(CONF_BATTERY_THRESHOLD) or 20)
        if self._battery_map.get(entity_id) != entity_id:  # eigene Batterie-Entität
            if entity_id.startswith("binary_sensor."):
                return st.state == STATE_ON, None
            try:
                level = int(round(float(st.state)))
            except (TypeError, ValueError):
                return None, None
            return level <= threshold, level
        for attr in ("battery_level", "battery"):  # Batterie als Attribut des Sensors
            raw = st.attributes.get(attr)
            if raw is None:
                continue
            try:
                level = int(round(float(raw)))
            except (TypeError, ValueError):
                continue
            return level <= threshold, level
        if isinstance(st.attributes.get("battery_low"), bool):
            return st.attributes["battery_low"], None
        return None, None

    @callback
    def _handle_battery_event(self, event: Event[EventStateChangedData]) -> None:
        self._check_battery(event.data["entity_id"])

    @callback
    def _check_battery(self, entity_id: str, startup: bool = False) -> None:
        sensor = self._battery_map.get(entity_id)
        if sensor is None:
            return
        low, level = self._battery_level(entity_id)
        if low is None:
            return
        name = self.friendly(sensor)
        threshold = int(self.opt(CONF_BATTERY_THRESHOLD) or 20)
        if low:
            if sensor in self.battery_low and self.battery_low[sensor] == level:
                return
            self.battery_low[sensor] = level
            if sensor in self._battery_notified:
                self._async_update(save=False)
                return  # schon gemeldet (auch über einen Neustart hinweg)
            self._battery_notified.add(sensor)
            txt = self.t("Batterie schwach: {name} ({level} %)", name=name, level=level) if level is not None else self.t("Batterie schwach: {name}", name=name)
            self._log("warning", txt)
            self._async_update()
            if self.opt(CONF_BATTERY_NOTIFY):
                self.hass.async_create_task(
                    self._async_notify(
                        self.t("🔋 Batterie schwach"),
                        self.t("{text}. Bitte bald wechseln, damit der Sensor nicht ausfällt.", text=txt),
                        critical=False,
                    )
                )
            return
        # wieder gut: mit etwas Abstand zur Schwelle, damit es nicht hin und her springt
        if sensor in self.battery_low or sensor in self._battery_notified:
            if level is not None and level <= threshold + 5:
                return
            self.battery_low.pop(sensor, None)
            if sensor in self._battery_notified:
                self._battery_notified.discard(sensor)
                if not startup:
                    self._log("info", self.t("Batterie wieder in Ordnung: {name}", name=name))
            self._async_update()

    # -- Sperre nach mehreren falschen PINs ------------------------------
    @property
    def code_locked(self) -> bool:
        if self.code_locked_until and dt_util.utcnow() < self.code_locked_until:
            return True
        if self.code_locked_until:
            self.code_locked_until = None  # abgelaufen
            self._wrong_codes = 0
        return False

    @property
    def silence_code_required(self) -> bool:
        return self.code_set and bool(self.opt(CONF_SILENCE_CODE))

    def code_ok(self) -> None:
        """Richtiger PIN – Zähler zurücksetzen."""
        if self._wrong_codes:
            self._wrong_codes = 0
            self._async_update()

    def lock_minutes_left(self) -> int:
        if not self.code_locked_until:
            return 0
        return max(1, int(-(-(self.code_locked_until - dt_util.utcnow()).total_seconds() // 60)))

    async def async_locked_attempt(self, action: str) -> None:
        self._log("warning", self.t("PIN-Eingabe gesperrt – Versuch abgewiesen ({action})", action=action))
        self._async_update()

    async def check_user_code(self, code: str | None, action: str, area: str = "main") -> tuple[bool, str | None]:
        """PIN prüfen inkl. Sperre. Gibt (gültig, Inhaber) zurück; zählt Fehlversuche."""
        if self.code_locked:
            await self.async_locked_attempt(action)
            return False, None
        ok, owner = self.verify_pin(code, area)
        if ok:
            self.code_ok()
        else:
            await self.async_wrong_code(action)
        return ok, owner

    async def async_wrong_code(self, action: str) -> None:
        """Falsche PIN protokollieren, ggf. melden und nach zu vielen Versuchen sperren."""
        self._wrong_codes += 1
        self._log("warning", self.t("Falscher PIN bei: {action}", action=action))
        limit = int(self.opt(CONF_CODE_MAX_ATTEMPTS) or 0)
        if limit and self._wrong_codes >= limit:
            minutes = max(1, int(self.opt(CONF_CODE_LOCKOUT) or 5))
            self.code_locked_until = dt_util.utcnow() + timedelta(minutes=minutes)
            self._log("warning", self.t("{n} falsche PINs – Eingabe für {m} Min. gesperrt", n=self._wrong_codes, m=minutes))
            self._async_update()
            # immer melden – unabhängig von „Bei falscher PIN-Eingabe benachrichtigen“
            await self._async_notify(
                self.t("🔐 Mehrere falsche PINs"),
                self.t(
                    "{n} falsche PIN-Eingaben in Folge (zuletzt: {action}). Die PIN-Eingabe ist für {m} Minuten gesperrt.",
                    n=self._wrong_codes, action=action, m=minutes,
                ),
                critical=True,
            )
            return
        self._async_update()
        if self.opt(CONF_NOTIFY_WRONG_CODE):
            await self._async_notify(
                self.t("🔐 Falscher PIN"),
                self.t("Es wurde ein falscher PIN eingegeben ({action}).", action=action),
                critical=False,
            )

    async def async_test(self, kind: str) -> str:
        """Ausgänge testen (von der Safe-Home-Seite). Gibt eine Rückmeldung zurück."""
        if kind == "notify":
            if not self.opt(CONF_NOTIFY_SERVICES):
                return self.t("Kein Benachrichtigungsdienst ausgewählt")
            await self._async_notify(
                self.t("🧪 Safe Home Test"),
                self.t("Diese Testbenachrichtigung kommt von deiner Alarmanlage."),
                critical=False,
                with_camera=True,
                whatsapp=False,
            )
            self._log("info", self.t("Testbenachrichtigung gesendet"))
            self._async_update()
            return self.t("Testbenachrichtigung gesendet")
        if kind == "whatsapp":
            return await self._wa_test()
        if kind == "siren":
            sirens = list(self.opt(CONF_SIRENS) or [])
            if not sirens:
                return self.t("Keine Sirene ausgewählt")
            if self.state == S.TRIGGERED:
                return self.t("Während eines Alarms nicht möglich")
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
            self._log("info", self.t("Sirenentest (3 Sekunden)"))
            self._async_update()
            return self.t("Sirene läuft 3 Sekunden")
        if kind == "tts":
            players, alexa = self.speech_targets()
            if not alexa and (not self.opt(CONF_TTS_ENTITY) or not players):
                return self.t("Sprachausgabe und Lautsprecher auswählen")
            await self._async_speak(self.t("Dies ist ein Test von Safe Home."), force=True)
            return self.t("Testansage gesendet")
        if kind == "lights":
            lights = list(self.opt(CONF_ALARM_LIGHTS) or [])
            if not lights:
                return self.t("Kein Alarmlicht ausgewählt")
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
            return self.t("Alarmlicht 5 Sekunden an")
        return self.t("Unbekannter Test")

    @property
    def auto_active(self) -> bool:
        """Home-Zone-Automatik an? (einziger Schalter des Moduls)"""
        return self.auto_mode

    @property
    def night_active(self) -> bool:
        """Nachtmodus nach Zeitplan an? Pausiert, solange der Wochenplan aktiv ist."""
        return self.night_auto and not self.week_active()

    @callback
    def _enable_options(self, updates: dict[str, Any]) -> None:
        """Einstellung mit einschalten (Instanz wird danach neu geladen, Zustand bleibt erhalten)."""
        self.hass.config_entries.async_update_entry(self.entry, options={**self.entry.options, **updates})

    @callback
    def set_auto_mode(self, enabled: bool) -> None:
        self.auto_mode = enabled
        if not enabled:
            self._cancel_auto_arm()
        self._log("info", self.t("Anwesenheits-Automatik an" if enabled else "Anwesenheits-Automatik aus"))
        self._async_update()
        if enabled and not (self.opt(CONF_AUTO_ARM) or self.opt(CONF_AUTO_DISARM)):
            # Ältere Konfiguration ohne ausgewählte Funktion: beide Funktionen einschalten, sonst täte der Schalter nichts
            self._log("info", self.t("Einstellungen „Automatisch scharf“ und „Automatisch unscharf“ eingeschaltet"))
            self._enable_options({CONF_AUTO_ARM: True, CONF_AUTO_DISARM: True})

    @callback
    def set_night_auto(self, enabled: bool) -> None:
        self.night_auto = enabled
        self._log("info", self.t("Nacht-Automatik an" if enabled else "Nacht-Automatik aus"))
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
        self._log("armed", self.t("{mode} – scharf ({source})", mode=self.ml(mode), source=source))
        self._fire_state_event()
        self._async_update()
        if self.opt(CONF_NOTIFY_STATE_CHANGES):
            icon = "🌙" if mode == MODE_NIGHT else "🛡️"
            self.hass.async_create_task(
                self._async_notify(
                    f"{icon} Safe Home: {self.ml(mode)}",
                    self.t(
                        "Alarmanlage ist scharf ({source}). {count} Sensoren aktiv.",
                        source=source,
                        count=len(self.sensors_for_mode(mode)) - len(self.bypassed),
                    ),
                    critical=False,
                )
            )

    @callback
    def _finish_arming(self, _now: datetime | None = None) -> None:
        self._timer_delay = None
        if self.state != S.ARMING or not self.arming_target:
            return
        self._set_armed(self.arming_target, self.last_changed_by or self.t("Automatik"))

    @callback
    def _entry_delay_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_delay = None
        if self.state == S.PENDING:
            cause = self.trigger_cause or self.t("Eingangsverzögerung abgelaufen")
            self.hass.async_create_task(self.async_trigger(cause))

    @callback
    def _trigger_time_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_alarm = None
        self._cancel_siren_timer()
        self.hass.async_create_task(self._async_after_trigger())

    # ------------------------------------------------------------------
    # Alarmdauer und Dauer des akustischen Alarms
    # ------------------------------------------------------------------
    def alarm_duration(self) -> int:
        return max(0, int(self.opt(CONF_TRIGGER_TIME) or 0))

    def siren_duration(self) -> int:
        """Dauer des akustischen Alarms. Ältere Installationen ohne eigenen Wert: wie die Alarmdauer."""
        value = self.entry.options.get(CONF_SIREN_DURATION)
        if value is None:
            value = self.opt(CONF_TRIGGER_TIME)
        return max(0, int(value or 0))

    def fmt_duration(self, seconds: int) -> str:
        minutes, sec = divmod(int(seconds), 60)
        hours, minutes = divmod(minutes, 60)
        parts = []
        if hours:
            parts.append(f"{hours} h")
        if minutes:
            parts.append(self.t("{n} Min.", n=minutes))
        if sec or not parts:
            parts.append(f"{sec} s")
        return " ".join(parts)

    @callback
    def _start_alarm_timers(self) -> None:
        self._cancel_alarm_timer()
        alarm = self.alarm_duration()
        if alarm > 0:
            self._timer_alarm = async_call_later(self.hass, alarm, self._trigger_time_elapsed)
        self._start_siren_timer()

    @callback
    def _start_siren_timer(self) -> None:
        """Sirene nach der eingestellten Dauer stumm schalten – der Alarm bleibt bestehen."""
        self._cancel_siren_timer()
        siren = self.siren_duration()
        alarm = self.alarm_duration()
        if siren > 0 and (alarm == 0 or siren < alarm):
            self._timer_siren = async_call_later(self.hass, siren, self._siren_time_elapsed)

    @callback
    def _siren_time_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_siren = None
        if self.state != S.TRIGGERED or not self.siren_active:
            return
        self._log(
            "info",
            self.t(
                "Akustischer Alarm nach {d} beendet – Alarm bleibt still bestehen",
                d=self.fmt_duration(self.siren_duration()),
            ),
        )
        self.hass.async_create_task(self._async_sirens(False))
        self._async_update()

    @callback
    def _cancel_alarm_timer(self) -> None:
        if self._timer_alarm:
            self._timer_alarm()
            self._timer_alarm = None

    async def _async_after_trigger(self) -> None:
        if self.state != S.TRIGGERED:
            return
        if self.drill and self.drill["kind"] == "alarm" and not self.drill.get("zone"):
            await self.async_drill_reset()
            return
        await self._async_sirens(False)
        if self.opt(CONF_REARM) and self.armed_mode in MODE_TO_STATE:
            mode = self.armed_mode
            # Noch offene Sensoren überbrücken, damit der Alarm nicht sofort erneut auslöst
            self.bypassed |= set(self.open_sensors(mode))
            self.state = MODE_TO_STATE[mode]
            self.trigger_cause = None
            self._log("armed", self.t("Alarmzeit abgelaufen – wieder {mode}", mode=self.ml(mode)))
            self._fire_state_event()
        else:
            self._log("info", self.t("Alarmzeit abgelaufen – Sirene aus, Alarm bleibt bestehen"))
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
            self._log("warning", self.t("Sensor nicht erreichbar: {name}", name=self.friendly(entity_id)))
            if self.opt(CONF_TAMPER_NOTIFY):
                self.hass.async_create_task(
                    self._async_notify(
                        self.t("📡 Sensor nicht erreichbar"),
                        self.t("{name} meldet sich nicht mehr, während Safe Home scharf ist.", name=self.friendly(entity_id)),
                        critical=False,
                    )
                )
            self._async_update()
            return

        # Überbrückter Sensor wird geschlossen -> wieder überwachen
        if new_state == STATE_OFF and entity_id in self.bypassed:
            self.bypassed.discard(entity_id)
            self._log("info", self.t("{name} geschlossen – wird wieder überwacht", name=self.friendly(entity_id)))
            self._async_update()
            return

        # Nur echte Auslösung off -> on (verhindert Fehlalarme beim Neustart)
        if not (old_state == STATE_OFF and new_state == STATE_ON):
            self._async_update(save=False)
            return

        if not relevant or entity_id in self.bypassed:
            self._async_update(save=False)
            return

        if self.state == S.TRIGGERED:
            self._late_siren(entity_id)
            self._async_update(save=False)
            return

        if self.state == S.PENDING and entity_id not in self.delayed_sensors:
            # Während der Eingangsverzögerung meldet ein Melder OHNE Verzögerung (z. B. Bewegung im Wohnzimmer)
            # -> sofort Alarm, nicht erst am Ende des Countdowns
            self._log("info", self.t("{name} während der Eingangsverzögerung – sofortiger Alarm", name=self.friendly(entity_id)))
            self.trigger_sensors = [entity_id, *(e for e in self.trigger_sensors if e != entity_id)]
            self.hass.async_create_task(self.async_trigger(self.sensor_cause(entity_id)))
            return

        if self.state not in ARMED_STATES:
            # ARMING: Ausgangsverzögerung läuft, PENDING: weiterer verzögerter Melder – Countdown läuft weiter
            self._async_update(save=False)
            return

        name = self.friendly(entity_id)
        entry_delay = int(
            self.opt(CONF_ENTRY_DELAY_AWAY if mode == MODE_AWAY else CONF_ENTRY_DELAY_NIGHT)
            or 0
        )
        self.trigger_sensors = [entity_id]
        if entity_id in self.delayed_sensors and entry_delay > 0:
            self.state = S.PENDING
            self.trigger_cause = self.sensor_cause(entity_id)
            self._start_delay(entry_delay, self._entry_delay_elapsed)
            self._log("pending", self.t("Eingangsverzögerung {delay} s: {name}", delay=entry_delay, name=name))
            self._fire_state_event()
            self._async_update()
            self.start_entry_announcements(
                "main",
                lambda: self.state == S.PENDING,
                lambda: self.delay_until,
                lambda n, first: self.t("Bitte Alarmanlage innerhalb von {delay} Sekunden ausschalten.", delay=n)
                if first
                else self.t("Bitte Alarmanlage ausschalten – noch {n} Sekunden.", n=n),
            )
            return

        self.hass.async_create_task(self.async_trigger(self.sensor_cause(entity_id)))

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
            self._log("info", self.t("Alle haben das Haus verlassen (zuletzt {name})", name=name))
            self._cancel_night_rearm()
            if (
                self.auto_mode
                and self.opt(CONF_AUTO_ARM)
                and self.state in (S.DISARMED, S.ARMED_NIGHT)
            ):
                delay = int(self.opt(CONF_AUTO_ARM_DELAY) or 0)
                self._cancel_auto_arm()
                if delay > 0:
                    self._log("info", self.t("Automatisches Scharfschalten in {delay} s", delay=delay))
                    self._timer_auto_arm = async_call_later(
                        self.hass, delay, self._auto_arm_elapsed
                    )
                else:
                    self.hass.async_create_task(
                        self.async_arm(MODE_AWAY, self.t("Automatik: Alle unterwegs"), skip_delay=True, auto=True)
                    )
        elif after > before and new.state == STATE_HOME:
            self._cancel_auto_arm()
            auto_disarm = self.auto_mode and bool(self.opt(CONF_AUTO_DISARM))
            if (
                before == 0
                and auto_disarm
                and (
                    self.state in (S.ARMED_AWAY, S.PENDING, S.TRIGGERED)
                    or (self.state == S.ARMING and self.arming_target == MODE_AWAY)
                )
                and self.active_mode == MODE_AWAY
            ):
                # Erste Person kommt heim: Unterwegs aus – nachts danach wieder Nachtmodus
                self.hass.async_create_task(
                    self._async_disarm_then_night(self.t("Automatik: {name} ist zuhause", name=name))
                )
            elif auto_disarm and (
                self.state == S.ARMED_NIGHT or (self.state == S.ARMING and self.arming_target == MODE_NIGHT)
            ):
                # Jemand kommt nachts heim, während die anderen schlafen: kurz unscharf, damit die
                # Haustür keinen Alarm auslöst, danach wieder Nachtmodus
                self.hass.async_create_task(
                    self._async_disarm_then_night(self.t("Automatik: {name} kommt nach Hause", name=name))
                )
        self._async_update()

    async def _async_disarm_then_night(self, source: str) -> None:
        await self.async_disarm(source)
        self._schedule_night_rearm()

    def in_night_window(self, now: datetime | None = None) -> bool:
        """Liegt der Zeitpunkt in der eingestellten Nachtzeit? (auch über Mitternacht)"""
        start = _parse_time(self.opt(CONF_NIGHT_START), DEFAULTS[CONF_NIGHT_START])
        end = _parse_time(self.opt(CONF_NIGHT_END), DEFAULTS[CONF_NIGHT_END])
        t = dt_util.as_local(now or dt_util.utcnow()).time()
        if start == end:
            return False
        if start < end:
            return start <= t < end
        return t >= start or t < end

    @callback
    def _schedule_night_rearm(self) -> None:
        """Nach Heimkehr in der Nachtzeit den Nachtmodus nach der Wartezeit wieder einschalten."""
        self._cancel_night_rearm()
        minutes = int(self.opt(CONF_NIGHT_REARM_DELAY) or 0)
        if minutes <= 0 or not self.night_active or not self.in_night_window():
            return
        self._log("info", self.t("Nachtmodus wird in {minutes} Minuten wieder aktiviert", minutes=minutes))
        self._timer_night_rearm = async_call_later(self.hass, minutes * 60, self._night_rearm_elapsed)
        self._async_update()

    @callback
    def _night_rearm_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_night_rearm = None
        if (
            self.state == S.DISARMED
            and self.night_active
            and self.in_night_window()
            and (not self.persons or self.people_home > 0)
        ):
            self.hass.async_create_task(
                self.async_arm(MODE_NIGHT, self.t("Automatik: wieder Nachtruhe"), auto=True)
            )

    @callback
    def _cancel_night_rearm(self) -> None:
        if self._timer_night_rearm:
            self._timer_night_rearm()
            self._timer_night_rearm = None

    @callback
    def _auto_arm_elapsed(self, _now: datetime | None = None) -> None:
        self._timer_auto_arm = None
        if self.people_home == 0 and self.state in (S.DISARMED, S.ARMED_NIGHT):
            # Exit-Verzögerung überspringen: Bewohner sind bereits weg
            self.hass.async_create_task(
                self.async_arm(MODE_AWAY, self.t("Automatik: Alle unterwegs"), skip_delay=True, auto=True)
            )

    @callback
    def _handle_night_start(self, _now: datetime) -> None:
        if not self.night_active:
            return
        nobody_home = bool(self.persons) and self.people_home == 0
        if nobody_home and self.opt(CONF_NIGHT_ONLY_HOME):
            # Niemand zuhause: kein Nachtmodus. Unterwegs bleibt; ist die Anlage aus, wird sie
            # (mit aktiver Automatik) auf Unterwegs geschaltet, damit das leere Haus geschützt ist.
            if self.state == S.DISARMED and self.auto_mode and self.opt(CONF_AUTO_ARM):
                self._cancel_auto_arm()
                self.hass.async_create_task(
                    self.async_arm(MODE_AWAY, self.t("Automatik: Nachtzeit – niemand zuhause"), skip_delay=True, auto=True)
                )
            else:
                self._log("info", self.t("Nachtzeit – niemand zuhause, kein Nachtmodus"))
                self._async_update()
            return
        if self.state == S.DISARMED:
            self.hass.async_create_task(
                self.async_arm(MODE_NIGHT, self.t("Automatik: Nachtzeit"), auto=True)
            )
        elif self.state == S.ARMED_AWAY and self.armed_by_automation and not nobody_home:
            # Unterwegs wurde automatisch geschaltet, inzwischen ist aber jemand da -> Nachtmodus
            self.hass.async_create_task(
                self.async_arm(MODE_NIGHT, self.t("Automatik: Nachtzeit"), skip_delay=True, auto=True)
            )

    @callback
    def _handle_night_end(self, _now: datetime) -> None:
        self._cancel_night_rearm()
        if not self.night_active or self.state != S.ARMED_NIGHT:
            return  # Unterwegs bleibt morgens selbstverständlich scharf
        if self.persons and self.people_home == 0:
            # Niemand mehr da: das leere Haus nie unscharf lassen
            if self.auto_mode and self.opt(CONF_AUTO_ARM):
                self.hass.async_create_task(
                    self.async_arm(MODE_AWAY, self.t("Automatik: Morgen – niemand zuhause"), skip_delay=True, auto=True)
                )
            else:
                self._log("info", self.t("Nachtende – niemand zuhause, Nachtmodus bleibt aktiv"))
                self._async_update()
            return
        self.hass.async_create_task(self.async_disarm(self.t("Automatik: Guten Morgen")))

    @callback
    def _handle_notification_action(self, event: Event) -> None:
        action = event.data.get("action", "")
        if action == f"{ACTION_SILENCE}_{self.entry.entry_id}":
            self.hass.async_create_task(self.async_silence(self.t("Benachrichtigung")))
        elif action == f"{ACTION_DISARM}_{self.entry.entry_id}" and self.opt(
            CONF_NOTIFY_DISARM_ACTION
        ):
            self.hass.async_create_task(self.async_disarm(self.t("Benachrichtigung")))
        elif action.startswith(f"{ACTION_DISARM}_{self.entry.entry_id}_") and self.opt(CONF_NOTIFY_DISARM_ACTION):
            zone = self.zones.get(action.rsplit("_", 1)[-1])
            if zone:
                self.hass.async_create_task(zone.async_disarm(self.t("Benachrichtigung")))

    # ------------------------------------------------------------------
    # Ausgänge: Sirene, Licht, Sprache, Benachrichtigung
    # ------------------------------------------------------------------
    def sirens_for(self, source: str) -> list[str]:
        """Sirenen einer Quelle: Hauptbereich = gemeinsame Auswahl; Teilbereich = gemeinsam, eigene oder keine."""
        shared = list(self.opt(CONF_SIRENS) or [])
        zone = self.zones.get(source)
        if zone is None:
            return shared
        mode = zone.cfg.get("siren_mode", "shared")
        if mode == "off":
            return []
        if mode == "own":
            return list(zone.cfg.get("sirens") or [])
        return shared

    async def _async_sirens(self, on: bool, source: str = "main") -> None:
        """Sirenen einer Quelle ein-/ausschalten. Eine Sirene geht erst aus, wenn keine Quelle sie mehr braucht."""
        if on:
            targets = self.sirens_for(source)
            self._siren_sources[source] = targets
        elif source == "*":
            targets = sorted({e for ents in self._siren_sources.values() for e in ents} | set(self.opt(CONF_SIRENS) or []))
            self._siren_sources.clear()
        else:
            gone = self._siren_sources.pop(source, None)
            if gone is None:
                gone = self.sirens_for(source)
            still = {e for ents in self._siren_sources.values() for e in ents}
            targets = [e for e in gone if e not in still]
        self.siren_active = any(self._siren_sources.values())
        if not targets:
            return
        try:
            await self.hass.services.async_call(
                "homeassistant",
                "turn_on" if on else "turn_off",
                {ATTR_ENTITY_ID: targets},
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

    def _platform(self, entity_id: str) -> str | None:
        try:
            from homeassistant.helpers import entity_registry as er  # noqa: PLC0415

            ent = er.async_get(self.hass).async_get(entity_id)
            return ent.platform if ent else None
        except Exception:  # noqa: BLE001 – im Test ohne Registry
            return None

    def speech_targets(self) -> tuple[list[str], list[str]]:
        """(Lautsprecher für TTS, Alexa-Geräte). Alexa-Geräte unter „Lautsprecher“ werden zu Alexa umgeleitet."""
        players = list(self.opt(CONF_MEDIA_PLAYERS) or [])
        alexa = list(self.opt(CONF_ALEXA_DEVICES) or []) if self.opt(CONF_ALEXA_ENABLED) else []
        for p in [p for p in players if self._platform(p) == ALEXA_PLATFORM]:
            players.remove(p)
            if p not in alexa:
                alexa.append(p)
        return players, alexa

    async def _async_alarm_announcement(self, message: str, silent_reason: str | None) -> None:
        """Alarm-Durchsage – unabhängig von den Sirenen-Regeln, außer es ist so eingestellt."""
        if not self.tts_enabled:
            return
        if silent_reason is not None and not self.opt(CONF_TTS_SILENT):
            self._log("info", self.t("Keine Ansage – stiller Alarm: {reason}", reason=silent_reason))
            return
        players, alexa = self.speech_targets()
        if not alexa and (not players or not self.opt(CONF_TTS_ENTITY)):
            self._log("warning", self.t("Keine Ansage – keine Lautsprecher oder Alexa-Geräte ausgewählt"))
            return
        await self._async_speak(message)

    async def _async_speak(self, message: str, force: bool = False) -> None:
        if not force and not self.tts_enabled:
            return
        players, alexa = self.speech_targets()
        if alexa:
            # Alexa Media Player: Standard-Alexa-Stimme, kein TTS-Dienst
            try:
                await self.hass.services.async_call(
                    "notify",
                    "alexa_media",
                    {"message": message, "target": alexa, "data": {"type": "tts"}},
                    blocking=False,
                )
            except Exception as err:  # noqa: BLE001
                _LOGGER.warning("Alexa-Ansage fehlgeschlagen: %s", err)
                self._log("warning", self.t("Alexa-Ansage fehlgeschlagen: {err}", err=err))
        tts_entity = self.opt(CONF_TTS_ENTITY)
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
        whatsapp: bool = True,
        zone_id: str | None = None,
    ) -> None:
        if whatsapp and self.opt(CONF_WA_ENABLED) and self.opt(CONF_WA_OTHER):
            # Weitere Meldungen (Schaltungen, Sabotage, falscher PIN …) an die Sofort-Empfänger
            for rec in self._wa_recipients():
                if rec.delay == 0:
                    self.hass.async_create_task(self._wa_send(rec, f"{title}\n{message}"))
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
                            "title": self.t("Sirene stumm"),
                        }
                    ]
                    if self.opt(CONF_NOTIFY_DISARM_ACTION):
                        actions.append(
                            {
                                "action": f"{ACTION_DISARM}_{self.entry.entry_id}" + (f"_{zone_id}" if zone_id else ""),
                                "title": self.t("Entschärfen"),
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

    # ------------------------------------------------------------------
    # Haushalt (Wassersensoren u. a.) – meldet per Push/WhatsApp, löst keinen Einbruchalarm aus
    # ------------------------------------------------------------------
    def household_items(self) -> list[dict[str, str]]:
        out = []
        for item in self.opt(CONF_HH_SENSORS) or []:
            if isinstance(item, dict) and item.get("entity"):
                out.append({"entity": str(item["entity"]), "state": str(item.get("state") or "on")})
        return out

    _HH_LABELS = {
        "moisture": ("Trocken", "Feucht"),
        "gas": ("Kein Gas", "Gas erkannt"),
        "smoke": ("Kein Rauch", "Rauch erkannt"),
        "carbon_monoxide": ("Kein CO", "CO erkannt"),
        "problem": ("OK", "Problem"),
        "cold": ("Normal", "Kalt"),
        "heat": ("Normal", "Heiß"),
        "door": ("Geschlossen", "Offen"),
        "window": ("Geschlossen", "Offen"),
        "opening": ("Geschlossen", "Offen"),
        "running": ("Aus", "Läuft"),
        "power": ("Aus", "Strom"),
        "plug": ("Ausgesteckt", "Eingesteckt"),
        "battery": ("Normal", "Batterie schwach"),
    }

    def household_state_label(self, entity_id: str, state: str) -> str:
        st = self.hass.states.get(entity_id)
        if entity_id.startswith("binary_sensor.") and state in ("on", "off"):
            dc = (st.attributes.get("device_class") if st else None) or ""
            off, on = self._HH_LABELS.get(dc, ("Aus", "An"))
            return self.t(on if state == "on" else off)
        return state

    @callback
    def _handle_household_event(self, event: Event[EventStateChangedData]) -> None:
        entity_id = event.data["entity_id"]
        old = event.data.get("old_state")
        new = event.data.get("new_state")
        if not self.opt(CONF_HH_ENABLED) or new is None:
            return
        item = next((i for i in self.household_items() if i["entity"] == entity_id), None)
        if item is None:
            return
        old_state = old.state if old else None
        name = self.friendly(entity_id)
        now = dt_util.as_local(dt_util.utcnow()).strftime("%H:%M")
        if new.state == item["state"] and old_state != item["state"] and old_state not in INVALID_STATES:
            self._household_alert(entity_id, item["state"])
        elif old_state == item["state"] and new.state != item["state"] and new.state not in INVALID_STATES:
            self._household_resolved(entity_id, new.state)

    @callback
    def _household_alert(self, entity_id: str, state: str) -> None:
        """Haushalts-Meldung: Protokoll, Ansage, Push, WhatsApp."""
        name = self.friendly(entity_id)
        now = dt_util.as_local(dt_util.utcnow()).strftime("%H:%M")
        if True:
            self.household_alerts.add(entity_id)
            label = self.household_state_label(entity_id, state)
            self._log("household", self.t("Haushalt: {name} – {state}", name=name, state=label))
            self._async_update()
            if self.opt(CONF_TTS_HOUSEHOLD):
                if self.sensor_type(entity_id) == "water":
                    speech = self.t("Achtung, Wasseralarm! Wasser erkannt: {name}. Bitte sofort prüfen.", name=name)
                else:
                    speech = self.t("Achtung! {name}: {state} erkannt. Bitte prüfen.", name=name, state=label)
                self.hass.async_create_task(self._async_speak(speech))
            self.hass.async_create_task(
                self._async_household_notify(
                    self.t("💧 Haushalt: {name}", name=name),
                    self.t("{name}: {state} erkannt ({time} Uhr). Bitte prüfen!", name=name, state=label, time=now),
                    critical=True,
                )
            )

    @callback
    def _household_resolved(self, entity_id: str, new_state: str) -> None:
        """Haushalts-Meldung beendet (Entwarnung)."""
        name = self.friendly(entity_id)
        now = dt_util.as_local(dt_util.utcnow()).strftime("%H:%M")
        if True:
            self.household_alerts.discard(entity_id)
            label = self.household_state_label(entity_id, new_state)
            if entity_id.startswith("binary_sensor."):
                label = label.lower()  # „wieder trocken“
            self._log("info", self.t("Haushalt: {name} wieder {state}", name=name, state=label))
            self._async_update()
            if self.opt(CONF_HH_RESOLVED):
                self.hass.async_create_task(
                    self._async_household_notify(
                        self.t("✅ Haushalt: {name}", name=name),
                        self.t("Entwarnung: {name} ist wieder {state} ({time} Uhr).", name=name, state=label, time=now),
                        critical=False,
                    )
                )

    async def _async_household_notify(self, title: str, message: str, critical: bool) -> None:
        """Push und/oder WhatsApp – je nach den Häkchen unter Alarm-Aktionen."""
        if self.opt(CONF_HH_NOTIFY):
            await self._async_notify(title, message, critical=critical, whatsapp=False)
        if self.opt(CONF_HH_WHATSAPP) and self.opt(CONF_WA_ENABLED):
            for rec in self._wa_recipients():
                if rec.delay == 0:
                    await self._wa_send(rec, f"{title}\n{message}")

    # ------------------------------------------------------------------
    # Teilbereiche: gemeinsame Ausgänge
    # ------------------------------------------------------------------
    def any_zone_alarm(self, exclude: str | None = None) -> bool:
        return any(z.state in (S.TRIGGERED,) for zid, z in self.zones.items() if zid != exclude)

    def zone_entity_id(self, zone_id: str) -> str | None:
        try:
            from homeassistant.helpers import entity_registry as er  # noqa: PLC0415

            return er.async_get(self.hass).async_get_entity_id("alarm_control_panel", DOMAIN, f"{self.entry.entry_id}_zone_{zone_id}")
        except Exception:  # noqa: BLE001 – im Test ohne Registry
            return None

    async def async_zone_alarm(self, zone: SafeHomeZone, cause: str) -> None:
        """Alarm eines Teilbereichs über die gemeinsamen Ausgänge – immer mit Namen des Bereichs."""
        full = f"{zone.name}: {cause}"
        self.hass.bus.async_fire(
            EVENT_TRIGGERED,
            {"entry_id": self.entry.entry_id, "name": self.name, "zone": zone.name, "zone_id": zone.id, "cause": cause, "mode": "zone"},
        )
        if zone.cfg.get("siren_mode") == "off":
            reason = self.t("für {zone} ist keine Sirene eingestellt", zone=zone.name)
        elif not self.sirens_for(zone.id):
            reason = self.t("keine Sirene ausgewählt")
        else:
            reason = self.siren_block_reason(zone.trigger_sensors, zone=True)
        zone.silent_reason = reason
        if reason is None:
            self._silenced = False
            await self._async_sirens(True, zone.id)
        else:
            zone._log("info", self.t("Stiller Alarm – Sirene bleibt aus: {reason}", reason=reason))  # noqa: SLF001
        await self._async_alarm_lights()
        await self._async_alarm_announcement(self.alarm_speech(list(zone.trigger_sensors), cause, zone=zone.name), reason)
        await self._async_persistent(
            self.t("🚨 Safe Home Alarm – {zone}", zone=zone.name),
            f"{full} – {dt_util.as_local(zone.triggered_at or dt_util.utcnow()).strftime(date_format(self.hass))}",
        )
        await self._async_notify(
            self.t("🚨 ALARM – {zone}", zone=zone.name),
            self.t("{cause}. Bereich: {zone}.", cause=cause, zone=zone.name),
            critical=True,
            with_actions=True,
            with_camera=True,
            whatsapp=False,
            zone_id=zone.id,
        )
        self._wa_zone_start(zone)
        self._async_update()

    # ------------------------------------------------------------------
    # Wochenplan (Kernzeiten) – greift nur, wenn „Anwesenheit“ ausgeschaltet ist
    # ------------------------------------------------------------------
    def _week_transitions(self) -> tuple[dict[int, str], set[int]]:
        """(Beginn → Modus, Enden) in Minuten der Woche (Mo 00:00 = 0). Lückenlose Balken gelten als einer."""
        segs: list[list[Any]] = []
        plan = self.opt(CONF_WEEK_PLAN) or []
        for day, bars in enumerate(plan[:7]):
            for start, end, mode in bars:
                segs.append([day * 1440 + start, day * 1440 + end, mode])
        segs.sort()
        merged: list[list[Any]] = []
        for seg in segs:
            if merged and seg[0] <= merged[-1][1] and seg[2] == merged[-1][2]:
                merged[-1][1] = max(merged[-1][1], seg[1])
            else:
                merged.append(seg)
        week = 7 * 1440
        if len(merged) > 1 and merged[0][0] == 0 and merged[-1][1] == week and merged[0][2] == merged[-1][2]:
            first = merged.pop(0)  # über Sonntag → Montag hinweg
            merged[-1][1] = week + first[1]
        starts = {seg[0] % week: seg[2] for seg in merged}
        ends = {seg[1] % week for seg in merged if seg[1] - seg[0] < week} - set(starts)
        return starts, ends

    def week_active(self) -> bool:
        return bool(self.opt(CONF_WEEK_ENABLED)) and not self.auto_mode

    @callback
    def _handle_week_tick(self, now: datetime) -> None:
        if not self.week_active():
            return
        local = dt_util.as_local(now)
        minute = local.weekday() * 1440 + local.hour * 60 + local.minute
        starts, ends = self._week
        source = self.t("Kernzeiten")
        if minute in starts:
            mode = starts[minute]
            if self.state in (S.TRIGGERED, S.PENDING) or (self.active_mode == mode and self.state != S.DISARMED):
                return

            async def _arm() -> None:
                if await self.async_arm(mode, source):
                    self.armed_by_week = True
                    self._async_update()

            self.hass.async_create_task(_arm())
        elif minute in ends and self.armed_by_week and self.state in (*ARMED_STATES, S.ARMING):
            self.hass.async_create_task(self.async_disarm(source))

    # ------------------------------------------------------------------
    # Alarm von einem Sensor auslösen (Einstellungsseite) und Rückstellung
    # ------------------------------------------------------------------
    def drill_info(self) -> dict[str, Any]:
        d = self.drill
        if not d:
            return {"active": False}
        return {"active": True, "kind": d["kind"], "entity": d["entity"], "name": self.friendly(d["entity"]), "zone": d.get("zone")}

    async def async_drill(self, entity_id: str) -> str:
        """Alarm so auslösen, als hätte der Sensor gemeldet – mit allen echten Ausgängen."""
        if self.drill:
            return self.t("Bitte zuerst zurückstellen")
        name = self.friendly(entity_id)
        zone = next((z for z in self.zones.values() if entity_id in z.sensors), None)
        item = next((i for i in self.household_items() if i["entity"] == entity_id), None)
        if zone is not None:
            if zone.state == S.TRIGGERED:
                return self.t("{zone} ist bereits im Alarm", zone=zone.name)
            self.drill = {"kind": "alarm", "entity": entity_id, "zone": zone.id, "prev": zone.state}
            zone.trigger_sensors = [entity_id]
            await zone.async_trigger(self.sensor_cause(entity_id))
        elif entity_id in self.away_sensors or entity_id in self.night_sensors:
            if self.state == S.TRIGGERED:
                return self.t("Die Alarmanlage ist bereits im Alarm")
            prev = self.armed_mode if self.state in ARMED_STATES or self.state == S.PENDING else None
            self.drill = {"kind": "alarm", "entity": entity_id, "zone": None, "prev": prev}
            self._cancel_delay()
            self._cancel_auto_arm()
            self.arming_target = None
            if self.armed_mode is None:
                self.armed_mode = MODE_AWAY if entity_id in self.away_sensors else MODE_NIGHT
            self.trigger_sensors = [entity_id]
            await self.async_trigger(self.sensor_cause(entity_id))
        elif item is not None:
            if not self.opt(CONF_HH_ENABLED):
                return self.t("Haushalt ist ausgeschaltet")
            self.drill = {"kind": "household", "entity": entity_id, "zone": None, "prev": None, "state": item["state"]}
            self._household_alert(entity_id, item["state"])
        else:
            return self.t("Sensor nicht gefunden")
        self._async_update()
        return self.t("Alarm ausgelöst: {name}", name=name)

    async def async_drill_reset(self) -> str:
        """Alles auf den Zustand vor dem Auslösen zurückstellen."""
        d, self.drill = self.drill, None
        if not d:
            return self.t("Nichts zurückzustellen")
        source = self.t("Rückstellung")
        eid = d["entity"]
        if d["kind"] == "household":
            alert = d.get("state", "on")
            if eid.startswith("binary_sensor.") and alert in ("on", "off"):
                self._household_resolved(eid, "off" if alert == "on" else "on")
            else:
                self.household_alerts.discard(eid)
                self._log("info", self.t("Haushalt: {name} zurückgestellt", name=self.friendly(eid)))
        elif d.get("zone"):
            zone = self.zones.get(d["zone"])
            if zone is not None:
                await zone.async_disarm(source)
                if d["prev"] in (S.ARMED_AWAY, S.ARMING):
                    await zone.async_arm(source, skip_delay=True)
        else:
            await self.async_disarm(source)
            if d["prev"] in MODE_TO_STATE:
                self._set_armed(d["prev"], source)
        self._async_update()
        return self.t("Zurückgestellt")

    async def async_zone_alarm_end(self, zone: SafeHomeZone, source: str, was_alarm: bool) -> None:
        if self.drill and self.drill.get("zone") == zone.id:
            self.drill = None
        await self._async_sirens(False, zone.id)
        if was_alarm and self.state != S.TRIGGERED and not self.any_zone_alarm(exclude=zone.id):
            await self._async_restore_lights()
        tr = self._wa_zone.pop(zone.id, None)
        if tr:
            for unsub in tr["timers"]:
                unsub()
            if self.opt(CONF_WA_ALL_CLEAR) and tr["notified"]:
                text = self.t(
                    "✅ Entwarnung: {name} wurde um {time} Uhr ausgeschaltet ({source}).",
                    name=f"{self.name} – {zone.name}",
                    time=dt_util.as_local(dt_util.utcnow()).strftime("%H:%M"),
                    source=source,
                )
                for rec in tr["notified"]:
                    self.hass.async_create_task(self._wa_send(rec, text))

    def _wa_zone_text(self, zone: SafeHomeZone, minutes: int = 0) -> str:
        now = dt_util.as_local(zone.triggered_at or dt_util.utcnow())
        names = [self.friendly(e) for e in zone.trigger_sensors]
        values = {
            "name": f"{self.name} – {zone.name}",
            "sensor": f"{zone.name}: " + (", ".join(names) if names else (zone.trigger_cause or self.t("Unbekannter Melder"))),
            "cause": zone.trigger_cause or "",
            "mode": zone.name,
            "date": now.strftime("%d.%m.%Y" if is_german(self.hass) else "%Y-%m-%d"),
            "time": now.strftime("%H:%M"),
        }
        return self._wa_format(values, minutes)

    @callback
    def _wa_zone_start(self, zone: SafeHomeZone) -> None:
        old = self._wa_zone.pop(zone.id, None)
        if old:
            for unsub in old["timers"]:
                unsub()
        if not self.opt(CONF_WA_ENABLED):
            return
        tr: dict[str, Any] = {"timers": [], "notified": []}
        self._wa_zone[zone.id] = tr

        async def _send(rec: wa.Recipient, minutes: int) -> None:
            if await self._wa_send(rec, self._wa_zone_text(zone, minutes)):
                tr["notified"].append(rec)

        for rec in self._wa_recipients():
            if rec.delay == 0:
                self.hass.async_create_task(_send(rec, 0))
                continue

            @callback
            def _escalate(_now: datetime, rec: wa.Recipient = rec) -> None:
                if self._wa_zone.get(zone.id) is tr:  # nicht inzwischen ausgeschaltet
                    self.hass.async_create_task(_send(rec, rec.delay))

            tr["timers"].append(async_call_later(self.hass, rec.delay * 60, _escalate))

    # ------------------------------------------------------------------
    # Akustischer Alarm
    # ------------------------------------------------------------------
    def siren_window(self) -> tuple[time, time]:
        return (
            _parse_time(self.opt(CONF_SIREN_TIME_START), DEFAULTS[CONF_SIREN_TIME_START]),
            _parse_time(self.opt(CONF_SIREN_TIME_END), DEFAULTS[CONF_SIREN_TIME_END]),
        )

    def siren_in_window(self, now: datetime | None = None) -> bool:
        """Liegt der Zeitpunkt im Zeitfenster für den akustischen Alarm? (auch über Mitternacht)"""
        if not self.opt(CONF_SIREN_TIME_ENABLED):
            return True
        start, end = self.siren_window()
        t = dt_util.as_local(now or dt_util.utcnow()).time()
        if start == end:
            return True
        if start < end:
            return start <= t < end
        return t >= start or t < end

    def siren_block_reason(self, sensors: list[str], panic: bool = False, zone: bool = False) -> str | None:
        """None = Sirene darf auslösen, sonst der Grund für den stillen Alarm."""
        if panic:
            return None  # Panikalarm ist ein bewusster Notruf und ertönt immer
        modes = self.opt(CONF_SIREN_MODES)
        modes = list(modes) if isinstance(modes, (list, tuple)) else list(DEFAULTS[CONF_SIREN_MODES])
        mode = None if zone else self.armed_mode  # Teilbereiche kennen nur „scharf“
        if mode and mode not in modes:
            return self.t("im Modus {mode} ist der akustische Alarm ausgeschaltet", mode=self.ml(mode))
        if not self.siren_in_window():
            start, end = self.siren_window()
            return self.t(
                "außerhalb des Zeitfensters {start}–{end} Uhr",
                start=start.strftime("%H:%M"),
                end=end.strftime("%H:%M"),
            )
        excluded = set(self.opt(CONF_SIREN_EXCLUDED) or [])
        if sensors and all(s in excluded for s in sensors):
            return self.t(
                "{names} löst keinen akustischen Alarm aus",
                names=", ".join(self.friendly(s) for s in sensors),
            )
        return None

    @callback
    def _late_siren(self, entity_id: str) -> None:
        """Weiterer Melder während eines stillen Alarms: Sirene nachträglich starten, wenn er darf."""
        if entity_id not in self.trigger_sensors:
            self.trigger_sensors = [*self.trigger_sensors, entity_id]
        if self.siren_active or self._silenced or not self.silent_reason:
            return
        if self.siren_block_reason([entity_id]) is not None:
            return
        self.silent_reason = None
        self._log("triggered", self.t("Sirene ausgelöst durch {name}", name=self.friendly(entity_id)))
        self.hass.async_create_task(self._async_sirens(True))
        self._start_siren_timer()

    # ------------------------------------------------------------------
    # WhatsApp (TextMeBot)
    # ------------------------------------------------------------------
    def _wa_recipients(self) -> list[wa.Recipient]:
        return wa.parse_recipients(self.opt(CONF_WA_RECIPIENTS))

    def _wa_sensor_text(self) -> str:
        names = [self.friendly(e) for e in self.trigger_sensors]
        if names:
            return ", ".join(names)
        return self.trigger_cause or self.t("Unbekannter Melder")

    def _wa_alarm_text(self, escalation_minutes: int = 0) -> str:
        now = dt_util.as_local(self.triggered_at or dt_util.utcnow())
        values = {
            "name": self.name,
            "sensor": self._wa_sensor_text(),
            "cause": self.trigger_cause or "",
            "mode": self.ml(self.armed_mode),
            "date": now.strftime("%d.%m.%Y" if is_german(self.hass) else "%Y-%m-%d"),
            "time": now.strftime("%H:%M"),
        }
        return self._wa_format(values, escalation_minutes)

    def _wa_format(self, values: dict[str, Any], escalation_minutes: int = 0) -> str:
        template = str(self.opt(CONF_WA_MESSAGE) or "").strip() or self.t(
            "🚨 ALARM AUSGELÖST! 🚨\nAuslöser: {sensor}\nZeitpunkt: {date} um {time} Uhr\nModus: {mode}\nBitte sofort prüfen!"
        )

        class _Keep(dict):
            def __missing__(self, key: str) -> str:  # unbekannte Platzhalter stehen lassen
                return "{" + key + "}"

        try:
            text = template.format_map(_Keep(values))
        except (ValueError, IndexError):
            text = template
        if escalation_minutes:
            text = self.t("⏰ Erinnerung: Der Alarm ist seit {minutes} Minuten nicht zurückgestellt.", minutes=escalation_minutes) + "\n\n" + text
        return text

    async def _wa_send(self, rec: wa.Recipient, text: str) -> bool:
        ok, info = await wa.async_send(self.hass, rec, text)
        if not ok and info != "example":
            self._log("warning", self.t("WhatsApp an {name} fehlgeschlagen: {info}", name=rec.name, info=info))
            self._async_update()
        return ok

    @callback
    def _wa_start_alarm(self) -> None:
        """Alarm per WhatsApp: Sofort-Empfänger direkt, weitere nach ihrer Wartezeit (Eskalation)."""
        self._wa_cancel()
        self._wa_alarm_active = True
        self._wa_notified = []
        if not self.opt(CONF_WA_ENABLED):
            return
        recipients = self._wa_recipients()
        if not recipients:
            return

        async def _send_alarm(rec: wa.Recipient, minutes: int) -> None:
            if await self._wa_send(rec, self._wa_alarm_text(minutes)):
                self._wa_notified.append(rec)
                self._log("info", self.t("WhatsApp-Alarm an {name} gesendet", name=rec.name))
                self._async_update()

        for rec in recipients:
            if rec.delay == 0:
                self.hass.async_create_task(_send_alarm(rec, 0))
                continue

            @callback
            def _escalate(_now: datetime, rec: wa.Recipient = rec) -> None:
                # Nur, wenn der Alarm in der Zwischenzeit nicht zurückgestellt wurde
                if self._wa_alarm_active:
                    self._log("warning", self.t("Alarm nicht zurückgestellt – WhatsApp an {name}", name=rec.name))
                    self._async_update()
                    self.hass.async_create_task(_send_alarm(rec, rec.delay))

            self._wa_timers.append(async_call_later(self.hass, rec.delay * 60, _escalate))

    @callback
    def _wa_cancel(self) -> None:
        for unsub in self._wa_timers:
            unsub()
        self._wa_timers = []

    async def _wa_test(self) -> str:
        recipients = self._wa_recipients()
        if not recipients:
            return self.t("Kein WhatsApp-Empfänger eingetragen")
        if all(r.is_example for r in recipients):
            return self.t("Noch Beispieldaten – bitte echte Nummer und TextMeBot-API-Key eintragen")
        text = self.t("🧪 Safe Home: Test-Nachricht über WhatsApp. Diese Nummer erhält Alarme von „{name}“.", name=self.name)
        sent, failed = [], []
        for rec in recipients:
            if rec.is_example:
                continue
            (sent if await self._wa_send(rec, text) else failed).append(rec.name)
        self._log("info", self.t("WhatsApp-Test: {ok} von {total} gesendet", ok=len(sent), total=len(sent) + len(failed)))
        self._async_update()
        if failed:
            return self.t("WhatsApp fehlgeschlagen an: {names} – Details im Protokoll", names=", ".join(failed))
        return self.t("WhatsApp-Test gesendet an: {names}", names=", ".join(sent))

    # ------------------------------------------------------------------
    # Hinweis-Ansage während der Eingangsverzögerung – in Schleife, bis entschärft oder Zeit abgelaufen
    # ------------------------------------------------------------------
    @callback
    def start_entry_announcements(
        self,
        key: str,
        active: Callable[[], bool],
        until: Callable[[], datetime | None],
        text: Callable[[int, bool], str],
    ) -> None:
        if not self.opt(CONF_TTS_ENTRY_WARNING):
            return
        self._stop_entry_announcements(key)
        gen = self._entry_gen.get(key, 0) + 1
        self._entry_gen[key] = gen
        interval = max(0, int(self.opt(CONF_TTS_ENTRY_REPEAT) or 0))
        if interval:
            interval = max(5, interval)  # Ansagen dürfen sich nicht überlappen

        @callback
        def _tick(_now: datetime | None = None, first: bool = False) -> None:
            self._entry_timers.pop(key, None)
            if self._entry_gen.get(key) != gen or not active():
                return
            end = until()
            remaining = int(-(-(end - dt_util.utcnow()).total_seconds() // 1)) if end else 0
            if remaining < 3:
                return  # gleich beginnt der Alarm – keine Ansage mehr dazwischen
            self.hass.async_create_task(self._async_speak(text(remaining, first)))
            if interval and remaining - interval >= 3:
                self._entry_timers[key] = async_call_later(self.hass, interval, _tick)

        _tick(first=True)

    @callback
    def _stop_entry_announcements(self, key: str | None = None) -> None:
        for k in [key] if key else list(self._entry_timers):
            unsub = self._entry_timers.pop(k, None)
            if unsub:
                unsub()

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
            "armed_by_automation": self.armed_by_automation,
            "armed_by_week": self.armed_by_week,
            "code_locked_until": self.code_locked_until.isoformat() if self.code_locked_until else None,
            "battery_notified": sorted(self._battery_notified),
            "wrong_codes": self._wrong_codes,
            "zones": {zid: z.save_data() for zid, z in self.zones.items()},
            "events": list(self.events),
        }

    async def _async_save(self) -> None:
        await self._store.async_save(self._data_to_save())

    @property
    def auto_arm_pending(self) -> bool:
        return self._timer_auto_arm is not None
