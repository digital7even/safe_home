"""Art eines Sensors (Tür, Fenster, Bewegung, …) – steuert Texte von Ansagen und Benachrichtigungen."""

from __future__ import annotations

TYPES: tuple[str, ...] = ("door", "window", "motion", "presence", "water", "camera")

_BY_DEVICE_CLASS = {
    "door": "door",
    "garage_door": "door",
    "opening": "door",
    "lock": "door",
    "window": "window",
    "motion": "motion",
    "vibration": "motion",
    "moving": "motion",
    "occupancy": "presence",
    "presence": "presence",
    "moisture": "water",
}


def infer_type(entity_id: str, device_class: str | None) -> str:
    """Art aus device_class bzw. Entitätsnamen ableiten (wenn nichts gewählt wurde)."""
    eid = (entity_id or "").lower()
    if any(k in eid for k in ("camera", "kamera", "_cam_", "cam_", "_cam")):
        return "camera"
    if device_class in _BY_DEVICE_CLASS:
        return _BY_DEVICE_CLASS[device_class]
    if any(k in eid for k in ("fenster", "window")):
        return "window"
    if any(k in eid for k in ("bewegung", "motion", "pir")):
        return "motion"
    if any(k in eid for k in ("praesenz", "präsenz", "presence", "occupancy", "mmwave")):
        return "presence"
    if any(k in eid for k in ("wasser", "water", "leak", "moisture")):
        return "water"
    return "door"


# Ursache (Protokoll, Push, WhatsApp) und Ansage je Art – deutsche Schlüssel, übersetzt über i18n
CAUSE = {
    "door": "Tür geöffnet: {name}",
    "window": "Fenster geöffnet: {name}",
    "motion": "Bewegung erkannt: {name}",
    "presence": "Anwesenheit erkannt: {name}",
    "water": "Wasser erkannt: {name}",
    "camera": "Kamera hat Bewegung erkannt: {name}",
}
SPEECH = {
    "door": "Geöffnete Tür erkannt: {name}.",
    "window": "Geöffnetes Fenster erkannt: {name}.",
    "motion": "Bewegung erkannt: {name}.",
    "presence": "Person erkannt: {name}.",
    "water": "Wasser erkannt: {name}.",
    "camera": "Bewegung auf der Kamera erkannt: {name}.",
}
