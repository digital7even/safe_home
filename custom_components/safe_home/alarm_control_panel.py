"""Alarmzentrale von Safe Home."""

from __future__ import annotations

from typing import Any

from homeassistant.components.alarm_control_panel import (
    AlarmControlPanelEntity,
    AlarmControlPanelEntityFeature,
    AlarmControlPanelState,
    CodeFormat,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import SafeHomeConfigEntry
from .const import (
    CONF_CODE,
    CONF_CODE_ARM_REQUIRED,
    DOMAIN,
    MODE_AWAY,
    MODE_NIGHT,
    VERSION,
)
from .entity import SafeHomeEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: SafeHomeConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    async_add_entities([SafeHomeAlarmPanel(entry.runtime_data)])


class SafeHomeAlarmPanel(SafeHomeEntity, AlarmControlPanelEntity):
    """Alarmanlage mit den Modi Zuhause, Unterwegs und Nacht."""

    _attr_name = None  # Gerätename verwenden
    _attr_translation_key = "safe_home"
    _attr_supported_features = (
        AlarmControlPanelEntityFeature.ARM_AWAY
        | AlarmControlPanelEntityFeature.ARM_NIGHT
        | AlarmControlPanelEntityFeature.TRIGGER
    )

    def __init__(self, controller) -> None:
        super().__init__(controller, "alarm")

    # -- Code -----------------------------------------------------------
    @property
    def _code(self) -> str:
        return str(self.controller.opt(CONF_CODE) or "")

    @property
    def code_format(self) -> CodeFormat | None:
        code = self._code
        if not code:
            return None
        return CodeFormat.NUMBER if code.isdigit() else CodeFormat.TEXT

    @property
    def code_arm_required(self) -> bool:
        return bool(self._code) and bool(self.controller.opt(CONF_CODE_ARM_REQUIRED))

    async def _check_code(self, code: str | None, action: str, required: bool) -> None:
        if not required or not self._code:
            return
        if (code or "") != self._code:
            await self.controller.async_wrong_code(action)
            raise ServiceValidationError(
                "Falscher PIN",
                translation_domain=DOMAIN,
                translation_key="invalid_code",
            )

    # -- Zustand --------------------------------------------------------
    @property
    def alarm_state(self) -> AlarmControlPanelState:
        return self.controller.state

    @property
    def changed_by(self) -> str | None:
        return self.controller.last_changed_by

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        c = self.controller
        registry = er.async_get(self.hass)
        entry_id = c.entry.entry_id
        auto_entity = registry.async_get_entity_id("switch", DOMAIN, f"{entry_id}_auto_mode")
        night_entity = registry.async_get_entity_id("switch", DOMAIN, f"{entry_id}_night_auto")
        return {
            "mode": c.active_mode or "disarmed",
            "mode_label": c.mode_label,
            "arming_target": c.arming_target,
            "delay_until": c.delay_until.isoformat() if c.delay_until else None,
            "delay_total": c.delay_total,
            "trigger_cause": c.trigger_cause,
            "siren_active": c.siren_active,
            "open_sensors": c.open_sensors(),
            "bypassed_sensors": sorted(c.bypassed),
            "away_sensors": c.away_sensors,
            "night_sensors": c.night_sensors,
            "persons": c.persons,
            "people_home": c.people_home,
            "auto_mode": c.auto_mode,
            "auto_arm_pending": c.auto_arm_pending,
            "night_auto": c.night_auto,
            "auto_mode_entity": auto_entity,
            "night_auto_entity": night_entity,
            "events": list(reversed(list(c.events)))[:15],
            "integration": "safe_home",
            "version": VERSION,
        }

    # -- Aktionen -------------------------------------------------------
    async def async_alarm_disarm(self, code: str | None = None) -> None:
        await self._check_code(code, "Unscharf schalten", True)
        await self.controller.async_disarm(await self._source("Manuell"))

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        await self._check_code(code, "Unterwegs", self.code_arm_required)
        if not await self.controller.async_arm(MODE_AWAY, await self._source("Manuell")):
            raise ServiceValidationError(
                "Scharfschalten nicht möglich",
                translation_domain=DOMAIN,
                translation_key="arm_blocked",
            )

    async def async_alarm_arm_night(self, code: str | None = None) -> None:
        await self._check_code(code, "Nacht", self.code_arm_required)
        if not await self.controller.async_arm(MODE_NIGHT, await self._source("Manuell")):
            raise ServiceValidationError(
                "Scharfschalten nicht möglich",
                translation_domain=DOMAIN,
                translation_key="arm_blocked",
            )

    async def async_alarm_trigger(self, code: str | None = None) -> None:
        await self.controller.async_trigger("Manuell ausgelöst", source=await self._source("Manuell"))

    async def _source(self, fallback: str) -> str:
        """Namen des auslösenden Benutzers ermitteln (falls vorhanden)."""
        ctx = self._context
        if ctx and ctx.user_id:
            user = await self.hass.auth.async_get_user(ctx.user_id)
            if user is not None and user.name:
                return f"{fallback} ({user.name})"
        return fallback
