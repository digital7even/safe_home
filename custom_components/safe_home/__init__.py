"""Safe Home – Alarmanlage für Home Assistant.

Mit ❤️ entwickelt in Deutschland von Digital7even.
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path
import shutil

import voluptuous as vol

from homeassistant.components import panel_custom
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry, ConfigEntryState
from homeassistant.const import ATTR_ENTITY_ID, Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv, entity_registry as er
from homeassistant.helpers.typing import ConfigType

from .const import (
    CARD_FILENAME,
    PANEL_FILENAME,
    PANEL_URL_PATH,
    DOMAIN,
    FRONTEND_URL_BASE,
    SERVICE_PANIC,
    SERVICE_SET_AUTO_MODE,
    SERVICE_SILENCE,
    SERVICE_SKIP_EXIT_DELAY,
    VERSION,
)
from .controller import SafeHomeController
from .frontend_resource import async_setup_resource
from .websocket_api import async_register as async_register_websocket

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [
    Platform.ALARM_CONTROL_PANEL,
    Platform.SWITCH,
    Platform.SENSOR,
    Platform.BINARY_SENSOR,
]

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

type SafeHomeConfigEntry = ConfigEntry[SafeHomeController]

SERVICE_SCHEMA = vol.Schema({vol.Optional(ATTR_ENTITY_ID): cv.entity_ids})
SILENCE_SCHEMA = vol.Schema({vol.Optional(ATTR_ENTITY_ID): cv.entity_ids, vol.Optional("code"): cv.string})
AUTO_MODE_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTITY_ID): cv.entity_ids,
        vol.Required("enabled"): cv.boolean,
        vol.Optional("night"): cv.boolean,
    }
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Frontend-Karte bereitstellen und Dienste registrieren."""
    frontend_dir = Path(__file__).parent / "frontend"
    # Ohne Langzeit-Cache: Browser/Apps prüfen bei jedem Laden, ob die Datei noch aktuell ist.
    await hass.http.async_register_static_paths(
        [StaticPathConfig(FRONTEND_URL_BASE, str(frontend_dir), False)]
    )
    # Karte automatisch laden – keine manuelle Ressource nötig
    card_hash, panel_hash = await hass.async_add_executor_job(
        lambda: (_file_hash(frontend_dir / CARD_FILENAME), _file_hash(frontend_dir / PANEL_FILENAME))
    )
    # Wie bei HACS-Karten: Kartendatei unter /local (config/www) ausliefern. Diesen Ordner stellt
    # Home Assistant vom ersten Moment des Starts an bereit – unabhängig davon, wann die
    # Integration geladen ist. So steht die Karte auch beim Start der App sofort zur Verfügung.
    card_url = await hass.async_add_executor_job(_install_card, hass, frontend_dir, card_hash)
    # 1) Dashboard-Ressource: Das Dashboard wartet mit dem Zeichnen, bis die Karte geladen ist
    async_setup_resource(hass, card_url)
    # 2) Zusätzlich global laden (Kartenauswahl, YAML-Dashboards). Gleiche URL -> nur einmal ausgeführt.
    add_extra_js_url(hass, card_url)

    # Eigene Seite in der Seitenleiste (nur für Administratoren).
    # Ein Fehler hier darf die Alarmanlage selbst nie verhindern.
    try:
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name="safe-home-panel",
            sidebar_title="Safe Home",
            sidebar_icon="mdi:shield-home",
            module_url=f"{FRONTEND_URL_BASE}/{PANEL_FILENAME}?v={VERSION}-{panel_hash}",
            require_admin=True,
            config={"card_url": card_url},
        )
    except Exception:  # noqa: BLE001
        _LOGGER.exception("Safe-Home-Seite in der Seitenleiste konnte nicht angelegt werden")
    async_register_websocket(hass)
    # Design „Safe Home“ für das Benutzerprofil
    from .theme import async_register_theme  # noqa: PLC0415

    async_register_theme(hass)

    def _controllers(call: ServiceCall) -> list[SafeHomeController]:
        entries: list[SafeHomeConfigEntry] = [
            e
            for e in hass.config_entries.async_entries(DOMAIN)
            if e.state is ConfigEntryState.LOADED
        ]
        entity_ids = call.data.get(ATTR_ENTITY_ID)
        if not entity_ids:
            return [e.runtime_data for e in entries]
        registry = er.async_get(hass)
        wanted: set[str] = set()
        for entity_id in entity_ids:
            reg = registry.async_get(entity_id)
            if reg and reg.config_entry_id:
                wanted.add(reg.config_entry_id)
        return [e.runtime_data for e in entries if e.entry_id in wanted]

    async def handle_panic(call: ServiceCall) -> None:
        for ctrl in _controllers(call):
            await ctrl.async_panic(ctrl.t("Dienst / Panik-Taste"))

    async def handle_silence(call: ServiceCall) -> None:
        from .alarm_control_panel import check_code_or_raise  # noqa: PLC0415

        # PIN nur bei Bedienung durch eine Person (Dashboard/App) – Automationen und Skripte haben keinen Benutzer
        by_user = bool(call.context and call.context.user_id)
        for ctrl in _controllers(call):
            source = ctrl.t("Dienst")
            if by_user and ctrl.silence_code_required:
                owner = await check_code_or_raise(ctrl, call.data.get("code"), ctrl.t("Sirene stumm"))
                source = f"{ctrl.t('Manuell')} ({owner})" if owner else ctrl.t("Manuell")
            elif by_user:
                user = await hass.auth.async_get_user(call.context.user_id)
                source = f"{ctrl.t('Manuell')} ({user.name})" if user and user.name else ctrl.t("Manuell")
            await ctrl.async_silence(source)

    async def handle_skip(call: ServiceCall) -> None:
        wanted = set(call.data.get(ATTR_ENTITY_ID) or [])
        for ctrl in _controllers(call):
            main_id = er.async_get(hass).async_get_entity_id("alarm_control_panel", DOMAIN, f"{ctrl.entry.entry_id}_alarm")
            if not wanted or main_id in wanted:
                await ctrl.async_skip_exit_delay(ctrl.t("Dienst"))
            for zid, zone in ctrl.zones.items():
                if not wanted or ctrl.zone_entity_id(zid) in wanted:
                    await zone.async_skip_exit_delay(ctrl.t("Dienst"))

    async def handle_auto(call: ServiceCall) -> None:
        for ctrl in _controllers(call):
            ctrl.set_auto_mode(call.data["enabled"])
            if "night" in call.data:
                ctrl.set_night_auto(call.data["night"])

    hass.services.async_register(DOMAIN, SERVICE_PANIC, handle_panic, SERVICE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SILENCE, handle_silence, SILENCE_SCHEMA)
    hass.services.async_register(DOMAIN, SERVICE_SKIP_EXIT_DELAY, handle_skip, SERVICE_SCHEMA)
    hass.services.async_register(
        DOMAIN, SERVICE_SET_AUTO_MODE, handle_auto, AUTO_MODE_SCHEMA
    )
    return True


