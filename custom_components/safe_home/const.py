"""Konstanten für Safe Home."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "safe_home"
NAME: Final = "Safe Home"
MANUFACTURER: Final = "Digital7even"
VERSION: Final = "1.0.0"

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
CONF_TRIGGER_TIME: Final = "trigger_time"
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

# Automatik
CONF_PERSONS: Final = "persons"
CONF_AUTO_ARM: Final = "auto_arm"
CONF_AUTO_ARM_DELAY: Final = "auto_arm_delay"
CONF_AUTO_DISARM: Final = "auto_disarm"
CONF_NIGHT_AUTO: Final = "night_auto"
CONF_NIGHT_START: Final = "night_start"
CONF_NIGHT_END: Final = "night_end"
CONF_NIGHT_ONLY_HOME: Final = "night_only_when_home"

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
    CONF_PERSONS: [],
    CONF_AUTO_ARM: True,
    CONF_AUTO_ARM_DELAY: 120,
    CONF_AUTO_DISARM: True,
    CONF_NIGHT_AUTO: False,
    CONF_NIGHT_START: "23:00:00",
    CONF_NIGHT_END: "06:30:00",
    CONF_NIGHT_ONLY_HOME: True,
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
