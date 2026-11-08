"""Prüfung und Bereinigung der Optionen (genutzt von der Safe-Home-Seite)."""

from __future__ import annotations

import re
from typing import Any

from . import whatsapp as wa
from .i18n import tr
from .const import (
    CONF_AWAY_SENSORS,
    CONF_CODE,
    CONF_NIGHT_END,
    CONF_NIGHT_SENSORS,
    CONF_NIGHT_START,
    CONF_OPEN_POLICY,
    CONF_HH_SENSORS,
    CONF_SIREN_EXCLUDED,
    CONF_SIREN_MODES,
    CONF_SIREN_TIME_END,
    CONF_SIREN_TIME_START,
    CONF_TTS_ENTITY,
    CONF_MEDIA_PLAYERS,
    CONF_SENSOR_TYPES,
    CONF_TTS_ENABLED,
    CONF_ALEXA_ENABLED,
    CONF_ALEXA_DEVICES,
    ALEXA_PLATFORM,
    CONF_WA_ENABLED,
    CONF_WA_RECIPIENTS,
    CONF_ZONES,
    CONF_PINS,
    CONF_WEEK_PLAN,
    DEFAULTS,
    OPEN_POLICY_BLOCK,
    OPEN_POLICY_BYPASS,
)

_ENTITY_RE = re.compile(r"^[a-z_]+\.[a-z0-9_]+$")
_TIME_RE = re.compile(r"^([01]?\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$")
_MAX_SECONDS = {"trigger_time": 86400, "siren_duration": 7200, "night_rearm_delay": 240, "tts_entry_repeat": 60, "code_max_attempts": 20, "code_lockout_minutes": 120, "battery_threshold": 90}