def _file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:10]


def _install_card(hass: HomeAssistant, frontend_dir: Path, card_hash: str) -> str:
    """Kartendatei und Logo nach config/www/safe_home kopieren und die Lade-URL liefern.

    /local stellt Home Assistant nur bereit, wenn der Ordner www beim Start schon existierte.
    Fehlt er, wird er angelegt und die Karte bis zum nächsten Neustart über die Integration geladen.
    """
    www = Path(hass.config.path("www"))
    www_existed = www.is_dir()
    try:
        target_dir = www / "safe_home"
        target_dir.mkdir(parents=True, exist_ok=True)
        for name in (CARD_FILENAME, "logo-white.png"):
            source = frontend_dir / name
            target = target_dir / name
            if not target.exists() or target.read_bytes() != source.read_bytes():
                shutil.copyfile(source, target)
        # Lader aus einer früheren Version entfernen (eigene Datei)
        (target_dir / "safe-home-loader.js").unlink(missing_ok=True)
    except OSError as err:
        _LOGGER.warning("Safe-Home-Karte konnte nicht nach www kopiert werden: %s", err)
        www_existed = False
    if www_existed:
        return f"/local/safe_home/{CARD_FILENAME}?v={VERSION}-{card_hash}"
    _LOGGER.warning(
        "Ordner www wurde angelegt – bitte Home Assistant einmal neu starten, "
        "damit die Safe-Home-Karten zuverlässig über /local geladen werden"
    )
    return f"{FRONTEND_URL_BASE}/{CARD_FILENAME}?v={VERSION}-{card_hash}"


async def async_setup_entry(hass: HomeAssistant, entry: SafeHomeConfigEntry) -> bool:
    """Safe-Home-Instanz einrichten."""
    controller = SafeHomeController(hass, entry)
    entry.runtime_data = controller
    try:
        await controller.async_start()
        await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    except Exception:
        # Überwachung wieder abmelden, sonst liefe sie beim nächsten Versuch doppelt
        await controller.async_stop()
        raise
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: SafeHomeConfigEntry) -> bool:
    """Instanz entladen."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        await entry.runtime_data.async_stop()
    return unloaded


async def _async_update_listener(hass: HomeAssistant, entry: SafeHomeConfigEntry) -> None:
    """Bei geänderten Optionen neu laden (Zustand bleibt gespeichert)."""
    await hass.config_entries.async_reload(entry.entry_id)
