"""WebSocket-Befehle für die Safe-Home-Seite in der Seitenleiste."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er

from .const import DEFAULTS, DOMAIN, VERSION
from .frontend_resource import STATUS_KEY, async_register_now, get_status
from .options import sanitize_options


def _alarm_entity(hass: HomeAssistant, entry_id: str) -> str | None:
    return er.async_get(hass).async_get_entity_id(
        "alarm_control_panel", DOMAIN, f"{entry_id}_alarm"
    )


def _entry(hass: HomeAssistant, entry_id: str):
    entry = hass.config_entries.async_get_entry(entry_id)
    if entry is None or entry.domain != DOMAIN:
        return None
    return entry


@callback
def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_entries)
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_test)
    websocket_api.async_register_command(hass, ws_resource)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "safe_home/entries"})
@callback
def ws_entries(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Alle Safe-Home-Instanzen."""
    connection.send_result(
        msg["id"],
        {
            "version": VERSION,
            "entries": [
                {
                    "entry_id": e.entry_id,
                    "title": e.title,
                    "loaded": e.state is ConfigEntryState.LOADED,
                    "entity_id": _alarm_entity(hass, e.entry_id),
                }
                for e in hass.config_entries.async_entries(DOMAIN)
            ],
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "safe_home/config", vol.Required("entry_id"): str}
)
@callback
def ws_get_config(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Optionen einer Instanz inkl. Standardwerten und Protokoll."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Instanz nicht gefunden")
        return
    options = {**DEFAULTS, **entry.options}
    controller = getattr(entry, "runtime_data", None)
    events = list(reversed(list(controller.events))) if controller else []
    connection.send_result(
        msg["id"],
        {
            "entry_id": entry.entry_id,
            "title": entry.title,
            "entity_id": _alarm_entity(hass, entry.entry_id),
            "options": options,
            "defaults": DEFAULTS,
            "notify_services": sorted(
                s for s in hass.services.async_services_for_domain("notify") if s != "send_message"
            ),
            "events": events,
            "version": VERSION,
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "safe_home/save_config",
        vol.Required("entry_id"): str,
        vol.Required("options"): dict,
        vol.Optional("title"): str,
    }
)
@websocket_api.async_response
async def ws_save_config(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Optionen prüfen und speichern (Instanz wird danach neu geladen)."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Instanz nicht gefunden")
        return
    options, errors = sanitize_options(msg["options"])
    if errors:
        connection.send_result(msg["id"], {"success": False, "errors": errors})
        return
    title = (msg.get("title") or "").strip() or entry.title
    hass.config_entries.async_update_entry(entry, options=options, title=title)
    connection.send_result(msg["id"], {"success": True, "options": options})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): "safe_home/test",
        vol.Required("entry_id"): str,
        vol.Required("kind"): vol.In(["notify", "siren", "tts", "lights"]),
    }
)
@websocket_api.async_response
async def ws_test(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Ausgänge testen."""
    entry = _entry(hass, msg["entry_id"])
    controller = getattr(entry, "runtime_data", None) if entry else None
    if controller is None or entry.state is not ConfigEntryState.LOADED:
        connection.send_error(msg["id"], "not_loaded", "Instanz ist nicht geladen")
        return
    message = await controller.async_test(msg["kind"])
    connection.send_result(msg["id"], {"message": message})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "safe_home/resource", vol.Optional("register", default=False): bool}
)
@websocket_api.async_response
async def ws_resource(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Status der Dashboard-Ressource; mit register=True sofort (erneut) eintragen."""
    url = hass.data.get(STATUS_KEY + "_url")
    if msg["register"] and url:
        status = await async_register_now(hass, url)
    else:
        status = get_status(hass)
    connection.send_result(msg["id"], status)