def sanitize_options(raw: dict[str, Any], hass: Any = None) -> tuple[dict[str, Any], dict[str, str]]:
    """Unbekannte Schlüssel verwerfen, Typen erzwingen, Fehler sammeln.

    Gibt (optionen, fehler) zurück. fehler ist ein dict feld -> Meldung.
    """
    out: dict[str, Any] = {}
    errors: dict[str, str] = {}

    for key, default in DEFAULTS.items():
        value = raw.get(key, default)

        if key == CONF_SIREN_MODES:
            items = value if isinstance(value, list) else []
            out[key] = [m for m in ("away", "night") if m in items]
            continue

        if key == CONF_ZONES:
            continue  # wird nach den Sensorlisten geprüft (Zuordnung muss eindeutig sein)

        if key == "ui_theme":
            out[key] = "ha" if value == "ha" else "safe_home"
            continue

        if key == "pin_areas_off":
            out[key] = [a for a in (value if isinstance(value, list) else []) if isinstance(a, str) and a in ("main", "z1", "z2", "z3")]
            continue

        if key == CONF_PINS:
            if CONF_PINS not in raw and str(raw.get(CONF_CODE) or "").strip():
                # Umstieg: der bisherige allgemeine PIN wird zum ersten Eintrag
                value = [{"type": "guest", "name": tr(hass, "Bisheriger PIN"), "code": str(raw.get(CONF_CODE)).strip()}]
            out[key] = _clean_pins(value, errors, hass)
            continue

        if key == CONF_WEEK_PLAN:
            out[key] = clean_week(value)
            continue

        if key == CONF_SENSOR_TYPES:
            out[key] = _clean_types(value)
            continue

        if key == CONF_TTS_ENABLED and key not in raw:
            # ältere Installationen: Ansagen waren aktiv, sobald Dienst und Lautsprecher gewählt waren
            out[key] = bool(raw.get(CONF_MEDIA_PLAYERS)) and (bool(raw.get(CONF_TTS_ENTITY)) or bool(raw.get(CONF_ALEXA_DEVICES)))
            continue

        if key == CONF_HH_SENSORS:
            out[key] = _clean_household(value, errors, hass)
            continue

        if key == CONF_WA_RECIPIENTS:
            out[key] = _clean_recipients(value, errors, hass)
            continue

        if key == CONF_TTS_ENTITY:
            value = (value or "").strip() if isinstance(value, str) else None
            if value and not _ENTITY_RE.match(value):
                errors[key] = tr(hass, "Ungültige Entität")
            out[key] = value or None
            continue

        if isinstance(default, bool):
            out[key] = bool(value)
        elif isinstance(default, int):
            try:
                number = int(float(value))
            except (TypeError, ValueError):
                errors[key] = tr(hass, "Bitte eine Zahl eingeben")
                number = default
            limit = _MAX_SECONDS.get(key, 3600)
            if number < 0 or number > limit:
                errors[key] = tr(hass, "Erlaubt: 0 bis {limit} Sekunden", limit=limit)
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
                    errors[key] = tr(hass, "Ungültige Entität: {item}", item=item)
                    continue
                if item not in clean:
                    clean.append(item)
            out[key] = clean
        else:  # Text
            out[key] = "" if value is None else str(value).strip()

    # Feldspezifische Regeln
    if out[CONF_PINS]:
        out[CONF_CODE] = ""  # persönliche PINs ersetzen den allgemeinen PIN
    code = out[CONF_CODE]
    if code and len(code) < 4:
        errors[CONF_CODE] = tr(hass, "Der PIN muss mindestens 4 Zeichen lang sein")
    if out[CONF_OPEN_POLICY] not in (OPEN_POLICY_BYPASS, OPEN_POLICY_BLOCK):
        out[CONF_OPEN_POLICY] = OPEN_POLICY_BYPASS
    for key in (CONF_NIGHT_START, CONF_NIGHT_END, CONF_SIREN_TIME_START, CONF_SIREN_TIME_END):
        match = _TIME_RE.match(out[key])
        if not match:
            errors[key] = tr(hass, "Uhrzeit im Format HH:MM")
            out[key] = DEFAULTS[key]
        else:
            out[key] = f"{int(match.group(1)):02d}:{match.group(2)}:{match.group(4) or '00'}"
    if not out["auto_arm"] and not out["auto_disarm"]:
        errors["auto_arm"] = tr(
            hass,
            "Mindestens eine Funktion auswählen – zum Ausschalten der Home-Zone-Automatik den Schalter verwenden",
        )
    # Alexa-Geräte unter „Lautsprecher“ sprechen zur Laufzeit trotzdem mit der Alexa-Stimme (kein TTS-Dienst nötig).
    # Die Alexa-Checkbox bleibt dabei unverändert – sie ist standardmäßig aus.
    tts_players = [p for p in out[CONF_MEDIA_PLAYERS] if _platform(hass, p) != ALEXA_PLATFORM]
    if out[CONF_TTS_ENABLED]:
        alexa = (out[CONF_ALEXA_ENABLED] and out[CONF_ALEXA_DEVICES]) or len(tts_players) < len(out[CONF_MEDIA_PLAYERS])
        if tts_players and not out[CONF_TTS_ENTITY]:
            errors[CONF_TTS_ENTITY] = tr(hass, "Bitte einen Sprachausgabe-Dienst auswählen")
        if not out[CONF_MEDIA_PLAYERS] and not alexa:
            errors[CONF_MEDIA_PLAYERS] = tr(hass, "Bitte Lautsprecher oder Alexa-Geräte auswählen")
    if out[CONF_ALEXA_ENABLED] and not out[CONF_ALEXA_DEVICES]:
        errors[CONF_ALEXA_DEVICES] = tr(hass, "Bitte mindestens ein Alexa-Gerät auswählen")
    if out[CONF_WA_ENABLED] and not out[CONF_WA_RECIPIENTS]:
        errors[CONF_WA_RECIPIENTS] = tr(hass, "Bitte mindestens einen WhatsApp-Empfänger eintragen")
    elif out[CONF_WA_ENABLED] and not any(r["enabled"] for r in out[CONF_WA_RECIPIENTS]):
        errors[CONF_WA_RECIPIENTS] = tr(hass, "Bitte mindestens einen WhatsApp-Empfänger aktivieren")
    out[CONF_ZONES] = _clean_zones(raw.get(CONF_ZONES, []), out, errors, hass)
    zone_sensors = {s for z in out[CONF_ZONES] for s in z["sensors"]}
    if not out[CONF_AWAY_SENSORS] and not out[CONF_NIGHT_SENSORS] and not zone_sensors:
        errors["base"] = tr(hass, "Bitte mindestens einen Sensor für Unterwegs oder Nacht auswählen")
    # Verzögerte Sensoren müssen überwacht werden
    monitored = set(out[CONF_AWAY_SENSORS]) | set(out[CONF_NIGHT_SENSORS])
    out["delayed_sensors"] = [e for e in out["delayed_sensors"] if e in monitored]
    monitored |= zone_sensors
    out[CONF_SIREN_EXCLUDED] = [e for e in out[CONF_SIREN_EXCLUDED] if e in monitored]
    known = monitored | {i["entity"] for i in out[CONF_HH_SENSORS]}
    out[CONF_SENSOR_TYPES] = {e: t for e, t in out[CONF_SENSOR_TYPES].items() if e in known}

    return out, errors


