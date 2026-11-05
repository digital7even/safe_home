"""Binärsensoren von Safe Home."""

from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event

from . import SafeHomeConfigEntry
from .entity import SafeHomeEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: SafeHomeConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    c = entry.runtime_data
    async_add_entities([OpenSensorsBinarySensor(c), SirenActiveBinarySensor(c)])


class OpenSensorsBinarySensor(SafeHomeEntity, BinarySensorEntity):
    """An, wenn mindestens ein überwachter Sensor offen/aktiv ist."""

    _attr_translation_key = "open_sensors"
    _attr_device_class = BinarySensorDeviceClass.PROBLEM

    def __init__(self, controller) -> None:
        super().__init__(controller, "open_sensors")

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()
        if self.controller.all_sensors:
            self.async_on_remove(
                async_track_state_change_event(
                    self.hass, self.controller.all_sensors, self._sensor_changed
                )
            )

    @callback
    def _sensor_changed(self, _event: Event[EventStateChangedData]) -> None:
        self.async_write_ha_state()

    @property
    def is_on(self) -> bool:
        return bool(self.controller.open_sensors())

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        open_ids = self.controller.open_sensors()
        return {
            "entities": open_ids,
            "names": [self.controller.friendly(e) for e in open_ids],
        }


class SirenActiveBinarySensor(SafeHomeEntity, BinarySensorEntity):
    """An, solange der Alarm akustisch aktiv ist."""

    _attr_translation_key = "siren_active"
    _attr_device_class = BinarySensorDeviceClass.SOUND

    def __init__(self, controller) -> None:
        super().__init__(controller, "siren_active")

    @property
    def is_on(self) -> bool:
        return self.controller.siren_active
