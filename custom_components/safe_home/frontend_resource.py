"""Kartendatei als Dashboard-Ressource eintragen.

Hintergrund: `add_extra_js_url` lädt das Skript ohne Reihenfolge-Garantie. Kommt es nach dem
Dashboard an (z. B. beim Start der Companion App aus dem Zwischenspeicher), zeigt Home Assistant
„Konfigurationsfehler“ und zeichnet die Karte nicht neu. Nur Dashboard-Ressourcen (Speicher-Modus)
lassen das Dashboard warten, bis die Karte geladen ist. Daher tragen wir die Karte zusätzlich als
Ressource ein und halten die Adresse (mit Prüfsumme) bei jedem Update aktuell.
"""

from __future__ import annotations

import asyncio
import logging
import re
from typing import Any

from homeassistant.const import EVENT_HOMEASSISTANT_STARTED
from homeassistant.core import CoreState, Event, HomeAssistant, callback
from homeassistant.helpers.event import async_call_later

from .i18n import tr

_LOGGER = logging.getLogger(__name__)

_RETRY_SECONDS = 5
_MAX_RETRIES = 24  # 2 Minuten
STATUS_KEY = "safe_home_resource_status"


def _set_status(hass: HomeAssistant, state: str, message: str, url: str, **kwargs: Any) -> None:
    """Ergebnis merken – wird auf der Safe-Home-Seite angezeigt (in der Systemsprache)."""
    hass.data[STATUS_KEY] = {
        "state": state,
        "message": tr(hass, message, **kwargs),
        "url": url.split("?")[0],
        "full_url": url,
    }


def get_status(hass: HomeAssistant) -> dict:
    return hass.data.get(STATUS_KEY) or {"state": "pending", "message": tr(hass, "Wird eingetragen …"), "url": "", "full_url": ""}


def _resources(hass: HomeAssistant) -> Any | None:
    lovelace = hass.data.get("lovelace")
    if lovelace is None:
        return None
    resources = getattr(lovelace, "resources", None)
    if resources is None and isinstance(lovelace, dict):
        resources = lovelace.get("resources")
    return resources


async def _async_register(hass: HomeAssistant, url: str) -> bool | None:
    """True = erledigt, False = nicht möglich (YAML-Modus), None = später erneut versuchen."""
    resources = _resources(hass)
    if resources is None:
        _set_status(hass, "pending", "Dashboard-Verwaltung ist noch nicht bereit – neuer Versuch folgt.", url)
        return None
    # YAML-Modus: Ressourcen sind schreibgeschützt -> Rückfall auf add_extra_js_url
    if not hasattr(resources, "async_create_item") or not hasattr(resources, "async_items"):
        _LOGGER.warning(
            "Dashboard-Ressourcen werden per YAML verwaltet – Safe-Home-Karte bitte selbst eintragen: %s (type: module)",
            url.split("?")[0],
        )
        _set_status(
            hass,
            "yaml",
            "Deine Dashboard-Ressourcen werden per YAML verwaltet und können nicht automatisch ergänzt werden. "
            "Bitte den Eintrag unten in deine YAML-Konfiguration übernehmen.",
            url,
        )
        return False
    if not getattr(resources, "loaded", True):
        load = getattr(resources, "async_load", None)
        if load is None:
            _set_status(hass, "pending", "Ressourcen sind noch nicht geladen – neuer Versuch folgt.", url)
            return None
        await load()
        resources.loaded = True

    # Jede bisherige Safe-Home-Adresse erkennen (auch alte Lader-Einträge und /safe_home_static)
    matches = [
        item
        for item in resources.async_items()
        if re.search(r"safe-home-(card|loader)\.js", str(item.get("url", "")).split("?")[0])
    ]
    if matches:
        first, *duplicates = matches
        # Home Assistant speichert den Typ als "type" (beim Anlegen heißt das Feld "res_type")
        if first.get("url") != url or (first.get("type") or first.get("res_type")) != "module":
            await resources.async_update_item(first["id"], {"res_type": "module", "url": url})
            _LOGGER.debug("Safe-Home-Ressource aktualisiert: %s", url)
        for dup in duplicates:  # doppelte Einträge aufräumen
            await resources.async_delete_item(dup["id"])
        _set_status(hass, "ok", "Die Karte ist als Dashboard-Ressource eingetragen.", url)
        return True

    await resources.async_create_item({"res_type": "module", "url": url})
    _LOGGER.info("Safe-Home-Karte als Dashboard-Ressource eingetragen: %s", url)
    _set_status(hass, "ok", "Die Karte ist als Dashboard-Ressource eingetragen.", url)
    return True


async def async_register_now(hass: HomeAssistant, url: str) -> dict:
    """Sofort eintragen (Taste auf der Safe-Home-Seite) und Ergebnis zurückgeben."""
    try:
        await _async_register(hass, url)
    except Exception as err:  # noqa: BLE001
        _LOGGER.exception("Safe-Home-Ressource konnte nicht eingetragen werden")
        _set_status(hass, "error", "Fehler beim Eintragen: {err}", url, err=err)
    return get_status(hass)


@callback
def async_setup_resource(hass: HomeAssistant, url: str) -> None:
    """Ressource eintragen – sofort, nach dem Start oder mit Wiederholungen. Fehler sind nie fatal."""
    _set_status(hass, "pending", "Wird eingetragen …", url)
    hass.data[STATUS_KEY + "_url"] = url
    attempts = 0
    finished = False
    lock = asyncio.Lock()  # sofortiger Versuch und Start-Ereignis dürfen nicht parallel eintragen

    async def _try(_now: Any = None) -> None:
        nonlocal attempts, finished
        async with lock:
            if finished:
                return
            attempts += 1
            try:
                result = await _async_register(hass, url)
            except Exception as err:  # noqa: BLE001
                _LOGGER.exception("Safe-Home-Ressource konnte nicht eingetragen werden")
                _set_status(hass, "error", "Fehler beim Eintragen: {err}", url, err=err)
                finished = True
                return
            if result is not None:
                finished = True
                return
        if attempts < _MAX_RETRIES:
            async_call_later(hass, _RETRY_SECONDS, _try)
        else:
            _LOGGER.warning("Safe-Home-Ressource: Dashboard-Verwaltung nicht erreichbar – bitte auf der Safe-Home-Seite erneut versuchen")
            _set_status(hass, "error", "Die Dashboard-Verwaltung war beim Start nicht erreichbar. Bitte „Jetzt eintragen“ tippen.", url)

    # Sofort versuchen (Dashboard-Daten sind meist schon da) und nach dem Start sicherheitshalber erneut
    hass.async_create_task(_try())
    if hass.state is not CoreState.running:

        async def _on_started(_event: Event) -> None:
            await _try()

        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STARTED, _on_started)