_DT_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$")


def _clean_pins(value: Any, errors: dict[str, str], hass: Any) -> list[dict[str, Any]]:
    """Persönliche PINs (Home-Assistant-Benutzer) und Gast-PINs mit optionalem Zeitraum."""
    import secrets  # noqa: PLC0415

    clean: list[dict[str, Any]] = []
    seen: dict[str, str] = {}
    for item in value if isinstance(value, list) else []:
        if not isinstance(item, dict):
            continue
        kind = "user" if item.get("type") == "user" else "guest"
        code = str(item.get("code") or "").strip()
        name = str(item.get("name") or "").strip()[:40]
        if not code:
            if kind == "guest" and name:
                errors[CONF_PINS] = tr(hass, "{name}: bitte einen PIN eingeben", name=name)
            continue  # Benutzer ohne PIN = kein Eintrag
        label = name or tr(hass, "Gast")
        if len(code) < 4:
            errors[CONF_PINS] = tr(hass, "{name}: Der PIN muss mindestens 4 Zeichen lang sein", name=label)
        if code in seen:
            errors[CONF_PINS] = tr(hass, "{name} und {other} haben denselben PIN", name=label, other=seen[code])
        seen[code] = label
        start = str(item.get("start") or "").strip()[:16] or None
        end = str(item.get("end") or "").strip()[:16] or None
        if kind == "user":
            start = end = None
        for val in (start, end):
            if val and not _DT_RE.match(val):
                errors[CONF_PINS] = tr(hass, "{name}: Datum und Uhrzeit ungültig", name=label)
        if start and end and end <= start:
            errors[CONF_PINS] = tr(hass, "{name}: Das Ende muss nach dem Beginn liegen", name=label)
        if kind == "guest" and not name:
            errors[CONF_PINS] = tr(hass, "Bitte für jeden Gast-PIN einen Namen eingeben")
        raw_areas = item.get("areas")
        areas = None if raw_areas is None else [str(a)[:8] for a in raw_areas if isinstance(a, str)][:4]
        if areas is not None and not areas:
            errors[CONF_PINS] = tr(hass, "{name}: mindestens einen Bereich auswählen", name=label)
        clean.append({
            "areas": areas,  # None = alle Bereiche
            "id": str(item.get("id") or secrets.token_hex(4))[:16],
            "type": kind,
            "user_id": str(item.get("user_id") or "")[:64] if kind == "user" else "",
            "name": label,
            "code": code[:32],
            "start": start,
            "end": end,
            "enabled": item.get("enabled", True) is not False,
        })
    if len(clean) > 50:
        errors[CONF_PINS] = tr(hass, "Höchstens 50 PINs")
        clean = clean[:50]
    return clean


def clean_week(value: Any) -> list[list[list[Any]]]:
    """Wochenplan: 7 Tage (Mo–So), je Tag Balken [start, ende, modus] in Minuten (0–1440, 5-Minuten-Raster)."""
    week: list[list[list[Any]]] = []
    days = value if isinstance(value, list) else []
    for d in range(7):
        bars: list[list[Any]] = []
        raw = days[d] if d < len(days) and isinstance(days[d], list) else []
        for bar in raw:
            if isinstance(bar, dict):
                bar = [bar.get("start"), bar.get("end"), bar.get("mode")]
            if not isinstance(bar, (list, tuple)) or len(bar) < 2:
                continue
            try:
                start = max(0, min(1440, int(round(float(bar[0]) / 5) * 5)))
                end = max(0, min(1440, int(round(float(bar[1]) / 5) * 5)))
            except (TypeError, ValueError):
                continue
            mode = bar[2] if len(bar) > 2 and bar[2] in ("away", "night") else "away"
            if end > start:
                bars.append([start, end, mode])
        bars.sort()
        merged: list[list[Any]] = []
        for bar in bars:
            if merged and bar[0] <= merged[-1][1]:
                last = merged[-1]
                if bar[2] == last[2]:
                    last[1] = max(last[1], bar[1])
                    continue
                bar[0] = last[1]  # Überlappung: der spätere Balken beginnt am Ende des früheren
                if bar[1] <= bar[0]:
                    continue
            merged.append(bar)
        week.append(merged[:24])
    return week


