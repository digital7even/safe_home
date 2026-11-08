# Changelog

All notable changes to Safe Home. German version: [CHANGELOG.de.md](CHANGELOG.de.md)

## 1.20.0 – Tab bar stays in place

### Fixed
- **Settings page on smartphones:** after tapping a tab, the horizontal tab bar jumped back to the start. It now keeps its position. A tab that is only half visible is moved fully into view when tapped, so the next tab is right there.

## 1.19.0 – Home Assistant theme (Beta) & "Safe Home" theme

### New
- **Home Assistant theme (Beta):** *Info → Display* has the new option **Use Home Assistant theme**, marked in yellow with **(Beta)**.
  - It switches the Safe Home page and **all cards** (standard, compact, tablet, square, custom, badge) between the Safe Home look and the colours of your active Home Assistant theme, light or dark.
  - Meant to avoid display problems, e.g. with custom themes. The state colours are kept.
  - The page switches as soon as you tick the box; for the cards the setting applies after saving, on all devices.
  - On a light background the red logo is used automatically.
- **"Safe Home" theme:** At startup Safe Home automatically adds its own Home Assistant theme, based on the app's colours, with a light and a dark mode. Select it under *Profile → Theme → Safe Home*. After "Reload themes" it is added again automatically.

### Changed
- *Info → Display:* each option now has its note directly below it.

## 1.18.0 – PINs per area

### New
- **PIN function on/off:** *Security → PIN entry* has a new master switch. When it is off, no PIN is needed anywhere, and all PIN settings are greyed out.
- **PIN per area:** under *Require PIN for* you tick the main area and each partition separately.
  - An area without a tick needs no PIN.
  - An area that has no active PIN assigned needs no PIN either. The page points this out.
- **Areas per PIN:** each user and guest PIN has a new row, **May operate**, with a checkbox for the main area and for each partition. For example, the tradesperson PIN can be valid only for *Garage*.
  - The default is all areas, so existing PINs keep working.
  - A PIN used in another area is rejected, and the log records *“PIN of … is not valid for …”*.
- The cards ask for the PIN separately for each partition, according to these settings.

## 1.17.0 – Clearer settings page

No functional changes. The settings page has been reorganised and the texts shortened.

### Changed
- **The *Core times* tab has been removed:**
  - **Delays** (with the live timeline) are now in *Areas & sensors*.
  - The **weekly schedule** is now in *Automation*, next to presence detection and night mode. Its mutual priority over night mode is therefore visible at a glance.
  - **Alarm duration, siren duration and re-arm afterwards** are now in *Alarm actions → Siren & lights*.
- **Alarm actions**, in a new order:
  1. **Siren & lights**: sirens, alarm lights, siren rules, per-sensor siren, durations.
  2. **Notifications**.
  3. **Announcements**.
  4. **WhatsApp**.
  5. **Testing**.
- **Household:** the switches for push, WhatsApp and announcement on household alerts are now in the *Household* tab under **Notify via**, together with the all-clear.
- **Name of the alarm system:** it is edited in the main area tile under *Areas*, no longer under *Security*.
- **Security:** the first section is now called **PIN entry**.
- **Areas & sensors:** *Behaviour* and *Batteries* are combined into **Monitoring**.
- **Shorter texts:** labels and descriptions are shorter throughout. Examples: *“Arm automatically when everyone has left”* and *“Critical – rings even when silent”*. Section descriptions are at most one sentence.

## 1.16.0 – Battery monitoring & weekly schedule before night mode

### New
- **Battery monitoring of the sensors:** Safe Home checks the batteries of all monitored sensors, in the main area and in partitions.
  - It uses the battery entity on the same device (in % or *battery low*) or the sensor's `battery_level` attribute.
  - A low battery shows up as an amber chip in the cards and under *Areas & sensors → Batteries*. It is also written to the log, and you get a push notification.
  - **Settings:** *Monitor sensor batteries* (on/off), *Warn at charge level* (5–90 %, default 20 %) and *Push notification on low battery* (on/off).
  - Each battery is reported only once, also across restarts, until it has been replaced. It counts as replaced 5 % above the threshold.

### Changed
- **The weekly schedule takes precedence over the night mode schedule:** while the weekly schedule is active, the night mode schedule is paused.
  - The *Night mode* section under *Automation* is greyed out, with a note and a link to *Core hours*.
  - The card switch shows *Paused (weekly schedule)*.
  - This prevents overlapping switching times.

## 1.15.0 – Square card: status, people & swiping

### New
- **Square card – choose what goes in the middle:** up to three elements, each switchable in the card editor:
  - **Status**: the current mode as a large icon, with a countdown ring during a delay.
  - **People**: avatars, coloured when the person is at home, plus *“2 of 3 home”*.
  - **Panic button**: the round SOS button, which can now be switched off.
