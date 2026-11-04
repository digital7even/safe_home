"""Prüfung und Bereinigung der Optionen (genutzt von der Safe-Home-Seite)."""

from __future__ import annotations

import re
from typing import Any

from .const import (
    CONF_AWAY_SENSORS,
    CONF_CODE,
    CONF_NIGHT_END,
    CONF_NIGHT_SENSORS,
    CONF_NIGHT_START,
    CONF_OPEN_POLICY,
    CONF_TTS_ENTITY,
    DEFAULTS,
    OPEN_POLICY_BLOCK,
    OPEN_POLICY_BYPASS,
)

_ENTITY_RE = re.compile(r"^[a-z_]+\.[a-z0-9_]+$")
_TIME_RE = re.compile(r"^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$")
_MAX_SECONDS = {"trigger_time": 7200}


def sanitize_options(raw: dict[str, Any]) -> tuple[dict[str, Any], dict[str, str]]:
    """Unbekannte Schlüssel verwerfen, Typen erzwingen, Fehler sammeln.

    Gibt (optionen, fehler) zurück. fehler ist ein dict feld -> Meldung.
    """
    out: dict[str, Any] = {}
    errors: dict[str, str] = {}

    for key, default in DEFAULTS.items():
        value = raw.get(key, default)

        if key == CONF_TTS_ENTITY:
            value = (value or "").strip() if isinstance(value, str) else None
            if value and not _ENTITY_RE.match(value):
                errors[key] = "Ungültige Entität"
            out[key] = value or None
            continue

        if isinstance(default, bool):
            out[key] = bool(value)
        elif isinstance(default, int):
            try:
                number = int(float(value))
            except (TypeError, ValueError):
                errors[key] = "Bitte eine Zahl eingeben"
                number = default
            limit = _MAX_SECONDS.get(key, 3600)
            if number < 0 or number > limit:
                errors[key] = f"Erlaubt: 0 bis {limit} Sekunden"
                number = max(0, min(number, limit))
            out[key] = number
        elif isinstance(default, list):
            items = value if isinstance(value, list) else []
            clean: list[str] = []
            for item in items:
                if not isinstance(item, str):
                    continue
                item = item.strip()
                if key == "notify_services":
                    item = item.removeprefix("notify.")
                    if item and item not in clean:
                        clean.append(item)
                    continue
                if not _ENTITY_RE.match(item):
                    errors[key] = f"Ungültige Entität: {item}"
                    continue
                if item not in clean:
                    clean.append(item)
            out[key] = clean
        else:  # Text
            out[key] = "" if value is None else str(value).strip()

    # Feldspezifische Regeln
    code = out[CONF_CODE]
    if code and len(code) < 4:
        errors[CONF_CODE] = "Der PIN muss mindestens 4 Zeichen lang sein"
    if out[CONF_OPEN_POLICY] not in (OPEN_POLICY_BYPASS, OPEN_POLICY_BLOCK):
        out[CONF_OPEN_POLICY] = OPEN_POLICY_BYPASS
    for key in (CONF_NIGHT_START, CONF_NIGHT_END):
        match = _TIME_RE.match(out[key])
        if not match:
            errors[key] = "Uhrzeit im Format HH:MM"
            out[key] = DEFAULTS[key]
        else:
            out[key] = f"{int(match.group(1)):02d}:{match.group(2)}:{match.group(4) or '00'}"
    if not out[CONF_AWAY_SENSORS] and not out[CONF_NIGHT_SENSORS]:
        errors["base"] = "Bitte mindestens einen Sensor für Unterwegs oder Nacht auswählen"
    # Verzögerte Sensoren müssen überwacht werden
    monitored = set(out[CONF_AWAY_SENSORS]) | set(out[CONF_NIGHT_SENSORS])
    out["delayed_sensors"] = [e for e in out["delayed_sensors"] if e in monitored]

    return out, errors
