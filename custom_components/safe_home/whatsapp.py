"""WhatsApp-Nachrichten über die TextMeBot-API (https://textmebot.com).

Aufruf: GET https://api.textmebot.com/send.php?recipient=<Nummer>&apikey=<Key>&text=<Text>

TextMeBot verarbeitet Nachrichten nacheinander und verwirft zu schnell aufeinanderfolgende
Anfragen. Alle Nachrichten laufen deshalb über eine gemeinsame Warteschlange mit Abstand.
"""

from __future__ import annotations

import asyncio
import logging
import re
from dataclasses import dataclass
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

_LOGGER = logging.getLogger(__name__)

API_URL = "https://api.textmebot.com/send.php"
SEND_GAP_SECONDS = 6  # Abstand zwischen zwei Nachrichten
TIMEOUT_SECONDS = 30
_DATA_KEY = "safe_home_whatsapp_lock"

# Telefonnummer international (+49…) oder TextMeBot-Gruppen-ID (z. B. 1203630…@g.us)
PHONE_RE = re.compile(r"^\+?[1-9]\d{6,14}$")
GROUP_RE = re.compile(r"^[0-9-]{8,40}@g\.us$")
EXAMPLE_PREFIX = "Beispiel"


@dataclass
class Recipient:
    name: str
    phone: str
    apikey: str
    delay: int = 0  # Minuten nach Alarmbeginn; 0 = sofort

    @property
    def is_example(self) -> bool:
        return self.apikey.startswith(EXAMPLE_PREFIX) or self.phone in EXAMPLE_PHONES


EXAMPLE_PHONES = {"+491701234567", "+491769876543"}

EXAMPLE_RECIPIENTS: list[dict[str, Any]] = [
    {"name": "Max (Beispiel)", "phone": "+491701234567", "apikey": "BeispielKey123", "delay": 0},
    {"name": "Anna (Beispiel)", "phone": "+491769876543", "apikey": "BeispielKey456", "delay": 5},
]


def normalize_phone(value: str) -> str:
    """Leerzeichen, Bindestriche und Klammern entfernen; 00 am Anfang wird zu +."""
    value = str(value or "").strip()
    if GROUP_RE.match(value):
        return value
    value = re.sub(r"[\s\-/()]", "", value)
    if value.startswith("00"):
        value = "+" + value[2:]
    return value


def valid_recipient_id(value: str) -> bool:
    return bool(PHONE_RE.match(value) or GROUP_RE.match(value))


def parse_recipients(raw: Any) -> list[Recipient]:
    out: list[Recipient] = []
    for item in raw or []:
        if not isinstance(item, dict):
            continue
        phone = normalize_phone(item.get("phone", ""))
        apikey = str(item.get("apikey", "") or "").strip()
        if not phone or not apikey:
            continue
        try:
            delay = max(0, min(240, int(item.get("delay", 0) or 0)))
        except (TypeError, ValueError):
            delay = 0
        out.append(Recipient(str(item.get("name", "") or phone).strip() or phone, phone, apikey, delay))
    return out


def _lock(hass: HomeAssistant) -> asyncio.Lock:
    lock = hass.data.get(_DATA_KEY)
    if lock is None:
        lock = hass.data[_DATA_KEY] = asyncio.Lock()
    return lock


async def async_send(hass: HomeAssistant, recipient: Recipient, text: str) -> tuple[bool, str]:
    """Eine Nachricht senden. Gibt (erfolgreich, Meldung) zurück – wirft nie."""
    if recipient.is_example:
        return False, "example"
    params = {"recipient": recipient.phone, "apikey": recipient.apikey, "text": text}
    async with _lock(hass):
        try:
            session = async_get_clientsession(hass)
            async with asyncio.timeout(TIMEOUT_SECONDS):
                resp = await session.get(API_URL, params=params)
                body = (await resp.text())[:300]
            ok = resp.status == 200 and not re.search(r"\b(error|invalid|wrong|not\s+valid)\b", body, re.I)
            if ok:
                _LOGGER.debug("WhatsApp an %s gesendet", recipient.name)
            else:
                _LOGGER.warning("WhatsApp an %s fehlgeschlagen (HTTP %s): %s", recipient.name, resp.status, body)
            result = (ok, "" if ok else f"HTTP {resp.status}: {re.sub(r'<[^>]+>', ' ', body).strip()[:160]}")
        except TimeoutError:
            _LOGGER.warning("WhatsApp an %s: Zeitüberschreitung", recipient.name)
            result = (False, "timeout")
        except Exception as err:  # noqa: BLE001 – Versandfehler dürfen den Alarm nie stören
            _LOGGER.warning("WhatsApp an %s fehlgeschlagen: %s", recipient.name, err)
            result = (False, str(err))
        # Abstand einhalten, bevor die nächste Nachricht die Warteschlange verlässt
        await asyncio.sleep(SEND_GAP_SECONDS)
    return result
