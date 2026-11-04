"""Sensoren von Safe Home."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from . import SafeHomeConfigEntry
from .entity import SafeHomeEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: SafeHomeConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    c = entry.runtime_data
    async_add_entities([LastEventSensor(c), PeopleHomeSensor(c), LastAlarmSensor(c)])


class LastEventSensor(SafeHomeEntity, SensorEntity):
    """Letztes Ereignis aus dem Protokoll."""

    _attr_translation_key = "last_event"
    _attr_icon = "mdi:history"

    def __init__(self, controller) -> None:
        super().__init__(controller, "last_event")

    @property
    def native_value(self) -> str | None:
        if not self.controller.events:
            return None
        return str(self.controller.events[-1]["message"])[:255]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        if not self.controller.events:
            return {}
        last = self.controller.events[-1]
        return {"time": last["time"], "type": last["type"]}


class PeopleHomeSensor(SafeHomeEntity, SensorEntity):
    """Anzahl der Personen zuhause."""

    _attr_translation_key = "people_home"
    _attr_icon = "mdi:home-account"
    _attr_native_unit_of_measurement = "Personen"

    def __init__(self, controller) -> None:
        super().__init__(controller, "people_home")

    @property
    def native_value(self) -> int:
        return self.controller.people_home


class LastAlarmSensor(SafeHomeEntity, SensorEntity):
    """Zeitpunkt und Ursache des letzten Alarms."""

    _attr_translation_key = "last_alarm"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:alarm-light"

    def __init__(self, controller) -> None:
        super().__init__(controller, "last_alarm")

    @property
    def native_value(self) -> datetime | None:
        if self.controller.triggered_at:
            return self.controller.triggered_at
        for item in reversed(self.controller.events):
            if item.get("type") == "triggered":
                return dt_util.parse_datetime(item["time"])
        return None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        for item in reversed(self.controller.events):
            if item.get("type") == "triggered":
                return {"cause": item["message"]}
        return {}
