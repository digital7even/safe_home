"""Einrichtungs- und Options-Dialog für Safe Home."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.const import CONF_NAME
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.selector import (
    BooleanSelector,
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
    TimeSelector,
)

from .const import (
    CONF_ALARM_LIGHTS,
    CONF_AUTO_ARM,
    CONF_AUTO_ARM_DELAY,
    CONF_AUTO_DISARM,
    CONF_AWAY_SENSORS,
    CONF_CAMERAS,
    CONF_CODE,
    CONF_CODE_ARM_REQUIRED,
    CONF_CRITICAL,
    CONF_DELAYED_SENSORS,
    CONF_ENTRY_DELAY_AWAY,
    CONF_ENTRY_DELAY_NIGHT,
    CONF_EXIT_DELAY_AWAY,
    CONF_EXIT_DELAY_NIGHT,
    CONF_MEDIA_PLAYERS,
    CONF_NIGHT_AUTO,
    CONF_NIGHT_END,
    CONF_NIGHT_ONLY_HOME,
    CONF_NIGHT_SENSORS,
    CONF_NIGHT_START,
    CONF_NOTIFY_DISARM_ACTION,
    CONF_NOTIFY_SERVICES,
    CONF_NOTIFY_STATE_CHANGES,
    CONF_NOTIFY_WRONG_CODE,
    CONF_OPEN_POLICY,
    CONF_PERSONS,
    CONF_REARM,
    CONF_SIRENS,
    CONF_TAMPER_NOTIFY,
    CONF_SIREN_DURATION,
    CONF_TRIGGER_TIME,
    CONF_TTS_ENTITY,
    DEFAULTS,
    DOMAIN,
    NAME,
    OPEN_POLICY_BLOCK,
    OPEN_POLICY_BYPASS,
)

def _seconds(max_value: int = 3600) -> NumberSelector:
    return NumberSelector(
        NumberSelectorConfig(
            min=0, max=max_value, step=1, mode=NumberSelectorMode.BOX,
            unit_of_measurement="s",
        )
    )


def _entities(domain: str | list[str], multiple: bool = True, **kwargs: Any) -> EntitySelector:
    return EntitySelector(EntitySelectorConfig(domain=domain, multiple=multiple, **kwargs))


def _sv(values: dict[str, Any], key: str) -> dict[str, Any]:
    """suggested_value – erlaubt das Leeren von Listenfeldern."""
    value = values.get(key, DEFAULTS.get(key))
    return {"suggested_value": value} if value not in (None, "") else {}


def _def(values: dict[str, Any], key: str) -> Any:
    value = values.get(key, DEFAULTS.get(key))
    return DEFAULTS.get(key) if value is None else value


def _notify_options(hass: HomeAssistant, current: list[str]) -> list[str]:
    services = sorted(
        name
        for name in hass.services.async_services_for_domain("notify")
        if name not in ("send_message",)
    )
    for item in current or []:
        if item not in services:
            services.append(item)
    return services


def schema_security(values: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Optional(CONF_CODE, description=_sv(values, CONF_CODE)): TextSelector(
                TextSelectorConfig(type=TextSelectorType.PASSWORD)
            ),
            vol.Required(
                CONF_CODE_ARM_REQUIRED, default=_def(values, CONF_CODE_ARM_REQUIRED)
            ): BooleanSelector(),
            vol.Required(
                CONF_NOTIFY_WRONG_CODE, default=_def(values, CONF_NOTIFY_WRONG_CODE)
            ): BooleanSelector(),
        }
    )


def schema_sensors(values: dict[str, Any]) -> vol.Schema:
    sensor_sel = _entities("binary_sensor")
    return vol.Schema(
        {
            vol.Optional(CONF_AWAY_SENSORS, description=_sv(values, CONF_AWAY_SENSORS)): sensor_sel,
            vol.Optional(CONF_NIGHT_SENSORS, description=_sv(values, CONF_NIGHT_SENSORS)): sensor_sel,
            vol.Optional(
                CONF_DELAYED_SENSORS, description=_sv(values, CONF_DELAYED_SENSORS)
            ): sensor_sel,
            vol.Required(CONF_OPEN_POLICY, default=_def(values, CONF_OPEN_POLICY)): SelectSelector(
                SelectSelectorConfig(
                    options=[OPEN_POLICY_BYPASS, OPEN_POLICY_BLOCK],
                    translation_key="open_policy",
                    mode=SelectSelectorMode.LIST,
                )
            ),
            vol.Required(CONF_TAMPER_NOTIFY, default=_def(values, CONF_TAMPER_NOTIFY)): BooleanSelector(),
        }
    )


def schema_delays(values: dict[str, Any]) -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_EXIT_DELAY_AWAY, default=_def(values, CONF_EXIT_DELAY_AWAY)): _seconds(),
            vol.Required(CONF_ENTRY_DELAY_AWAY, default=_def(values, CONF_ENTRY_DELAY_AWAY)): _seconds(),
            vol.Required(CONF_EXIT_DELAY_NIGHT, default=_def(values, CONF_EXIT_DELAY_NIGHT)): _seconds(),
            vol.Required(CONF_ENTRY_DELAY_NIGHT, default=_def(values, CONF_ENTRY_DELAY_NIGHT)): _seconds(),
            vol.Required(CONF_TRIGGER_TIME, default=_def(values, CONF_TRIGGER_TIME)): _seconds(86400),
            vol.Required(
                CONF_SIREN_DURATION,
                default=values.get(CONF_SIREN_DURATION, values.get(CONF_TRIGGER_TIME, DEFAULTS[CONF_SIREN_DURATION])),
            ): _seconds(7200),
            vol.Required(CONF_REARM, default=_def(values, CONF_REARM)): BooleanSelector(),
        }
    )


def schema_actions(hass: HomeAssistant, values: dict[str, Any]) -> vol.Schema:
    current_notify = values.get(CONF_NOTIFY_SERVICES) or []
    return vol.Schema(
        {
            vol.Optional(CONF_SIRENS, description=_sv(values, CONF_SIRENS)): _entities(
                ["siren", "switch", "input_boolean", "script"]
            ),
            vol.Optional(CONF_ALARM_LIGHTS, description=_sv(values, CONF_ALARM_LIGHTS)): _entities("light"),
            vol.Optional(
                CONF_NOTIFY_SERVICES, description=_sv(values, CONF_NOTIFY_SERVICES)
            ): SelectSelector(
                SelectSelectorConfig(
                    options=_notify_options(hass, current_notify),
                    multiple=True,
                    custom_value=True,
                    mode=SelectSelectorMode.DROPDOWN,
                )
            ),
            vol.Required(
                CONF_NOTIFY_STATE_CHANGES, default=_def(values, CONF_NOTIFY_STATE_CHANGES)
            ): BooleanSelector(),
            vol.Required(CONF_CRITICAL, default=_def(values, CONF_CRITICAL)): BooleanSelector(),
            vol.Required(
                CONF_NOTIFY_DISARM_ACTION, default=_def(values, CONF_NOTIFY_DISARM_ACTION)
            ): BooleanSelector(),
            vol.Optional(CONF_CAMERAS, description=_sv(values, CONF_CAMERAS)): _entities("camera"),
            vol.Optional(CONF_TTS_ENTITY, description=_sv(values, CONF_TTS_ENTITY)): _entities(
                "tts", multiple=False
            ),
            vol.Optional(CONF_MEDIA_PLAYERS, description=_sv(values, CONF_MEDIA_PLAYERS)): _entities(
                "media_player"
            ),
        }
    )


def schema_automation(values: dict[str, Any], initial: bool = True) -> vol.Schema:
    """Bei der Einrichtung ist „Nachtmodus“ der Startwert des Schalters „Nachtzeit“.
    Später gibt es dafür nur noch den Schalter (Karte / Safe-Home-Seite)."""
    night = (
        {vol.Required(CONF_NIGHT_AUTO, default=_def(values, CONF_NIGHT_AUTO)): BooleanSelector()} if initial else {}
    )
    return vol.Schema(
        {
            vol.Optional(CONF_PERSONS, description=_sv(values, CONF_PERSONS)): _entities(
                ["person", "device_tracker"]
            ),
            vol.Required(CONF_AUTO_ARM, default=_def(values, CONF_AUTO_ARM)): BooleanSelector(),
            vol.Required(CONF_AUTO_ARM_DELAY, default=_def(values, CONF_AUTO_ARM_DELAY)): _seconds(),
            vol.Required(CONF_AUTO_DISARM, default=_def(values, CONF_AUTO_DISARM)): BooleanSelector(),
            **night,
            vol.Required(CONF_NIGHT_START, default=_def(values, CONF_NIGHT_START)): TimeSelector(),
            vol.Required(CONF_NIGHT_END, default=_def(values, CONF_NIGHT_END)): TimeSelector(),
            vol.Required(CONF_NIGHT_ONLY_HOME, default=_def(values, CONF_NIGHT_ONLY_HOME)): BooleanSelector(),
        }
    )


def _clean(user_input: dict[str, Any], schema_keys: list[str]) -> dict[str, Any]:
    """Nicht ausgefüllte optionale Felder explizit leeren."""
    data = dict(user_input)
    for key in schema_keys:
        if key not in data:
            data[key] = [] if isinstance(DEFAULTS.get(key), list) else (
                "" if key == CONF_CODE else None
            )
    return data


def _validate_code(data: dict[str, Any]) -> dict[str, str]:
    code = (data.get(CONF_CODE) or "").strip()
    if code and len(code) < 4:
        return {CONF_CODE: "code_too_short"}
    return {}


def _validate_sensors(data: dict[str, Any]) -> dict[str, str]:
    if not data.get(CONF_AWAY_SENSORS) and not data.get(CONF_NIGHT_SENSORS):
        return {"base": "no_sensors"}
    return {}


def _keys(schema: vol.Schema) -> list[str]:
    return [str(k) for k in schema.schema]


class SafeHomeConfigFlow(ConfigFlow, domain=DOMAIN):
    """Einrichtungsassistent."""

    VERSION = 1

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._title: str = NAME

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            data = _clean(user_input, _keys(schema_security({})))
            errors = _validate_code(data)
            if not errors:
                self._title = user_input.get(CONF_NAME) or NAME
                data.pop(CONF_NAME, None)
                data[CONF_CODE] = (data.get(CONF_CODE) or "").strip()
                self._data.update(data)
                return await self.async_step_sensors()
        schema = vol.Schema(
            {vol.Required(CONF_NAME, default=NAME): TextSelector()}
        ).extend(schema_security(self._data).schema)
        return self.async_show_form(step_id="user", data_schema=schema, errors=errors)

    async def async_step_sensors(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        schema = schema_sensors(self._data)
        if user_input is not None:
            data = _clean(user_input, _keys(schema))
            errors = _validate_sensors(data)
            if not errors:
                self._data.update(data)
                return await self.async_step_delays()
        return self.async_show_form(step_id="sensors", data_schema=schema, errors=errors)

    async def async_step_delays(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_actions()
        return self.async_show_form(step_id="delays", data_schema=schema_delays(self._data))

    async def async_step_actions(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        schema = schema_actions(self.hass, self._data)
        if user_input is not None:
            self._data.update(_clean(user_input, _keys(schema)))
            return await self.async_step_automation()
        return self.async_show_form(step_id="actions", data_schema=schema)

    async def async_step_automation(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        schema = schema_automation(self._data)
        if user_input is not None:
            self._data.update(_clean(user_input, _keys(schema)))
            return self.async_create_entry(title=self._title, data={}, options=self._data)
        return self.async_show_form(step_id="automation", data_schema=schema)

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return SafeHomeOptionsFlow()


class SafeHomeOptionsFlow(OptionsFlow):
    """Einstellungen nachträglich ändern."""

    @property
    def _values(self) -> dict[str, Any]:
        return dict(self.config_entry.options)

    def _save(self, data: dict[str, Any]) -> ConfigFlowResult:
        merged = {**self._values, **data}
        return self.async_create_entry(title="", data=merged)

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return self.async_show_menu(
            step_id="init",
            menu_options=["sensors", "delays", "actions", "automation", "security"],
        )

    async def async_step_sensors(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        schema = schema_sensors(self._values)
        errors: dict[str, str] = {}
        if user_input is not None:
            data = _clean(user_input, _keys(schema))
            errors = _validate_sensors(data)
            if not errors:
                return self._save(data)
        return self.async_show_form(step_id="sensors", data_schema=schema, errors=errors)

    async def async_step_delays(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self._save(user_input)
        return self.async_show_form(step_id="delays", data_schema=schema_delays(self._values))

    async def async_step_actions(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        schema = schema_actions(self.hass, self._values)
        if user_input is not None:
            return self._save(_clean(user_input, _keys(schema)))
        return self.async_show_form(step_id="actions", data_schema=schema)

    async def async_step_automation(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        schema = schema_automation(self._values, initial=False)
        if user_input is not None:
            return self._save(_clean(user_input, _keys(schema)))
        return self.async_show_form(step_id="automation", data_schema=schema)

    async def async_step_security(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        schema = schema_security(self._values)
        errors: dict[str, str] = {}
        if user_input is not None:
            data = _clean(user_input, _keys(schema))
            data[CONF_CODE] = (data.get(CONF_CODE) or "").strip()
            errors = _validate_code(data)
            if not errors:
                return self._save(data)
        return self.async_show_form(step_id="security", data_schema=schema, errors=errors)