def _platform(hass: Any, entity_id: str) -> str | None:
    """Integration einer Entität (z. B. alexa_media) – None, wenn unbekannt."""
    if hass is None:
        return None
    try:
        from homeassistant.helpers import entity_registry as er  # noqa: PLC0415

        ent = er.async_get(hass).async_get(entity_id)
        return ent.platform if ent else None
    except Exception:  # noqa: BLE001
        return None


def _clean_types(value: Any) -> dict[str, str]:
    """Art je Sensor – nur gültige Entitäten und bekannte Arten."""
    from .sensor_types import TYPES  # noqa: PLC0415

    clean: dict[str, str] = {}
    if isinstance(value, dict):
        for eid, typ in value.items():
            if isinstance(eid, str) and _ENTITY_RE.match(eid.strip()) and typ in TYPES:
                clean[eid.strip()] = typ
    return clean


def _clean_recipients(value: Any, errors: dict[str, str], hass: Any) -> list[dict[str, Any]]:
    """WhatsApp-Empfänger prüfen: Name, Nummer (+49… oder Gruppen-ID), API-Key, Wartezeit in Minuten."""
    clean: list[dict[str, Any]] = []
    for item in value if isinstance(value, list) else []:
        if not isinstance(item, dict):
            continue
        name = str(item.get("name", "") or "").strip()[:60]
        phone = wa.normalize_phone(item.get("phone", ""))
        apikey = str(item.get("apikey", "") or "").strip()
        if not phone and not apikey and not name:
            continue  # leere Zeile
        label = name or phone or "?"
        if not wa.valid_recipient_id(phone):
            errors[CONF_WA_RECIPIENTS] = tr(
                hass, "{name}: Nummer bitte international angeben, z. B. +491701234567", name=label
            )
        elif not apikey:
            errors[CONF_WA_RECIPIENTS] = tr(hass, "{name}: TextMeBot-API-Key fehlt", name=label)
        try:
            delay = int(float(item.get("delay", 0) or 0))
        except (TypeError, ValueError):
            delay = 0
        if delay < 0 or delay > 240:
            errors[CONF_WA_RECIPIENTS] = tr(hass, "{name}: Wartezeit 0 bis 240 Minuten", name=label)
            delay = max(0, min(delay, 240))
        clean.append({"name": name or phone, "phone": phone, "apikey": apikey, "delay": delay, "enabled": item.get("enabled", True) is not False})
    if len(clean) > 10:
        errors[CONF_WA_RECIPIENTS] = tr(hass, "Höchstens 10 WhatsApp-Empfänger")
        clean = clean[:10]
    return clean


def _clean_household(value: Any, errors: dict[str, str], hass: Any) -> list[dict[str, str]]:
    """Haushalts-Sensoren: Entität und der Zustand, bei dem gemeldet wird."""
    clean: list[dict[str, str]] = []
    seen: set[str] = set()
    for item in value if isinstance(value, list) else []:
        if isinstance(item, str):
            item = {"entity": item, "state": "on"}
        if not isinstance(item, dict):
            continue
        entity = str(item.get("entity", "") or "").strip()
        state = str(item.get("state", "") or "").strip() or "on"
        if not entity or entity in seen:
            continue
        if not _ENTITY_RE.match(entity):
            errors[CONF_HH_SENSORS] = tr(hass, "Ungültige Entität: {item}", item=entity)
            continue
        seen.add(entity)
        clean.append({"entity": entity, "state": state[:60]})
    return clean


