"""Schalter für die Automatik von Safe Home."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import SafeHomeConfigEntry
from .entity import SafeHomeEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: SafeHomeConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    c = entry.runtime_data
    async_add_entities([AutoModeSwitch(c), NightAutoSwitch(c)])


class AutoModeSwitch(SafeHomeEntity, SwitchEntity):
    """Anwesenheits-Automatik (Scharf beim Verlassen, Unscharf beim Ankommen)."""

    _attr_translation_key = "auto_mode"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, controller) -> None:
        super().__init__(controller, "auto_mode")

    @property
    def is_on(self) -> bool:
        return self.controller.auto_mode

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            "people_home": self.controller.people_home,
            "persons": self.controller.persons,
            "auto_arm_pending": self.controller.auto_arm_pending,
        }

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.controller.set_auto_mode(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.controller.set_auto_mode(False)


class NightAutoSwitch(SafeHomeEntity, SwitchEntity):
    """Zeitgesteuerter Nachtmodus."""

    _attr_translation_key = "night_auto"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, controller) -> None:
        super().__init__(controller, "night_auto")

    @property
    def is_on(self) -> bool:
        return self.controller.night_auto

    async def async_turn_on(self, **kwargs: Any) -> None:
        self.controller.set_night_auto(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        self.controller.set_night_auto(False)