- **Arrangement:** *Everything in one view* (side by side, scaled to fit) or *Swipe (left/right)*.
  - When swiping, one element is shown at a time, with page dots underneath that you can tap. Swiping works with touch and with the mouse.
  - The current page stays put when the status changes.
- By default the card looks the same as in 1.14.0: only the panic button is shown.

## 1.14.0 – Square card

### New
- **Safe Home – Square** (`custom:safe-home-square-card`): a 1:1 card for small control displays.
  - It shows only the status (with countdown ring during a delay) and the modes **Home**, **Away** and **Night**. The PIN keypad fills the card.
  - A large **round panic button** (SOS): hold it for 2 seconds, and a ring around the button fills up while you hold. Releasing earlier does nothing.
  - During an alarm, the button is replaced by the cause of the alarm.
  - Everything scales with the size of the card, from about 200 px.
  - Option `show_panic: false` hides the panic button. The card can also be chosen in the card editor as the *Square* layout.

## 1.13.0 – PIN protection

### New
- **The PIN is also needed to silence the siren:** *Silence siren* on the cards now opens the keypad.
  - Option *Security → Also require the PIN to silence the siren*, on by default.
  - Automations and scripts that call `safe_home.silence` don't need a PIN. The service has a new optional `code` field.
- **Lock after wrong PINs:**
  - After 5 wrong entries in a row, PIN entry is locked for 5 minutes. Both values can be set under *Security*, and 0 means never lock.
  - During the lock even the correct PIN is rejected, for disarming, arming, partitions and silencing.
  - When the lock starts, you immediately get a **critical push notification** *“🔐 Several wrong PINs”*, even if *Notify on wrong PIN* is switched off.
  - The keypad shows *“Too many wrong PINs – locked for X more min”*, and the log records every rejected attempt.
  - A correct PIN resets the counter, and the lock survives a restart of Home Assistant.

### Fixed
- The *Silence siren* button on the cards skipped the PIN check entirely.

## 1.12.0 – Partition sirens & collapsible settings

### New
- **Sirens per partition:** each partition has a new *Siren* setting under *Areas & sensors*:
  - **Like main area**: the sirens under *Alarm actions*. This is the default and matches the previous behaviour.
  - **Own sirens**: only the sirens selected here sound, e.g. only the outdoor siren at the garage. Any siren, switch or script can be added.
  - **No siren**: a silent alarm. Notifications, alarm lights and the announcement still run.
  - A siren only switches off once no area needs it any more. If the main area and the garage are in alarm at the same time and you disarm the garage, the shared siren keeps sounding.
- **Collapsible settings:** the sections in the tabs (e.g. *Alarm actions*) are collapsed by default and open with a tap on the heading. Each section remembers whether it is open or closed. If the settings contain errors, all sections open automatically.
- **Info → Display → “Expand settings by default”:** shows all sections expanded again. The setting applies per browser or device.

## 1.11.0 – Stricter entry delay & looping reminder

### Changed
- **Immediate alarm during the entry delay:** if a sensor **without** delay reports while the entry delay is running (e.g. motion in the living room after the front door), the alarm now starts **immediately**. Previously it waited until the countdown ended. This applies to the main area and all partitions. Closing the door still does not stop the countdown, only disarming does.

### New
- **Looping entry-delay reminder:** the announcement *“Please disarm the alarm system within 30 seconds.”* now repeats with the remaining time (*“… 20 seconds left.”*) until you disarm or the alarm starts.
  - The interval can be set under *Alarm actions → Announcements → Repeat the reminder every … seconds*. The default is 10 s, and 0 means only once.
  - This works for TTS speakers and Alexa, in the main area and in partitions.
  - There is no reminder in the last 3 seconds before the alarm starts, so it doesn't overlap the alarm announcement.

## 1.10.0 – White logo on badges

### Changed
- The **Safe Home badge** now shows the **white** Safe Home logo by default. For light dashboards there is the option *Red logo (for light backgrounds)* (`red_logo: true`). It replaces `white_logo` from 1.9.0.

## 1.9.0 – Badge card & hiding partitions

### New
- **Safe Home – Badge** (`custom:safe-home-badge-card`): a small card with a **transparent background**.
  - It shows the Safe Home logo and the current status in its colour: green *Home*, orange *Away*, purple *Night*. *Alarm* and the entry delay blink.
  - Optional: partitions as coloured dots (with names if you like) and the name of the alarm system.
  - A tap opens the details of the alarm system.
  - It can also be used as a real Home Assistant **badge** in the badge bar: `custom:safe-home-badge`. Visual editor included.
