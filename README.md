<p align="center">
  <img
    src="https://github.com/digital7even/safe_home/blob/main/docs/logo.png" width="120" alt="Safe Home logo">
</p>

<h1 align="center">Safe Home</h1>
<p align="center"><b>The alarm system for Home Assistant – largely automatic.</b></p>

<p align="center">
  <img src="https://img.shields.io/badge/HACS-Custom-0b2463?style=for-the-badge" alt="HACS">
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.12%2B-0b2463?style=for-the-badge" alt="HA">
  <img src="https://img.shields.io/badge/Version-1.20.0-e8213b?style=for-the-badge" alt="Version">
</p>

<p align="center"><b>English</b> · <a href="README.de.md">Deutsch</a></p>

<p align="center"><img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/preview-custom-tablet.jpg" alt="Safe Home custom card" width="100%"></p>

> **Languages:** Safe Home is fully available in **English and German** – setup dialog, dashboard cards, card editor, sidebar page, log entries, notifications and voice announcements. The cards and the sidebar page follow the language of your Home Assistant user profile; log entries, notifications and announcements follow the system language (*Settings → System → General*). Every language other than German uses English.

---

📝 **What's new:** see the [release notes](CHANGELOG.md).

## Features

**Three modes**
| Mode | State | Monitors |
|---|---|---|
| 🏠 **Home** | Disarmed | nothing |
| 🛡️ **Away** | Armed | all selected sensors |
| 🌙 **Night** | Partially armed | only the sensors selected for night |

