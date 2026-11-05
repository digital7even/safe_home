"""Konstanten für Safe Home."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "safe_home"
NAME: Final = "Safe Home"
MANUFACTURER: Final = "Digital7even"
VERSION: Final = "1.1.0"

# Frontend
FRONTEND_URL_BASE: Final = "/safe_home_static"
CARD_FILENAME: Final = "safe-home-card.js"
PANEL_FILENAME: Final = "safe-home-panel.js"
PANEL_URL_PATH: Final = "safe-home"

# Allgemein / Sicherheit
CONF_CODE: Final = "code"
CONF_CODE_ARM_REQUIRED: Final = "code_arm_required"
CONF_NOTIFY_WRONG_CODE: Final = "notify_wrong_code"

# Sensoren
CONF_AWAY_SENSORS: Final = "away_sensors"
CONF_NIGHT_SENSORS: Final = "night_sensors"
CONF_DELAYED_SENSORS: Final = "delayed_sensors"
CONF_OPEN_POLICY: Final = "open_sensor_policy"
CONF_TAMPER_NOTIFY: Final = "tamper_notify"

OPEN_POLICY_BYPASS: Final = "bypass"
OPEN_POLICY_BLOCK: Final = "block"

# Zeiten (Sekunden)
CONF_EXIT_DELAY_AWAY: Final = "exit_delay_away"
CONF_EXIT_DELAY_NIGHT: Final = "exit_delay_night"
CONF_ENTRY_DELAY_AWAY: Final = "entry_delay_away"
CONF_ENTRY_DELAY_NIGHT: Final = "entry_delay_night"
CONF_TRIGGER_TIME: Final = "trigger_time"  # Alarmdauer (Zustand „Alarm“), 0 = bis zum Ausschalten
CONF_SIREN_DURATION: Final = "siren_duration"  # Dauer des akustischen Alarms, 0 = gesamte Alarmdauer
CONF_REARM: Final = "rearm_after_trigger"

# Aktionen
CONF_SIRENS: Final = "sirens"
CONF_ALARM_LIGHTS: Final = "alarm_lights"
CONF_NOTIFY_SERVICES: Final = "notify_services"
CONF_NOTIFY_STATE_CHANGES: Final = "notify_state_changes"
CONF_CRITICAL: Final = "critical_notifications"
CONF_NOTIFY_DISARM_ACTION: Final = "notification_disarm_action"
CONF_CAMERAS: Final = "cameras"
CONF_TTS_ENTITY: Final = "tts_entity"
CONF_MEDIA_PLAYERS: Final = "media_players"

# Akustischer Alarm (Sirenen) – fein einstellbar
CONF_SIREN_MODES: Final = "siren_modes"  # in welchen Modi die Sirene auslöst
CONF_SIREN_TIME_ENABLED: Final = "siren_time_enabled"
CONF_SIREN_TIME_START: Final = "siren_time_start"
CONF_SIREN_TIME_END: Final = "siren_time_end"
CONF_SIREN_EXCLUDED: Final = "siren_excluded_sensors"  # Melder ohne akustischen Alarm

# Haushalt (z. B. Wassersensoren) – unabhängig vom Zustand der Alarmanlage
CONF_HH_ENABLED: Final = "household_enabled"
CONF_HH_SENSORS: Final = "household_sensors"  # [{"entity": ..., "state": "on"}]
CONF_HH_NOTIFY: Final = "household_notify"  # Push bei Haushalts-Alarm
CONF_HH_WHATSAPP: Final = "whatsapp_household"  # WhatsApp bei Haushalts-Alarm
CONF_HH_RESOLVED: Final = "household_resolved"  # Entwarnung, wenn der Zustand endet

# Teilbereiche (bis zu 3, z. B. Garage) – nur Scharf/Unscharf, eigene Sensoren und Zeiten
CONF_ZONES: Final = "zones"

# WhatsApp (TextMeBot)
CONF_WA_ENABLED: Final = "whatsapp_enabled"
CONF_WA_RECIPIENTS: Final = "whatsapp_recipients"
CONF_WA_MESSAGE: Final = "whatsapp_message"
CONF_WA_ALL_CLEAR: Final = "whatsapp_all_clear"
CONF_WA_OTHER: Final = "whatsapp_other_messages"

# Automatik
CONF_PERSONS: Final = "persons"
CONF_AUTO_ARM: Final = "auto_arm"
CONF_AUTO_ARM_DELAY: Final = "auto_arm_delay"
CONF_AUTO_DISARM: Final = "auto_disarm"
CONF_NIGHT_AUTO: Final = "night_auto"
CONF_NIGHT_START: Final = "night_start"
CONF_NIGHT_END: Final = "night_end"
CONF_NIGHT_ONLY_HOME: Final = "night_only_when_home"
CONF_NIGHT_REARM_DELAY: Final = "night_rearm_delay"  # Minuten nach Heimkehr in der Nacht, 0 = aus

DEFAULTS: Final[dict] = {
    CONF_CODE: "",
    CONF_CODE_ARM_REQUIRED: False,
    CONF_NOTIFY_WRONG_CODE: True,
    CONF_AWAY_SENSORS: [],
    CONF_NIGHT_SENSORS: [],
    CONF_DELAYED_SENSORS: [],
    CONF_OPEN_POLICY: OPEN_POLICY_BYPASS,
    CONF_TAMPER_NOTIFY: True,
    CONF_EXIT_DELAY_AWAY: 60,
    CONF_EXIT_DELAY_NIGHT: 0,
    CONF_ENTRY_DELAY_AWAY: 30,
    CONF_ENTRY_DELAY_NIGHT: 15,
    CONF_TRIGGER_TIME: 180,
    CONF_SIREN_DURATION: 180,
    CONF_REARM: True,
    CONF_SIRENS: [],
    CONF_ALARM_LIGHTS: [],
    CONF_NOTIFY_SERVICES: [],
    CONF_NOTIFY_STATE_CHANGES: True,
    CONF_CRITICAL: True,
    CONF_NOTIFY_DISARM_ACTION: False,
    CONF_CAMERAS: [],
    CONF_TTS_ENTITY: None,
    CONF_MEDIA_PLAYERS: [],
    CONF_SIREN_MODES: ["away", "night"],
    CONF_SIREN_TIME_ENABLED: False,
    CONF_SIREN_TIME_START: "22:00:00",
    CONF_SIREN_TIME_END: "06:00:00",
    CONF_SIREN_EXCLUDED: [],
    CONF_ZONES: [],
    CONF_HH_ENABLED: False,
    CONF_HH_SENSORS: [],
    CONF_HH_NOTIFY: True,
    CONF_HH_WHATSAPP: True,
    CONF_HH_RESOLVED: True,
    CONF_WA_ENABLED: False,
    # Beispieldaten – vor dem Einschalten durch echte Nummern und TextMeBot-Keys ersetzen
    CONF_WA_RECIPIENTS: [
        {"name": "Max (Beispiel)", "phone": "+491701234567", "apikey": "BeispielKey123", "delay": 0},
        {"name": "Anna (Beispiel)", "phone": "+491769876543", "apikey": "BeispielKey456", "delay": 5},
    ],
    CONF_WA_MESSAGE: "",  # leer = Standardtext in der Systemsprache
    CONF_WA_ALL_CLEAR: True,
    CONF_WA_OTHER: False,
    CONF_PERSONS: [],
    CONF_AUTO_ARM: True,
    CONF_AUTO_ARM_DELAY: 120,
    CONF_AUTO_DISARM: True,
    CONF_NIGHT_AUTO: False,
    CONF_NIGHT_START: "23:00:00",
    CONF_NIGHT_END: "06:30:00",
    CONF_NIGHT_ONLY_HOME: True,
    CONF_NIGHT_REARM_DELAY: 10,
}

# Modi (interne Namen)
MODE_AWAY: Final = "away"
MODE_NIGHT: Final = "night"

MODE_LABELS: Final[dict] = {
    "disarmed": "Zuhause",
    MODE_AWAY: "Unterwegs",
    MODE_NIGHT: "Nacht",
}

# Services
SERVICE_PANIC: Final = "panic"
SERVICE_SILENCE: Final = "silence"
SERVICE_SKIP_EXIT_DELAY: Final = "skip_exit_delay"
SERVICE_SET_AUTO_MODE: Final = "set_auto_mode"

# Events (für eigene Automationen)
EVENT_TRIGGERED: Final = "safe_home_triggered"
EVENT_STATE_CHANGED: Final = "safe_home_state_changed"

# Benachrichtigungs-Aktionen (Companion App)
ACTION_SILENCE: Final = "SAFE_HOME_SILENCE"
ACTION_DISARM: Final = "SAFE_HOME_DISARM"

MAX_EVENTS: Final = 30
STORAGE_VERSION: Final = 1


def signal_update(entry_id: str) -> str:
    """Dispatcher-Signal für Zustandsänderungen."""
    return f"{DOMAIN}_{entry_id}_update"
