"""Gemeinsame Basis für Safe-Home-Entitäten."""

from __future__ import annotations

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, MANUFACTURER, VERSION, signal_update
from .controller import SafeHomeController


class SafeHomeEntity(Entity):
    """Basisklasse – aktualisiert sich bei jeder Zustandsänderung des Controllers."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, controller: SafeHomeController, key: str) -> None:
        self.controller = controller
        entry_id = controller.entry.entry_id
        self._attr_unique_id = f"{entry_id}_{key}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry_id)},
            name=controller.name,
            manufacturer=MANUFACTURER,
            model="Safe Home Alarmanlage",
            sw_version=VERSION,
            entry_type=DeviceEntryType.SERVICE,
            configuration_url="https://github.com/digital7even/safe_home",
        )

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass,
                signal_update(self.controller.entry.entry_id),
                self._handle_update,
            )
        )

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()