- **Hide partitions completely:** the *Custom* and *Tablet* cards have a third option, *Hide* (`zones_display: hidden`). The list, the dots and the partitions widget disappear. Only the red banner remains during an alarm in a partition, so an alarm is not missed.

## 1.8.0 – Manage PINs & animated covers

### New
- **Manage PINs** under *Security*:
  - Each **Home Assistant user** can get their own PIN.
  - **Guest PINs** have a name and optional *valid from* and *valid until* times, so access can be planned ahead. Each guest PIN can be switched off with a checkbox, and a status shows *Active*, *Scheduled*, *Expired*, *Deactivated* or *Unlimited*.
  - 🎲 creates a random 6-digit PIN that isn't already in use, and 👁 shows the PIN.
  - These PINs **replace the general PIN**. An existing general PIN is carried over as *Previous PIN*.
  - The log and notifications show whose PIN was used. A scheduled, expired or deactivated guest PIN is rejected, and the log gives the reason.
  - PINs work for the main area and for all partitions.
- **Animated covers:** in the card editor under *Covers* you can choose **Classic (bar)** or **Animated shutter**.
  - The animated style shows each cover as a small window. Its shutter covers exactly the closed share, and the open percentage is shown in the window.
  - While the cover is moving, the slats roll.
  - The window is the same size as the buttons, so the card does not get bigger.

### Changed
- The single *PIN code* field in the *Security* form has been removed. *Manage PINs* replaces it.

### Upgrade notes
- No breaking changes. An existing general PIN keeps working until you save, and after saving it becomes the entry *Previous PIN*.

## 1.7.0 – Weekly schedule, WhatsApp recipients on/off

### New
- **Weekly schedule** in the *Core times* tab:
  - A weekly calendar from Monday to Sunday. Drag bars for *Away* (orange) or *Night* (purple) into it. Outside the bars the system is disarmed.
  - Drag the edges to change the time and drag a bar to move it. Draw with *Disarmed* to erase. Times snap to a 15-minute grid.
  - Shortcuts: *Copy Monday to Tue–Fri* and *Clear all*.
  - **Only active when “Presence detection” is switched off.** Otherwise the section is greyed out, with a short note and a link to the automation tab.
  - At the start of a bar the system is armed (with exit delay). At the end it is disarmed, but only if the schedule armed it. Bars that meet across midnight count as one period.
