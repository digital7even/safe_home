"""Eigene Vorlagen für Push, WhatsApp und Ansagen.

Jede Meldung hat einen Schlüssel, eine Gruppe, einen Kanal und einen Standardtext (Deutsch/Englisch).
Die Standardtexte entsprechen den eingebauten Meldungen. Eigene Texte gelten nur, wenn
„Eigene Vorlagen festlegen“ eingeschaltet ist – sonst bleibt es bei den eingebauten Meldungen.

Platzhalter stehen in geschweiften Klammern, z. B. {sensor}. Unbekannte Platzhalter bleiben stehen.
In allen Vorlagen verfügbar: {name} (Name der Alarmanlage), {time} (Uhrzeit), {date} (Datum).
"""

from __future__ import annotations

from typing import Any

MAX_LEN = 1000

# Platzhalter, die überall verfügbar sind
COMMON: tuple[str, ...] = ("name", "time", "date")

# Kanäle: push_title / push = Push-Benachrichtigung (Titel / Text), wa = WhatsApp, tts = Ansage,
# cause = Auslöser-Text (Protokoll, Push, WhatsApp, Karten)
CATALOG: list[dict[str, Any]] = [
    # ---------------------------------------------------------------- Alarm
    {"key": "push_alarm_title", "group": "alarm", "channel": "push_title", "ph": ["cause", "sensor", "mode"],
     "de": "🚨 ALARM – Safe Home", "en": "🚨 ALARM – Safe Home"},
    {"key": "push_alarm", "group": "alarm", "channel": "push", "ph": ["cause", "sensor", "mode"],
     "de": "{cause}. Modus: {mode}.", "en": "{cause}. Mode: {mode}."},
    {"key": "wa_alarm", "group": "alarm", "channel": "wa", "ph": ["sensor", "cause", "mode"],
     "de": "🚨 ALARM AUSGELÖST! 🚨\nAuslöser: {sensor}\nZeitpunkt: {date} um {time} Uhr\nModus: {mode}\nBitte sofort prüfen!",
     "en": "🚨 ALARM TRIGGERED! 🚨\nTriggered by: {sensor}\nTime: {date} at {time}\nMode: {mode}\nPlease check immediately!"},
    {"key": "tts_alarm", "group": "alarm", "channel": "tts", "ph": ["headline", "detail", "sensor", "cause", "zone"],
     "de": "{headline} {detail} Die Bewohner werden benachrichtigt.",
     "en": "{headline} {detail} The residents are being notified."},
    {"key": "push_zone_alarm_title", "group": "alarm", "channel": "push_title", "ph": ["zone", "cause", "sensor"],
     "de": "🚨 ALARM – {zone}", "en": "🚨 ALARM – {zone}"},
    {"key": "push_zone_alarm", "group": "alarm", "channel": "push", "ph": ["zone", "cause", "sensor"],
     "de": "{cause}. Bereich: {zone}.", "en": "{cause}. Area: {zone}."},
    {"key": "wa_reminder", "group": "alarm", "channel": "wa", "ph": ["minutes"],
     "de": "⏰ Erinnerung: Der Alarm ist seit {minutes} Minuten nicht zurückgestellt.",
     "en": "⏰ Reminder: the alarm has not been reset for {minutes} minutes."},
    # ---------------------------------------------------- Eingangsverzögerung
    {"key": "tts_entry_first", "group": "entry", "channel": "tts", "ph": ["delay"],
     "de": "Bitte Alarmanlage innerhalb von {delay} Sekunden ausschalten.",
     "en": "Please disarm the alarm system within {delay} seconds."},
    {"key": "tts_entry_repeat", "group": "entry", "channel": "tts", "ph": ["n"],
     "de": "Bitte Alarmanlage ausschalten – noch {n} Sekunden.",
     "en": "Please disarm the alarm system – {n} seconds left."},
    {"key": "tts_zone_entry_first", "group": "entry", "channel": "tts", "ph": ["zone", "delay"],
     "de": "{zone}: Bitte innerhalb von {delay} Sekunden ausschalten.",
     "en": "{zone}: Please disarm within {delay} seconds."},
    {"key": "tts_zone_entry_repeat", "group": "entry", "channel": "tts", "ph": ["zone", "n"],
     "de": "{zone}: Bitte ausschalten – noch {n} Sekunden.",
     "en": "{zone}: Please disarm – {n} seconds left."},
    # ------------------------------------------------------------ Schaltungen
    {"key": "push_armed_title", "group": "state", "channel": "push_title", "ph": ["icon", "mode", "source", "count"],
     "de": "{icon} Safe Home: {mode}", "en": "{icon} Safe Home: {mode}"},
    {"key": "push_armed", "group": "state", "channel": "push", "ph": ["mode", "source", "count"],
     "de": "Alarmanlage ist scharf ({source}). {count} Sensoren aktiv.",
     "en": "Alarm system armed ({source}). {count} sensors active."},
    {"key": "push_disarmed_title", "group": "state", "channel": "push_title", "ph": ["source"],
     "de": "🏠 Safe Home unscharf", "en": "🏠 Safe Home disarmed"},
    {"key": "push_disarmed", "group": "state", "channel": "push", "ph": ["source"],
     "de": "Modus Zuhause aktiv. Ausgelöst durch: {source}", "en": "Home mode active. Triggered by: {source}"},
    {"key": "wa_all_clear", "group": "state", "channel": "wa", "ph": ["source", "zone"],
     "de": "✅ Entwarnung: {name} wurde um {time} Uhr ausgeschaltet ({source}).",
     "en": "✅ All clear: {name} was disarmed at {time} ({source})."},
    # --------------------------------------------------------------- Hinweise
    {"key": "push_bypass_title", "group": "warnings", "channel": "push_title", "ph": ["mode", "names"],
     "de": "⚠️ Sensoren überbrückt", "en": "⚠️ Sensors bypassed"},
    {"key": "push_bypass", "group": "warnings", "channel": "push", "ph": ["mode", "names"],
     "de": "Beim Aktivieren von {mode} waren offen: {names}. Sie werden überwacht, sobald sie geschlossen sind.",
     "en": "When activating {mode}, these were open: {names}. They will be monitored as soon as they are closed."},
    {"key": "push_blocked_title", "group": "warnings", "channel": "push_title", "ph": ["zone", "mode", "names", "source"],
     "de": "⚠️ Scharfschalten blockiert", "en": "⚠️ Arming blocked"},
    {"key": "push_blocked", "group": "warnings", "channel": "push", "ph": ["zone", "mode", "names", "source"],
     "de": "{mode} konnte nicht aktiviert werden ({source}). Offen: {names}",
     "en": "{mode} could not be activated ({source}). Open: {names}"},
    {"key": "push_tamper_title", "group": "warnings", "channel": "push_title", "ph": ["sensor", "zone"],
     "de": "📡 Sensor nicht erreichbar", "en": "📡 Sensor unavailable"},
    {"key": "push_tamper", "group": "warnings", "channel": "push", "ph": ["sensor", "zone"],
     "de": "{sensor} meldet sich nicht mehr, während Safe Home scharf ist.",
     "en": "{sensor} is no longer responding while Safe Home is armed."},
    {"key": "push_wrong_code_title", "group": "warnings", "channel": "push_title", "ph": ["action"],
     "de": "🔐 Falscher PIN", "en": "🔐 Wrong PIN"},
    {"key": "push_wrong_code", "group": "warnings", "channel": "push", "ph": ["action"],
     "de": "Es wurde ein falscher PIN eingegeben ({action}).", "en": "A wrong PIN was entered ({action})."},
    {"key": "push_lockout_title", "group": "warnings", "channel": "push_title", "ph": ["n", "action", "m"],
     "de": "🔐 Mehrere falsche PINs", "en": "🔐 Several wrong PINs"},
    {"key": "push_lockout", "group": "warnings", "channel": "push", "ph": ["n", "action", "m"],
     "de": "{n} falsche PIN-Eingaben in Folge (zuletzt: {action}). Die PIN-Eingabe ist für {m} Minuten gesperrt.",
     "en": "{n} wrong PIN entries in a row (last: {action}). PIN entry is locked for {m} minutes."},
    {"key": "push_battery_title", "group": "warnings", "channel": "push_title", "ph": ["sensor", "level"],
     "de": "🔋 Batterie schwach", "en": "🔋 Battery low"},
    {"key": "push_battery", "group": "warnings", "channel": "push", "ph": ["sensor", "level"],
     "de": "Batterie schwach: {sensor} ({level} %). Bitte bald wechseln, damit der Sensor nicht ausfällt.",
     "en": "Battery low: {sensor} ({level} %). Please replace it soon so the sensor doesn't fail."},
    {"key": "wa_other", "group": "warnings", "channel": "wa", "ph": ["title", "message"],
     "de": "{title}\n{message}", "en": "{title}\n{message}"},
    # ---------------------------------------------------------------- Haushalt
    {"key": "push_household_title", "group": "household", "channel": "push_title", "ph": ["sensor", "state"],
     "de": "💧 Haushalt: {sensor}", "en": "💧 Household: {sensor}"},
    {"key": "push_household", "group": "household", "channel": "push", "ph": ["sensor", "state"],
     "de": "{sensor}: {state} erkannt ({time} Uhr). Bitte prüfen!", "en": "{sensor}: {state} detected ({time}). Please check!"},
    {"key": "push_household_ok_title", "group": "household", "channel": "push_title", "ph": ["sensor", "state"],
     "de": "✅ Haushalt: {sensor}", "en": "✅ Household: {sensor}"},
    {"key": "push_household_ok", "group": "household", "channel": "push", "ph": ["sensor", "state"],
     "de": "Entwarnung: {sensor} ist wieder {state} ({time} Uhr).", "en": "All clear: {sensor} is {state} again ({time})."},
    {"key": "tts_household_water", "group": "household", "channel": "tts", "ph": ["sensor"],
     "de": "Achtung, Wasseralarm! Wasser erkannt: {sensor}. Bitte sofort prüfen.",
     "en": "Attention, water alarm! Water detected: {sensor}. Please check immediately."},
    {"key": "tts_household", "group": "household", "channel": "tts", "ph": ["sensor", "state"],
     "de": "Achtung! {sensor}: {state} erkannt. Bitte prüfen.", "en": "Attention! {sensor}: {state} detected. Please check."},
    # ------------------------------------------------------- Texte je Melder-Art
    {"key": "cause_door", "group": "sensor", "channel": "cause", "ph": ["sensor"], "de": "Tür geöffnet: {sensor}", "en": "Door opened: {sensor}"},
    {"key": "cause_window", "group": "sensor", "channel": "cause", "ph": ["sensor"], "de": "Fenster geöffnet: {sensor}", "en": "Window opened: {sensor}"},
    {"key": "cause_motion", "group": "sensor", "channel": "cause", "ph": ["sensor"], "de": "Bewegung erkannt: {sensor}", "en": "Motion detected: {sensor}"},
    {"key": "cause_presence", "group": "sensor", "channel": "cause", "ph": ["sensor"], "de": "Anwesenheit erkannt: {sensor}", "en": "Presence detected: {sensor}"},
    {"key": "cause_water", "group": "sensor", "channel": "cause", "ph": ["sensor"], "de": "Wasser erkannt: {sensor}", "en": "Water detected: {sensor}"},
    {"key": "cause_camera", "group": "sensor", "channel": "cause", "ph": ["sensor"], "de": "Kamera hat Bewegung erkannt: {sensor}", "en": "Camera detected motion: {sensor}"},
    {"key": "speech_door", "group": "sensor", "channel": "tts", "ph": ["sensor"], "de": "Geöffnete Tür erkannt: {sensor}.", "en": "Open door detected: {sensor}."},
    {"key": "speech_window", "group": "sensor", "channel": "tts", "ph": ["sensor"], "de": "Geöffnetes Fenster erkannt: {sensor}.", "en": "Open window detected: {sensor}."},
    {"key": "speech_motion", "group": "sensor", "channel": "tts", "ph": ["sensor"], "de": "Bewegung erkannt: {sensor}.", "en": "Motion detected: {sensor}."},
    {"key": "speech_presence", "group": "sensor", "channel": "tts", "ph": ["sensor"], "de": "Person erkannt: {sensor}.", "en": "Person detected: {sensor}."},
    {"key": "speech_water", "group": "sensor", "channel": "tts", "ph": ["sensor"], "de": "Wasser erkannt: {sensor}.", "en": "Water detected: {sensor}."},
    {"key": "speech_camera", "group": "sensor", "channel": "tts", "ph": ["sensor"], "de": "Bewegung auf der Kamera erkannt: {sensor}.", "en": "Motion detected on camera: {sensor}."},
]

