"""Home-Assistant-Design „Safe Home“ – wird beim Start automatisch zu den Designs hinzugefügt.

Auswählbar im Benutzerprofil (Design: Safe Home), mit hellem und dunklem Modus.
Ein Neuladen der Designs über `frontend.reload_themes` entfernt es nicht: es wird danach erneut eingetragen.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import Event, HomeAssistant, callback

_LOGGER = logging.getLogger(__name__)

THEME_NAME = "Safe Home"
_DATA_THEMES = "frontend_themes"  # Ablage der Designs im Frontend von Home Assistant
_EVENT_THEMES_UPDATED = "themes_updated"

_SHARED: dict[str, str] = {
    "ha-card-border-radius": "18px",
    "state-alarm_control_panel-disarmed-color": "#34d399",
    "state-alarm_control_panel-armed_home-color": "#34d399",
    "state-alarm_control_panel-armed_away-color": "#ffba5e",
    "state-alarm_control_panel-armed_night-color": "#a78bfa",
    "state-alarm_control_panel-arming-color": "#3b7bff",
    "state-alarm_control_panel-pending-color": "#fbbf24",
    "state-alarm_control_panel-triggered-color": "#ef2945",
    "error-color": "#ef2945",
    "warning-color": "#fbbf24",
    "success-color": "#34d399",
    "info-color": "#3b7bff",
}

SAFE_HOME_THEME: dict[str, Any] = {
    **_SHARED,
    "modes": {
        "dark": {
            "primary-color": "#3b7bff",
            "accent-color": "#ffba5e",
            "primary-background-color": "#071538",
            "secondary-background-color": "#0b1d4d",
            "card-background-color": "#0f2560",
            "ha-card-background": "#0f2560",
            "ha-card-border-color": "rgba(160,190,255,0.16)",
            "ha-card-box-shadow": "0 10px 30px rgba(3,10,35,0.45)",
            "primary-text-color": "#eef3ff",
            "secondary-text-color": "#9fb1d9",
            "text-primary-color": "#ffffff",
            "disabled-text-color": "#64748b",
            "divider-color": "rgba(160,190,255,0.16)",
            "app-header-background-color": "#0b2463",
            "app-header-text-color": "#eef3ff",
            "sidebar-background-color": "#071538",
            "sidebar-text-color": "#c7d6ff",
            "sidebar-icon-color": "#9fb1d9",
            "sidebar-selected-text-color": "#ffffff",
            "sidebar-selected-icon-color": "#3b7bff",
            "state-icon-color": "#9cc0ff",
            "input-fill-color": "rgba(255,255,255,0.06)",
            "code-editor-background-color": "#0b1d4d",
            "markdown-code-background-color": "#0b1d4d",
            "table-row-background-color": "#0f2560",
            "table-row-alternative-background-color": "#0b2463",
        },
        "light": {
            "primary-color": "#2563eb",
            "accent-color": "#f59e0b",
            "primary-background-color": "#f2f5fb",
            "secondary-background-color": "#e6ecf7",
            "card-background-color": "#ffffff",
            "ha-card-background": "#ffffff",
            "ha-card-border-color": "#dbe3f1",
            "primary-text-color": "#0b1d4d",
            "secondary-text-color": "#51608a",
            "text-primary-color": "#ffffff",
            "divider-color": "#dbe3f1",
            "app-header-background-color": "#0b2463",
            "app-header-text-color": "#ffffff",
            "sidebar-background-color": "#ffffff",
            "sidebar-text-color": "#0b1d4d",
            "sidebar-selected-text-color": "#2563eb",
            "sidebar-selected-icon-color": "#2563eb",
            "state-icon-color": "#2563eb",
        },
    },
}


@callback
def async_register_theme(hass: HomeAssistant) -> None:
    """Design eintragen und das Frontend benachrichtigen. Fehler dürfen den Start nie verhindern."""

    @callback
    def _add(fire: bool = True) -> bool:
        themes = hass.data.get(_DATA_THEMES)
        if not isinstance(themes, dict):
            return False
        if themes.get(THEME_NAME) == SAFE_HOME_THEME:
            return True
        themes[THEME_NAME] = SAFE_HOME_THEME
        if fire:
            hass.bus.async_fire(_EVENT_THEMES_UPDATED)
        return True

    try:
        if not _add():
            _LOGGER.debug("Designs des Frontends nicht gefunden – Safe-Home-Design wird nicht eingetragen")
            return

        @callback
        def _on_reload(_event: Event) -> None:
            # Nach „Designs neu laden“ fehlt das Design wieder -> erneut eintragen (feuert nur, wenn es fehlte)
            _add()

        hass.bus.async_listen(_EVENT_THEMES_UPDATED, _on_reload)
    except Exception:  # noqa: BLE001
        _LOGGER.exception("Safe-Home-Design konnte nicht eingetragen werden")