- **WhatsApp recipients can be switched on and off:** each recipient has an *Active* checkbox, e.g. to notify only one person for a while. A counter shows how many recipients are active.
- **Important notes on WhatsApp notifications:** an expandable box with notes on TextMeBot:
  - TextMeBot is a **paid service from a third party**. Prices and terms are on [textmebot.com](https://textmebot.com).
  - Messages are sent from the WhatsApp account linked to your API key.
  - There is no delivery guarantee.
  - Phone numbers and message texts are passed on to TextMeBot.

### Changed
- The switch on the cards is now simply called **“Anwesenheit”** in German. In English it stays **“Presence detection”**.

### Upgrade notes
- No breaking changes. Existing WhatsApp recipients are active. The weekly schedule is off until you tick *Use weekly schedule*.

## 1.6.0 – New names & colour for Away

### Changed
- **“Away” is now shown in orange (`#FFBA5E`) instead of blue:**
  - On all cards: the active mode button, the status ring and glow, the background tone and the badge.
  - On the settings page and in the Android widget.
- **Partitions use the same colour:** an armed partition shows an orange dot and an orange-framed row, and the *Arm* button is orange too.
- On the cards, the **“Home zone”** switch in the automation box is now called **“Presence detection”**. The settings page refers to it by the new name.
- The **“Delays”** tab on the settings page is now called **“Core times”**. In German, *Zeiten* became *Kernzeiten*.

## 1.5.0 – Announcements during every alarm

### Fixed
- **Alexa (and all other speakers) stayed silent during alarms**, even though the *Test announcement* button worked. Cause: as soon as a siren rule applied, the alarm counted as a *silent alarm*, and the announcement was skipped as well. Siren rules are e.g. the time window outside 22:00–06:00, a sensor without siren, or a mode without siren. This also affected alarms triggered from a sensor in the *Testing* area.
- The announcement now runs on **every alarm**, including during a silent alarm: only the siren stays off.

### New
- Option **Announcement during a silent alarm too** (on by default). Switch it off if you want a silent alarm to stay completely silent.
- **Reasons in the log:** if no announcement is made (silent alarm with the option off, or no speakers or Alexa devices selected), or if Alexa Media Player reports an error, the log says so. Example: *“Alexa announcement failed: …”*.

## 1.4.0 – Trigger an alarm from a sensor & smartphone selection

### New
- **Trigger a real alarm from a sensor:** *Alarm actions → Testing* has a new area where you can trigger an alarm from any configured sensor.
  - Choose between **Alarm system** (main area and partitions, grouped by area) and **Household**.
  - Triggering takes two clicks: *Trigger alarm*, then *Really trigger now?*.
  - Everything runs exactly as in an emergency: sirens, alarm lights, announcement, push with camera snapshot, WhatsApp, log and the alarm banner on the cards. The texts match the sensor type, e.g. *“Window opened: Kitchen”*. The word “test” appears nowhere.
  - **Reset** ends the alarm and restores the previous state: disarmed stays disarmed, *Night* or *Away* is armed again, and a partition returns to the state it was in before. WhatsApp recipients get the usual all-clear. For household sensors, the usual all-clear message is sent.
  - Disarming via a card also ends the alarm. When the alarm duration has elapsed, Safe Home resets automatically instead of arming the system.
- **Smartphone selection for notifications:** the old field for notification services has been replaced by a drop-down menu in the Safe Home style.
  - It **only lists smartphones with the Companion App**, with device name, model and operating system (e.g. *“Pixel 8 by Max · Google Pixel 8 · Android 15”*).
  - Selected phones appear as chips that you can remove with ×.
  - Other services you entered earlier, such as `telegram`, are still shown and can be removed.

### Upgrade notes
- No breaking changes. Your selected notification services are kept unchanged.

## 1.3.0 – Alexa devices

### New
- **Alexa devices are kept separate from speakers:** *Alarm actions → Announcements* has a new checkbox, **Use Alexa devices (Alexa Media Player)**. It is **off by default**. Only when it is ticked can you select Echo devices. The device list only shows players of the `alexa_media` integration.
- **Normal Alexa voice:** Echo devices get the announcement via `notify.alexa_media` (`type: tts`). No TTS service is passed, so Alexa speaks with its own voice. If you only use Alexa devices, you don't need a TTS service at all.
  - You can combine speakers (e.g. Sonos or Google via TTS) and Alexa devices. Every announcement goes to both.
  - This covers all announcements: alarm, entry delay, household alerts, partitions and the test button.
- **Echo selected as a speaker by mistake?** The settings page shows a hint. Safe Home still sends the announcement with the Alexa voice. The Alexa checkbox is not ticked automatically.

### Improved
- **Readable drop-down menus:** all drop-down menus on the settings page now have the dark blue page background instead of white, with an arrow in the Safe Home style. This includes Type, Area, Household state, the WhatsApp wait time and the Home Assistant selection fields. The same applies to your own YAML widgets in the Custom card. Previously, the light text on the white background was only readable while hovering.

### Upgrade notes
- No breaking changes. Echo devices that were previously selected as speakers will automatically use the Alexa voice from now on. They are not moved – select them via the Alexa checkbox if you like.

## 1.2.0 – Sensor types & announcements

### New
- **Sensor type for every sensor:** door contact, window contact, motion sensor, presence sensor, water sensor or camera.
  - Choose it in the new **Type** column of the *Areas & sensors* tab. Binary sensors in the *Household* tab have it too.
  - Safe Home suggests the type from the device class and the entity name.
  - The type also sets the icon shown in the settings page.
- **Messages that match the sensor:** push notifications, WhatsApp messages and the log now say what happened, e.g. *“Window opened: Kitchen”*, *“Motion detected: Hallway”*, *“Water detected: Basement”*. Previously they said *“Kitchen triggered”*.
- **Announcements with their own on/off switch** (*Alarm actions → Announcements*):
  - On an alarm, the announcement depends on the sensor type, e.g. *“Attention, possible break-in! Open window detected: Kitchen. The residents are being notified.”* A water sensor gives *“Attention, water alarm! …”*.
  - Partitions name the area: *“Attention, possible break-in in area Garage! …”*.
  - Optional **announcement during the entry delay**, which reminds you to disarm the alarm system.
  - Optional **announcement on household alerts**, e.g. a water sensor.
  - A **preview** shows all announcements with your own sensor names.
  - The text-to-speech service and speakers are only shown when announcements are switched on. When they are on, a service and at least one speaker are required.
  - During a silent alarm there is no announcement.

### Upgrade notes
- No breaking changes.
  - If you had a TTS service and speakers set up, announcements stay switched on.
  - Sensor types are suggested automatically. Check them in *Areas & sensors*.
- Automations that look for the old *“… triggered”* text in `cause` should use the new wording or `safe_home_triggered` instead.

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