KEYS: frozenset[str] = frozenset(t["key"] for t in CATALOG)
BY_KEY: dict[str, dict[str, Any]] = {t["key"]: t for t in CATALOG}


def default(key: str, german: bool) -> str:
    item = BY_KEY.get(key)
    if item is None:
        return ""
    return item["de"] if german else item["en"]


def catalog(german: bool) -> list[dict[str, Any]]:
    """Katalog für die Einstellungsseite – mit Standardtext in der Systemsprache."""
    return [
        {"key": t["key"], "group": t["group"], "channel": t["channel"], "placeholders": [*t["ph"], *COMMON], "default": default(t["key"], german)}
        for t in CATALOG
    ]


class _Keep(dict):
    def __missing__(self, key: str) -> str:  # unbekannte Platzhalter stehen lassen
        return "{" + key + "}"


def render(template: str, values: dict[str, Any]) -> str:
    """Vorlage füllen. Fehlerhafte Klammern führen nie zu einem Fehler – dann bleibt der Text, wie er ist."""
    try:
        return str(template).format_map(_Keep({k: "" if v is None else v for k, v in values.items()}))
    except (ValueError, IndexError, AttributeError, KeyError):
        return str(template)


def clean_templates(value: Any, german: bool | None = None) -> dict[str, str]:
    """Nur bekannte Schlüssel, Text gekürzt; leere und dem Standard gleiche Texte entfallen."""
    out: dict[str, str] = {}
    if not isinstance(value, dict):
        return out
    for key, text in value.items():
        if key not in KEYS or not isinstance(text, str):
            continue
        text = text.replace("\r\n", "\n").strip()[:MAX_LEN]
        if not text:
            continue
        if german is not None and text == default(key, german):
            continue
        out[key] = text
    return out


def clean_names(value: Any) -> dict[str, str]:
    """Alternative Namen je Entität (höchstens 60 Zeichen)."""
    out: dict[str, str] = {}
    if not isinstance(value, dict):
        return out
    for eid, name in value.items():
        if not isinstance(eid, str) or "." not in eid or not isinstance(name, str):
            continue
        name = " ".join(name.split())[:60]
        if name:
            out[eid] = name
    return out
