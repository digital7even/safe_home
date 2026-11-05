# Changelog

All notable changes to Safe Home. German version: [CHANGELOG.de.md](CHANGELOG.de.md)

## 1.1.0 – Partitions

### New
- **Partitions:** up to 3 partitions next to the main alarm system, e.g. *Garage*, *Outbuilding* or *Workshop*. The main alarm system with Home, Away and Night stays the **main area** and does not count as a partition.
  - Each partition has its own **name**, its own **sensors** and its own **exit and entry delay**. You can also set the entry delay for each sensor.
  - A partition only knows **Armed** and **Disarmed**.
  - **Core hours:** armed at the start time and disarmed at the end time, on the weekdays you choose (Mon–Sun).
  - **Own presence:** armed when all selected people have left, disarmed as soon as one of them returns. This works independently of the main area.
  - Each partition gets its own entity `alarm_control_panel.<partition name>` (`alarm_arm_away` / `alarm_disarm`) and uses the same PIN as the main area.
  - The armed state is restored after a Home Assistant restart.
  - The rules for open sensors when arming, for unavailable sensors and for re-arming after an alarm also apply to partitions.
- **Partition alarms** use the same outputs as the main area: sirens, alarm lights, push notifications with a disarm button, voice announcement, WhatsApp, a persistent notification and the log. Every alarm names the partition, e.g. *“🚨 ALARM – Garage”*.
  - The settings under *Audible alarm* also apply to partitions (time window, sensors that don't trigger the siren). The mode selection does not, because partitions have no modes.
  - Sirens only turn off once no area needs them any more.
- **Dashboard cards:**
  - **Compact:** up to 3 dots in the top-right corner, one per partition, coloured by state (green disarmed, blue armed, amber delay, red alarm). Tap them to unfold the partition controls.
  - **Standard:** partitions are listed directly below the mode buttons.
  - **Tablet & Custom:** choose in the card editor whether partitions appear as a list or only as dots (`zones_display: inline | dots`). In the Custom card the list is a separate widget, *Partitions*, that you can move and resize.
  - In every card variant, a partition alarm shows a red banner with a disarm button.
  - Every card can arm and disarm partitions, skip a running exit delay with *Arm now* and cancel arming. If a PIN is set, it is asked for.
- **Settings page:** the *Sensors* tab is now called **Areas & sensors**.
  - Add, rename and delete partitions there, and set their delays, core hours and presence.
  - The sensor table has a new **Area** column, so you can assign each sensor to exactly one area.
  - If you delete a partition, its sensors go back to the main area.
- **Services & events:**
  - `safe_home.skip_exit_delay` also works for partition entities.
  - `safe_home_triggered` now also includes `zone` and `zone_id` (with `mode: zone`).
  - The main entity has a new `zones` attribute with the state of every partition.

### Upgrade notes
- No breaking changes. Your existing configuration is kept unchanged. Partitions are optional.
- Restart Home Assistant after updating. The dashboard resource gets a new version number automatically, so browsers and the Companion App load the new cards.

## 1.0.0 – First release

- Alarm system with the modes **Home**, **Away** and **Night**, exit and entry delay, panic alarm and PIN.
- **Home-zone automation:**
  - Arms automatically when everyone has left (with a delay) and disarms when someone returns.
  - Night mode on a schedule that depends on who is home, with re-arming after a late arrival home.
  - One switch per automation.
- **Alarm actions:**
  - Sirens, with fine-grained rules: mode, time window, per sensor, silent alarm.
  - Alarm duration and siren duration can be set separately.
  - Red alarm lights, push notifications (also critical ones), cameras and voice announcements.
- **WhatsApp via TextMeBot:**
  - Several recipients, with escalation through wait times.
  - All-clear and status messages.
- **Household:** monitoring of water sensors and similar, with a selectable alert state.
- **Four dashboard cards:**
  - Standard, Compact, Tablet and Custom.
  - The Custom card has modules for people, weather, climate, covers, lights, scenes, cameras, clock, fuel prices and your own YAML widgets.
  - Drag & drop, adjustable widget sizes and your own background colour.
- **Settings page in the sidebar:**
  - Overview, sensors, delays with a timeline, alarm actions with test buttons, automation, household, security and log.
  - Generator for an Android Companion App widget.
- Fully bilingual: German and English.