**Partitions**
- Up to **3 partitions** (e.g. garage, outbuilding, workshop) next to the main alarm system – each with its own name, sensors, delays, core hours and presence. See [Partitions](#partitions).

**Automation**
- **Arms automatically** as soon as all selected people have left the home zone (with an adjustable delay).
- **Disarms automatically** as soon as the first person comes home – even during the entry delay or a running alarm.
- **Night mode on a schedule** (e.g. 23:00–06:30) – depending on who is home.
- **Largely autonomous by time and location** – see [Day and night automation](#day-and-night-automation).
- Both automations can be switched on and off at any time from the dashboard.

**When an alarm is triggered**
- Turn on sirens / sounders (`siren`, `switch`, `input_boolean`, `script`) – **fine-grained**: only in certain modes, only within a time window and individually per sensor (see [Audible alarm](#audible-alarm))
- Turn alarm lights on in red (turned off again when disarming)
- Push notification to the Companion App – optionally as a **critical notification** (bypasses silent/focus modes), with a **camera snapshot** and the buttons **"Silence siren"** and optionally **"Disarm"** (requires unlocking the device)
- **Voice announcements** on speakers (TTS), switchable – matching the sensor type, e.g. *“Attention, possible break-in! Open window detected: Kitchen.”* (see [Sensor types & announcements](#sensor-types--announcements))
- **WhatsApp via TextMeBot** – built into the integration, naming the triggered sensor, with **escalation** to further recipients if the alarm is not disarmed, and an all-clear message
- Persistent notification in Home Assistant
- Event `safe_home_triggered` for your own automations

**Security & convenience**
- **Exit delay** and **entry delay**, separately for Away and Night – the exit delay can be skipped on every card with **"Arm now"**
- Only selected sensors (e.g. the front door) use the entry delay – all others trigger immediately
- **Open windows when arming**: bypass and report, or block arming. A bypassed sensor is monitored again automatically as soon as it has been closed.
- **Tamper / signal-loss detection**: notification when a sensor becomes unavailable while armed
- Optional **PIN code** (digits or text), notification on wrong PIN entry
- **Panic alarm** (hold the button in the card for 2 seconds, or use the `safe_home.panic` service)
- Protection against false alarms after restarts: only real changes from "closed" to "open" trigger
- State and log survive restarts
- Event log (last 30 entries)

---

## Installation

<p>
  <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=digital7even&amp;repository=safe_home&amp;category=integration"><img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Repository in Home Assistant öffnen" height="32"></a>
</p>

### Via HACS (recommended)
1. HACS → ⋮ → **Custom repositories** → `https://github.com/digital7even/safe_home`, category **Integration**.
2. Install **Safe Home** and restart Home Assistant.
3. **Settings → Devices & services → Add integration → Safe Home**.

### Manual
Copy the folder `custom_components/safe_home` to `config/custom_components/safe_home` and restart Home Assistant.

> The integration loads the dashboard cards automatically – you do **not** need to add a resource manually. After an update, clear the browser cache or reload the app if necessary.

---

## Safe Home page in the sidebar

After installation, **Safe Home** appears in the sidebar (administrators only). It offers a clearer way to configure everything than the setup dialog – in the same design as the cards.

| Overview | Sensors | Smartphone |
|---|---|---|
| <img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/panel-overview.jpg" width="320"> | <img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/panel-sensors.jpg" width="320"> | <img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/panel-mobile.jpg" width="150"> |

| Tab | Content |
|---|---|
| **Overview** | Key figures (monitored/open sensors, people at home, last alarm), recommendations for gaps in the configuration, and control of the alarm system |
| **Areas & sensors** | **Areas** (name of the alarm system, up to 3 **partitions**), **Monitored sensors** (type, area, *Away*/*Night*/*Delayed* per sensor, suggestions), **Delays** (exit/entry delay with live timeline), **Monitoring** (open/unavailable sensors, batteries) |
| **Alarm actions** | **Siren & lights** (sirens, alarm lights, siren rules, per-sensor siren, alarm and siren duration), **Notifications** (smartphones, critical, disarm button, camera), **Announcements**, **WhatsApp**, **Testing** incl. [triggering a real alarm from a sensor](#triggering-an-alarm-from-a-sensor) |
| **Automation** | **Presence detection**, **Weekly schedule**, **Night mode** and a summary of how Safe Home acts on its own |
| **Household** | Monitor household sensors, **Notify via** push / WhatsApp / announcement / all-clear, sensors with alert state |
| **Security** | **PIN entry** (PIN for arming/silencing, wrong-PIN notification, lock) and **Manage PINs** – personal PINs for every Home Assistant user and guest PINs with a validity period (see [PINs](#pins)) |
| **Log** | The last 30 events, filterable by alarms, mode changes and warnings |
| **Info** | **Android widget generator**, dashboard resource status, version, links, thank-you |

The sections in the tabs are **collapsed** and open with a tap on their heading – especially tidy on smartphones. Under *Info → Display* you can tick *Expand settings by default* (per browser/device).

Changes are only applied when you click **Save** (the bar at the bottom appears automatically). Before saving, Safe Home validates all inputs and highlights errors. If you have several instances, select the one you want in the top right.

### Android widget (Companion App)

Under **Info → Android widget**, Safe Home generates a ready-made **template widget** for the Android home screen in the style of the compact card: coloured state with icon, a hint line (e.g. the trigger or "until 16:45:30" during a delay) and the three modes with the active one highlighted. Optional: people at home, open sensors, dark blue background.

1. Tap **Copy template**.
2. Long-press the home screen → Widgets → Home Assistant → drag **Template** onto the home screen.
3. Paste the template and save.

The preview on the Safe Home page is rendered by your Home Assistant. The template widget can only show text with simple formatting; tapping it refreshes it. To switch modes, add button widgets with `alarm_control_panel.alarm_arm_away`, `alarm_arm_night` and `alarm_disarm`. Details: [Companion App Android widgets](https://companion.home-assistant.io/https://raw.githubusercontent.com/digital7even/safe_home/main/docs/integrations/android-widgets).

## Setup

The setup wizard guides you through five steps. Everything can be changed later on the **Safe Home sidebar page** or under **Safe Home → Configure**.

1. **Name & PIN** – optional PIN code, optionally also required for arming.
2. **Sensors** – sensors for *Away*, for *Night*, and which of them use the *entry delay*.
3. **Delays** – exit/entry delay, alarm duration, audible alarm duration, re-arming after the alarm.

**Two alarm durations:**

| Setting | Meaning |
|---|---|
| **Alarm duration** | How long the alarm stays active. Afterwards the system re-arms (if enabled), otherwise the alarm stays until disarmed. `0` = until disarmed. |
| **Audible alarm duration** | How long sirens and sounders go off. Afterwards the alarm stays active **silently** – notifications, WhatsApp and alarm lights keep running. `0` = for the whole alarm duration. |

Example: alarm duration 10 min, siren 3 min → 3 minutes of siren, 7 minutes of silent alarm, then armed again. Both values are set on the Safe Home page as hours/minutes/seconds, and the timeline shows both phases. Silencing manually only ends the siren – the alarm duration keeps running. Existing installations use their previous alarm duration as the siren duration as well.
4. **Actions** – sirens, alarm lights, smartphones with the Companion App (e.g. `mobile_app_my_phone`), cameras, voice output.
5. **Automation** – people for the home zone, auto arm/disarm, night mode schedule.

**Recommendation:** put the front door on the *entry delay*, but **not** the motion sensors – this way you can disarm when coming home, while intruders entering through a window trigger the alarm immediately.

---

## Weekly schedule

Under **Automation → Weekly schedule** you can draw a weekly calendar (Monday–Sunday): drag bars for **Away** (orange) or **Night** (purple); everything outside the bars is **disarmed**. Drag the edges to change times, drag a bar to move it, draw with *Disarmed* to erase. Grid: 15 minutes. *Copy Monday to Tue–Fri* and *Clear all* help with setup.

- The weekly schedule is **only active when "Presence detection" is switched off** in the automation – otherwise the section is greyed out with a note.
- At the start of a bar Safe Home arms (with the normal exit delay), at the end it disarms – but only if the weekly schedule armed it. Manually chosen modes and running alarms are left untouched.
- Bars that touch across midnight (e.g. Tue 22:00–24:00 and Wed 00:00–06:00) count as one period.
- While the weekly schedule is active, the **night mode schedule is paused** (greyed out under *Automation*, the card switch shows *Paused (weekly schedule)*) – so the two never overlap.

## Battery monitoring

Safe Home checks the batteries of all monitored sensors – main area and partitions. It finds the battery entity on the same device (`sensor` with device class *battery* in %, or a *battery low* binary sensor) or reads the `battery_level` attribute of the sensor itself.

- Below the threshold (default **20 %**, adjustable 5–90 %) the sensor appears as an amber chip in the cards' sensor section and on the *Areas & sensors → Batteries* section, an entry is written to the log and – if enabled – a push notification is sent.
- Each battery is reported **only once** (also across restarts) until it has been replaced; it counts as replaced 5 % above the threshold.
- Everything can be switched off: *Monitor sensor batteries* and *Push notification on low battery*.

## Day and night automation

Safe Home decides on its own which mode applies, based on the **time** and the **location of your people**. The Safe Home page shows the rules with your current times under **Automation → How Safe Home acts on its own**.

| Situation | Safe Home |
|---|---|
| Last person leaves the home zone | After the delay **Away** – also directly from night mode (e.g. in the morning after disarming). |
| First person comes home | **Away off**. During night time, **night mode** is re-activated after the configured delay (default 10 min). |
| **Night starts**, someone is home | **Night mode**. If Away was set by the automation, it switches to night mode. |
| **Night starts**, nobody home | **No night mode** – Away stays active or is switched on. |
| Someone comes home **at night** while the others sleep | Briefly disarmed (the front door does not trigger), then night mode again after the delay. |
| **Night ends**, someone home | Disarmed ("Good morning"). |
| **Night ends**, nobody there any more | Not disarmed but **Away** – the empty house stays protected. |

- Every step that reacts to people only applies with the **home-zone automation switched on** ("Presence detection" switch). Without it, Safe Home only follows the schedule and never disarms an empty house in the morning.
- **Away chosen by hand** is never overridden by the automation.
- **One switch per automation:** the home-zone automation and night mode are switched on and off only with their switch – "Presence detection" and "Night time" on the cards or at the top of the Automation tab (the same switch, takes effect immediately without saving). The tab otherwise only holds the details: people, delays, times and what the home-zone automation does (arm on leaving / disarm on arriving).
- New setting: **After coming home at night, back to night mode after … minutes** (0 = stays disarmed).

---

## Triggering an alarm from a sensor

To check that everything really works in an emergency, *Alarm actions → Testing* lets you trigger an alarm **from a configured sensor** – just as if it had reported:

1. Choose **Alarm system** (main area and partitions) or **Household**.
2. Select the sensor and press **Trigger alarm** – then confirm with a second click.
3. Sirens, alarm lights, announcement, push notifications (with camera snapshot) and WhatsApp run **exactly like a real alarm** – with the sensor's real wording, e.g. *“Window opened: Kitchen”*. The word “test” appears nowhere.
4. **Reset** stops everything and restores the previous state (e.g. disarmed or armed *Night*). WhatsApp recipients get the usual all-clear.

Disarming via a card also ends the alarm. When the alarm duration has elapsed, Safe Home resets automatically instead of re-arming. Let your housemates and WhatsApp recipients know before you trigger an alarm.

## Sensor types & announcements

For every sensor you can choose its **type** in the *Areas & sensors* tab (and for binary sensors in *Household*): **door contact, window contact, motion sensor, presence sensor, water sensor or camera**. Safe Home suggests the type from the sensor's device class – e.g. a contact reported as *opening* can be set to *Window contact*.

The type controls the wording of all messages:

| Type | Push / WhatsApp / log | Announcement |
|---|---|---|
| Door contact | Door opened: Front door | Attention, possible break-in! Open door detected: Front door. |
| Window contact | Window opened: Kitchen | Attention, possible break-in! Open window detected: Kitchen. |
| Motion sensor | Motion detected: Hallway | Attention, possible break-in! Motion detected: Hallway. |
| Presence sensor | Presence detected: Living room | Attention, possible break-in! Person detected: Living room. |
| Camera | Camera detected motion: Driveway | Attention, possible break-in! Motion detected on camera: Driveway. |
| Water sensor | Water detected: Basement | Attention, water alarm! Water detected: Basement. |

Every alarm announcement ends with *“The residents are being notified.”* In partitions it says *“…possible break-in in area Garage!”*.

**Announcements** (*Alarm actions → Announcements*) are switched on and off with their own checkbox. When on, choose the TTS service and the speakers, plus:
- **Announcement during the entry delay** – *“Please disarm the alarm system within 30 seconds.”* It **loops** with the remaining time (*“… 20 seconds left.”*) until you disarm or the alarm starts – every 10 s by default, adjustable under *Repeat the reminder every … seconds* (0 = only once).

**Entry delay in short:** only sensors marked *Delayed* (e.g. the front door) start the countdown. Closing the door again does **not** stop it – only disarming does. If a sensor **without** delay reports during the countdown (e.g. motion in the living room), the alarm starts **immediately**.
- **Announcement on household alerts** – e.g. *“Attention, water alarm! Water detected: Washing machine. Please check immediately.”*

**Alexa devices (Alexa Media Player):** Echo devices are kept separate from the speakers. Tick *Use Alexa devices* (off by default) to select them – they then speak with the **normal Alexa voice** via `notify.alexa_media` (`type: tts`), no TTS service needed. Speakers and Alexa devices can be combined. If an Echo is selected under *Speakers* by mistake, Safe Home shows a hint – it still speaks with the Alexa voice. Requires the [Alexa Media Player](https://github.com/alandtse/alexa_media_player) integration.

A preview shows what the announcements will sound like with your own sensor names. By default the announcement also runs during a **silent alarm** (siren off, e.g. outside the siren time window) – switch off *Announcement during a silent alarm too* to keep a silent alarm completely silent. If an announcement is skipped or Alexa reports an error, the log says why. Existing installations with a TTS service and speakers keep their announcements switched on.

## Partitions

Besides the **main area** – the alarm system with Home, Away and Night – you can create up to **3 partitions** in the *Areas & sensors* tab, e.g. *Garage*, *Outbuilding* or *Workshop*. The main area is not a partition; it always exists.

| Setting | Description |
|---|---|
| **Name** | Shown on the cards and named in every alarm (push, WhatsApp, announcement, log) |
| **Sensors** | In the sensor table choose the **area** per sensor. Each sensor belongs to exactly one area. Partition sensors have no modes – they are monitored whenever the partition is armed |
| **Exit / entry delay** | Own delays per partition; *Entry delay* per sensor |
| **Siren** | *Like main area* (the sirens under *Alarm actions*), *Own sirens* (e.g. only the outdoor siren at the garage) or *No siren* (silent alarm – notifications, lights and announcement still run) |
| **Core hours** | Armed at the start time on the selected weekdays, disarmed at the end time (e.g. 18:30–06:00, Mon–Fri) |
| **Own presence** | Armed when all selected people have left, disarmed as soon as one of them returns – independent of the main area |

A partition only knows **Armed** and **Disarmed**. Each one gets its own entity `alarm_control_panel.<partition name>` (arm with `alarm_arm_away`, disarm with `alarm_disarm`, same PIN as the main area).

**Alarms** use the same outputs as the main area: sirens (the rules from *Audible alarm* apply, except the mode selection), alarm lights, push notifications with a disarm button, announcement and WhatsApp – always with the partition name, e.g. *“🚨 ALARM – Garage”*. The sirens only stop once no area needs them any more.

**On the cards**
- **Compact:** up to 3 dots in the top right – one per partition, coloured by state (green disarmed, blue armed, amber delay, red alarm). Tap them to unfold the controls.
- **Standard:** partitions are listed directly below the mode buttons.
- **Tablet & Custom:** selectable in the card editor – `zones_display: inline` (list in the card) or `zones_display: dots`. In the Custom card the list is its own widget *Partitions* that can be moved and resized.
- A partition alarm appears as a red banner with a disarm button in every variant.

## Household (e.g. water sensors)

In the **Household** tab of the Safe Home page you can add sensors that are monitored **independently of the alarm system** – also in Home mode. They do not trigger an intrusion alarm or the siren but alert via **push** and/or **WhatsApp**.

- **Monitor household** switches the module on (default: off).
- For each sensor you choose **"Alert on"** – e.g. *Wet* for a water sensor or *Dry* for a plant moisture sensor. Other entities work too (e.g. `sensor.dryer_status` = `finished`).
- **Suggestions:** all water sensors (`device_class: moisture`) with one click.
- Optional **all-clear** ("Washing machine is dry again").
- Under **Alarm actions** you choose whether household alerts are sent as **push** (critical if enabled) and/or **WhatsApp** (to recipients set to "immediately").
- Alerting sensors appear on the cards in the *Sensors* area (💧) and in the log; automations can use the attribute `household_alerts`.

---

## Audible alarm

On the **Safe Home page → Alarm actions → Audible alarm** you choose when sirens and sounders go off. A summary line at the top shows the current setup, e.g. "Siren sounds: Away + Night · from 22:00 to 06:00 – 4 of 5 sensors trigger the siren".

| Setting | Meaning |
|---|---|
| **Siren sounds in mode** | Checkboxes for *Away* and *Night* (default: both). |
| **Only within a time window** | From–to, can span midnight (e.g. 22:00–06:00). Default: around the clock. |
| **Siren per sensor** | List of all monitored sensors with a *Siren / Silent* switch plus *All on* / *All silent*. New sensors trigger the siren automatically. |

If a rule applies, the result is a **silent alarm**: the alarm is triggered and notifications, WhatsApp and alarm lights run as usual – only the siren stays off. The announcement still runs unless *Announcement during a silent alarm too* is switched off. The log states the reason (e.g. "Silent alarm – siren stays off: Hallway motion does not trigger the audible alarm") and the cards show "Silent alarm".

- If **another sensor** that is allowed to sound the siren triggers during a silent alarm, the siren starts then – unless it was silenced manually.
- **Panic alarm** and **manual triggering** always sound – they are deliberate emergency calls.
- New attributes for your own automations: `silent_alarm` (true/false) and `silent_reason`.

```yaml
# stored in the instance options
siren_modes: [away, night]
siren_time_enabled: true
siren_time_start: "22:00:00"
siren_time_end: "06:00:00"
siren_excluded_sensors: [binary_sensor.hallway_motion]
```

---

## WhatsApp notifications (TextMeBot)

Safe Home sends alarms directly via WhatsApp – no automation and no `rest_command` needed. Configure it on the **Safe Home page → Alarm actions → WhatsApp via TextMeBot**.

> **Important:** [TextMeBot](https://textmebot.com) is a **paid service from a third party** (not from Safe Home, Home Assistant or WhatsApp) – sending usually requires a paid subscription; prices and terms are on the TextMeBot website. There is no delivery guarantee, so use WhatsApp only in addition to push notifications and sirens. Phone numbers and message texts are transmitted to TextMeBot. The settings page shows these notes in the expandable box *Important notes on WhatsApp notifications*.

| Setting | Meaning |
|---|---|
| **Recipients** | Name, WhatsApp number (international, e.g. `+447700900123`, or a group ID) and the **TextMeBot API key**. Up to 10 recipients. Each one has an **Active** checkbox – e.g. to notify only one person for a while. |
| **Send: immediately / after X min** | *Immediately* = when the alarm starts. With a delay = **escalation**: only if the alarm has not been disarmed by then. The message then starts with "⏰ Reminder: the alarm has not been reset for X minutes." |
| **Alarm message** | Empty = default text. Placeholders: `{sensor}` triggered sensors, `{date}`, `{time}`, `{mode}`, `{name}` |
| **All-clear** | Everyone who received an alarm message gets "✅ All clear …" when the system is disarmed. |
| **Other messages** | Optionally also mode changes, tamper and wrong PIN – only to recipients set to "immediately". |

Default text (English system language):
```
🚨 ALARM TRIGGERED! 🚨
Triggered by: Balcony door
Time: 2026-11-04 at 15:40
Mode: Away
Please check immediately!
```

- **Example data** is pre-filled (`+491701234567` / `BeispielKey123`, `+491769876543` / `BeispielKey456`, second recipient after 5 minutes). Nothing is ever sent to example data – the page points this out.
- **Test → WhatsApp** sends a test message to all recipients.
- There are a few seconds between two messages so TextMeBot does not drop any. Send errors are written to the log and never interfere with the alarm.
- You get the API key at [textmebot.com](https://textmebot.com/send-text-messages/). Messages are sent from the WhatsApp account linked to the key.

**Prefer an automation?** An automation for Safe Home (including the `rest_command`) is available in [`https://raw.githubusercontent.com/digital7even/safe_home/main/docs/automation-whatsapp.yaml`](https://raw.githubusercontent.com/digital7even/safe_home/main/docs/automation-whatsapp.yaml). It uses the new attribute `triggered_sensors` (the sensors that actually triggered) and checks "not disarmed" after 5 minutes, because Safe Home re-arms itself after the alarm duration. Use only one of the two variants, otherwise messages arrive twice.

---

## Dashboard cards

There are four variants. All of them appear in the dashboard under **Add card** and are loaded automatically.

| Standard | Compact | Tablet |
|---|---|---|
| <img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/preview-standard.jpg" width="260"> | <img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/preview-compact.jpg" width="260"> | <img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/preview-tablet.jpg" width="260"> |
| All information stacked | Status and modes only | All information, wide and responsive |

### Standard
```yaml
type: custom:safe-home-card
entity: alarm_control_panel.safe_home
```

### Compact – for small dashboards
Shows only the current status (with a countdown bar during delays) and the Home, Away and Night buttons. During an alarm, an additional button to silence the siren appears.
```yaml
type: custom:safe-home-compact-card
entity: alarm_control_panel.safe_home
```

### Tablet – for wall-mounted tablets
Contains all information of the standard layout and arranges it according to the available width:
- narrow: one column
- from approx. 680 px: status & modes on the left, automation & sensors on the right, log below
- from approx. 1060 px: three columns side by side

Large buttons and a large keypad make it easy to use with your fingers.
```yaml
type: custom:safe-home-tablet-card
entity: alarm_control_panel.safe_home
```
Tip: the card makes the best use of space in a **Panel** view or a full-width **Sections** view.

### Square – 1:1 for small control displays

`custom:safe-home-square-card` (*Safe Home – Square*) is a square card for small wall displays: status with countdown, the three modes **Home / Away / Night** with PIN keypad, and a large **round panic button** (SOS – hold for 2 s; a ring fills up while holding). Nothing else. All sizes scale with the card.

The middle area can show up to three elements, each optional: the **current status** (large mode icon), the **people** (avatars, coloured when at home) and the **panic button**. They appear either **side by side in one view** or as **pages to swipe left/right** (with dots to tap).

```yaml
type: custom:safe-home-square-card
entity: alarm_control_panel.safe_home
show_panic: true        # round SOS button
square_status: false    # current mode, large
square_persons: false   # people at home / away
square_view: all        # all = one view, swipe = swipe left/right
```

### Badge – small and transparent

`custom:safe-home-badge-card` (in the card picker as **Safe Home – Badge**) shows the white Safe Home logo and the current status in its colour – on a **transparent background**, so it fits any dashboard. Optionally the partitions appear as small coloured dots (with names if you like). A tap opens the alarm system's details. The same element can also be added as a real Home Assistant **badge** at the top of a dashboard: `type: custom:safe-home-badge`.

```yaml
type: custom:safe-home-badge-card
entity: alarm_control_panel.safe_home
show_zones: true      # partitions as dots
zone_names: false     # names next to the dots
show_name: false      # name of the alarm system below the status
red_logo: false       # red logo instead of the white one (for light backgrounds)
```

### Custom – full screen for smartphone & tablet
The most extensive card: everything from the standard layout plus additional modules. Each module can be switched on and off in the card editor and has its own expandable section.

| Smartphone | Tablet |
|---|---|
| <img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/preview-custom-phone.jpg" width="240"> | <img src="https://raw.githubusercontent.com/digital7even/safe_home/main/docs/preview-custom-tablet.jpg" width="520"> |

| Module | What it shows |
|---|---|
| **Clock & greeting** | Large clock, "Good morning/afternoon/evening" and the date in the header |
| **People** | Large profile pictures with status *Home*, *Away* or the zone name (e.g. *Work*) and since when |
| **Weather** | Your `weather.*` entity with temperature, condition, humidity, wind, pressure and forecast (2–8 entries) |
| **Room climate** | Selected thermometers and humidity sensors. Values from the same device are combined into one tile named after the room. Coloured border: cold (< 18 °C), comfortable, warm (> 24 °C); humidity below 35 % or above 65 % is highlighted |
| **Covers** | Up / stop / down per cover, position as a bar, grouped by room, controllable per room and all at once |
| **Lights** | Lights and switches as tiles to tap, with brightness and "All off" |
| **Scenes & scripts** | One tap starts the scene or script |
| **Cameras** | Live snapshots, refreshed automatically (adjustable interval) |
| **Fuel prices** | Up to 4 petrol station price sensors (e.g. from Tankerkönig) with name, address, fuel type (Super / Super E10 / Diesel) and the price with a superscript last digit. The cheapest open station per fuel type is highlighted in green, closed stations are greyed out; optionally sorted by price |
| **Custom widgets 1–4** | Up to four dashboard cards of your choice as YAML code – including HACS cards (`custom:…`). With a title they appear in the Safe Home frame, without a title in their own card frame |
| **Alarm system** | Automation switches, open sensors, log, panic button |

Tapping people, weather, thermometers, cover names, petrol stations or cameras opens the Home Assistant details dialog.

**Custom widgets:** In the editor, under *Custom widget 1–4*, turn on the switch and paste the code of the card you want into the field *Card code (YAML)*. You can get the code of an existing card in the card editor via ⋮ → *Show code editor*. Example:

```yaml
type: entities
entities:
  - sensor.power_consumption
  - sensor.pv_power
```

The cards are created with Home Assistant's own card mechanism and their colours are adapted to Safe Home. If a HACS card loads later, it appears automatically as soon as it is ready. If `type:` is missing, the widget shows a hint.

**Fuel prices:** The Tankerkönig integration (built into Home Assistant, German petrol stations) creates one sensor per station and fuel type, e.g. `sensor.aral_main_street_super_e10`. Safe Home reads the name, address and fuel type from its attributes, and the *open/closed* status from the status sensor of the same station. Other price sensors work as well; the fuel type is then detected from the name.

**Arranging widgets:**
- **In the card editor** there is an **Arrangement** section: the three columns are shown side by side, and widgets can be dragged between the columns or moved with the arrow buttons. Hidden widgets are marked and keep their place. *Default arrangement* resets it. Apply with *Save* as usual.
- **Directly on the dashboard** (edit dashboard): every widget gets a handle bar; the new arrangement is saved to the dashboard configuration immediately – even if the card is inside a stack or section. For dashboards in YAML mode, please use the card editor.
- On smartphones the columns are shown one below the other: first column 1, then 2, then 3.

**Widget size:** Every widget has four sizes – *Extra small* (72 %), *Small* (86 %), *Normal* and *Large* (115 %). The entire content is scaled proportionally; tiles, camera images and lists rearrange automatically (e.g. more tiles per row when the widget is smaller), so everything stays responsive.
- **In the card editor:** in the *Arrangement* section with − and + on each widget.
- **Directly on the dashboard** (edit dashboard): − and + next to the handle bar of each widget; the size is saved automatically.

**Device:** *Auto* adapts to the width (one, two or three columns). *Smartphone* forces one column, *Tablet* uses larger buttons and up to three columns.
**Full screen:** fills the entire screen including spacing for the notch/home bar – best used in a **Panel** view.

```yaml
type: custom:safe-home-custom-card
entity: alarm_control_panel.safe_home
device: auto            # auto | phone | tablet
fullscreen: true
accent: auto            # auto | blue | indigo | cyan | emerald | amber | red
show_clock: true
show_people: true
people: []              # empty = people from the alarm system
show_weather: true
weather_entity: weather.forecast_home
weather_name: Berlin    # optional
show_forecast: true
forecast_days: 5
show_climate: true
climate_entities:
  - sensor.living_room_temperature
  - sensor.living_room_humidity
show_covers: true
cover_entities:
  - cover.living_room
  - cover.bedroom
covers_group_by_area: true
show_cover_all: true
covers_design: animated     # classic (bar) | animated (shutter showing 0–100 %)
show_lights: true
light_entities:
  - light.living_room
show_scenes: true
scene_entities:
  - scene.movie_night
show_cameras: true
camera_entities:
  - camera.driveway
camera_refresh: 10      # seconds
show_fuel: true
fuel_title: Fuel        # optional, default "Fuel prices"
fuel_entities:          # at most 4
  - sensor.aral_main_street_super_e10
  - sensor.shell_garden_road_super
fuel_sort: false        # true = cheapest first
show_custom_1: true     # custom widgets 1–4 (show_custom_N, custom_N_title, custom_N_card)
custom_1_title: Energy  # optional
custom_1_card:
  type: entities
  entities:
    - sensor.power_consumption
widget_sizes:           # xs | s | m (default) | l – set via − / +
  cameras: s
  covers: xs
layout_order:           # set automatically via drag & drop
  a: [alarm, people, automation, panic]
  b: [weather, climate, fuel, cameras, custom1, custom3]
  c: [covers, lights, scenes, sensors, events, custom2, custom4]
```

**Cover style:** in the card editor (*Covers*) choose between **Classic (bar)** and **Animated shutter** – a small window whose shutter shows the exact position from 0 to 100 % and rolls while moving. The card does not get bigger.

### Custom background colour (all variants)
In the card editor under **Background colour**, three sliders (**red, green, blue**) set the base colour of the card – with a live preview. Surfaces, lines, text and accent colour are derived automatically. Very light colours are darkened to keep the text readable; *Default dark blue* resets it. The colour effects of the modes (green, blue, purple, yellow, red) are preserved; red tones are never used as the accent colour (amber is used instead), so nothing can be mistaken for an alarm.

```yaml
background_color: [20, 110, 70]   # red, green, blue (0–255)
accent: auto                      # custom card: auto = matches the background colour
```

### Options (all variants)
```yaml
title: My Home          # optional
layout: standard        # standard | compact | tablet | custom (overrides the variant)
show_automation: true   # home-zone & night automation, people
show_sensors: true      # open / bypassed sensors
show_events: true       # log
events_count: 5         # tablet: default 8
show_panic: true        # panic button (hold for 2 s)
zones_display: inline   # tablet & custom: partitions as list (inline), dots (dots) or hidden (hidden – only the alarm banner remains)
```

If a PIN is set, a keypad opens. Colours can be customised via CSS variables, e.g. `--sh-bg1`, `--sh-bg2`, `--sh-accent` (for example with card-mod).

---

## Home Assistant theme (Beta)

Under **Info → Display**, **Use Home Assistant theme** <sup>(Beta)</sup> switches between the Safe Home look and the theme of your Home Assistant. After saving, the option applies to the Safe Home page **and all Safe Home cards**, on all devices.

- Colours, backgrounds, card borders and text then come from your active HA theme (light or dark). This helps with display problems, e.g. with custom themes or older browsers.
- The state colours (green = Home, amber = Away, purple = Night, red = Alarm) stay, so the state is visible at a glance.
- On a light background the red logo is used automatically; the badge also switches to the red logo in a light theme.
- The custom background colour from the card editor is ignored in this mode.

### "Safe Home" theme for all of Home Assistant
Safe Home also ships its own Home Assistant theme, based on the app's colours (dark blue, blue accent, state colours). It is added to the themes automatically at startup – no YAML file needed.

1. Tap your **user name** (profile) at the bottom left.
2. Under **Theme**, choose **Safe Home**.
3. Under **Mode**, choose *Auto*, *Light* or *Dark* – the theme has a light and a dark mode.

The theme stays available after *Developer tools → YAML → Reload themes*. It can also be selected as the theme of individual dashboards.

## PINs

Under **Security → Manage PINs** each Home Assistant user gets their **own PIN**, and you can create **guest PINs** – e.g. for tradespeople, babysitters or holiday guests:

| | |
|---|---|
| **User PINs** | One PIN per Home Assistant user. 🎲 generates a random 6-digit PIN, 👁 shows it. |
| **Guest PINs** | Name, PIN, **valid from** and **valid until** (date and time, both optional) – so access can be planned ahead. Each guest PIN can be deactivated with a checkbox. The status shows *Active*, *Scheduled*, *Expired*, *Deactivated* or *Unlimited*. |

- Personal and guest PINs **replace the previous general PIN**. When updating, an existing general PIN is shown as the entry *Previous PIN* so nobody is locked out.
- Every valid PIN can operate the alarm system (main area and partitions). The log and notifications show whose PIN was used, e.g. *“Home – disarmed (Manual (Grandma))”*.
- A scheduled or expired guest PIN is rejected; the log says why (e.g. *“PIN of Tradesperson is only valid from 10.01.2030 08:00”*).
- PINs must be at least 4 characters long and unique.
- **PIN function on/off:** a master switch under *Security → PIN entry*. Off = the alarm system can be operated without a PIN everywhere.
- **Per area:** under *Require PIN for* tick the main area and each partition separately. An area without a tick – or without any PIN assigned to it – can be operated without a PIN.
- **Per PIN:** *May operate* chooses the areas a user or guest PIN is valid for (e.g. the tradesperson only *Garage*). A PIN used for another area is rejected; the log says why.
- **Silencing the siren needs the PIN** too (option *Also require the PIN to silence the siren*, on by default) – so an intruder at the wall tablet cannot switch it off. Automations and scripts calling `safe_home.silence` don't need a PIN.
- **Lock after wrong PINs:** after 5 wrong entries in a row (adjustable, 0 = never) PIN entry is locked for 5 minutes (adjustable) – even the correct PIN is rejected. You immediately get a critical push *“Several wrong PINs”*, and the keypad shows how long the lock lasts. The lock survives a restart.

## Troubleshooting

**"Custom element doesn't exist: safe-home-…":** Home Assistant and some add-on cards load the *scoped-custom-element-registry* polyfill, which replaces the registry of card elements during startup. Safe Home therefore always registers its cards in the currently active registry and detects a later replacement automatically – Home Assistant then rebuilds the affected cards by itself. If the message still appears, please open an issue with the build ID from the card editor and a screenshot of the browser console (F12).

**"Configuration error" after starting the Companion App / cards missing:** Safe Home delivers its cards like a HACS card: the card file is stored in `config/www/safe_home/` and registered as a **dashboard resource** (*Settings → Dashboards → ⋮ → Resources*, entry `/local/safe_home/safe-home-card.js`). Home Assistant serves the `www` folder from the very first moment of startup – so the card is reachable regardless of when the integration is loaded. The file and URL are updated automatically with every update.

If the `www` folder did not exist before, Safe Home creates it – in that case, **restart Home Assistant one more time**. The status is shown on the Safe Home page under **Info → Dashboard resource**; **"Register now"** registers the resource again immediately.

**Dashboards/resources in YAML mode:** Here the resource cannot be registered automatically. Please add it yourself:
```yaml
lovelace:
  resources:
    - url: /local/safe_home/safe-home-card.js
      type: module
```

**Device keeps jumping to the login page:** If the log repeatedly shows `…/auth/authorize?…` for a device (e.g. in the *Current page* sensor of Fully Kiosk), the device loses its login and reloads the frontend over and over. Set the start URL to the dashboard (not the login page), allow web storage, and disable clearing cache/cookies/web storage on reload.

## Entities

| Entity | Description |
|---|---|
| `alarm_control_panel.safe_home` | The alarm system (Home / Away / Night) |
| `alarm_control_panel.<partition>` | One per partition (Armed / Disarmed) |
| `switch.safe_home_presence_automation` | Home-zone automation on/off |
| `switch.safe_home_night_automation` | Night mode schedule on/off |
| `binary_sensor.safe_home_open_sensors` | On when a monitored sensor is open |
| `binary_sensor.safe_home_siren_active` | On while the siren is running |
| `sensor.safe_home_last_event` | Last log entry |
| `sensor.safe_home_last_alarm` | Time of the last alarm |
| `sensor.safe_home_people_home` | Number of people at home |

*(The exact entity IDs depend on the instance name and the language of your Home Assistant installation.)*

## Services

| Service | Description |
|---|---|
| `alarm_control_panel.alarm_disarm / alarm_arm_away / alarm_arm_night` | Standard Home Assistant services |
| `safe_home.panic` | Immediate alarm |
| `safe_home.silence` | Sirens off, the alarm stays active (optional `code` – required when operated from the dashboard) |
| `safe_home.skip_exit_delay` | Skip the running exit delay – arm immediately (also for partitions) |
| `safe_home.set_auto_mode` | Switch the automations (`enabled`, optionally `night`) |

## Events for your own automations

- `safe_home_triggered` – `cause`, `mode`, `name` (partitions: `mode: zone`, plus `zone` and `zone_id`)
- `safe_home_state_changed` – `state`, `mode`, `changed_by`

```yaml
# Example: open all covers on the ground floor when the alarm is triggered
trigger:
  - platform: event
    event_type: safe_home_triggered
action:
  - service: cover.open_cover
    target:
      area_id: ground_floor
```

---

## Disclaimer

Safe Home is a software alarm system based on Home Assistant. It does not replace a certified intruder alarm system with backup power and connection to a monitoring service. For maximum reliability, a UPS for the Home Assistant server and the wireless gateway is recommended.

---

<p align="center">
  This project was made with ❤️ in Germany.<br>
  Thank you for using <b>Safe Home</b>!<br><br>
  <a href="https://github.com/digital7even"><b>Digital7even</b></a>
</p>