def _clean_zones(value: Any, out: dict[str, Any], errors: dict[str, str], hass: Any) -> list[dict[str, Any]]:
    """Teilbereiche (max. 3). Jeder Sensor gehört genau einem Bereich – Hauptbereich oder Teilbereich."""
    from .zone import MAX_ZONES, ZONE_DEFAULTS, ZONE_IDS  # noqa: PLC0415

    zones: list[dict[str, Any]] = []
    used_ids: set[str] = set()
    taken: set[str] = set()
    items = [z for z in (value if isinstance(value, list) else []) if isinstance(z, dict)]
    if len(items) > MAX_ZONES:
        errors[CONF_ZONES] = tr(hass, "Höchstens 3 Teilbereiche")
        items = items[:MAX_ZONES]
    for raw in items:
        zid = str(raw.get("id") or "")
        if zid not in ZONE_IDS or zid in used_ids:
            zid = next(i for i in ZONE_IDS if i not in used_ids)
        used_ids.add(zid)
        name = str(raw.get("name") or "").strip()[:40]
        if not name:
            errors[CONF_ZONES] = tr(hass, "Bitte für jeden Teilbereich einen Namen eingeben")
            name = tr(hass, "Teilbereich {n}", n=len(zones) + 1)

        def _ents(key: str) -> list[str]:
            res: list[str] = []
            for item in raw.get(key) or []:
                if isinstance(item, str) and _ENTITY_RE.match(item.strip()) and item.strip() not in res:
                    res.append(item.strip())
                elif isinstance(item, str) and item.strip():
                    errors[CONF_ZONES] = tr(hass, "Ungültige Entität: {item}", item=item)
            return res

        sensors = [e for e in _ents("sensors") if e not in taken]
        taken.update(sensors)

        def _num(key: str) -> int:
            try:
                n = int(float(raw.get(key, ZONE_DEFAULTS[key])))
            except (TypeError, ValueError):
                n = ZONE_DEFAULTS[key]
            if n < 0 or n > 3600:
                errors[CONF_ZONES] = tr(hass, "{name}: Verzögerung 0 bis 3600 Sekunden", name=name)
            return max(0, min(n, 3600))

        def _time(key: str) -> str:
            m = _TIME_RE.match(str(raw.get(key) or ZONE_DEFAULTS[key]))
            if not m:
                errors[CONF_ZONES] = tr(hass, "{name}: Uhrzeit im Format HH:MM", name=name)
                return ZONE_DEFAULTS[key]
            return f"{int(m.group(1)):02d}:{m.group(2)}:{m.group(4) or '00'}"

        days = sorted({int(d) for d in (raw.get("days") if isinstance(raw.get("days"), list) else ZONE_DEFAULTS["days"]) if str(d).isdigit() and 0 <= int(d) <= 6})
        zone = {
            "id": zid,
            "name": name,
            "sensors": sensors,
            "delayed_sensors": [e for e in _ents("delayed_sensors") if e in sensors],
            "exit_delay": _num("exit_delay"),
            "entry_delay": _num("entry_delay"),
            "schedule_enabled": bool(raw.get("schedule_enabled", False)),
            "arm_time": _time("arm_time"),
            "disarm_time": _time("disarm_time"),
            "days": days,
            "presence_enabled": bool(raw.get("presence_enabled", False)),
            "persons": _ents("persons"),
            "siren_mode": raw.get("siren_mode") if raw.get("siren_mode") in ("shared", "own", "off") else "shared",
            "sirens": _ents("sirens"),
        }
        if zone["siren_mode"] == "own" and not zone["sirens"]:
            errors[CONF_ZONES] = tr(hass, "{name}: bitte eigene Sirenen auswählen", name=name)
        if zone["schedule_enabled"] and not days:
            errors[CONF_ZONES] = tr(hass, "{name}: mindestens einen Wochentag wählen", name=name)
        if zone["presence_enabled"] and not zone["persons"]:
            errors[CONF_ZONES] = tr(hass, "{name}: Personen für die Anwesenheit auswählen", name=name)
        zones.append(zone)
    # Sensoren eines Teilbereichs gehören nicht mehr zum Hauptbereich
    if taken:
        for key in ("away_sensors", "night_sensors", "delayed_sensors"):
            out[key] = [e for e in out.get(key, []) if e not in taken]
    return zones
