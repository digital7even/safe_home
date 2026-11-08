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
    ctrl = entry.runtime_data
    async_add_entities([SafeHomeAlarmPanel(ctrl), *(SafeHomeZonePanel(ctrl, z) for z in ctrl.zones.values())])


async def check_code_or_raise(controller, code: str | None, action: str, area: str = "main") -> str | None:
    """PIN prüfen (mit Sperre nach zu vielen Fehlversuchen) – wirft bei Fehler, liefert den Inhaber."""
    was_locked = controller.code_locked
    ok, owner = await controller.check_user_code(code, action, area)
    if ok:
        return owner
    if was_locked or controller.code_locked:
        raise ServiceValidationError(
            "PIN-Eingabe gesperrt",
            translation_domain=DOMAIN,
            translation_key="code_locked",
            translation_placeholders={"minutes": str(controller.lock_minutes_left())},
        )
    raise ServiceValidationError("Falscher PIN", translation_domain=DOMAIN, translation_key="invalid_code")


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

    # -- Code (persönliche PINs, Gast-PINs oder allgemeiner PIN) -------------
    _pin_owner: str | None = None

    @property
    def code_format(self) -> CodeFormat | None:
        if not self.controller.code_set:
            return None
        return CodeFormat.NUMBER if self.controller.code_numeric else CodeFormat.TEXT

    @property
    def code_arm_required(self) -> bool:
        return self.controller.code_set and bool(self.controller.opt(CONF_CODE_ARM_REQUIRED))

    async def _check_code(self, code: str | None, action: str, required: bool) -> None:
        self._pin_owner = None
        if not required or not self.controller.code_set:
            return
        self._pin_owner = await check_code_or_raise(self.controller, code, action)

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
            "triggered_sensors": list(c.trigger_sensors),
            "household_alerts": sorted(c.household_alerts),
            "zones": [
                {
                    **z.attributes(),
                    "entity_id": c.zone_entity_id(zid),
                    "code_required": c.code_required_for(zid),
                    "code_arm_required": c.code_required_for(zid) and bool(c.opt(CONF_CODE_ARM_REQUIRED)),
                    "code_numeric": c.code_numeric_for(zid),
                }
                for zid, z in c.zones.items()
            ],
            "siren_active": c.siren_active,
            "silence_code_required": c.silence_code_required,
            "ui_theme": c.opt("ui_theme") or "safe_home",
            "battery_low": [{"entity": e, "level": lvl} for e, lvl in sorted(c.battery_low.items())],
            "week_active": c.week_active(),
            "code_locked_until": c.code_locked_until.isoformat() if c.code_locked else None,
            "silent_alarm": bool(c.silent_reason) and c.state == "triggered",
            "silent_reason": c.silent_reason,
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
        await self._check_code(code, self.controller.t("Unscharf schalten"), True)
        await self.controller.async_disarm(await self._source(self.controller.t("Manuell")))

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        await self._check_code(code, self.controller.t("Unterwegs"), self.code_arm_required)
        if not await self.controller.async_arm(MODE_AWAY, await self._source(self.controller.t("Manuell"))):
            raise ServiceValidationError(
                "Scharfschalten nicht möglich",
                translation_domain=DOMAIN,
                translation_key="arm_blocked",
            )

    async def async_alarm_arm_night(self, code: str | None = None) -> None:
        await self._check_code(code, self.controller.t("Nacht"), self.code_arm_required)
        if not await self.controller.async_arm(MODE_NIGHT, await self._source(self.controller.t("Manuell"))):
            raise ServiceValidationError(
                "Scharfschalten nicht möglich",
                translation_domain=DOMAIN,
                translation_key="arm_blocked",
            )

    async def async_alarm_trigger(self, code: str | None = None) -> None:
        await self.controller.async_trigger(self.controller.t("Manuell ausgelöst"), source=await self._source(self.controller.t("Manuell")), panic=True)

    async def _source(self, fallback: str) -> str:
        """Namen des auslösenden Benutzers ermitteln – bei PIN-Eingabe der Inhaber des PINs."""
        if self._pin_owner:
            return f"{fallback} ({self._pin_owner})"
        ctx = self._context
        if ctx and ctx.user_id:
            user = await self.hass.auth.async_get_user(ctx.user_id)
            if user is not None and user.name:
                return f"{fallback} ({user.name})"
        return fallback


class SafeHomeZonePanel(SafeHomeEntity, AlarmControlPanelEntity):
    """Teilbereich (z. B. Garage) – nur Scharf (Unterwegs) und Unscharf."""

    _attr_supported_features = AlarmControlPanelEntityFeature.ARM_AWAY | AlarmControlPanelEntityFeature.TRIGGER

    def __init__(self, controller, zone) -> None:
        super().__init__(controller, f"zone_{zone.id}")
        self.zone = zone
        self._attr_name = zone.name
        self._attr_icon = "mdi:garage-lock"

    _pin_owner: str | None = None

    @property
    def code_format(self) -> CodeFormat | None:
        if not self.controller.code_required_for(self.zone.id):
            return None
        return CodeFormat.NUMBER if self.controller.code_numeric_for(self.zone.id) else CodeFormat.TEXT

    @property
    def code_arm_required(self) -> bool:
        return self.controller.code_required_for(self.zone.id) and bool(self.controller.opt(CONF_CODE_ARM_REQUIRED))

    async def _check_code(self, code: str | None, action: str, required: bool) -> None:
        self._pin_owner = None
        if not required or not self.controller.code_required_for(self.zone.id):
            return
        self._pin_owner = await check_code_or_raise(self.controller, code, f"{self.zone.name}: {action}", self.zone.id)

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        return self.zone.state

    @property
    def changed_by(self) -> str | None:
        return self.zone.last_changed_by

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {
            **self.zone.attributes(),
            "integration": "safe_home",
            "zone": True,
            "main_entity": er.async_get(self.hass).async_get_entity_id(
                "alarm_control_panel", DOMAIN, f"{self.controller.entry.entry_id}_alarm"
            ),
        }

    async def _source(self) -> str:
        fallback = self.controller.t("Manuell")
        if self._pin_owner:
            return f"{fallback} ({self._pin_owner})"
        ctx = self._context
        if ctx and ctx.user_id:
            user = await self.hass.auth.async_get_user(ctx.user_id)
            if user is not None and user.name:
                return f"{fallback} ({user.name})"
        return fallback

    async def async_alarm_disarm(self, code: str | None = None) -> None:
        await self._check_code(code, self.controller.t("Unscharf schalten"), True)
        await self.zone.async_disarm(await self._source())

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        await self._check_code(code, self.controller.t("Scharf"), self.code_arm_required)
        if not await self.zone.async_arm(await self._source()):
            raise ServiceValidationError("Scharfschalten nicht möglich", translation_domain=DOMAIN, translation_key="arm_blocked")

    async def async_alarm_trigger(self, code: str | None = None) -> None:
        await self.zone.async_trigger(self.controller.t("Manuell ausgelöst"))
