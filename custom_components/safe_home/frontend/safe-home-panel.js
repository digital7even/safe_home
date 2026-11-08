/*!
 * Safe Home – Einstellungsseite in der Seitenleiste
 * Mit ❤️ entwickelt in Deutschland von Digital7even
 * https://github.com/digital7even
 */
const PANEL_VERSION = "1.20.0";
const P_LOGO = new URL("./logo-white.png", import.meta.url).href;
const P_LOGO_COLOR = new URL("./logo.png", import.meta.url).href;

// ------------------------------------------------------------------ Sprache (Deutsch / Englisch)
let P_LANG = (() => {
  try {
    return String(document.documentElement.lang || navigator.language || "en").toLowerCase().startsWith("de") ? "de" : "en";
  } catch (e) {
    return "en";
  }
})();
let P_LOCALE = P_LANG === "de" ? "de-DE" : "en-GB";
function pSetLang(hass) {
  const l = String(hass?.locale?.language || hass?.language || "").toLowerCase();
  if (!l) return false;
  const next = l.startsWith("de") ? "de" : "en";
  P_LOCALE = l.startsWith("de") ? "de-DE" : l.startsWith("en") && l.includes("-") ? l : "en-GB";
  if (next === P_LANG) return false;
  P_LANG = next;
  return true;
}
const PANEL_EN = {
  "Tipp: Unter Profil → Design kannst du außerdem das Design „Safe Home“ (hell und dunkel) für ganz Home Assistant auswählen.": "Tip: under Profile → Theme you can also select the \"Safe Home\" theme (light and dark) for all of Home Assistant.",
  "Home-Assistant-Design verwenden": "Use Home Assistant theme",
  "(Beta)": "(Beta)",
  "Seite und alle Safe-Home-Karten übernehmen die Farben deines Home-Assistant-Designs statt des eigenen Safe-Home-Looks – hilfreich bei Darstellungsproblemen. Gilt für alle Geräte, nach dem Speichern.": "This page and all Safe Home cards use the colours of your Home Assistant theme instead of the Safe Home look – helpful if something doesn't display properly. Applies to all devices after saving.",
  "PIN-Funktion": "PIN function",
  "Eingeschaltet": "Switched on",
  "Ausgeschaltet – die Alarmanlage lässt sich ohne PIN bedienen.": "Switched off – the alarm system can be operated without a PIN.",
  "PIN verlangen für": "Require PIN for",
  "ohne PIN": "no PIN",
  "PIN nötig": "PIN required",
  "kein PIN zugeordnet – ohne PIN bedienbar": "no PIN assigned – can be operated without a PIN",
  "Darf schalten": "May operate",
  "Je PIN wählst du, welche Bereiche damit geschaltet werden dürfen. Protokoll und Benachrichtigungen nennen, wessen PIN verwendet wurde.": "For each PIN you choose which areas it may operate. The log and notifications show whose PIN was used.",
  "Hauptbereich = Alarmanlage mit Zuhause, Unterwegs und Nacht. Dazu bis zu 3 Teilbereiche, z. B. Garage.": "Main area = alarm system with Home, Away and Night. Plus up to 3 partitions, e.g. garage.",
  "Zuhause, Unterwegs, Nacht": "Home, Away, Night",
  "Je Sensor: Art, Bereich und in welchem Modus er überwacht wird.": "Per sensor: type, area and in which mode it is monitored.",
  "Überwachung": "Monitoring",
  "Offene und nicht erreichbare Sensoren, Batterien.": "Open and unavailable sensors, batteries.",
  "Zeit zum Verlassen und zum Entschärfen beim Heimkommen – in Sekunden.": "Time to leave and to disarm when coming home – in seconds.",
  "Ausgegraut, solange „Anwesenheit“ eingeschaltet ist.": "Greyed out while “Presence detection” is switched on.",
  "Solange der Wochenplan aktiv ist, pausiert der Nachtmodus-Zeitplan.": "While the weekly schedule is active, the night mode schedule is paused.",
  "Sirene & Licht": "Siren & lights",
  "Was vor Ort passiert – und wann die Sirene ertönt.": "What happens on site – and when the siren sounds.",
  "Dauer": "Duration",
  "Benachrichtigungen": "Notifications",
  "Push-Nachricht auf deine Smartphones.": "Push notification to your smartphones.",
  "Ansagen über Lautsprecher und Alexa – passend zum Melder.": "Announcements via speakers and Alexa – matching the sensor.",
  "Alarm per WhatsApp. Empfänger mit Wartezeit nur, wenn der Alarm dann noch läuft.": "Alarm via WhatsApp. Recipients with a delay only if the alarm is still running then.",
  "Ausgänge prüfen – mit den gespeicherten Einstellungen.": "Check the outputs – with the saved settings.",
  "Automatisch scharf und unscharf nach Standort deiner Personen.": "Arm and disarm automatically based on where your people are.",
  "Feste Scharf-Zeiten je Wochentag – nur ohne „Anwesenheit“.": "Fixed armed times per weekday – only without “Presence detection”.",
  "Nachts nur die Nachtsensoren überwachen.": "At night, monitor only the night sensors.",
  "Pausiert – der Wochenplan legt fest, wann „Nacht“ scharf ist.": "Paused – the weekly schedule decides when “Night” is armed.",
  "Zusammenfassung deiner Einstellungen.": "Summary of your settings.",
  "Wasser- und andere Sensoren – unabhängig von der Alarmanlage, ohne Sirene.": "Water and other sensors – independent of the alarm system, no siren.",
  "Melden per": "Notify via",
  "Je Sensor: bei welchem Zustand gemeldet wird.": "Per sensor: which state triggers a notification.",
  "PIN-Eingabe": "PIN entry",
  "Wann ein PIN nötig ist und was bei falschen PINs passiert.": "When a PIN is needed and what happens on wrong PINs.",
  "Ein PIN je Benutzer, dazu Gast-PINs mit Zeitraum.": "One PIN per user, plus guest PINs with a time period.",
  "Batterien überwachen": "Monitor batteries",
  "Push-Benachrichtigung": "Push notification",
  "PIN zum Stummschalten der Sirene": "PIN to silence the siren",
  "PIN zum Scharfschalten": "PIN to arm",
  "Bei falschem PIN benachrichtigen": "Notify on wrong PIN",
  "Melden, wenn ein Sensor nicht mehr erreichbar ist": "Notify when a sensor becomes unavailable",
  "Verlassen – Unterwegs": "Leaving – Away",
  "Heimkommen – Unterwegs": "Coming home – Away",
  "Verlassen – Nacht": "Leaving – Night",
  "Heimkommen – Nacht": "Coming home – Night",
  "Sirenendauer": "Siren duration",
  "Danach wieder scharf schalten": "Re-arm afterwards",
  "Sirenen": "Sirens",
  "Alarmlicht (leuchtet rot)": "Alarm lights (light up red)",
  "Auch beim Scharf- und Unscharfschalten": "Also when arming and disarming",
  "Kritisch – klingelt auch bei Lautlos": "Critical – rings even when silent",
  "Taste „Entschärfen“ in der Nachricht": "“Disarm” button in the notification",
  "Kamerabild mitsenden": "Attach camera snapshot",
  "Hinweis in der Eingangsverzögerung": "Reminder during the entry delay",
  "Hinweis wiederholen alle": "Repeat reminder every",
  "Auch bei stillem Alarm": "Also during a silent alarm",
  "Sprachansage": "Announcement",
  "Alexa-Geräte verwenden": "Use Alexa devices",
  "Sprachausgabe (TTS)": "Text-to-speech (TTS)",
  "Lautsprecher": "Speakers",
  "Personen": "People",
  "Automatisch scharf, wenn alle weg sind": "Arm automatically when everyone has left",
  "Wartezeit vor dem Scharfschalten": "Wait before arming",
  "Automatisch unscharf, wenn jemand heimkommt": "Disarm automatically when someone comes home",
  "Beginn": "Start",
  "Ende": "End",
  "Nur wenn jemand zuhause ist (sonst Unterwegs)": "Only when someone is home (otherwise Away)",
  "Nach nächtlicher Heimkehr wieder „Nacht“ nach": "After coming home at night, back to “Night” after",
  "Sirene im Modus": "Siren in mode",
  "WhatsApp bei Alarm": "WhatsApp on alarm",
  "Entwarnung senden (z. B. wieder trocken)": "Send all-clear (e.g. dry again)",
  "Eigener Nachrichtentext (leer = Standard)": "Own message text (empty = default)",
  "Entwarnung beim Ausschalten": "All-clear when disarming",
  "Auch Schaltungen, Sabotage und falsche PINs": "Also arming changes, tampering and wrong PINs",
  "Je Batterie nur eine Meldung – bis sie gewechselt ist.": "Only one notification per battery – until it is replaced.",
  "Automationen dürfen weiterhin ohne PIN stummschalten.": "Automations can still silence without a PIN.",
  "Danach gesperrt, du bekommst sofort eine Push-Nachricht. 0 = nie.": "Locked afterwards, you get a push notification immediately. 0 = never.",
  "Mit Restzeit, bis entschärft ist. 0 = nur einmal.": "With the remaining time until disarmed. 0 = only once.",
  "Z. B. Sonos oder Google. Echo-Geräte unter „Alexa-Geräte“.": "E.g. Sonos or Google. Echo devices under “Alexa devices”.",
  "Sprechen mit der Alexa-Stimme.": "Speak with the Alexa voice.",
  "Wie lange der Alarm aktiv bleibt. 0 = bis zum Ausschalten.": "How long the alarm stays active. 0 = until disarmed.",
  "Danach läuft der Alarm still weiter. 0 = ganze Alarmdauer.": "After that the alarm continues silently. 0 = entire alarm duration.",
  "Nur bei entsperrtem Handy.": "Only with an unlocked phone.",
  "Schützt vor kurzen GPS-Aussetzern.": "Protects against short GPS dropouts.",
  "0 = bleibt unscharf.": "0 = stays disarmed.",
  "Sonst stiller Alarm – alles außer der Sirene läuft.": "Otherwise silent alarm – everything except the siren runs.",
  "Wenn die Sirene stumm bleibt (z. B. außerhalb des Zeitfensters).": "When the siren stays silent (e.g. outside the time window).",
  "Z. B. 22:00 bis 06:00.": "E.g. 22:00 to 06:00.",
  "An Empfänger mit „sofort“.": "To recipients set to “immediately”.",
  "An die Smartphones unter „Alarm-Aktionen“.": "To the smartphones under “Alarm actions”.",
  "Auch im Modus Zuhause aktiv.": "Also active in Home mode.",
  "Pausiert, weil der Wochenplan unter „Kernzeiten“ aktiv ist. Der Wochenplan legt dann fest, wann „Nacht“ scharf ist.": "Paused because the weekly schedule under “Core hours” is active. The weekly schedule then decides when “Night” is armed.",
  "Zu den Kernzeiten": "Go to core hours",
  "Solange er aktiv ist, ist der Nachtmodus-Zeitplan pausiert.": "While it is active, the night mode schedule is paused.",
  "Batterien": "Batteries",
  "Safe Home prüft die Batterien der überwachten Sensoren (auch in Teilbereichen) und warnt, bevor ein Sensor ausfällt.": "Safe Home checks the batteries of the monitored sensors (partitions included) and warns before a sensor fails.",
  "Alle Batterien in Ordnung": "All batteries OK",
  "schwach": "low",
  "Batterien der Sensoren überwachen": "Monitor sensor batteries",
  "Warnen ab Ladestand": "Warn at charge level",
  "Push-Benachrichtigung bei schwacher Batterie": "Push notification on low battery",
  "Unterschreitet ein Sensor diesen Wert, erscheint ein Hinweis in Karte und Protokoll. Gemeldet wird je Batterie nur einmal – bis sie gewechselt ist.": "If a sensor drops below this value, a notice appears in the card and the log. Each battery is reported only once – until it has been replaced.",
  "PIN auch zum Stummschalten der Sirene verlangen": "Also require the PIN to silence the siren",
  "Sperre nach … falschen PINs": "Lock after … wrong PINs",
  "Dauer der Sperre": "Lock duration",
  "Verhindert, dass ein Einbrecher am Wand-Tablet die Sirene ausschaltet. Automationen und Skripte dürfen weiterhin ohne PIN stummschalten.": "Prevents an intruder at the wall tablet from switching off the siren. Automations and scripts can still silence without a PIN.",
  "Danach ist die PIN-Eingabe gesperrt – auch mit richtigem PIN – und du bekommst sofort eine Push-Nachricht. 0 = nie sperren.": "After that PIN entry is locked – even with the correct PIN – and you immediately get a push notification. 0 = never lock.",
  "Darstellung": "Display",
  "Wie die Einstellungsseite angezeigt wird – gilt für diesen Browser bzw. dieses Gerät.": "How the settings page is displayed – applies to this browser or device.",
  "Einstellungen standardmäßig ausklappen": "Expand settings by default",
  "Aus: Die Abschnitte in den Reitern sind zugeklappt und öffnen sich per Tipp auf die Überschrift – besonders übersichtlich auf dem Smartphone.": "Off: the sections in the tabs are collapsed and open with a tap on the heading – especially tidy on smartphones.",
  "Abschnitte werden ausgeklappt angezeigt": "Sections are shown expanded",
  "Abschnitte werden zugeklappt angezeigt": "Sections are shown collapsed",
  "Sirene": "Siren",
  "Wie Hauptbereich": "Like main area",
  "Eigene Sirenen": "Own sirens",
  "Keine Sirene": "No siren",
  "Es ertönen die Sirenen unter „Alarm-Aktionen“.": "The sirens under “Alarm actions” sound.",
  "Nur die hier gewählten Sirenen ertönen.": "Only the sirens selected here sound.",
  "Stiller Alarm – Benachrichtigungen, Licht und Ansage laufen trotzdem.": "Silent alarm – notifications, lights and announcement still run.",
  "Weitere Entität, z. B. switch.aussensirene": "Other entity, e.g. switch.outdoor_siren",
  "Noch keine Sirene in Home Assistant gefunden – Entität unten eintragen.": "No siren found in Home Assistant yet – enter the entity below.",
  "PINs verwalten": "Manage PINs",
  "Persönliche PINs für jeden Home-Assistant-Benutzer und Gast-PINs mit Zeitraum. Sie ersetzen den bisherigen allgemeinen PIN.": "Personal PINs for every Home Assistant user and guest PINs with a time period. They replace the previous general PIN.",
  "Jeder gültige PIN kann die Alarmanlage bedienen. Im Protokoll und in den Benachrichtigungen steht, wessen PIN verwendet wurde.": "Every valid PIN can operate the alarm system. The log and notifications show whose PIN was used.",
  "Noch kein PIN – jeder mit Zugriff aufs Dashboard kann die Alarmanlage bedienen. Lege am besten zuerst einen PIN für dich selbst an.": "No PIN yet – anyone with access to the dashboard can operate the alarm system. Best create a PIN for yourself first.",
  "Benutzer": "Users",
  "Gäste": "Guests",
  "Administrator": "Administrator",
  "Standardbenutzer": "User",
  "Benutzer gelöscht": "User deleted",
  "PIN gesetzt": "PIN set",
  "Kein PIN": "No PIN",
  "PIN": "PIN",
  "mind. 4 Ziffern": "at least 4 digits",
  "Zufälligen PIN erzeugen": "Generate random PIN",
  "PIN anzeigen": "Show PIN",
  "Gültig ab": "Valid from",
  "Gültig bis": "Valid until",
  "sofort": "immediately",
  "unbegrenzt": "unlimited",
  "Gast-PIN hinzufügen": "Add guest PIN",
  "Noch keine Gast-PINs. Lege z. B. einen PIN für Handwerker, Babysitter oder Feriengäste an – auf Wunsch nur für einen bestimmten Zeitraum.": "No guest PINs yet. Create e.g. a PIN for tradespeople, babysitters or holiday guests – for a specific period if you like.",
  "Name, z. B. Handwerker": "Name, e.g. Tradesperson",
  "Aktiv": "Active",
  "Geplant": "Scheduled",
  "Abgelaufen": "Expired",
  "Deaktiviert": "Deactivated",
  "Unbegrenzt": "Unlimited",
  "Benutzer konnten nicht geladen werden.": "Users could not be loaded.",
  "Name der Instanz und Verhalten bei der PIN-Eingabe.": "Instance name and PIN entry behaviour.",
  "Aktiv": "Active",
  "{n} von {m} Empfängern aktiv": "{n} of {m} recipients active",
  "Wichtige Hinweise zu WhatsApp-Benachrichtigungen": "Important notes on WhatsApp notifications",
  "TextMeBot ist ein kostenpflichtiges Angebot eines Drittanbieters – nicht von Safe Home, Home Assistant oder WhatsApp. Für den Versand ist in der Regel ein bezahltes Abo nötig. Preise und Bedingungen findest du auf der Website von TextMeBot.":
    "TextMeBot is a paid service from a third party – not from Safe Home, Home Assistant or WhatsApp. Sending usually requires a paid subscription. You can find prices and terms on the TextMeBot website.",
  "Gesendet wird über das WhatsApp-Konto, das mit deinem TextMeBot-API-Key verbunden ist.": "Messages are sent from the WhatsApp account linked to your TextMeBot API key.",
  "Es gibt keine Zustellgarantie: Nachrichten können verzögert ankommen oder ausfallen, wenn TextMeBot oder WhatsApp gestört sind. Nutze WhatsApp deshalb nur zusätzlich zu Push-Benachrichtigungen und Sirene.":
    "There is no delivery guarantee: messages can arrive late or not at all if TextMeBot or WhatsApp has problems. So use WhatsApp only in addition to push notifications and sirens.",
  "Telefonnummern und Nachrichtentexte werden zum Versand an TextMeBot übermittelt.": "Phone numbers and message texts are transmitted to TextMeBot for sending.",
  "Mit den Häkchen legst du fest, wer gerade benachrichtigt wird – z. B. zeitweise nur eine Person.": "Use the checkboxes to choose who is currently notified – e.g. only one person for a while.",
  "Zur Website von TextMeBot": "Go to the TextMeBot website",
  "Wochenplan": "Weekly schedule",
  "Lege fest, wann die Alarmanlage an welchem Wochentag scharf ist. Außerhalb der Balken ist sie unscharf.": "Set when the alarm system is armed on each weekday. Outside the bars it is disarmed.",
  "Der Wochenplan ist nur aktiv, wenn „Anwesenheit“ in der Automatik ausgeschaltet ist.": "The weekly schedule is only active when “Presence detection” is switched off in the automation.",
  "Ausgegraut, weil „Anwesenheit“ eingeschaltet ist. Schalte sie unter „Automatik“ aus, um den Wochenplan zu nutzen.": "Greyed out because “Presence detection” is switched on. Switch it off under “Automation” to use the weekly schedule.",
  "Zur Automatik": "Go to automation",
  "Wochenplan verwenden": "Use weekly schedule",
  "Zeichnen": "Draw",
  "Unscharf": "Disarmed",
  "Montag auf Di–Fr kopieren": "Copy Monday to Tue–Fri",
  "Alles leeren": "Clear all",
  "Ziehen trägt einen Balken ein, an den Rändern ziehen ändert die Zeit, den Balken ziehen verschiebt ihn. Mit „Unscharf“ löschst du Zeiten. Raster: 15 Minuten.":
    "Drag to add a bar, drag the edges to change the time, drag the bar to move it. Use “Disarmed” to erase times. Grid: 15 minutes.",
  "Zum Beginn eines Balkens wird scharf geschaltet (mit Ausgangsverzögerung), zum Ende wieder unscharf – aber nur, wenn der Wochenplan scharf geschaltet hat. Von Hand gewählte Modi bleiben unangetastet.":
    "At the start of a bar the system is armed (with exit delay), at the end disarmed again – but only if the weekly schedule armed it. Manually chosen modes are left untouched.",
  "Montag": "Monday", "Dienstag": "Tuesday", "Mittwoch": "Wednesday", "Donnerstag": "Thursday", "Freitag": "Friday", "Samstag": "Saturday", "Sonntag": "Sunday",
  "Alarm von einem Sensor auslösen": "Trigger an alarm from a sensor",
  "Löst einen echten Alarm aus – Sirenen, Licht, Ansagen, Push und WhatsApp laufen genau wie im Ernstfall. Sag vorher Mitbewohnern und WhatsApp-Empfängern Bescheid. Mit „Rückstellung“ wird alles auf den Zustand davor zurückgesetzt.":
    "Triggers a real alarm – sirens, lights, announcements, push and WhatsApp run exactly as in an emergency. Let housemates and WhatsApp recipients know beforehand. “Reset” puts everything back to the state before.",
  "Alarmanlage": "Alarm system",
  "Sensor": "Sensor",
  "Alarm auslösen": "Trigger alarm",
  "Jetzt wirklich auslösen?": "Really trigger now?",
  "Rückstellung": "Reset",
  "Ausgelöst: {name}": "Triggered: {name}",
  "Läuft wie ein echter Alarm – zum Beenden „Rückstellung“ drücken.": "Runs like a real alarm – press “Reset” to end it.",
  "Noch keine Sensoren angelegt.": "No sensors set up yet.",
  "Haushalt ist ausgeschaltet – im Reiter „Haushalt“ einschalten.": "Household is switched off – switch it on in the “Household” tab.",
  "Bitte zuerst speichern – ausgelöst wird mit den gespeicherten Einstellungen": "Please save first – the alarm uses the saved settings",
  "Smartphones (Companion App)": "Smartphones (Companion App)",
  "Smartphones auswählen": "Select smartphones",
  "Benachrichtigungen gehen an die ausgewählten Smartphones mit der Home Assistant App.": "Notifications go to the selected smartphones with the Home Assistant app.",
  "Keine Companion App gefunden – installiere die Home Assistant App auf dem Smartphone und melde dich an.": "No Companion App found – install the Home Assistant app on your smartphone and sign in.",
  "{n} ausgewählt": "{n} selected",
  "Weiterer Dienst": "Other service",
  "Entfernen": "Remove",
  "Art": "Type",
  "Türkontakt": "Door contact",
  "Fensterkontakt": "Window contact",
  "Bewegungsmelder": "Motion sensor",
  "Präsenzmelder": "Presence sensor",
  "Wassersensor": "Water sensor",
  "Kamera": "Camera",
  "Art des Sensors": "Sensor type",
  "Sprachansagen": "Announcements",
  "Safe Home spricht über deine Lautsprecher – passend zur Art des Melders, der ausgelöst hat.": "Safe Home speaks through your speakers – matching the type of sensor that triggered.",
  "So klingen die Ansagen": "What the announcements sound like",
  "Beim Alarm": "On alarm",
  "In der Eingangsverzögerung": "During entry delay",
  "Haushalt": "Household",
  "Bei einem stillen Alarm gibt es keine Ansage.": "There is no announcement during a silent alarm.",
  "Achtung, möglicher Einbruch!": "Attention, possible break-in!",
  "Achtung, Wasseralarm!": "Attention, water alarm!",
  "Die Bewohner werden benachrichtigt.": "The residents are being notified.",
  "Geöffnete Tür erkannt: {name}.": "Open door detected: {name}.",
  "Geöffnetes Fenster erkannt: {name}.": "Open window detected: {name}.",
  "Bewegung erkannt: {name}.": "Motion detected: {name}.",
  "Person erkannt: {name}.": "Person detected: {name}.",
  "Wasser erkannt: {name}.": "Water detected: {name}.",
  "Bewegung auf der Kamera erkannt: {name}.": "Motion detected on camera: {name}.",
  "Bitte Alarmanlage innerhalb von {delay} Sekunden ausschalten.": "Please disarm the alarm system within {delay} seconds.",
  "Achtung, Wasseralarm! Wasser erkannt: {name}. Bitte sofort prüfen.": "Attention, water alarm! Water detected: {name}. Please check immediately.",
  "Haustür": "Front door", "Küchenfenster": "Kitchen window", "Flur": "Hallway", "Wohnzimmer": "Living room", "Garten": "Garden", "Keller": "Basement",
  "Sprachansagen bei Alarm": "Announcements on alarm",
  "Hinweis wiederholen alle … Sekunden": "Repeat the reminder every … seconds",
  "Die Ansage läuft in Schleife mit der verbleibenden Zeit, bis du entschärfst oder der Alarm beginnt. 0 = nur einmal.": "The announcement loops with the remaining time until you disarm or the alarm starts. 0 = only once.",
  "Bitte Alarmanlage ausschalten – noch {n} Sekunden.": "Please disarm the alarm system – {n} seconds left.",
  "alle {s} s wiederholt": "repeated every {s} s",
  "Alexa-Geräte verwenden (Alexa Media Player)": "Use Alexa devices (Alexa Media Player)",
  "Alexa-Geräte": "Alexa devices",
  "Lautsprecher, die über den Sprachausgabe-Dienst sprechen (z. B. Sonos, Google, Home Assistant Voice). Echo-Geräte bitte unten unter „Alexa-Geräte“ auswählen.": "Speakers that talk via the text-to-speech service (e.g. Sonos, Google, Home Assistant Voice). Please select Echo devices below under “Alexa devices”.",
  "Echo-Geräte sprechen mit der normalen Alexa-Stimme – ohne Sprachausgabe-Dienst.": "Echo devices speak with the normal Alexa voice – no text-to-speech service needed.",
  "{names}: Alexa-Gerät – bitte nicht unter „Lautsprecher“ auswählen, sondern über die Checkbox „Alexa-Geräte verwenden“. Bis dahin spricht es trotzdem mit der Alexa-Stimme.": "{names}: Alexa device – please don't select it under “Speakers” but via the “Use Alexa devices” checkbox. Until then it still speaks with the Alexa voice.",
  "Alexa-Geräte sprechen mit ihrer eigenen Stimme.": "Alexa devices speak with their own voice.",
  "Ansage während der Eingangsverzögerung": "Announcement during the entry delay",
  "Ansage auch bei Haushalts-Alarm (z. B. Wassersensor)": "Announcement on household alerts too (e.g. water sensor)",
  "Bei einem Alarm sagt Safe Home an, was erkannt wurde – z. B. „Achtung, möglicher Einbruch! Geöffnetes Fenster erkannt: Küche.“": "On an alarm Safe Home announces what was detected – e.g. “Attention, possible break-in! Open window detected: Kitchen.”",
  "Erinnert beim Heimkommen daran, die Alarmanlage auszuschalten.": "Reminds you to disarm the alarm system when you come home.",
  "Die Art steuert die Texte von Ansagen und Benachrichtigungen, z. B. „Fenster geöffnet: Küche“.": "The type controls the wording of announcements and notifications, e.g. “Window opened: Kitchen”.",
  "Bereiche & Sensoren": "Areas & sensors",
  "Bereiche": "Areas",
  "Bereich": "Area",
  "Hauptbereich": "Main area",
  "Teilbereiche": "Partitions",
  "Die Alarmanlage mit Zuhause, Unterwegs und Nacht ist der Hauptbereich. Zusätzlich kannst du bis zu 3 Teilbereiche anlegen – z. B. Garage oder Nebengebäude – die eigenständig scharf und unscharf geschaltet werden. Alarme laufen über dieselben Karten, Sirenen und Benachrichtigungen und nennen den Bereich.":
    "The alarm system with Home, Away and Night is the main area. In addition you can create up to 3 partitions – e.g. garage or outbuilding – that are armed and disarmed independently. Alarms use the same cards, sirens and notifications and name the area.",
  "Alarmanlage · Zuhause, Unterwegs, Nacht": "Alarm system · Home, Away, Night",
  "{n} Sensoren": "{n} sensors",
  "1 Sensor": "1 sensor",
  "Name, z. B. Garage": "Name, e.g. Garage",
  "Teilbereich {n}": "Partition {n}",
  "Teilbereich hinzufügen": "Add partition",
  "Teilbereich löschen": "Delete partition",
  "Höchstens 3 Teilbereiche": "At most 3 partitions",
  "Ausgangsverzögerung (s)": "Exit delay (s)",
  "Eingangsverzögerung (s)": "Entry delay (s)",
  "Kernzeiten": "Core hours",
  "Zur Startzeit an den gewählten Tagen scharf, zur Endzeit unscharf.": "Armed at the start time on the selected days, disarmed at the end time.",
  "Scharf ab": "Armed from",
  "Unscharf ab": "Disarmed from",
  "Eigene Anwesenheit": "Own presence",
  "Scharf, wenn alle gewählten Personen weg sind – unscharf, sobald eine zurückkommt.": "Armed when all selected people have left – disarmed as soon as one returns.",
  "Keine Personen in Home Assistant gefunden.": "No people found in Home Assistant.",
  "Noch keine Sensoren – ordne unten in der Tabelle Sensoren diesem Bereich zu.": "No sensors yet – assign sensors to this area in the table below.",
  "Nur scharf / unscharf": "Armed / disarmed only",
  "Teilbereich gelöscht – seine Sensoren gehören wieder zum Hauptbereich": "Partition deleted – its sensors belong to the main area again",
  "Bei Teilbereichen gibt es keine Modi – der Sensor ist überwacht, sobald der Bereich scharf ist.": "Partitions have no modes – the sensor is monitored whenever the area is armed.",
  "Mo": "Mon", "Di": "Tue", "Mi": "Wed", "Do": "Thu", "Fr": "Fri", "Sa": "Sat", "So": "Sun",
  "Noch keine überwachten Sensoren – zuerst unter „Bereiche & Sensoren“ hinzufügen.": "No monitored sensors yet – add them under “Areas & sensors” first.",
  "Safe Home konnte nicht geladen werden.": "Safe Home could not be loaded.",
  "Status konnte nicht abgefragt werden": "Status could not be retrieved",
  "Bitte die markierten Angaben prüfen": "Please check the highlighted fields",
  "Gespeichert – Safe Home wird neu geladen": "Saved – Safe Home is reloading",
  "Speichern fehlgeschlagen": "Saving failed",
  "Bitte zuerst speichern – getestet werden die gespeicherten Einstellungen": "Please save first – the saved settings are tested",
  "Test fehlgeschlagen": "Test failed",
  "Instanz": "Instance",
  "Menü": "Menu",
  "Alarmanlage": "Alarm system",
  "Einstellungen": "Settings",
  "Ungespeicherte Änderungen verwerfen?": "Discard unsaved changes?",
  "Noch keine Alarmanlage eingerichtet": "No alarm system set up yet",
  "Füge Safe Home über die Integrationen hinzu – danach kannst du hier alles bequem einstellen.": "Add Safe Home via the integrations – afterwards you can configure everything here.",
  "Safe Home einrichten": "Set up Safe Home",
  "Nicht gespeichert:": "Not saved:",
  "Sensoren": "Sensors",
  "Ungespeicherte Änderungen": "Unsaved changes",
  "Verwerfen": "Discard",
  "Speichert …": "Saving …",
  "Speichern": "Save",
  "Überwachte Sensoren": "Monitored sensors",
  "Aktuell offen": "Currently open",
  "Personen zuhause": "People at home",
  "Letzter Alarm": "Last alarm",
  "Die Karte ist noch nicht als Dashboard-Ressource eingetragen – dadurch kann beim Start der App „Konfigurationsfehler“ erscheinen.":
    "The card is not registered as a dashboard resource yet – this can cause “Configuration error” when the app starts.",
  "Noch kein Benachrichtigungsdienst – du würdest von einem Alarm unterwegs nichts erfahren.": "No notification service yet – you would not find out about an alarm while away.",
  "Keine Sirene ausgewählt – ein Alarm wäre vor Ort nicht hörbar.": "No siren selected – an alarm would not be audible on site.",
  "Keine Personen ausgewählt – die Home-Zone-Automatik ist dadurch inaktiv.": "No people selected – the home-zone automation is therefore inactive.",
  "Kein Sensor mit Eingangsverzögerung – beim Heimkommen löst der erste Sensor sofort aus.": "No sensor with entry delay – when you come home, the first sensor triggers immediately.",
  "Kein PIN gesetzt – jeder mit Zugriff aufs Dashboard kann entschärfen.": "No PIN set – anyone with access to the dashboard can disarm.",
  "Empfehlungen": "Recommendations",
  "Kleine Lücken in der Konfiguration": "Small gaps in the configuration",
  "Alles eingerichtet": "All set up",
  "Sensoren, Benachrichtigungen, Sirene, Automatik und PIN sind konfiguriert.": "Sensors, notifications, siren, automation and PIN are configured.",
  "Unterwegs": "Away",
  "Nacht": "Night",
  "Zuhause": "Home",
  "Eingangsverzögerung": "Entry delay",
  "Ausgangsverzögerung": "Exit delay",
  "Entfernen": "Remove",
  "{n} Unterwegs": "{n} Away",
  "{n} Nacht": "{n} Night",
  "{n} mit Verzögerung": "{n} with delay",
  "Lege für jeden Sensor fest, in welchem Modus er überwacht wird. Sensoren mit Eingangsverzögerung geben dir beim Heimkommen Zeit zum Ausschalten – alle anderen lösen sofort aus.":
    "Choose in which mode each sensor is monitored. Sensors with entry delay give you time to disarm when you come home – all others trigger immediately.",
  "Sensor suchen": "Search sensor",
  "{n} Vorschläge hinzufügen": "Add {n} suggestions",
  "Sensor": "Sensor",
  "Zustand": "State",
  "Verzögert": "Delayed",
  "Kein Treffer für „{q}“": "No match for “{q}”",
  "Noch keine Sensoren. Füge oben einen Sensor hinzu oder übernimm die Vorschläge.": "No sensors yet. Add a sensor above or accept the suggestions.",
  "Verhalten": "Behaviour",
  "Nicht gefunden": "Not found",
  "Nicht erreichbar": "Unavailable",
  "sofort": "immediately",
  "Scharf": "Armed",
  "überwacht": "monitored",
  "Alarm": "Alarm",
  "bis Aus": "until off",
  "Ablauf": "Sequence",
  "So läuft die Alarmanlage mit deinen Zeiten ab. Die Grafik passt sich deinen Eingaben sofort an.": "This is how the alarm system runs with your timings. The chart updates as you type.",
  "Verzögerungen": "Delays",
  "Alle Zeiten in Sekunden.": "All times in seconds.",
  "Benachrichtigung": "Notification",
  "Sirene (3 s)": "Siren (3 s)",
  "Alarmlicht (5 s)": "Alarm light (5 s)",
  "Ansage": "Announcement",
  "Bei einem Alarm": "When an alarm is triggered",
  "Was soll passieren, wenn Safe Home auslöst?": "What should happen when Safe Home triggers?",
  "Testen": "Test",
  "Prüfe deine Ausgänge, ohne einen echten Alarm auszulösen. Getestet werden die gespeicherten Einstellungen.": "Check your outputs without triggering a real alarm. The saved settings are tested.",
  "Home-Zone": "Home zone",
  "Anwesenheit": "Presence detection",
  "Safe Home schaltet sich anhand der Home-Zone deiner Personen selbst scharf und unscharf.": "Safe Home arms and disarms itself based on the home zone of your people.",
  "Nachtmodus": "Night mode",
  "Zeitgesteuert nur die Nachtsensoren überwachen.": "Monitor only the night sensors on a schedule.",
  "Sicherheit": "Security",
  "Name der Instanz und PIN-Code für die Bedienung über das Dashboard.": "Instance name and PIN code for operation via the dashboard.",
  "Protokoll": "Log",
  "Die letzten 30 Ereignisse dieser Instanz.": "The last 30 events of this instance.",
  "Alle": "All",
  "Alarme": "Alarms",
  "Schaltungen": "Mode changes",
  "Warnungen": "Warnings",
  "Aktualisieren": "Refresh",
  "Keine Einträge.": "No entries.",
  "Wird abgefragt …": "Checking …",
  "Eingetragen": "Registered",
  "Wird eingetragen": "Registering",
  "Manuell nötig": "Manual step needed",
  "Fehler": "Error",
  "Dashboard-Ressource": "Dashboard resource",
  "Damit die Safe-Home-Karten beim Start der App zuverlässig erscheinen, muss die Kartendatei als Ressource eingetragen sein.":
    "For the Safe Home cards to appear reliably when the app starts, the card file must be registered as a resource.",
  "Typ: JavaScript-Modul": "Type: JavaScript module",
  "Jetzt eintragen": "Register now",
  "Adresse kopieren": "Copy URL",
  "Ressourcen öffnen": "Open resources",
  "Manuell: Einstellungen → Dashboards → ⋮ (oben rechts) → Ressourcen → „Ressource hinzufügen“, Adresse oben eintragen, Typ „JavaScript-Modul“. Ist der Menüpunkt nicht sichtbar, im Benutzerprofil den „Erweiterten Modus“ einschalten.":
    "Manually: Settings → Dashboards → ⋮ (top right) → Resources → “Add resource”, enter the URL above, type “JavaScript module”. If the menu item is not visible, enable “Advanced mode” in your user profile.",
  "Kartendatei ist in diesem Browser geladen.": "The card file is loaded in this browser.",
  "Kartendatei ist in diesem Browser nicht geladen – bitte Seite neu laden. Bleibt das so, die Adresse oben im Browser öffnen und prüfen, ob die Datei erreichbar ist.":
    "The card file is not loaded in this browser – please reload the page. If it stays that way, open the URL above in the browser and check that the file is reachable.",
  "Version": "Version",
  "Die Alarmanlage für Home Assistant – weitestgehend automatisch.": "The alarm system for Home Assistant – largely automatic.",
  "Dokumentation": "Documentation",
  "Problem melden": "Report a problem",
  "Weitere Instanz": "Add instance",
  "Überbrücken und melden – wird überwacht, sobald er geschlossen ist": "Bypass and report – monitored again as soon as it is closed",
  "Scharfschalten verhindern und melden": "Block arming and report",
  "Sensor hinzufügen": "Add sensor",
  "binary_sensor.… hinzufügen": "Add binary_sensor.…",
  "Ressource eingetragen": "Resource registered",
  "Adresse kopiert": "URL copied",
  "Heute": "Today",
  "Entitäten, durch Komma getrennt": "Entities, separated by commas",
  // Reiter
  "Übersicht": "Overview",
  "Zeiten": "Delays",
  "Alarm-Aktionen": "Alarm actions",
  "Automatik": "Automation",
  "Info": "Info",
  // Sensor-Zustände
  "Geschlossen": "Closed",
  "Offen": "Open",
  "Ruhe": "Clear",
  "Bewegung": "Motion",
  "Frei": "Clear",
  "Belegt": "Occupied",
  "Abwesend": "Away",
  "Anwesend": "Present",
  "Erschütterung": "Vibration",
  "Aus": "Off",
  "An": "On",
  // Formularfelder
  "Name der Alarmanlage": "Name of the alarm system",
  "PIN-Code (optional, mind. 4 Zeichen)": "PIN code (optional, min. 4 characters)",
  "PIN auch zum Scharfschalten verlangen": "Require PIN for arming as well",
  "Bei falscher PIN-Eingabe benachrichtigen": "Notify on wrong PIN entry",
  "Offene Sensoren beim Scharfschalten": "Open sensors when arming",
  "Melden, wenn ein Sensor im scharfen Zustand nicht mehr erreichbar ist": "Notify when a sensor becomes unavailable while armed",
  "Ausgangsverzögerung – Unterwegs": "Exit delay – Away",
  "Eingangsverzögerung – Unterwegs": "Entry delay – Away",
  "Ausgangsverzögerung – Nacht": "Exit delay – Night",
  "Eingangsverzögerung – Nacht": "Entry delay – Night",
  "Alarmdauer (Sirene)": "Alarm duration (siren)",
  "Nach Ablauf der Alarmdauer wieder scharf schalten": "Re-arm after the alarm duration",
  "Sirenen / akustische Signalgeber": "Sirens / sounders",
  "Alarmbeleuchtung (wird rot eingeschaltet)": "Alarm lights (turned on in red)",
  "Benachrichtigungsdienste": "Notification services",
  "Auch beim Scharf- und Unscharfschalten benachrichtigen": "Also notify when arming and disarming",
  "Alarm als kritische Benachrichtigung (umgeht Lautlos)": "Send alarm as critical notification (bypasses silent mode)",
  "„Entschärfen“-Taste in der Alarm-Benachrichtigung": "“Disarm” button in the alarm notification",
  "Kameras (Schnappschuss in der Benachrichtigung)": "Cameras (snapshot in the notification)",
  "Sprachausgabe-Dienst (TTS)": "Text-to-speech service (TTS)",
  "Lautsprecher für Ansagen": "Speakers for announcements",
  "Personen für die Home-Zone-Automatik": "People for the home-zone automation",
  "Automatisch scharf, wenn alle die Home-Zone verlassen": "Arm automatically when everyone leaves the home zone",
  "Wartezeit vor dem automatischen Scharfschalten": "Delay before arming automatically",
  "Automatisch unscharf, wenn jemand nach Hause kommt": "Disarm automatically when someone comes home",
  "Nachtmodus nach Zeitplan": "Night mode on a schedule",
  "Nachtmodus Beginn": "Night mode start",
  "Nachtmodus Ende": "Night mode end",
  "Nachtmodus nur, wenn jemand zuhause ist": "Night mode only when someone is home",
  "0 = Sirene läuft, bis die Alarmanlage ausgeschaltet wird.": "0 = the siren runs until the alarm system is disarmed.",
  "Z. B. mobile_app_mein_handy. Eigene Dienstnamen können eingetippt werden.": "E.g. mobile_app_my_phone. You can type in your own service names.",
  "Companion App: Alarm klingelt auch bei Lautlos und Fokus.": "Companion App: the alarm rings even in silent and focus mode.",
  "Zum Entschärfen muss das Handy entsperrt werden.": "The phone must be unlocked to disarm.",
  "Schützt vor kurzen GPS-Aussetzern. Die Ausgangsverzögerung entfällt hier.": "Protects against short GPS dropouts. The exit delay does not apply here.",
  "Leer lassen für Bedienung ohne PIN.": "Leave empty to operate without a PIN.",
  "Wird scharf": "Arming",
  "ALARM": "ALARM",
  "Nicht verfügbar": "Unavailable",
  // Haushalt
  "Haushalt": "Household",
  "Trocken": "Dry", "Feucht": "Wet", "Kein Gas": "No gas", "Gas erkannt": "Gas detected", "Kein Rauch": "No smoke", "Rauch erkannt": "Smoke detected",
  "Kein CO": "No CO", "CO erkannt": "CO detected", "OK": "OK", "Problem": "Problem", "Normal": "Normal", "Kalt": "Cold", "Heiß": "Hot",
  "Läuft": "Running", "Strom": "Power", "Ausgesteckt": "Unplugged", "Eingesteckt": "Plugged in", "Batterie schwach": "Battery low",
  "WhatsApp auch bei Haushalts-Alarm (z. B. Wassersensor)": "WhatsApp for household alerts as well (e.g. water sensor)",
  "Push-Benachrichtigung auch bei Haushalts-Alarm (z. B. Wassersensor)": "Push notification for household alerts as well (e.g. water sensor)",
  "Haushalt überwachen": "Monitor household",
  "Entwarnung senden, wenn der Zustand wieder endet (z. B. wieder trocken)": "Send an all-clear when the state ends (e.g. dry again)",
  "Geht an Empfänger mit „sofort“. Welche Sensoren das sind, legst du im Reiter „Haushalt“ fest.": "Sent to recipients set to “immediately”. Choose the sensors in the “Household” tab.",
  "Geht an die Benachrichtigungsdienste oben – als kritische Benachrichtigung, wenn diese aktiviert ist. Sensoren im Reiter „Haushalt“.":
    "Sent to the notification services above – as a critical notification if enabled. Choose the sensors in the “Household” tab.",
  "Unabhängig von der Alarmanlage – auch im Modus Zuhause aktiv. Löst keinen Einbruchalarm und keine Sirene aus.":
    "Independent of the alarm system – also active in Home mode. Does not trigger an intrusion alarm or the siren.",
  "Zustand, z. B. fertig": "State, e.g. finished",
  "Melden bei": "Alert on",
  "Überwacht z. B. Wassersensoren unabhängig von der Alarmanlage. Erreicht ein Sensor den gewählten Zustand, kommt eine Push-Benachrichtigung und/oder WhatsApp – einstellbar unter „Alarm-Aktionen“.":
    "Monitors e.g. water sensors independently of the alarm system. When a sensor reaches the chosen state, you get a push notification and/or WhatsApp – configurable under “Alarm actions”.",
  "Wähle je Sensor, bei welchem Zustand gemeldet wird – z. B. „Feucht“ bei einem Wassersensor oder „Trocken“ bei einem Feuchtesensor für Pflanzen.":
    "Choose for each sensor in which state it alerts – e.g. “Wet” for a water sensor or “Dry” for a plant moisture sensor.",
  "{n} Wassersensoren hinzufügen": "Add {n} water sensors",
  "Noch keine Sensoren. Füge oben z. B. deine Wassersensoren hinzu.": "No sensors yet. Add e.g. your water sensors above.",
  // Alarmdauer
  "{n} Min.": "{n} min",
  "Alarmdauer": "Alarm duration",
  "Dauer des akustischen Alarms": "Audible alarm duration",
  "So lange bleibt der Alarm aktiv. Danach wird wieder scharf geschaltet (falls unten aktiviert), sonst bleibt der Alarm bis zum Ausschalten. 0 = bis zum Ausschalten.":
    "How long the alarm stays active. Afterwards the system re-arms (if enabled below), otherwise the alarm stays until disarmed. 0 = until disarmed.",
  "So lange ertönen Sirenen und Signalgeber. Danach bleibt der Alarm still bestehen – Benachrichtigungen, WhatsApp und Alarmlicht laufen weiter. 0 = während der gesamten Alarmdauer.":
    "How long sirens and sounders go off. Afterwards the alarm stays active silently – notifications, WhatsApp and alarm lights keep running. 0 = for the whole alarm duration.",
  "Alarm mit Sirene": "Alarm with siren",
  "Wieder scharf": "Armed again",
  "Alarm bleibt": "Alarm stays",
  "Verzögerungen und Alarmdauer": "Delays and alarm duration",
  "Verzögerungen in Sekunden; Alarmdauer und akustischer Alarm in Stunden, Minuten und Sekunden.": "Delays in seconds; alarm duration and audible alarm in hours, minutes and seconds.",
  // Ein Schalter je Modul
  "Home-Zone-Automatik": "Home-zone automation",
  "Nachtmodus nach Zeitplan": "Night mode on a schedule",
  "Nachtzeit": "Night time",
  "Eingeschaltet – gleicher Schalter wie „{n}“ auf den Karten": "On – same switch as “{n}” on the cards",
  "Ausgeschaltet – gleicher Schalter wie „{n}“ auf den Karten": "Off – same switch as “{n}” on the cards",
  "Ein- und ausgeschaltet werden beide Automatiken nur über ihren Schalter – hier oben oder als „Anwesenheit“ und „Nachtzeit“ auf den Karten, beides ist derselbe Schalter. Von Hand gewähltes Unterwegs wird von der Automatik nie überschrieben.":
    "Both automations are switched on and off only with their switch – here at the top or as “Presence detection” and “Night time” on the cards, which is the same switch. Away chosen by hand is never overridden by the automation.",
  "Beim Verlassen: automatisch scharf, wenn alle die Home-Zone verlassen": "On leaving: arm automatically when everyone leaves the home zone",
  "Beim Heimkommen: automatisch unscharf, wenn jemand nach Hause kommt": "On arriving: disarm automatically when someone comes home",
  // Android-Widget
  "Safe Home – Android-Widget im Stil der Kompakt-Karte": "Safe Home – Android widget in the style of the compact card",
  "Alarmanlage unscharf": "Alarm system disarmed",
  "Alle Sensoren scharf": "All sensors armed",
  "Nachtsensoren scharf": "Night sensors armed",
  "Bitte entschärfen": "Please disarm",
  "Einbruch erkannt": "Intrusion detected",
  "Integration prüfen": "Check the integration",
  "Stiller Alarm": "Silent alarm",
  "bis": "until",
  "Alle weg – scharf in Kürze": "Everyone left – arming shortly",
  "zuhause": "home",
  "offen": "open",
  "alles zu": "all closed",
  "„Template kopieren“ tippen.": "Tap “Copy template”.",
  "In der Companion App: Startbildschirm lange gedrückt halten → Widgets → Home Assistant → „Template“ auf den Startbildschirm ziehen.":
    "Long-press the home screen → Widgets → Home Assistant → drag “Template” onto the home screen.",
  "Das kopierte Template in das Feld „Template“ einfügen – darunter erscheint die Vorschau. Als Design „Transparent“ oder ein dunkles Design wählen, falls angeboten.":
    "Paste the copied template into the “Template” field – the preview appears below it. Choose “Transparent” or a dark theme if offered.",
  "Speichern. Ändern lässt sich das Widget später unter Einstellungen → Companion App → Widgets verwalten.": "Save. You can edit the widget later under Settings → Companion App → Manage widgets.",
  "Android-Widget (Companion App)": "Android widget (Companion App)",
  "Erzeugt ein Template-Widget im Stil der Kompakt-Karte für den Android-Startbildschirm: Zustand, Hinweis und die drei Modi – der aktive ist hervorgehoben.":
    "Creates a template widget in the style of the compact card for the Android home screen: state, hint and the three modes – the active one is highlighted.",
  "Offene Sensoren": "Open sensors",
  "Dunkelblauer Hintergrund": "Dark blue background",
  "Vorschau": "Preview",
  "Vorschau wird geladen …": "Loading preview …",
  "Die Vorschau wird von deinem Home Assistant berechnet – so sieht es auch im Widget aus. Schrift und Abstände hängen vom Startbildschirm ab.":
    "The preview is rendered by your Home Assistant – the widget shows the same. Font and spacing depend on your home screen.",
  "Template": "Template",
  "Template kopieren": "Copy template",
  "Tippen auf das Widget aktualisiert es. Für sofortige Aktualisierung im Hintergrund der Companion App den Benachrichtigungszugriff erlauben. Zum Schalten der Modi kannst du zusätzlich Button-Widgets mit den Aktionen alarm_control_panel.alarm_arm_away / alarm_arm_night / alarm_disarm anlegen.":
    "Tapping the widget refreshes it. For instant updates in the background, allow notification access for the Companion App. To switch modes, you can additionally create button widgets with the actions alarm_control_panel.alarm_arm_away / alarm_arm_night / alarm_disarm.",
  "Keine Vorschau verfügbar – teste das Template unter Entwicklerwerkzeuge → Template.": "No preview available – test the template under Developer tools → Template.",
  "Template kopiert – jetzt im Widget einfügen": "Template copied – now paste it into the widget",
  "Kopieren nicht möglich – Text ist markiert, bitte manuell kopieren": "Copying not possible – the text is selected, please copy it manually",
  // Tag/Nacht-Automatik
  "Nachtmodus nur, wenn jemand zuhause ist – sonst Unterwegs": "Night mode only when someone is home – otherwise Away",
  "Nach Heimkehr in der Nacht wieder Nachtmodus nach": "After coming home at night, back to night mode after",
  "Wer nachts heimkommt, bekommt die Anlage automatisch unscharf geschaltet. Danach wird der Nachtmodus wieder aktiv. 0 = bleibt unscharf.":
    "Anyone coming home at night gets the system disarmed automatically. Night mode is re-activated afterwards. 0 = stays disarmed.",
  "So handelt Safe Home selbstständig": "How Safe Home acts on its own",
  "Ergibt sich aus Uhrzeit und Standort deiner Personen – mit deinen aktuellen Einstellungen:": "Based on the time and the location of your people – with your current settings:",
  "(ausgeschaltet)": "(switched off)",
  "Alle gehen": "Everyone leaves",
  "Sobald die letzte Person die Home-Zone verlässt, wird nach {s} s auf Unterwegs geschaltet – auch aus dem Nachtmodus.": "As soon as the last person leaves the home zone, Away is armed after {s} s – also from night mode.",
  "Erste Person kommt heim": "First person comes home",
  "Unterwegs wird automatisch ausgeschaltet.": "Away is disarmed automatically.",
  "{t} Uhr – Nachtbeginn": "{t} – night starts",
  "Ist jemand zuhause, beginnt der Nachtmodus. Ist niemand zuhause, bleibt bzw. wird Unterwegs scharf – kein Nachtmodus.": "If someone is home, night mode starts. If nobody is home, Away stays or becomes armed – no night mode.",
  "Der Nachtmodus beginnt – auch wenn niemand zuhause ist.": "Night mode starts – even if nobody is home.",
  "Heimkehr in der Nacht": "Coming home at night",
  "Kommt jemand nachts heim, wird für ihn unscharf geschaltet und nach {m} Minuten wieder der Nachtmodus aktiv.": "If someone comes home at night, the system is disarmed for them and night mode is re-activated after {m} minutes.",
  "Kommt jemand nachts heim, wird unscharf geschaltet und bleibt es.": "If someone comes home at night, the system is disarmed and stays disarmed.",
  "Nachts wird für Heimkehrer nicht automatisch unscharf geschaltet.": "At night, the system is not disarmed automatically for people coming home.",
  "(Heimkehr-Automatik ausgeschaltet)": "(arrival automation switched off)",
  "{t} Uhr – Nachtende": "{t} – night ends",
  "Mit Personen zuhause wird ausgeschaltet. Ist niemand mehr da, wird nicht ausgeschaltet, sondern Unterwegs aktiviert. Unterwegs bleibt morgens immer scharf.":
    "With people at home, the system is disarmed. If nobody is there any more, it is not disarmed but switched to Away. Away always stays armed in the morning.",
  "Hinweis: Die Home-Zone-Automatik ist ausgeschaltet – Safe Home schaltet dann nur nach Zeitplan.": "Note: the home-zone automation is switched off – Safe Home then only switches on the schedule.",
  "Alle Automatiken lassen sich jederzeit auch über die Schalter „Anwesenheit“ und „Nachtzeit“ auf den Karten pausieren. Von Hand gewähltes Unterwegs wird von der Automatik nie überschrieben.":
    "All automations can be paused at any time with the “Presence detection” and “Night time” switches on the cards. Away chosen by hand is never overridden by the automation.",
  // Akustischer Alarm
  "Sirene ertönt im Modus": "Siren sounds in mode",
  "Nur in einem Zeitfenster": "Only within a time window",
  "Von": "From",
  "Bis": "To",
  "In nicht angehakten Modi gibt es einen stillen Alarm: Benachrichtigungen, WhatsApp, Alarmlicht und Ansage laufen weiter, nur die Sirene bleibt aus.":
    "Modes that are not ticked get a silent alarm: notifications, WhatsApp, alarm lights and announcement still run, only the siren stays off.",
  "Ansage auch bei stillem Alarm (Sirene bleibt aus)": "Announcement during a silent alarm too (siren stays off)",
  "Z. B. außerhalb des Sirenen-Zeitfensters oder bei Sensoren ohne Sirene. Ausgeschaltet bleibt ein stiller Alarm ganz still.": "E.g. outside the siren time window or for sensors without siren. When off, a silent alarm stays completely silent.",
  "Auch bei einem stillen Alarm (Sirene aus) wird angesagt.": "Announced during a silent alarm (siren off) too.",
  "Außerhalb des Zeitfensters stiller Alarm. Über Mitternacht möglich, z. B. 22:00 bis 06:00.": "Silent alarm outside the time window. Can span midnight, e.g. 22:00 to 06:00.",
  "Akustischer Alarm": "Audible alarm",
  "Lege fest, wann die Sirenen und Signalgeber ertönen – nach Modus, Uhrzeit und für jeden Sensor einzeln.": "Choose when the sirens and sounders go off – by mode, time of day and for each sensor individually.",
  "in keinem Modus": "in no mode",
  "von {a} bis {b} Uhr": "from {a} to {b}",
  "rund um die Uhr": "around the clock",
  "Keine Sirene ausgewählt – wähle oben unter „Sirenen“ mindestens eine aus.": "No siren selected – choose at least one under “Sirens” above.",
  "Sirene ertönt: {m} · {t}": "Siren sounds: {m} · {t}",
  "{n} von {m} Sensoren lösen die Sirene aus.": "{n} of {m} sensors trigger the siren.",
  "Panikalarm und manuelles Auslösen ertönen immer.": "Panic alarm and manual triggering always sound.",
  "Noch keine überwachten Sensoren – zuerst unter „Sensoren“ hinzufügen.": "No monitored sensors yet – add them under “Sensors” first.",
  "Sirene": "Siren",
  "Still": "Silent",
  "Sirene bei {name}": "Siren for {name}",
  "Sirene je Sensor": "Siren per sensor",
  "Alle an": "All on",
  "Alle still": "All silent",
  // WhatsApp
  "WhatsApp": "WhatsApp",
  "WhatsApp über TextMeBot": "WhatsApp via TextMeBot",
  "Bei einem Alarm erhalten die Empfänger eine WhatsApp mit dem ausgelösten Melder. Empfänger mit Wartezeit werden nur benachrichtigt, wenn der Alarm bis dahin nicht ausgeschaltet wurde (Eskalation).":
    "When an alarm is triggered, the recipients get a WhatsApp message naming the triggered sensor. Recipients with a delay are only notified if the alarm has not been disarmed by then (escalation).",
  "nach {n} Min.": "after {n} min",
  "Name": "Name",
  "z. B. Max": "e.g. Max",
  "WhatsApp-Nummer": "WhatsApp number",
  "TextMeBot-API-Key": "TextMeBot API key",
  "Senden": "Send",
  "Die Einträge sind Beispieldaten. Bitte durch echte Nummern und deine TextMeBot-API-Keys ersetzen – an Beispieldaten wird nie gesendet.":
    "These entries are example data. Please replace them with real numbers and your TextMeBot API keys – nothing is ever sent to example data.",
  "Noch keine Empfänger.": "No recipients yet.",
  "Empfänger hinzufügen": "Add recipient",
  "Den API-Key bekommst du auf textmebot.com („Request ApiKey“) – gesendet wird vom WhatsApp-Konto, das mit dem Key verbunden ist. Nummer international angeben (z. B. +49…), für Gruppen die Gruppen-ID. Zwischen zwei Nachrichten liegen einige Sekunden Abstand, damit TextMeBot keine verwirft.":
    "You get the API key at textmebot.com (“Request ApiKey”) – messages are sent from the WhatsApp account linked to the key. Enter numbers in international format (e.g. +44…), or the group ID for groups. There are a few seconds between two messages so that TextMeBot does not drop any.",
  "WhatsApp-Benachrichtigung bei Alarm": "WhatsApp notification on alarm",
  "Nachricht bei Alarm (leer = Standardtext)": "Alarm message (empty = default text)",
  "Entwarnung senden, wenn die Alarmanlage ausgeschaltet wird": "Send an all-clear when the alarm system is disarmed",
  "Auch weitere Meldungen per WhatsApp (Schaltungen, Sabotage, falscher PIN)": "Also send other messages via WhatsApp (mode changes, tamper, wrong PIN)",
  "WhatsApp-Empfänger": "WhatsApp recipients",
  "Platzhalter: {sensor} ausgelöster Melder, {date} Datum, {time} Uhrzeit, {mode} Modus, {name} Name der Alarmanlage.":
    "Placeholders: {sensor} triggered sensor, {date} date, {time} time, {mode} mode, {name} name of the alarm system.",
  "Geht nur an Empfänger mit „sofort“.": "Only sent to recipients set to “immediately”.",
};
function PT(de, vars) {
  let s = P_LANG === "de" ? de : PANEL_EN[de] ?? de;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  return s;
}

const PI = {
  shield: '<path d="M12 3 20 6v6c0 5-3.5 8.2-8 9.3C7.5 20.2 4 17 4 12V6z"/>',
  door: '<path d="M6 21V3h12v18"/><path d="M3 21h18"/><circle cx="14.5" cy="12" r=".6" fill="currentColor"/>',
  window: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/>',
  motion: '<circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-6 2.5 2v4M7 12l3-4 4 1 2 3 3 1"/><path d="m11.5 15 1-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  alarm: '<path d="M6.5 18v-5.5a5.5 5.5 0 0 1 11 0V18"/><path d="M4 18h16v3H4z"/><path d="M12 2v2.2M4.4 5.4l1.5 1.5M19.6 5.4l-1.5 1.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1" fill="currentColor"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="4.5" cy="18" r="1" fill="currentColor"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
  speaker: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.2 2.8 2.8L16 9.5"/>',
  warn: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.2M12 17.2v.3"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
  ext: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  night: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  away: '<path d="M12 3 20 6v6c0 5-3.5 8.2-8 9.3C7.5 20.2 4 17 4 12V6z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10.2 11V9.4a1.8 1.8 0 0 1 3.6 0V11"/>',
  drop: '<path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9.5 2.5h5"/>',
  camera: '<path d="M3 8h3l2-2.5h8L18 8h3v11H3z"/><circle cx="12" cy="13" r="3.5"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  battery: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10.5v3"/><path d="M6.5 10v4"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  dice: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1.1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.1" fill="currentColor"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.7-8.7M16.5 6.5l2.5 2.5M14 9l2 2"/>',
  home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/>',
  chat: '<path d="M4 20l1.4-4.2A8 8 0 1 1 8.3 18.7z"/><path d="M9 10.5c.5 1.6 1.9 3 3.5 3.5l1.2-1.2 2 .8-.4 1.6c-3.4.2-7.2-3.6-7-7l1.6-.4.8 2z"/>',
};
const pi = (n, cls = "") =>
  `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PI[n] || ""}</svg>`;
const pesc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const clone = (o) => JSON.parse(JSON.stringify(o));

const TABS = [
  { id: "overview", label: "Übersicht", icon: "shield" },
  { id: "sensors", label: "Bereiche & Sensoren", icon: "door" },
  { id: "actions", label: "Alarm-Aktionen", icon: "alarm" },
  { id: "automation", label: "Automatik", icon: "pin" },
  { id: "household", label: "Haushalt", icon: "drop" },
  { id: "security", label: "Sicherheit", icon: "lock" },
  { id: "log", label: "Protokoll", icon: "list" },
  { id: "info", label: "Info", icon: "info" },
];

const SENSOR_TYPES = [
  ["door", "Türkontakt", "door"],
  ["window", "Fensterkontakt", "window"],
  ["motion", "Bewegungsmelder", "motion"],
  ["presence", "Präsenzmelder", "person"],
  ["water", "Wassersensor", "drop"],
  ["camera", "Kamera", "camera"],
];
const TYPE_BY_DC = { door: "door", garage_door: "door", opening: "door", lock: "door", window: "window", motion: "motion", vibration: "motion", moving: "motion", occupancy: "presence", presence: "presence", moisture: "water" };
const inferType = (eid, dc) => {
  const e = String(eid || "").toLowerCase();
  if (/camera|kamera|_cam_|cam_|_cam/.test(e)) return "camera";
  if (TYPE_BY_DC[dc]) return TYPE_BY_DC[dc];
  if (/fenster|window/.test(e)) return "window";
  if (/bewegung|motion|pir/.test(e)) return "motion";
  if (/praesenz|präsenz|presence|occupancy|mmwave/.test(e)) return "presence";
  if (/wasser|water|leak|moisture/.test(e)) return "water";
  return "door";
};
const SPEECH = { door: "Geöffnete Tür erkannt: {name}.", window: "Geöffnetes Fenster erkannt: {name}.", motion: "Bewegung erkannt: {name}.", presence: "Person erkannt: {name}.", water: "Wasser erkannt: {name}.", camera: "Bewegung auf der Kamera erkannt: {name}." };
const SUGGEST_CLASSES = ["door", "window", "opening", "garage_door", "motion", "occupancy", "presence", "vibration"];
const STATE_TEXT = {
  door: ["Geschlossen", "Offen"], window: ["Geschlossen", "Offen"], opening: ["Geschlossen", "Offen"],
  garage_door: ["Geschlossen", "Offen"], motion: ["Ruhe", "Bewegung"], occupancy: ["Frei", "Belegt"],
  presence: ["Abwesend", "Anwesend"], vibration: ["Ruhe", "Erschütterung"],
  moisture: ["Trocken", "Feucht"], gas: ["Kein Gas", "Gas erkannt"], smoke: ["Kein Rauch", "Rauch erkannt"],
  carbon_monoxide: ["Kein CO", "CO erkannt"], problem: ["OK", "Problem"], cold: ["Normal", "Kalt"], heat: ["Normal", "Heiß"],
  running: ["Aus", "Läuft"], power: ["Aus", "Strom"], plug: ["Ausgesteckt", "Eingesteckt"], battery: ["Normal", "Batterie schwach"],
};

const LABELS = {
  battery_enabled: "Batterien überwachen",
  battery_threshold: "Warnen ab Ladestand",
  battery_notify: "Push-Benachrichtigung",
  silence_requires_code: "PIN zum Stummschalten der Sirene",
  code_max_attempts: "Sperre nach … falschen PINs",
  code_lockout_minutes: "Dauer der Sperre",
  pins: "PINs verwalten",
  zones: "Teilbereiche",
  name: "Name der Alarmanlage",
  code: "PIN-Code (optional, mind. 4 Zeichen)",
  code_arm_required: "PIN zum Scharfschalten",
  notify_wrong_code: "Bei falschem PIN benachrichtigen",
  open_sensor_policy: "Offene Sensoren beim Scharfschalten",
  tamper_notify: "Melden, wenn ein Sensor nicht mehr erreichbar ist",
  exit_delay_away: "Verlassen – Unterwegs",
  entry_delay_away: "Heimkommen – Unterwegs",
  exit_delay_night: "Verlassen – Nacht",
  entry_delay_night: "Heimkommen – Nacht",
  trigger_time: "Alarmdauer",
  siren_duration: "Sirenendauer",
  rearm_after_trigger: "Danach wieder scharf schalten",
  sirens: "Sirenen",
  alarm_lights: "Alarmlicht (leuchtet rot)",
  notify_services: "Benachrichtigungsdienste",
  notify_state_changes: "Auch beim Scharf- und Unscharfschalten",
  critical_notifications: "Kritisch – klingelt auch bei Lautlos",
  notification_disarm_action: "Taste „Entschärfen“ in der Nachricht",
  cameras: "Kamerabild mitsenden",
  tts_enabled: "Sprachansagen",
  tts_entry_warning: "Hinweis in der Eingangsverzögerung",
  tts_entry_repeat: "Hinweis wiederholen alle",
  tts_silent_alarm: "Auch bei stillem Alarm",
  tts_household: "Sprachansage",
  alexa_enabled: "Alexa-Geräte verwenden",
  alexa_devices: "Alexa-Geräte",
  tts_entity: "Sprachausgabe (TTS)",
  media_players: "Lautsprecher",
  persons: "Personen",
  auto_arm: "Automatisch scharf, wenn alle weg sind",
  auto_arm_delay: "Wartezeit vor dem Scharfschalten",
  auto_disarm: "Automatisch unscharf, wenn jemand heimkommt",
  night_auto: "Nachtmodus nach Zeitplan",
  night_start: "Beginn",
  night_end: "Ende",
  night_only_when_home: "Nur wenn jemand zuhause ist (sonst Unterwegs)",
  night_rearm_delay: "Nach nächtlicher Heimkehr wieder „Nacht“ nach",
  siren_modes: "Sirene im Modus",
  siren_time_enabled: "Nur in einem Zeitfenster",
  siren_time_start: "Von",
  siren_time_end: "Bis",
  whatsapp_enabled: "WhatsApp bei Alarm",
  whatsapp_household: "WhatsApp",
  household_notify: "Push-Benachrichtigung",
  household_enabled: "Haushalt überwachen",
  household_resolved: "Entwarnung senden (z. B. wieder trocken)",
  whatsapp_message: "Eigener Nachrichtentext (leer = Standard)",
  whatsapp_all_clear: "Entwarnung beim Ausschalten",
  whatsapp_other_messages: "Auch Schaltungen, Sabotage und falsche PINs",
  whatsapp_recipients: "WhatsApp-Empfänger",
};
const HELPERS = {
  battery_threshold: "Je Batterie nur eine Meldung – bis sie gewechselt ist.",
  silence_requires_code: "Automationen dürfen weiterhin ohne PIN stummschalten.",
  code_max_attempts: "Danach gesperrt, du bekommst sofort eine Push-Nachricht. 0 = nie.",
  tts_entry_repeat: "Mit Restzeit, bis entschärft ist. 0 = nur einmal.",
  media_players: "Z. B. Sonos oder Google. Echo-Geräte unter „Alexa-Geräte“.",
  alexa_devices: "Sprechen mit der Alexa-Stimme.",
  trigger_time: "Wie lange der Alarm aktiv bleibt. 0 = bis zum Ausschalten.",
  siren_duration: "Danach läuft der Alarm still weiter. 0 = ganze Alarmdauer.",
  notify_services: "Z. B. mobile_app_mein_handy. Eigene Dienstnamen können eingetippt werden.",
  notification_disarm_action: "Nur bei entsperrtem Handy.",
  auto_arm_delay: "Schützt vor kurzen GPS-Aussetzern.",
  code: "Leer lassen für Bedienung ohne PIN.",
  night_rearm_delay: "0 = bleibt unscharf.",
  siren_modes: "Sonst stiller Alarm – alles außer der Sirene läuft.",
  tts_silent_alarm: "Wenn die Sirene stumm bleibt (z. B. außerhalb des Zeitfensters).",
  siren_time_enabled: "Z. B. 22:00 bis 06:00.",
  whatsapp_message: "Platzhalter: {sensor} ausgelöster Melder, {date} Datum, {time} Uhrzeit, {mode} Modus, {name} Name der Alarmanlage.",
  whatsapp_other_messages: "Geht nur an Empfänger mit „sofort“.",
  whatsapp_household: "An Empfänger mit „sofort“.",
  household_notify: "An die Smartphones unter „Alarm-Aktionen“.",
  household_enabled: "Auch im Modus Zuhause aktiv.",
};

// Dauer-Felder: gespeichert in Sekunden, im Formular als Stunden/Minuten/Sekunden
const DURATION_KEYS = ["trigger_time", "siren_duration"];
const toDur = (sec) => {
  const t = Math.max(0, Math.round(Number(sec) || 0));
  return { hours: Math.floor(t / 3600), minutes: Math.floor((t % 3600) / 60), seconds: t % 60 };
};
const fromDur = (v) =>
  v && typeof v === "object" ? (Number(v.days) || 0) * 86400 + (Number(v.hours) || 0) * 3600 + (Number(v.minutes) || 0) * 60 + (Number(v.seconds) || 0) : Number(v) || 0;
const fmtDur = (sec) => {
  const t = Math.max(0, Math.round(Number(sec) || 0));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
  const parts = [];
  if (h) parts.push(`${h} h`);
  if (m) parts.push(PT("{n} Min.", { n: m }));
  if (s || !parts.length) parts.push(`${s} s`);
  return parts.join(" ");
};
const sec = (max = 3600) => ({ number: { min: 0, max, step: 1, mode: "box", unit_of_measurement: "s" } });
const bool = { boolean: {} };
const ents = (domain, multiple = true) => ({ entity: { multiple, filter: [].concat(domain).map((d) => ({ domain: d })) } });

class SafeHomePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._tab = this._readTab();
    this._entries = null;
    this._entryId = null;
    this._data = null;
    this._draft = null;
    this._title = "";
    this._errors = {};
    this._search = "";
    this._logFilter = "all";
    this._toast = null;
    this._forms = [];
    this._busy = false;
    this._unload = (e) => {
      if (this._dirty()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    const langChanged = pSetLang(hass);
    if (first) this._init();
    else if (langChanged && this._data) this._render();
    else this._updateLive();
  }
  get hass() {
    return this._hass;
  }
  set narrow(v) {
    const changed = this._narrow !== v;
    this._narrow = v;
    if (changed && this._data) this._render();
  }
  set panel(v) {
    this._panel = v;
    // Karten mitladen, falls der Browser sie noch nicht kennt (exakt gleiche URL wie die Integration)
    // Exakt gleiche URL wie die Integration -> Datei wird nur einmal ausgeführt
    const url = v?.config?.card_url;
    if (url && !customElements.get("safe-home-card")) import(url).catch(() => {});
  }
  set route(v) {
    this._route = v;
  }

  connectedCallback() {
    window.addEventListener("beforeunload", this._unload);
  }
  disconnectedCallback() {
    window.removeEventListener("beforeunload", this._unload);
    this._wStopPreview?.();
  }

  _readTab() {
    try {
      const t = localStorage.getItem("safe_home_panel_tab") || "overview";
      return t === "delays" ? "sensors" : t; // Reiter „Kernzeiten“ gibt es nicht mehr
    } catch (e) {
      return "overview";
    }
  }
  _store(key, v) {
    try {
      localStorage.setItem(key, v);
    } catch (e) {
      /* ignore */
    }
  }

  // ------------------------------------------------------------------ Daten
  async _ws(msg) {
    return this._hass.callWS(msg);
  }

  async _init() {
    this._renderShell('<div class="center"><div class="spinner"></div></div>');
    this._formReady = ensureHaForm();
    try {
      const res = await this._ws({ type: "safe_home/entries" });
      this._entries = res.entries;
      if (!this._entries.length) {
        this._renderEmpty();
        return;
      }
      let stored = null;
      try {
        stored = localStorage.getItem("safe_home_panel_entry");
      } catch (e) {
        /* ignore */
      }
      const pick = this._entries.find((e) => e.entry_id === stored) || this._entries[0];
      await this._load(pick.entry_id);
    } catch (err) {
      this._renderShell(`<div class="center err">${pi("warn")}<p>${PT("Safe Home konnte nicht geladen werden.")}<br><small>${pesc(err?.message || err)}</small></p></div>`);
    }
  }

  async _load(entryId) {
    this._entryId = entryId;
    this._store("safe_home_panel_entry", entryId);
    const data = await this._ws({ type: "safe_home/config", entry_id: entryId });
    this._data = data;
    this._draft = clone(data.options);
    this._title = data.title;
    this._errors = {};
    this._hasForm = await this._formReady;
    await this._loadResource(false);
    this._render();
  }

  async _loadResource(register) {
    try {
      this._resource = await this._ws({ type: "safe_home/resource", register });
    } catch (err) {
      this._resource = { state: "error", message: err?.message || PT("Status konnte nicht abgefragt werden"), url: "/safe_home_static/safe-home-card.js" };
    }
  }

  _dirty() {
    if (!this._data) return false;
    return JSON.stringify(this._draft) !== JSON.stringify(this._data.options) || this._title !== this._data.title;
  }

  async _save() {
    if (this._busy) return;
    this._busy = true;
    this._updateSaveBar();
    try {
      const res = await this._ws({ type: "safe_home/save_config", entry_id: this._entryId, options: this._draft, title: this._title });
      if (!res.success) {
        this._errors = res.errors || {};
        this._showToast(PT("Bitte die markierten Angaben prüfen"), "err");
        this._render();
        return;
      }
      this._errors = {};
      this._data.options = clone(res.options);
      this._draft = clone(res.options);
      this._data.title = this._title;
      this._showToast(PT("Gespeichert – Safe Home wird neu geladen"), "ok");
      setTimeout(() => this._load(this._entryId).catch(() => {}), 1500);
      this._render();
    } catch (err) {
      this._showToast(err?.message || PT("Speichern fehlgeschlagen"), "err");
    } finally {
      this._busy = false;
      this._updateSaveBar();
    }
  }

  _discard() {
    this._draft = clone(this._data.options);
    this._title = this._data.title;
    this._errors = {};
    this._render();
  }

  async _test(kind) {
    if (this._dirty()) {
      this._showToast(PT("Bitte zuerst speichern – getestet werden die gespeicherten Einstellungen"), "err");
      return;
    }
    try {
      const res = await this._ws({ type: "safe_home/test", entry_id: this._entryId, kind });
      this._showToast(res.message, "ok");
    } catch (err) {
      this._showToast(err?.message || PT("Test fehlgeschlagen"), "err");
    }
  }

  _set(key, value) {
    if (key === "name") this._title = value || "";
    else this._draft[key] = value;
    if (key === "tts_enabled" && value)
      for (const k of ["tts_entry_warning", "tts_household", "tts_silent_alarm"]) if (this._draft[k] === undefined) this._draft[k] = true;
    if (key === "tts_enabled" && value && this._draft.tts_entry_repeat === undefined) this._draft.tts_entry_repeat = 10;
    if (key === "alexa_enabled" && value && !Array.isArray(this._draft.alexa_devices)) this._draft.alexa_devices = [];
    delete this._errors[key];
    this._updateSaveBar();
  }

  _showToast(msg, kind = "ok") {
    this._toast = { msg, kind, until: Date.now() + 3800 };
    this._paintToast();
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => {
      this._toast = null;
      this._paintToast();
    }, 3800);
  }

  _paintToast() {
    const h = this.shadowRoot.querySelector(".toast-host");
    if (!h) return;
    const t = this._toast && this._toast.until > Date.now() ? this._toast : null;
    h.innerHTML = t ? `<div class="toast ${t.kind}">${pi(t.kind === "ok" ? "check" : "warn")}${pesc(t.msg)}</div>` : "";
  }

  // ----------------------------------------------------------------- Rendern
  _renderShell(content) {
    this.shadowRoot.innerHTML = `<style>${PANEL_STYLE}</style><div class="app ${this._narrow ? "is-narrow" : ""}"><div class="glow"></div>${this._headerHtml()}${content}</div>`;
    this._bindHeader();
  }

  _headerHtml() {
    const st = this._data?.entity_id ? this._hass?.states[this._data.entity_id] : null;
    const info0 = st ? STATE_PILL[st.state] || STATE_PILL.unknown : null;
    const info = info0 ? { ...info0, l: PT(info0.l) } : null;
    const select =
      this._entries && this._entries.length > 1
        ? `<select class="inst" aria-label="${PT("Instanz")}">${this._entries
            .map((e) => `<option value="${pesc(e.entry_id)}" ${e.entry_id === this._entryId ? "selected" : ""}>${pesc(e.title)}</option>`)
            .join("")}</select>`
        : "";
    return `
      <header class="top">
        ${this._narrow ? `<button class="iconbtn menu" aria-label="${PT("Menü")}">${pi("menu")}</button>` : ""}
        <img class="logo" src="${P_LOGO}" alt="">
        <div class="ttl"><h1>Safe Home</h1><span>${pesc(this._data?.title || PT("Alarmanlage"))} · ${PT("Einstellungen")}</span></div>
        ${select}
        ${info ? `<span class="pill" style="--tone:${info.c}">${pesc(info.l)}</span>` : ""}
      </header>`;
  }

  _bindHeader() {
    const root = this.shadowRoot;
    root.querySelector(".menu")?.addEventListener("click", () =>
      this.dispatchEvent(new Event("hass-toggle-menu", { bubbles: true, composed: true }))
    );
    root.querySelector(".inst")?.addEventListener("change", async (e) => {
      if (this._dirty() && !confirm(PT("Ungespeicherte Änderungen verwerfen?"))) {
        e.target.value = this._entryId;
        return;
      }
      await this._load(e.target.value);
    });
  }

  _renderEmpty() {
    this._renderShell(`
      <div class="center empty">
        <img src="${this._draft?.ui_theme === "ha" || this.hasAttribute("data-ha") ? P_LOGO_COLOR : P_LOGO}" alt="" class="biglogo">
        <h2>${PT("Noch keine Alarmanlage eingerichtet")}</h2>
        <p>${PT("Füge Safe Home über die Integrationen hinzu – danach kannst du hier alles bequem einstellen.")}</p>
        <a class="btn primary" href="/config/integrations/dashboard/add?domain=safe_home">${pi("plus")} ${PT("Safe Home einrichten")}</a>
      </div>`);
  }

  _render() {
    if (!this._data) return;
    const tab = TABS.find((t) => t.id === this._tab) ? this._tab : "overview";
    const nav = TABS.map(
      (t) => `<button class="tab ${t.id === tab ? "active" : ""}" data-tab="${t.id}">${pi(t.icon)}<span>${PT(t.label)}</span>${
        this._tabErrors(t.id) ? '<i class="dot-err"></i>' : ""
      }</button>`
    ).join("");
    // Position der (auf dem Smartphone waagerecht wischbaren) Reiterleiste merken
    const oldNav = this.shadowRoot.querySelector(".tabs");
    if (oldNav) this._navScroll = oldNav.scrollLeft;
    this._renderShell(`
      <div class="body ${this._narrow ? "narrow" : ""}">
        <nav class="tabs">${nav}</nav>
        <main class="content" data-tab="${tab}">${this._errorsBanner()}${this._tabHtml(tab)}</main>
      </div>
      <div class="savebar"></div>
      <div class="toast-host"></div>`);
    this._applyUiTheme();
    this._keepTabVisible();
    this._bindTab(tab);
    this._paintToast();
    this.shadowRoot.querySelectorAll("[data-tab]").forEach((b) =>
      b.addEventListener("click", () => {
        if (!b.classList.contains("tab")) return;
        this._tab = b.dataset.tab;
        this._store("safe_home_panel_tab", this._tab);
        this._render();
        this.shadowRoot.querySelector(".content")?.scrollTo?.(0, 0);
      })
    );
    this._updateSaveBar();
  }

  /** Reiterleiste bleibt beim Neuzeichnen stehen; der aktive Reiter wird nur bei Bedarf sanft ins Bild geholt. */
  _keepTabVisible() {
    const nav = this.shadowRoot.querySelector(".tabs");
    if (!nav) return;
    if (this._navScroll) nav.scrollLeft = this._navScroll;
    if (nav.scrollWidth <= nav.clientWidth) return;
    const act = nav.querySelector(".tab.active");
    if (!act) return;
    const pad = 24;
    const nr = nav.getBoundingClientRect();
    const ar = act.getBoundingClientRect();
    const left = ar.left - nr.left + nav.scrollLeft;
    const right = left + ar.width;
    let target = nav.scrollLeft;
    if (left - pad < nav.scrollLeft) target = Math.max(0, left - pad);
    else if (right + pad > nav.scrollLeft + nav.clientWidth) target = right + pad - nav.clientWidth;
    if (target !== nav.scrollLeft) nav.scrollLeft = target;
    this._navScroll = nav.scrollLeft;
    nav.addEventListener("scroll", () => (this._navScroll = nav.scrollLeft), { passive: true });
  }

  _tabErrors(tab) {
    const keys = Object.keys(this._errors);
    const map = {
      sensors: ["away_sensors", "night_sensors", "delayed_sensors", "base", "zones", "battery_threshold", "exit_delay_away", "entry_delay_away", "exit_delay_night", "entry_delay_night"],
      actions: ["trigger_time", "siren_duration", "sirens", "alarm_lights", "notify_services", "cameras", "tts_entity", "media_players", "alexa_devices", "whatsapp_recipients", "siren_modes", "siren_time_start", "siren_time_end"],
      automation: ["persons", "auto_arm", "auto_arm_delay", "night_start", "night_end", "week_plan", "week_enabled"],
      household: ["household_sensors"],
      security: ["code", "pins", "code_max_attempts", "code_lockout_minutes", "pin_areas_off"],
    };
    return keys.some((k) => (map[tab] || []).includes(k));
  }

  _errorsBanner() {
    const e = Object.entries(this._errors);
    if (!e.length) return "";
    return `<div class="banner err">${pi("warn")}<div><b>${PT("Nicht gespeichert:")}</b><ul>${e
      .map(([k, v]) => `<li>${pesc(LABELS[k] ? PT(LABELS[k]) : k === "base" ? PT("Sensoren") : k)}: ${pesc(v)}</li>`)
      .join("")}</ul></div></div>`;
  }

  _updateSaveBar() {
    const bar = this.shadowRoot.querySelector(".savebar");
    if (!bar) return;
    const dirty = this._dirty();
    bar.classList.toggle("show", dirty);
    bar.innerHTML = dirty
      ? `<span>${pi("warn")} ${PT("Ungespeicherte Änderungen")}</span>
         <button class="btn ghost" data-sb="discard">${PT("Verwerfen")}</button>
         <button class="btn primary" data-sb="save" ${this._busy ? "disabled" : ""}>${this._busy ? PT("Speichert …") : PT("Speichern")}</button>`
      : "";
    bar.querySelector('[data-sb="discard"]')?.addEventListener("click", () => this._discard());
    bar.querySelector('[data-sb="save"]')?.addEventListener("click", () => this._save());
  }

  _applyUiTheme() {
    let mode = this._draft?.ui_theme || this._data?.options?.ui_theme;
    // Während des Ladens das zuletzt genutzte Design verwenden (kein Aufblitzen des falschen Designs)
    try {
      if (mode) localStorage.setItem("safe_home_ui_theme", mode);
      else mode = localStorage.getItem("safe_home_ui_theme");
    } catch (e) { /* Speicher nicht verfügbar */ }
    this.toggleAttribute("data-ha", mode === "ha");
  }

  _tabHtml(tab) {
    this._collapsible = !["overview", "log", "info"].includes(tab);
    this._secN = 0;
    switch (tab) {
      case "overview": return this._overviewHtml();
      case "sensors": return this._sensorsHtml();
      case "actions": return this._actionsHtml();
      case "automation": return this._automationHtml();
      case "household": return this._householdHtml();
      case "security": return this._securityHtml();
      case "log": return this._logHtml();
      default: return this._infoHtml();
    }
  }

  _section(title, sub, body, cls = "") {
    if (!this._collapsible) return `<section class="box ${cls}"><div class="box-h"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${body}</section>`;
    const id = `${this._tab}:${this._secN++}`;
    const open = this._secIsOpen(id);
    return `<section class="box coll ${open ? "open" : ""} ${cls}" data-sec="${id}">
      <button class="box-h box-tg" type="button" aria-expanded="${open}"><span class="box-tt"><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</span>${pi("chev", "box-chev")}</button>
      <div class="box-b">${body}</div></section>`;
  }

  _expandAll() {
    try {
      return localStorage.getItem("safe_home_expand_all") === "1";
    } catch (e) {
      return false;
    }
  }

  _secMap() {
    if (!this._secState) {
      try {
        this._secState = JSON.parse(localStorage.getItem("safe_home_sections") || "{}") || {};
      } catch (e) {
        this._secState = {};
      }
    }
    return this._secState;
  }

  _secIsOpen(id) {
    if (Object.keys(this._errors || {}).length) return true; // Fehler sollen sichtbar sein
    const m = this._secMap();
    return id in m ? !!m[id] : this._expandAll();
  }

  _bindSections(root) {
    root.querySelectorAll(".box-tg").forEach((b) =>
      b.addEventListener("click", () => {
        const sec = b.closest(".box");
        const open = !sec.classList.contains("open");
        sec.classList.toggle("open", open);
        b.setAttribute("aria-expanded", String(open));
        this._secMap()[sec.dataset.sec] = open;
        this._store("safe_home_sections", JSON.stringify(this._secState));
      })
    );
  }

  // -------------------------------------------------------------- Übersicht
  _overviewHtml() {
    const a = this._hass.states[this._data.entity_id]?.attributes || {};
    const o = this._data.options;
    const monitored = new Set([...(o.away_sensors || []), ...(o.night_sensors || []), ...(o.zones || []).flatMap((z) => z.sensors || [])]);
    const lastAlarm = (this._data.events || []).find((e) => e.type === "triggered");
    const tiles = [
      { ic: "door", v: monitored.size, l: PT("Überwachte Sensoren"), go: "sensors" },
      { ic: "warn", v: (a.open_sensors || []).length, l: PT("Aktuell offen"), go: "sensors", warn: (a.open_sensors || []).length > 0 },
      { ic: "person", v: `${a.people_home ?? 0}/${(o.persons || []).length}`, l: PT("Personen zuhause"), go: "automation" },
      { ic: "alarm", v: lastAlarm ? this._fmt(lastAlarm.time) : "–", l: PT("Letzter Alarm"), go: "log", small: true },
    ];
    const hints = [];
    if (this._resource && this._resource.state !== "ok")
      hints.push(["warn", PT("Die Karte ist noch nicht als Dashboard-Ressource eingetragen – dadurch kann beim Start der App „Konfigurationsfehler“ erscheinen."), "info"]);
    if (!(o.notify_services || []).length) hints.push(["bell", PT("Noch kein Benachrichtigungsdienst – du würdest von einem Alarm unterwegs nichts erfahren."), "actions"]);
    if (!(o.sirens || []).length) hints.push(["speaker", PT("Keine Sirene ausgewählt – ein Alarm wäre vor Ort nicht hörbar."), "actions"]);
    if (!(o.persons || []).length) hints.push(["pin", PT("Keine Personen ausgewählt – die Home-Zone-Automatik ist dadurch inaktiv."), "automation"]);
    if (!(o.delayed_sensors || []).length && (o.away_sensors || []).length) hints.push(["timer", PT("Kein Sensor mit Eingangsverzögerung – beim Heimkommen löst der erste Sensor sofort aus."), "sensors"]);
    if (!o.code && !(o.pins || []).length) hints.push(["lock", PT("Kein PIN gesetzt – jeder mit Zugriff aufs Dashboard kann entschärfen."), "security"]);
    return `
      <div class="tiles">${tiles
        .map((t) => `<button class="tile ${t.warn ? "warn" : ""}" data-go="${t.go}">${pi(t.ic)}<b class="${t.small ? "sm" : ""}">${pesc(t.v)}</b><span>${t.l}</span></button>`)
        .join("")}</div>
      ${
        hints.length
          ? this._section(PT("Empfehlungen"), PT("Kleine Lücken in der Konfiguration"), `<div class="hints">${hints
              .map(([ic, txt, go]) => `<button class="hint" data-go="${go}">${pi(ic)}<span>${txt}</span>${pi("ext", "go")}</button>`)
              .join("")}</div>`)
          : this._section(PT("Alles eingerichtet"), "", `<div class="allgood">${pi("check")} ${PT("Sensoren, Benachrichtigungen, Sirene, Automatik und PIN sind konfiguriert.")}</div>`)
      }
      <div class="cardhost"></div>`;
  }

  // --------------------------------------------------------------- Sensoren
  _sensorRows() {
    const d = this._draft;
    const ids = [...new Set([...(d.away_sensors || []), ...(d.night_sensors || []), ...(d.delayed_sensors || []), ...this._zones().flatMap((z) => z.sensors || [])])];
    return ids;
  }

  // ------------------------------------------------------------- Smartphones (Companion App)
  _phones() {
    const list = Array.isArray(this._data.mobile_apps)
      ? this._data.mobile_apps
      : (this._data.notify_services || [])
          .filter((sv) => sv.startsWith("mobile_app_"))
          .map((sv) => ({ service: sv, name: sv.slice(11).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), model: "", os: "" }));
    return list;
  }

  _phonesHtml() {
    const sel = (this._draft.notify_services || []).map((x) => String(x).replace(/^notify\./, ""));
    const phones = this._phones();
    const known = new Set(phones.map((p) => p.service));
    const other = sel.filter((x) => !known.has(x));
    const byId = Object.fromEntries(phones.map((p) => [p.service, p]));
    const chips = sel.length
      ? sel
          .map((x) => `<span class="np-chip ${known.has(x) ? "" : "other"}">${pi(known.has(x) ? "phone" : "bell")}${pesc(byId[x]?.name || x)}<button class="np-x" data-np-del="${pesc(x)}" aria-label="${PT("Entfernen")}">×</button></span>`)
          .join("")
      : `<span class="np-ph">${PT("Smartphones auswählen")}</span>`;
    const items = phones.length
      ? phones
          .map((p) => {
            const on = sel.includes(p.service);
            return `<button class="np-item ${on ? "on" : ""}" data-np-item="${pesc(p.service)}" role="option" aria-selected="${on}">
              <span class="np-ic">${pi("phone")}</span><span class="np-t"><b>${pesc(p.name)}</b><small>${pesc([p.model, p.os].filter(Boolean).join(" · ") || "notify." + p.service)}</small></span>
              <span class="np-check">${on ? pi("check") : ""}</span></button>`;
          })
          .join("")
      : `<div class="np-empty">${pi("phone")} ${PT("Keine Companion App gefunden – installiere die Home Assistant App auf dem Smartphone und melde dich an.")}</div>`;
    const err = this._errors.notify_services ? `<em class="fb-err">${pesc(this._errors.notify_services)}</em>` : "";
    return `<div class="np ${this._npOpen ? "open" : ""}">
      <span class="np-label">${PT("Smartphones (Companion App)")}</span>
      <div class="np-box"><div class="np-field" data-np-toggle role="button" tabindex="0" aria-expanded="${!!this._npOpen}"><span class="np-chips">${chips}</span><span class="np-chev">${pi("chev")}</span></div>
      ${this._npOpen ? `<div class="np-menu" role="listbox">${items}${other.length ? `<div class="np-other">${PT("Weiterer Dienst")}: ${other.map((o) => pesc(o)).join(", ")}</div>` : ""}</div>` : ""}</div>
      <small class="np-help">${PT("Benachrichtigungen gehen an die ausgewählten Smartphones mit der Home Assistant App.")}</small>${err}
    </div>`;
  }

  _bindPhones() {
    const host = this.shadowRoot.querySelector(".np-host");
    if (!host) return;
    const redraw = () => {
      host.innerHTML = this._phonesHtml();
      this._bindPhones();
    };
    const toggle = () => {
      this._npOpen = !this._npOpen;
      redraw();
    };
    const field = host.querySelector("[data-np-toggle]");
    field?.addEventListener("click", (e) => {
      if (e.target.closest("[data-np-del]")) return;
      toggle();
    });
    field?.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle()));
    host.querySelectorAll("[data-np-item]").forEach((b) =>
      b.addEventListener("click", () => {
        const set = new Set((this._draft.notify_services || []).map((x) => String(x).replace(/^notify\./, "")));
        set.has(b.dataset.npItem) ? set.delete(b.dataset.npItem) : set.add(b.dataset.npItem);
        this._set("notify_services", [...set]);
        redraw();
      })
    );
    host.querySelectorAll("[data-np-del]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        this._set("notify_services", (this._draft.notify_services || []).filter((x) => String(x).replace(/^notify\./, "") !== b.dataset.npDel));
        redraw();
      })
    );
    if (!this._npOutside) {
      this._npOutside = (e) => {
        if (!this._npOpen) return;
        if (!e.composedPath().some((el) => el.classList?.contains("np-host") || el.dataset?.npItem || el.dataset?.npDel !== undefined)) {
          this._npOpen = false;
          const h = this.shadowRoot.querySelector(".np-host");
          if (h) {
            h.innerHTML = this._phonesHtml();
            this._bindPhones();
          }
        }
      };
      this.shadowRoot.addEventListener("click", this._npOutside);
    }
  }

  // ------------------------------------------------------------- Alarm von einem Sensor auslösen
  _drillSensors(kind) {
    const d = this._draft;
    if (kind === "household") return [{ label: PT("Haushalt"), items: this._hhItems().map((i) => i.entity) }];
    const main = [...new Set([...(d.away_sensors || []), ...(d.night_sensors || [])])];
    return [{ label: PT("Hauptbereich"), items: main }, ...this._zones().map((z, i) => ({ label: this._zoneName(z, i), items: z.sensors || [] }))].filter((g) => g.items.length);
  }

  _drillHtml() {
    const kind = this._drillKind || "alarm";
    const info = this._data.drill || { active: false };
    const groups = this._drillSensors(kind);
    const all = groups.flatMap((g) => g.items);
    if (!all.includes(this._drillEntity)) this._drillEntity = all[0] || "";
    const hhOff = kind === "household" && !this._draft.household_enabled;
    const select = all.length
      ? `<select class="fb" data-dsel aria-label="${PT("Sensor")}">${groups
          .map((g) => `<optgroup label="${pesc(g.label)}">${g.items.map((e) => `<option value="${pesc(e)}" ${e === this._drillEntity ? "selected" : ""}>${pesc(this._name(e))}</option>`).join("")}</optgroup>`)
          .join("")}</select>`
      : `<div class="muted">${PT("Noch keine Sensoren angelegt.")}</div>`;
    const armed = this._drillArmed;
    return `<div class="drill ${info.active ? "active" : ""}">
      <div class="drill-h">${pi("alarm")}<div><b>${PT("Alarm von einem Sensor auslösen")}</b><small>${PT("Löst einen echten Alarm aus – Sirenen, Licht, Ansagen, Push und WhatsApp laufen genau wie im Ernstfall. Sag vorher Mitbewohnern und WhatsApp-Empfängern Bescheid. Mit „Rückstellung“ wird alles auf den Zustand davor zurückgesetzt.")}</small></div></div>
      <div class="drill-row">
        <div class="seg2" role="tablist">
          <button class="${kind === "alarm" ? "on" : ""}" data-dk="alarm" role="tab" aria-selected="${kind === "alarm"}">${pi("shield")} ${PT("Alarmanlage")}</button>
          <button class="${kind === "household" ? "on" : ""}" data-dk="household" role="tab" aria-selected="${kind === "household"}">${pi("drop")} ${PT("Haushalt")}</button>
        </div>
        <div class="drill-sel">${select}</div>
        <button class="btn danger ${armed ? "confirm" : ""}" data-drill ${!all.length || hhOff || info.active ? "disabled" : ""}>${pi("alarm")} ${armed ? PT("Jetzt wirklich auslösen?") : PT("Alarm auslösen")}</button>
        <button class="btn ghost" data-drill-reset ${info.active ? "" : "disabled"}>${pi("refresh")} ${PT("Rückstellung")}</button>
      </div>
      ${hhOff ? `<div class="drill-note">${pi("warn")} ${PT("Haushalt ist ausgeschaltet – im Reiter „Haushalt“ einschalten.")}</div>` : ""}
      ${info.active ? `<div class="drill-live">${pi("alarm")}<span><b>${PT("Ausgelöst: {name}", { name: pesc(info.name || this._name(info.entity)) })}</b><small>${PT("Läuft wie ein echter Alarm – zum Beenden „Rückstellung“ drücken.")}</small></span></div>` : ""}
    </div>`;
  }

  _redrawDrill() {
    const host = this.shadowRoot.querySelector(".drill-host");
    if (!host) return;
    host.innerHTML = this._drillHtml();
    this._bindDrill();
  }

  _bindDrill() {
    const host = this.shadowRoot.querySelector(".drill-host");
    if (!host) return;
    host.querySelectorAll("[data-dk]").forEach((b) =>
      b.addEventListener("click", () => {
        this._drillKind = b.dataset.dk;
        this._drillArmed = false;
        this._redrawDrill();
      })
    );
    host.querySelector("[data-dsel]")?.addEventListener("change", (e) => {
      this._drillEntity = e.target.value;
      this._drillArmed = false;
      this._redrawDrill();
    });
    host.querySelector("[data-drill]")?.addEventListener("click", async (e) => {
      if (this._dirty()) {
        this._showToast(PT("Bitte zuerst speichern – ausgelöst wird mit den gespeicherten Einstellungen"), "err");
        return;
      }
      if (!this._drillArmed) {
        this._drillArmed = true;
        this._redrawDrill();
        clearTimeout(this._drillT);
        this._drillT = setTimeout(() => {
          this._drillArmed = false;
          this._redrawDrill();
        }, 5000);
        return;
      }
      clearTimeout(this._drillT);
      this._drillArmed = false;
      e.currentTarget.disabled = true;
      try {
        const res = await this._ws({ type: "safe_home/drill", entry_id: this._entryId, entity_id: this._drillEntity });
        this._data.drill = res.drill;
        this._showToast(res.message, res.drill?.active ? "ok" : "err");
      } catch (err) {
        this._showToast(err?.message || String(err), "err");
      }
      this._redrawDrill();
    });
    host.querySelector("[data-drill-reset]")?.addEventListener("click", async (e) => {
      e.currentTarget.disabled = true;
      try {
        const res = await this._ws({ type: "safe_home/drill", entry_id: this._entryId, reset: true });
        this._data.drill = res.drill;
        this._showToast(res.message, "ok");
      } catch (err) {
        this._showToast(err?.message || String(err), "err");
      }
      this._redrawDrill();
    });
  }

  async _refreshDrill() {
    try {
      const d = await this._ws({ type: "safe_home/config", entry_id: this._entryId });
      const was = JSON.stringify(this._data.drill || {});
      this._data.drill = d.drill || { active: false };
      if (JSON.stringify(this._data.drill) !== was) this._redrawDrill();
    } catch (err) {
      /* nicht kritisch */
    }
  }

  // ------------------------------------------------------------- Art der Sensoren
  _type(eid) {
    const t = (this._draft.sensor_types || {})[eid];
    return SENSOR_TYPES.some((x) => x[0] === t) ? t : inferType(eid, this._hass.states[eid]?.attributes?.device_class);
  }

  _typeIcon(eid) {
    return (SENSOR_TYPES.find((x) => x[0] === this._type(eid)) || SENSOR_TYPES[0])[2];
  }

  _typeSelect(eid) {
    const cur = this._type(eid);
    return `<select class="fb s-type" data-stype="${pesc(eid)}" aria-label="${PT("Art des Sensors")}">${SENSOR_TYPES.map(
      ([v, l]) => `<option value="${v}" ${v === cur ? "selected" : ""}>${PT(l)}</option>`
    ).join("")}</select>`;
  }

  _bindTypes(root) {
    root.querySelectorAll("[data-stype]").forEach((sel) =>
      sel.addEventListener("change", () => {
        this._set("sensor_types", { ...(this._draft.sensor_types || {}), [sel.dataset.stype]: sel.value });
        this._render();
      })
    );
  }

  _isAlexa(eid) {
    const e = this._hass.entities?.[eid];
    if (e) return e.platform === "alexa_media";
    const a = this._hass.states[eid]?.attributes || {};
    return "last_called" in a || "last_called_summary" in a;
  }

  _ttsHintHtml() {
    const d = this._draft;
    if (!d.tts_enabled) return "";
    const wrong = (d.media_players || []).filter((e) => this._isAlexa(e));
    if (!wrong.length) return "";
    return `<div class="wa-note">${pi("warn")}<span>${PT("{names}: Alexa-Gerät – bitte nicht unter „Lautsprecher“ auswählen, sondern über die Checkbox „Alexa-Geräte verwenden“. Bis dahin spricht es trotzdem mit der Alexa-Stimme.", { names: wrong.map((e) => pesc(this._name(e))).join(", ") })}</span></div>`;
  }

  _refreshTtsHint() {
    const el = this.shadowRoot.querySelector(".tts-hint");
    if (el) el.innerHTML = this._ttsHintHtml();
    const prev = this.shadowRoot.querySelector(".tts-prev");
    if (prev && this._draft.tts_enabled) prev.outerHTML = this._ttsPreviewHtml();
  }

  _ttsPreviewHtml() {
    const sample = { door: "Haustür", window: "Küchenfenster", motion: "Flur", presence: "Wohnzimmer", water: "Keller", camera: "Garten" };
    const used = {};
    for (const e of this._monitored()) if (!used[this._type(e)]) used[this._type(e)] = this._name(e);
    const tail = PT("Die Bewohner werden benachrichtigt.");
    const lines = SENSOR_TYPES.map(([t, label, ic]) => {
      const name = used[t] || PT(sample[t]);
      const head = t === "water" ? PT("Achtung, Wasseralarm!") : PT("Achtung, möglicher Einbruch!");
      return `<li>${pi(ic)}<span><small>${PT(label)}</small>„${pesc(`${head} ${PT(SPEECH[t], { name })} ${tail}`)}“</span></li>`;
    });
    const d = this._draft;
    if (d.tts_entry_warning !== false) {
      const delay = Number(d.entry_delay_away ?? 30);
      const rep = Number(d.tts_entry_repeat ?? 10);
      const next = rep > 0 && delay - rep >= 3 ? ` → „${pesc(PT("Bitte Alarmanlage ausschalten – noch {n} Sekunden.", { n: delay - Math.max(5, rep) }))}“ (${PT("alle {s} s wiederholt", { s: Math.max(5, rep) })})` : "";
      lines.push(`<li>${pi("timer")}<span><small>${PT("In der Eingangsverzögerung")}</small>„${pesc(PT("Bitte Alarmanlage innerhalb von {delay} Sekunden ausschalten.", { delay }))}“${next}</span></li>`);
    }
    if (d.tts_household !== false && d.household_enabled)
      lines.push(`<li>${pi("drop")}<span><small>${PT("Haushalt")}</small>„${pesc(PT("Achtung, Wasseralarm! Wasser erkannt: {name}. Bitte sofort prüfen.", { name: PT("Keller") }))}“</span></li>`);
    const alexaNote = d.alexa_enabled && (d.alexa_devices || []).length ? ` ${PT("Alexa-Geräte sprechen mit ihrer eigenen Stimme.")}` : "";
    return `<div class="tts-prev"><b>${pi("speaker")} ${PT("So klingen die Ansagen")}</b><ul>${lines.join("")}</ul><small class="muted">${d.tts_silent_alarm === false ? PT("Bei einem stillen Alarm gibt es keine Ansage.") : PT("Auch bei einem stillen Alarm (Sirene aus) wird angesagt.")}${alexaNote}</small></div>`;
  }

  // ------------------------------------------------------------- Teilbereiche
  _zones() {
    return Array.isArray(this._draft.zones) ? this._draft.zones : [];
  }

  _zoneOf(eid) {
    return this._zones().find((z) => (z.sensors || []).includes(eid)) || null;
  }

  _zoneName(z, i) {
    return (z.name || "").trim() || PT("Teilbereich {n}", { n: i + 1 });
  }

  _setZones(list) {
    this._set("zones", clone(list));
  }

  _zonesHtml() {
    const d = this._draft;
    const zones = this._zones();
    const mainCount = new Set([...(d.away_sensors || []), ...(d.night_sensors || [])]).size;
    const persons = Object.keys(this._hass.states).filter((e) => e.startsWith("person."));
    const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    const hhmm = (v) => String(v || "").slice(0, 5);
    const sw = (key, on, label) => `<button class="sw ${on ? "on" : ""}" data-zsw="${key}" role="switch" aria-checked="${on}" aria-label="${label}"><i></i></button>`;
    const cards = zones
      .map((z, i) => {
        const n = (z.sensors || []).length;
        const zdays = Array.isArray(z.days) ? z.days : [0, 1, 2, 3, 4, 5, 6];
        const zp = z.persons || [];
        return `<div class="area zone" data-zi="${i}">
          <div class="area-h">
            <span class="area-ic">${pi("lock")}</span>
            <input class="fb zname" data-zf="name" maxlength="40" value="${pesc(z.name || "")}" placeholder="${PT("Name, z. B. Garage")}" aria-label="${PT("Name")}">
            <span class="chip">${PT(n === 1 ? "1 Sensor" : "{n} Sensoren", { n })}</span>
            <button class="iconbtn" data-zdel="${i}" aria-label="${PT("Teilbereich löschen")}" title="${PT("Teilbereich löschen")}">${pi("trash")}</button>
          </div>
          ${n ? "" : `<div class="area-hint">${pi("door")} ${PT("Noch keine Sensoren – ordne unten in der Tabelle Sensoren diesem Bereich zu.")}</div>`}
          <div class="area-grid">
            <label>${PT("Ausgangsverzögerung (s)")}<input class="fb" type="number" min="0" max="3600" data-zf="exit_delay" value="${pesc(z.exit_delay ?? 30)}"></label>
            <label>${PT("Eingangsverzögerung (s)")}<input class="fb" type="number" min="0" max="3600" data-zf="entry_delay" value="${pesc(z.entry_delay ?? 15)}"></label>
          </div>
          <div class="area-opt">
            <div class="area-sw">${pi("clock")}<div><b>${PT("Kernzeiten")}</b><small>${PT("Zur Startzeit an den gewählten Tagen scharf, zur Endzeit unscharf.")}</small></div>${sw("schedule_enabled", !!z.schedule_enabled, PT("Kernzeiten"))}</div>
            ${
              z.schedule_enabled
                ? `<div class="area-sub">
                    <div class="area-grid">
                      <label>${PT("Scharf ab")}<input class="fb" type="time" data-zf="arm_time" value="${hhmm(z.arm_time || "22:00")}"></label>
                      <label>${PT("Unscharf ab")}<input class="fb" type="time" data-zf="disarm_time" value="${hhmm(z.disarm_time || "06:00")}"></label>
                    </div>
                    <div class="pills">${days.map((l, k) => `<button class="pill ${zdays.includes(k) ? "on" : ""}" data-zday="${k}" aria-pressed="${zdays.includes(k)}">${PT(l)}</button>`).join("")}</div>
                  </div>`
                : ""
            }
            ${this._zoneSirenHtml(z)}
            <div class="area-sw">${pi("person")}<div><b>${PT("Eigene Anwesenheit")}</b><small>${PT("Scharf, wenn alle gewählten Personen weg sind – unscharf, sobald eine zurückkommt.")}</small></div>${sw("presence_enabled", !!z.presence_enabled, PT("Eigene Anwesenheit"))}</div>
            ${
              z.presence_enabled
                ? `<div class="area-sub"><div class="pills">${
                    persons.length
                      ? persons.map((p) => `<button class="pill ${zp.includes(p) ? "on" : ""}" data-zperson="${pesc(p)}" aria-pressed="${zp.includes(p)}">${pi("person")}${pesc(this._name(p))}</button>`).join("")
                      : `<span class="muted">${PT("Keine Personen in Home Assistant gefunden.")}</span>`
                  }</div></div>`
                : ""
            }
          </div>
        </div>`;
      })
      .join("");
    return this._section(
      PT("Bereiche"),
      PT("Hauptbereich = Alarmanlage mit Zuhause, Unterwegs und Nacht. Dazu bis zu 3 Teilbereiche, z. B. Garage."),
      `<div class="areas">
        <div class="area main">
          <div class="area-h"><span class="area-ic">${pi("shield")}</span><div class="area-t"><input class="fb zname" data-mainname maxlength="60" value="${pesc(this._title || "")}" placeholder="${PT("Name der Alarmanlage")}" aria-label="${PT("Name der Alarmanlage")}"><small>${PT("Hauptbereich")} · ${PT("Zuhause, Unterwegs, Nacht")}</small></div><span class="chip">${PT(mainCount === 1 ? "1 Sensor" : "{n} Sensoren", { n: mainCount })}</span></div>
        </div>
        ${cards}
        ${zones.length < 3 ? `<button class="btn soft zadd" data-zadd>${pi("plus")} ${PT("Teilbereich hinzufügen")}</button>` : ""}
      </div>`
    );
  }

  _batteryListHtml() {
    const a = this._hass?.states?.[this._data?.entity_id]?.attributes || {};
    const low = Array.isArray(a.battery_low) ? a.battery_low : [];
    if (this._draft.battery_enabled === false) return "";
    if (!low.length) return `<div class="allgood bat-ok">${pi("check")} ${PT("Alle Batterien in Ordnung")}</div>`;
    return `<div class="bat-list">${low
      .map((b) => `<span class="chip bat">${pi("battery")}${pesc(this._name(b.entity))}<em>${b.level != null ? `${b.level} %` : PT("schwach")}</em></span>`)
      .join("")}</div>`;
  }

  _zoneSirenHtml(z) {
    const mode = ["own", "off"].includes(z.siren_mode) ? z.siren_mode : "shared";
    const sel = z.sirens || [];
    const cands = [...new Set([...Object.keys(this._hass.states).filter((e) => e.startsWith("siren.")), ...(this._draft.sirens || []), ...sel])];
    const tb = (k, ic, l) => `<button class="${mode === k ? "on" : ""}" data-zsmode="${k}">${pi(ic)} ${PT(l)}</button>`;
    const note = { shared: "Es ertönen die Sirenen unter „Alarm-Aktionen“.", own: "Nur die hier gewählten Sirenen ertönen.", off: "Stiller Alarm – Benachrichtigungen, Licht und Ansage laufen trotzdem." }[mode];
    return `<div class="area-sw area-siren">${pi("speaker")}<div><b>${PT("Sirene")}</b><small>${PT(note)}</small></div></div>
      <div class="area-sub">
        <div class="seg2 zs-seg">${tb("shared", "home", "Wie Hauptbereich")}${tb("own", "speaker", "Eigene Sirenen")}${tb("off", "close", "Keine Sirene")}</div>
        ${
          mode === "own"
            ? `<div class="pills">${
                cands.length
                  ? cands.map((e) => `<button class="pill ${sel.includes(e) ? "on" : ""}" data-zsiren="${pesc(e)}" aria-pressed="${sel.includes(e)}">${pi("speaker")}${pesc(this._name(e))}</button>`).join("")
                  : `<span class="muted">${PT("Noch keine Sirene in Home Assistant gefunden – Entität unten eintragen.")}</span>`
              }</div>
              <input class="fb zs-add" list="zs-ents" placeholder="${PT("Weitere Entität, z. B. switch.aussensirene")}">
              <datalist id="zs-ents">${Object.keys(this._hass.states)
                .filter((e) => /^(siren|switch|input_boolean|script)\./.test(e))
                .map((e) => `<option value="${pesc(e)}">${pesc(this._name(e))}</option>`)
                .join("")}</datalist>`
            : ""
        }
      </div>`;
  }

  _bindZones(root) {
    root.querySelector("[data-mainname]")?.addEventListener("input", (e) => this._set("name", e.target.value));
    const zi = (el) => Number(el.closest("[data-zi]").dataset.zi);
    const upd = (i, fn) => {
      const list = clone(this._zones());
      fn(list[i]);
      this._setZones(list);
    };
    root.querySelectorAll("[data-zi] [data-zf]").forEach((inp) => {
      const f = inp.dataset.zf;
      if (f === "name") inp.addEventListener("input", () => upd(zi(inp), (z) => (z.name = inp.value)));
      inp.addEventListener("change", () => {
        upd(zi(inp), (z) => {
          if (f === "name") z.name = inp.value.trim();
          else if (f === "arm_time" || f === "disarm_time") z[f] = inp.value ? `${inp.value.slice(0, 5)}:00` : z[f];
          else z[f] = Math.max(0, Math.min(3600, Math.round(Number(inp.value) || 0)));
        });
        this._render();
      });
    });
    root.querySelectorAll("[data-zi] [data-zsw]").forEach((b) =>
      b.addEventListener("click", () => {
        upd(zi(b), (z) => (z[b.dataset.zsw] = !z[b.dataset.zsw]));
        this._render();
      })
    );
    root.querySelectorAll("[data-zi] [data-zday]").forEach((b) =>
      b.addEventListener("click", () => {
        const k = Number(b.dataset.zday);
        upd(zi(b), (z) => {
          const set = new Set(Array.isArray(z.days) ? z.days : [0, 1, 2, 3, 4, 5, 6]);
          set.has(k) ? set.delete(k) : set.add(k);
          z.days = [...set].sort();
        });
        this._render();
      })
    );
    root.querySelectorAll("[data-zi] [data-zsmode]").forEach((b) =>
      b.addEventListener("click", () => {
        upd(zi(b), (z) => (z.siren_mode = b.dataset.zsmode));
        this._render();
      })
    );
    root.querySelectorAll("[data-zi] [data-zsiren]").forEach((b) =>
      b.addEventListener("click", () => {
        const e = b.dataset.zsiren;
        upd(zi(b), (z) => {
          const set = new Set(z.sirens || []);
          set.has(e) ? set.delete(e) : set.add(e);
          z.sirens = [...set];
        });
        this._render();
      })
    );
    root.querySelectorAll("[data-zi] .zs-add").forEach((inp) =>
      inp.addEventListener("change", () => {
        const e = inp.value.trim();
        if (!/^[a-z_]+\.[a-z0-9_]+$/.test(e)) return;
        upd(zi(inp), (z) => (z.sirens = [...new Set([...(z.sirens || []), e])]));
        this._render();
      })
    );
    root.querySelectorAll("[data-zi] [data-zperson]").forEach((b) =>
      b.addEventListener("click", () => {
        const p = b.dataset.zperson;
        upd(zi(b), (z) => {
          const set = new Set(z.persons || []);
          set.has(p) ? set.delete(p) : set.add(p);
          z.persons = [...set];
        });
        this._render();
      })
    );
    root.querySelectorAll("[data-zdel]").forEach((b) =>
      b.addEventListener("click", () => {
        const list = clone(this._zones());
        const [gone] = list.splice(Number(b.dataset.zdel), 1);
        this._setZones(list);
        for (const e of gone?.sensors || []) this._toMain(e, (gone.delayed_sensors || []).includes(e));
        if ((gone?.sensors || []).length) this._showToast(PT("Teilbereich gelöscht – seine Sensoren gehören wieder zum Hauptbereich"), "ok");
        this._render();
      })
    );
    root.querySelector("[data-zadd]")?.addEventListener("click", () => {
      const list = clone(this._zones());
      if (list.length >= 3) return;
      const used = new Set(list.map((z) => z.id));
      const id = ["z1", "z2", "z3"].find((x) => !used.has(x));
      list.push({ id, name: "", sensors: [], delayed_sensors: [], exit_delay: 30, entry_delay: 15, schedule_enabled: false, arm_time: "22:00:00", disarm_time: "06:00:00", days: [0, 1, 2, 3, 4, 5, 6], presence_enabled: false, persons: [], siren_mode: "shared", sirens: [] });
      this._setZones(list);
      this._render();
      const names = this.shadowRoot.querySelectorAll(".zname");
      names[names.length - 1]?.focus();
    });
    root.querySelectorAll("[data-area]").forEach((sel) => sel.addEventListener("change", () => this._moveSensor(sel.dataset.area, sel.value)));
    root.querySelectorAll("[data-zdelay]").forEach((b) =>
      b.addEventListener("click", () => {
        const eid = b.dataset.zdelay;
        const list = clone(this._zones());
        const z = list.find((x) => (x.sensors || []).includes(eid));
        if (!z) return;
        const set = new Set(z.delayed_sensors || []);
        set.has(eid) ? set.delete(eid) : set.add(eid);
        z.delayed_sensors = [...set];
        this._setZones(list);
        this._render();
      })
    );
  }

  _toMain(eid, delayed) {
    const d = this._draft;
    const dc = this._hass.states[eid]?.attributes?.device_class;
    if (!(d.away_sensors || []).includes(eid)) d.away_sensors = [...(d.away_sensors || []), eid];
    if (["door", "window", "opening", "garage_door"].includes(dc) && !(d.night_sensors || []).includes(eid)) d.night_sensors = [...(d.night_sensors || []), eid];
    if (delayed && !(d.delayed_sensors || []).includes(eid)) d.delayed_sensors = [...(d.delayed_sensors || []), eid];
  }

  _moveSensor(eid, target) {
    const d = this._draft;
    const cur = this._zoneOf(eid);
    if ((cur?.id || "main") === target) return;
    const delayed = cur ? (cur.delayed_sensors || []).includes(eid) : (d.delayed_sensors || []).includes(eid);
    for (const k of ["away_sensors", "night_sensors", "delayed_sensors"]) d[k] = (d[k] || []).filter((e) => e !== eid);
    const list = clone(this._zones()).map((z) => ({ ...z, sensors: (z.sensors || []).filter((e) => e !== eid), delayed_sensors: (z.delayed_sensors || []).filter((e) => e !== eid) }));
    if (target === "main") this._toMain(eid, delayed);
    else {
      const z = list.find((x) => x.id === target);
      if (z) {
        z.sensors.push(eid);
        if (delayed) z.delayed_sensors.push(eid);
      }
    }
    this._setZones(list);
    delete this._errors.base;
    this._render();
  }

  _sensorsHtml() {
    const d = this._draft;
    const zones = this._zones();
    const ids = this._sensorRows();
    const q = this._search.toLowerCase();
    const shown = ids.filter((e) => !q || e.includes(q) || this._name(e).toLowerCase().includes(q));
    const suggestions = this._suggestions();
    const rows = shown
      .map((eid) => {
        const ic = this._typeIcon(eid);
        const sw = (key, on, label) =>
          `<button class="sw ${on ? "on" : ""}" data-sw="${key}" data-eid="${pesc(eid)}" role="switch" aria-checked="${on}" aria-label="${label}"><i></i></button>`;
        const zone = this._zoneOf(eid);
        const areaSel = zones.length
          ? `<div class="s-sw s-area" data-label="${PT("Bereich")}"><select class="fb" data-area="${pesc(eid)}" aria-label="${PT("Bereich")}">
              <option value="main" ${zone ? "" : "selected"}>${PT("Hauptbereich")}</option>
              ${zones.map((z, i) => `<option value="${pesc(z.id)}" ${zone?.id === z.id ? "selected" : ""}>${pesc(this._zoneName(z, i))}</option>`).join("")}
            </select></div>`
          : "";
        const na = `<span class="na" title="${PT("Bei Teilbereichen gibt es keine Modi – der Sensor ist überwacht, sobald der Bereich scharf ist.")}">–</span>`;
        const modeCells = zone
          ? `<div class="s-sw s-zonemode" data-label="${PT("Unterwegs")} / ${PT("Nacht")}">${na}</div><div class="s-sw s-na">${na}</div>
             <div class="s-sw" data-label="${PT("Eingangsverzögerung")}"><button class="sw ${(zone.delayed_sensors || []).includes(eid) ? "on" : ""}" data-zdelay="${pesc(eid)}" role="switch" aria-checked="${(zone.delayed_sensors || []).includes(eid)}" aria-label="${PT("Eingangsverzögerung")}"><i></i></button></div>`
          : `<div class="s-sw" data-label="${PT("Unterwegs")}">${sw("away_sensors", (d.away_sensors || []).includes(eid), PT("Unterwegs"))}</div>
          <div class="s-sw" data-label="${PT("Nacht")}">${sw("night_sensors", (d.night_sensors || []).includes(eid), PT("Nacht"))}</div>
          <div class="s-sw" data-label="${PT("Eingangsverzögerung")}">${sw("delayed_sensors", (d.delayed_sensors || []).includes(eid), PT("Eingangsverzögerung"))}</div>`;
        return `<div class="srow ${zones.length ? "has-area" : ""} ${zone ? "in-zone" : ""}" data-eid="${pesc(eid)}">
          <div class="s-name">${pi(ic)}<div><b>${pesc(this._name(eid))}</b><small>${pesc(eid)}${this._area(eid) ? ` · ${pesc(this._area(eid))}` : ""}</small></div></div>
          <div class="s-sw s-typ" data-label="${PT("Art")}">${this._typeSelect(eid)}</div>
          <div class="s-state" data-live="${pesc(eid)}">${this._stateChip(eid)}</div>
          ${areaSel}
          ${modeCells}
          <div class="s-del"><button class="iconbtn" data-del="${pesc(eid)}" aria-label="${PT("Entfernen")}">${pi("trash")}</button></div>
        </div>`;
      })
      .join("");
    const counts = `<span class="chip">${PT("{n} Unterwegs", { n: (d.away_sensors || []).length })}</span><span class="chip">${PT("{n} Nacht", { n: (d.night_sensors || []).length })}</span><span class="chip">${PT("{n} mit Verzögerung", { n: (d.delayed_sensors || []).length })}</span>${zones
      .map((z, i) => `<span class="chip zc">${pi("lock")}${pesc(this._zoneName(z, i))}: ${(z.sensors || []).length}</span>`)
      .join("")}`;
    return `
      ${this._zonesHtml()}
      ${this._section(
        PT("Überwachte Sensoren"),
        PT("Je Sensor: Art, Bereich und in welchem Modus er überwacht wird."),
        `<div class="toolbar">
          <label class="search">${pi("search")}<input type="search" placeholder="${PT("Sensor suchen")}" value="${pesc(this._search)}"></label>
          <div class="addhost"></div>
          ${suggestions.length ? `<button class="btn soft" data-suggest>${pi("spark")} ${PT("{n} Vorschläge hinzufügen", { n: suggestions.length })}</button>` : ""}
        </div>
        <div class="counts">${counts}</div>
        ${
          ids.length
            ? `<div class="stable">
                <div class="shead ${zones.length ? "has-area" : ""}"><span>${PT("Sensor")}</span><span>${PT("Art")}</span><span>${PT("Zustand")}</span>${zones.length ? `<span>${PT("Bereich")}</span>` : ""}<span>${pi("away")}${PT("Unterwegs")}</span><span>${pi("night")}${PT("Nacht")}</span><span>${pi("timer")}${PT("Verzögert")}</span><span></span></div>
                ${rows || `<div class="muted pad">${PT("Kein Treffer für „{q}“", { q: pesc(this._search) })}</div>`}
              </div>`
            : `<div class="emptybox">${pi("door")}<p>${PT("Noch keine Sensoren. Füge oben einen Sensor hinzu oder übernimm die Vorschläge.")}</p></div>`
        }`
      )}
      ${this._delaysHtml()}
      ${this._section(
        PT("Überwachung"),
        PT("Offene und nicht erreichbare Sensoren, Batterien."),
        `<div class="formhost" data-form="sensor_behaviour"></div><h3 class="sub-h">${pi("battery")} ${PT("Batterien")}</h3>${this._batteryListHtml()}<div class="formhost" data-form="battery"></div>`
      )}`;
  }

  _suggestions() {
    const have = new Set(this._sensorRows());
    return Object.keys(this._hass.states)
      .filter((e) => e.startsWith("binary_sensor.") && !have.has(e))
      .filter((e) => SUGGEST_CLASSES.includes(this._hass.states[e].attributes.device_class));
  }

  _stateChip(eid) {
    const s = this._hass.states[eid];
    if (!s) return `<span class="st off">${PT("Nicht gefunden")}</span>`;
    if (s.state === "unavailable" || s.state === "unknown") return `<span class="st off">${PT("Nicht erreichbar")}</span>`;
    const txt = STATE_TEXT[s.attributes.device_class] || ["Aus", "An"];
    return s.state === "on" ? `<span class="st on">${PT(txt[1])}</span>` : `<span class="st ok">${PT(txt[0])}</span>`;
  }

  _toggleSensor(key, eid) {
    const list = new Set(this._draft[key] || []);
    if (list.has(eid)) list.delete(eid);
    else list.add(eid);
    this._draft[key] = [...list];
    if (key !== "delayed_sensors" && list.has(eid) === false) {
      // nicht mehr überwacht -> Verzögerung entfernen
      const mon = new Set([...(this._draft.away_sensors || []), ...(this._draft.night_sensors || [])]);
      if (!mon.has(eid)) this._draft.delayed_sensors = (this._draft.delayed_sensors || []).filter((e) => e !== eid);
    }
    if (key === "delayed_sensors" && list.has(eid)) {
      const mon = new Set([...(this._draft.away_sensors || []), ...(this._draft.night_sensors || [])]);
      if (!mon.has(eid)) this._draft.away_sensors = [...(this._draft.away_sensors || []), eid];
    }
    delete this._errors.base;
    this._render();
  }

  _addSensor(eid) {
    if (!eid || this._sensorRows().includes(eid)) return;
    const dc = this._hass.states[eid]?.attributes?.device_class;
    this._draft.away_sensors = [...(this._draft.away_sensors || []), eid];
    if (["door", "window", "opening", "garage_door"].includes(dc)) this._draft.night_sensors = [...(this._draft.night_sensors || []), eid];
    delete this._errors.base;
    this._render();
  }

  _removeSensor(eid) {
    for (const k of ["away_sensors", "night_sensors", "delayed_sensors"]) this._draft[k] = (this._draft[k] || []).filter((e) => e !== eid);
    if (this._zoneOf(eid))
      this._setZones(this._zones().map((z) => ({ ...z, sensors: (z.sensors || []).filter((e) => e !== eid), delayed_sensors: (z.delayed_sensors || []).filter((e) => e !== eid) })));
    this._render();
  }

  // ------------------------------------------------------------------ Zeiten
  _delaysHtml() {
    const d = this._draft;
    const seg = (w, cls, label, val) => `<div class="seg ${cls}" style="flex:${Math.max(w, 6)}"><b>${label}</b><span>${val}</span></div>`;
    // Alarm = Sirene (akustisch) + stiller Rest, danach ggf. wieder scharf
    const alarm = Number(d.trigger_time) || 0;
    const siren = d.siren_duration == null ? alarm : Number(d.siren_duration) || 0;
    const loud = siren === 0 ? alarm : alarm === 0 ? siren : Math.min(siren, alarm);
    const w = (x) => Math.min(Math.max(x, 0), 120);
    let alarmSegs;
    if (alarm === 0 && siren === 0) alarmSegs = seg(60, "alarm", PT("Alarm mit Sirene"), PT("bis Aus"));
    else {
      alarmSegs = seg(w(loud) || 30, "alarm", PT("Alarm mit Sirene"), fmtDur(loud));
      if (alarm === 0) alarmSegs += seg(40, "silent", PT("Stiller Alarm"), PT("bis Aus"));
      else if (alarm > loud) alarmSegs += seg(w(alarm - loud), "silent", PT("Stiller Alarm"), fmtDur(alarm - loud));
      if (alarm > 0) alarmSegs += seg(34, d.rearm_after_trigger ? "armed" : "silent", d.rearm_after_trigger ? PT("Wieder scharf") : PT("Alarm bleibt"), d.rearm_after_trigger ? "" : PT("bis Aus"));
    }
    const tl = (mode, exit, entry) => `
      <div class="tl">
        <div class="tl-h">${pi(mode === "away" ? "away" : "night")} ${mode === "away" ? PT("Unterwegs") : PT("Nacht")}</div>
        <div class="tl-bar">
          ${seg(exit, "exit", PT("Ausgangsverzögerung"), exit ? `${exit} s` : PT("sofort"))}
          ${seg(30, "armed", PT("Scharf"), PT("überwacht"))}
          ${seg(entry, "entry", PT("Eingangsverzögerung"), entry ? `${entry} s` : PT("sofort"))}
          ${alarmSegs}
        </div>
      </div>`;
    return this._section(
      PT("Verzögerungen"),
      PT("Zeit zum Verlassen und zum Entschärfen beim Heimkommen – in Sekunden."),
      `<div class="tl-host">${tl("away", d.exit_delay_away, d.entry_delay_away)}${tl("night", d.exit_delay_night, d.entry_delay_night)}</div><div class="formhost" data-form="delays"></div>`
    );
  }

  // ---------------------------------------------------------------- Wochenplan
  _week() {
    const w = Array.isArray(this._draft.week_plan) ? this._draft.week_plan : [];
    return [0, 1, 2, 3, 4, 5, 6].map((d) => (Array.isArray(w[d]) ? w[d].map((b) => [Number(b[0]) || 0, Number(b[1]) || 0, b[2] === "night" ? "night" : "away"]) : []));
  }

  /** Wochenplan wirksam? (angehakt und „Anwesenheit“ aus) – dann ist der Nachtmodus-Zeitplan pausiert. */
  _weekRules() {
    return !!this._draft.week_enabled && !this._presenceOn();
  }

  _presenceOn() {
    const a = this._hass?.states?.[this._data?.entity_id]?.attributes || {};
    return a.auto_mode !== undefined ? !!a.auto_mode : true;
  }

  static wkApply(bars, s, e, mode) {
    const out = [];
    for (const b of bars) {
      if (b[1] <= s || b[0] >= e) out.push([...b]);
      else {
        if (b[0] < s) out.push([b[0], s, b[2]]);
        if (b[1] > e) out.push([e, b[1], b[2]]);
      }
    }
    if (mode && e > s) out.push([s, e, mode]);
    out.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const b of out) {
      const last = merged[merged.length - 1];
      if (last && last[2] === b[2] && b[0] <= last[1]) last[1] = Math.max(last[1], b[1]);
      else if (b[1] - b[0] >= 5) merged.push(b);
    }
    return merged;
  }

  _wkRowHtml(bars) {
    const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    return bars
      .map(([a, b, m], i) => {
        const w = ((b - a) / 1440) * 100;
        const label = `${hm(a)}–${hm(b)}`;
        return `<div class="wk-bar m-${m}" data-b="${i}" style="left:${(a / 1440) * 100}%;width:${w}%" title="${PT(m === "night" ? "Nacht" : "Unterwegs")} ${label}">
          <i class="wk-h" data-side="l"></i>${w >= 13 ? `<span>${label}</span>` : ""}<i class="wk-h" data-side="r"></i></div>`;
      })
      .join("");
  }

  _weekHtml() {
    const dis = this._presenceOn();
    const tool = this._wkTool || "away";
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    const short = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    const week = this._week();
    const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => `<span class="${h % 6 ? "odd" : ""}" style="left:${(h / 24) * 100}%">${String(h).padStart(2, "0")}</span>`).join("");
    const tb = (k, ic, l) => `<button class="${tool === k ? "on" : ""}" data-wktool="${k}">${pi(ic)} ${PT(l)}</button>`;
    return `<div class="wk ${dis ? "dis" : ""}">
      ${dis ? `<div class="wk-off">${pi("pin")}<span>${PT("Ausgegraut, solange „Anwesenheit“ eingeschaltet ist.")}</span></div>` : `<div class="wk-note">${pi("info")}<span>${PT("Solange der Wochenplan aktiv ist, pausiert der Nachtmodus-Zeitplan.")}</span></div>`}
      <div class="wk-body" ${dis ? 'inert aria-disabled="true"' : ""}>
        <label class="fb-check wk-en"><input type="checkbox" data-wk-en ${this._draft.week_enabled ? "checked" : ""}> ${PT("Wochenplan verwenden")}</label>
        <div class="wk-tools">
          <span class="wk-lbl">${PT("Zeichnen")}</span>
          <div class="seg2">${tb("away", "away", "Unterwegs")}${tb("night", "night", "Nacht")}${tb("off", "home", "Unscharf")}</div>
          <span class="wk-sp"></span>
          <button class="btn ghost sm" data-wkcopy>${PT("Montag auf Di–Fr kopieren")}</button>
          <button class="btn ghost sm" data-wkclear>${PT("Alles leeren")}</button>
        </div>
        <div class="wk-grid">
          <div class="wk-row wk-hours"><span class="wk-day"></span><div class="wk-scale">${hours}</div></div>
          ${week
            .map(
              (bars, d) => `<div class="wk-row"><span class="wk-day" title="${PT(days[d])}">${PT(short[d])}</span><div class="wk-track" data-day="${d}">${this._wkRowHtml(bars)}</div></div>`
            )
            .join("")}
        </div>
        <div class="wk-read" aria-live="polite"></div>
        <div class="wk-legend"><span><i class="m-away"></i>${PT("Unterwegs")}</span><span><i class="m-night"></i>${PT("Nacht")}</span><span><i class="m-off"></i>${PT("Unscharf")}</span></div>
        <p class="muted small-note">${PT("Ziehen trägt einen Balken ein, an den Rändern ziehen ändert die Zeit, den Balken ziehen verschiebt ihn. Mit „Unscharf“ löschst du Zeiten. Raster: 15 Minuten.")} ${PT("Zum Beginn eines Balkens wird scharf geschaltet (mit Ausgangsverzögerung), zum Ende wieder unscharf – aber nur, wenn der Wochenplan scharf geschaltet hat. Von Hand gewählte Modi bleiben unangetastet.")}</p>
      </div>
    </div>`;
  }

  _redrawWeek() {
    const host = this.shadowRoot.querySelector(".wk-host");
    if (!host) return;
    host.innerHTML = this._weekHtml();
    this._bindWeek();
  }

  _setWeek(week) {
    this._set("week_plan", week.map((d) => d.map((b) => [...b])));
  }

  _bindWeek() {
    const host = this.shadowRoot.querySelector(".wk-host");
    if (!host) return;
    host.querySelector("[data-go]")?.addEventListener("click", () => {
      this._tab = "automation";
      this._store("safe_home_panel_tab", this._tab);
      this._render();
    });
    host.querySelector("[data-wk-en]")?.addEventListener("change", (e) => this._set("week_enabled", e.target.checked));
    host.querySelectorAll("[data-wktool]").forEach((b) =>
      b.addEventListener("click", () => {
        this._wkTool = b.dataset.wktool;
        this._redrawWeek();
      })
    );
    host.querySelector("[data-wkcopy]")?.addEventListener("click", () => {
      const w = this._week();
      for (let d = 1; d <= 4; d++) w[d] = w[0].map((b) => [...b]);
      this._setWeek(w);
      this._redrawWeek();
    });
    host.querySelector("[data-wkclear]")?.addEventListener("click", () => {
      this._setWeek([[], [], [], [], [], [], []]);
      this._redrawWeek();
    });
    const read = host.querySelector(".wk-read");
    const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    host.querySelectorAll(".wk-track").forEach((track) => {
      const day = Number(track.dataset.day);
      const toMin = (x) => {
        const r = track.getBoundingClientRect();
        return Math.max(0, Math.min(1440, Math.round((((x - r.left) / r.width) * 1440) / 15) * 15));
      };
      track.addEventListener("pointerdown", (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        e.preventDefault();
        const week = this._week();
        const bars = week[day];
        const barEl = e.target.closest(".wk-bar");
        const idx = barEl ? Number(barEl.dataset.b) : -1;
        const side = e.target.closest(".wk-h")?.dataset.side;
        const m0 = toMin(e.clientX);
        const tool = this._wkTool || "away";
        let drag;
        if (idx >= 0 && side) drag = { kind: "resize", bar: bars[idx], side };
        else if (idx >= 0 && tool !== "off") drag = { kind: "move", bar: bars[idx], off: m0 - bars[idx][0] };
        else drag = { kind: "paint", start: m0, tool, onBar: idx };
        drag.moved = false;
        try {
          track.setPointerCapture(e.pointerId);
        } catch (err) {
          /* egal */
        }
        const preview = (x) => {
          const m = toMin(x);
          if (Math.abs(m - m0) >= 15) drag.moved = true;
          const rest = drag.bar ? bars.filter((b) => b !== drag.bar) : bars;
          let s, en, mode;
          if (drag.kind === "resize") {
            [s, en, mode] = drag.bar;
            if (drag.side === "l") s = Math.min(m, en - 15);
            else en = Math.max(m, s + 15);
          } else if (drag.kind === "move") {
            const len = drag.bar[1] - drag.bar[0];
            s = Math.max(0, Math.min(1440 - len, m - drag.off));
            en = s + len;
            mode = drag.bar[2];
          } else {
            s = Math.min(m0, m);
            en = Math.max(m0, m);
            mode = drag.tool === "off" ? null : drag.tool;
          }
          drag.result = SafeHomePanel.wkApply(rest, s, en, mode);
          drag.range = [s, en, mode];
          track.innerHTML = this._wkRowHtml(drag.result);
          if (read) read.textContent = `${PT(days[day])}: ${hm(s)}–${hm(en)} · ${mode ? PT(mode === "night" ? "Nacht" : "Unterwegs") : PT("Unscharf")}`;
        };
        const move = (ev) => preview(ev.clientX);
        const up = (ev) => {
          track.removeEventListener("pointermove", move);
          track.removeEventListener("pointerup", up);
          track.removeEventListener("pointercancel", up);
          if (!drag.moved) {
            // Antippen: leere Stelle -> 1-Stunden-Balken, Balken mit „Unscharf“ -> löschen, sonst Modus wechseln
            if (drag.kind === "paint" && drag.onBar >= 0 && drag.tool === "off") week[day] = bars.filter((_, i) => i !== drag.onBar);
            else if (drag.kind === "move" && drag.bar[2] !== tool) week[day] = SafeHomePanel.wkApply(bars.filter((b) => b !== drag.bar), drag.bar[0], drag.bar[1], tool);
            else if (drag.kind === "paint" && drag.tool !== "off") {
              const s = Math.max(0, Math.min(1380, Math.floor(m0 / 60) * 60));
              week[day] = SafeHomePanel.wkApply(bars, s, s + 60, drag.tool);
            } else {
              this._redrawWeek();
              return;
            }
          } else week[day] = drag.result || bars;
          this._setWeek(week);
          this._redrawWeek();
        };
        track.addEventListener("pointermove", move);
        track.addEventListener("pointerup", up);
        track.addEventListener("pointercancel", up);
      });
    });
  }

  // ---------------------------------------------------------------- Aktionen
  _actionsHtml() {
    const tests = [
      ["notify", "bell", PT("Benachrichtigung")],
      ["siren", "speaker", PT("Sirene (3 s)")],
      ["lights", "bulb", PT("Alarmlicht (5 s)")],
      ["tts", "speaker", PT("Ansage")],
      ["whatsapp", "chat", PT("WhatsApp")],
    ];
    return `
      ${this._section(
        PT("Sirene & Licht"),
        PT("Was vor Ort passiert – und wann die Sirene ertönt."),
        `<div class="formhost" data-form="lights"></div>${this._sirenSummaryHtml()}<div class="formhost" data-form="siren"></div><div class="si-host">${this._sirenSensorsHtml()}</div>
         <h3 class="sub-h">${pi("timer")} ${PT("Dauer")}</h3><div class="formhost" data-form="alarm_time"></div>`
      )}
      ${this._section(PT("Benachrichtigungen"), PT("Push-Nachricht auf deine Smartphones."), `<div class="np-host">${this._phonesHtml()}</div><div class="formhost" data-form="actions"></div>`)}
      ${this._section(PT("Sprachansagen"), PT("Ansagen über Lautsprecher und Alexa – passend zum Melder."), `<div class="formhost" data-form="tts"></div><div class="tts-hint">${this._ttsHintHtml()}</div>${this._draft.tts_enabled ? this._ttsPreviewHtml() : ""}`)}
      ${this._section(
        PT("WhatsApp über TextMeBot"),
        PT("Alarm per WhatsApp. Empfänger mit Wartezeit nur, wenn der Alarm dann noch läuft."),
        `${this._waInfoHtml()}<div class="formhost" data-form="whatsapp"></div>${this._waHtml()}`
      )}
      ${this._section(
        PT("Testen"),
        PT("Ausgänge prüfen – mit den gespeicherten Einstellungen."),
        `<div class="tests">${tests.map(([k, ic, l]) => `<button class="btn soft" data-test="${k}">${pi(ic)} ${l}</button>`).join("")}</div><div class="drill-host">${this._drillHtml()}</div>`
      )}`;
  }

  _sirenSummaryHtml() {
    const d = this._draft;
    const modes = Array.isArray(d.siren_modes) ? d.siren_modes : ["away", "night"];
    const hhmm = (v) => String(v || "").slice(0, 5);
    const modeTxt = modes.length ? modes.map((m) => PT(m === "away" ? "Unterwegs" : "Nacht")).join(" + ") : PT("in keinem Modus");
    const timeTxt = d.siren_time_enabled ? PT("von {a} bis {b} Uhr", { a: hhmm(d.siren_time_start), b: hhmm(d.siren_time_end) }) : PT("rund um die Uhr");
    const mon = this._monitored();
    const excl = new Set(d.siren_excluded_sensors || []);
    const silent = mon.filter((e) => excl.has(e)).length;
    const noSiren = !(d.sirens || []).length;
    return `<div class="siren-sum ${noSiren || !modes.length ? "warn" : ""}">
      ${pi(noSiren || !modes.length ? "warn" : "speaker")}
      <div><b>${noSiren ? PT("Keine Sirene ausgewählt – wähle oben unter „Sirenen“ mindestens eine aus.") : PT("Sirene ertönt: {m} · {t}", { m: modeTxt, t: timeTxt })}</b>
      <small>${PT("{n} von {m} Sensoren lösen die Sirene aus.", { n: mon.length - silent, m: mon.length })} ${PT("Panikalarm und manuelles Auslösen ertönen immer.")}</small></div>
    </div>`;
  }

  _monitored() {
    const d = this._draft;
    return [...new Set([...(d.away_sensors || []), ...(d.night_sensors || []), ...this._zones().flatMap((z) => z.sensors || [])])];
  }

  _sirenSensorsHtml() {
    const d = this._draft;
    const mon = this._monitored();
    if (!mon.length) return `<div class="emptybox">${pi("door")}<p>${PT("Noch keine überwachten Sensoren – zuerst unter „Bereiche & Sensoren“ hinzufügen.")}</p></div>`;
    const excl = new Set(d.siren_excluded_sensors || []);
    const rows = mon
      .map((eid) => {
        const ic = this._typeIcon(eid);
        const on = !excl.has(eid);
        const zone = this._zoneOf(eid);
        const zi = this._zones().indexOf(zone);
        const tags = [
          zone ? `<i class="zt">${pesc(this._zoneName(zone, zi))}</i>` : "",
          zone && (zone.delayed_sensors || []).includes(eid) ? `<i>${PT("Verzögert")}</i>` : "",
          (d.away_sensors || []).includes(eid) ? `<i>${PT("Unterwegs")}</i>` : "",
          (d.night_sensors || []).includes(eid) ? `<i>${PT("Nacht")}</i>` : "",
          (d.delayed_sensors || []).includes(eid) ? `<i>${PT("Verzögert")}</i>` : "",
        ].join("");
        return `<div class="sirow">
          <div class="s-name">${pi(ic)}<div><b>${pesc(this._name(eid))}</b><small>${pesc(eid)}${this._area(eid) ? ` · ${pesc(this._area(eid))}` : ""}</small></div></div>
          <div class="si-tags">${tags}</div>
          <div class="si-sw"><span class="si-lbl ${on ? "" : "off"}">${on ? PT("Sirene") : PT("Still")}</span><button class="sw ${on ? "on" : ""}" data-siren="${pesc(eid)}" role="switch" aria-checked="${on}" aria-label="${PT("Sirene bei {name}", { name: pesc(this._name(eid)) })}"><i></i></button></div>
        </div>`;
      })
      .join("");
    return `<div class="si-head"><span>${PT("Sirene je Sensor")}</span><span class="si-all"><button class="btn ghost sm" data-siren-all="on">${PT("Alle an")}</button><button class="btn ghost sm" data-siren-all="off">${PT("Alle still")}</button></span></div>
      <div class="stable">${rows}</div>`;
  }

  _waHtml() {
    const list = Array.isArray(this._draft.whatsapp_recipients) ? this._draft.whatsapp_recipients : [];
    const steps = [0, 1, 2, 3, 5, 10, 15, 30, 60];
    const delayOpts = (v) => {
      const vals = steps.includes(Number(v)) ? steps : [...steps, Number(v)].sort((a, b) => a - b);
      return vals
        .map((m) => `<option value="${m}" ${Number(v) === m ? "selected" : ""}>${m === 0 ? PT("sofort") : PT("nach {n} Min.", { n: m })}</option>`)
        .join("");
    };
    const example = list.some((r) => String(r.apikey || "").startsWith("Beispiel") || ["+491701234567", "+491769876543"].includes(r.phone));
    const rows = list
      .map(
        (r, i) => `<div class="wa-row ${r.enabled === false ? "off" : ""}" data-i="${i}">
          <label class="wa-on" title="${PT("Aktiv")}"><span>${PT("Aktiv")}</span><input type="checkbox" data-wa="enabled" ${r.enabled === false ? "" : "checked"}></label>
          <label><span>${PT("Name")}</span><input class="fb" data-wa="name" value="${pesc(r.name)}" placeholder="${PT("z. B. Max")}"></label>
          <label><span>${PT("WhatsApp-Nummer")}</span><input class="fb" data-wa="phone" inputmode="tel" value="${pesc(r.phone)}" placeholder="+491701234567"></label>
          <label><span>${PT("TextMeBot-API-Key")}</span><input class="fb" data-wa="apikey" type="password" autocomplete="off" value="${pesc(r.apikey)}"></label>
          <label><span>${PT("Senden")}</span><select class="fb" data-wa="delay">${delayOpts(r.delay || 0)}</select></label>
          <button class="iconbtn" data-wa-del="${i}" aria-label="${PT("Entfernen")}">${pi("trash")}</button>
        </div>`
      )
      .join("");
    const active = list.filter((r) => r.enabled !== false).length;
    return `<div class="wa">
      ${list.length ? `<div class="counts"><span class="chip ${active ? "" : "warnchip"}">${PT("{n} von {m} Empfängern aktiv", { n: active, m: list.length })}</span></div>` : ""}
      ${example ? `<div class="wa-note">${pi("warn")}<span>${PT("Die Einträge sind Beispieldaten. Bitte durch echte Nummern und deine TextMeBot-API-Keys ersetzen – an Beispieldaten wird nie gesendet.")}</span></div>` : ""}
      ${rows || `<div class="muted pad">${PT("Noch keine Empfänger.")}</div>`}
      <div class="tests"><button class="btn soft" data-wa-add>${pi("plus")} ${PT("Empfänger hinzufügen")}</button></div>
      <p class="muted small-note">${PT("Den API-Key bekommst du auf textmebot.com („Request ApiKey“) – gesendet wird vom WhatsApp-Konto, das mit dem Key verbunden ist. Nummer international angeben (z. B. +49…), für Gruppen die Gruppen-ID. Zwischen zwei Nachrichten liegen einige Sekunden Abstand, damit TextMeBot keine verwirft.")}</p>
    </div>`;
  }

  _waInfoHtml() {
    const items = [
      PT("TextMeBot ist ein kostenpflichtiges Angebot eines Drittanbieters – nicht von Safe Home, Home Assistant oder WhatsApp. Für den Versand ist in der Regel ein bezahltes Abo nötig. Preise und Bedingungen findest du auf der Website von TextMeBot."),
      PT("Gesendet wird über das WhatsApp-Konto, das mit deinem TextMeBot-API-Key verbunden ist."),
      PT("Es gibt keine Zustellgarantie: Nachrichten können verzögert ankommen oder ausfallen, wenn TextMeBot oder WhatsApp gestört sind. Nutze WhatsApp deshalb nur zusätzlich zu Push-Benachrichtigungen und Sirene."),
      PT("Telefonnummern und Nachrichtentexte werden zum Versand an TextMeBot übermittelt."),
      PT("Mit den Häkchen legst du fest, wer gerade benachrichtigt wird – z. B. zeitweise nur eine Person."),
    ];
    return `<details class="wa-info"${this._waInfoOpen ? " open" : ""}>
      <summary>${pi("warn")}<b>${PT("Wichtige Hinweise zu WhatsApp-Benachrichtigungen")}</b>${pi("chev", "wa-chev")}</summary>
      <ul>${items.map((t) => `<li>${t}</li>`).join("")}</ul>
      <a class="btn ghost sm" href="https://textmebot.com" target="_blank" rel="noopener noreferrer">${pi("ext")} ${PT("Zur Website von TextMeBot")}</a>
    </details>`;
  }

  _waUpdate(i, field, value) {
    const list = (Array.isArray(this._draft.whatsapp_recipients) ? this._draft.whatsapp_recipients : []).map((r) => ({ ...r }));
    if (!list[i]) return;
    list[i][field] = field === "delay" ? Number(value) || 0 : value;
    if (field === "enabled") {
      this._set("whatsapp_recipients", list);
      const host = this.shadowRoot.querySelector(".wa")?.parentElement;
      if (host) this._render();
      return;
    }
    this._set("whatsapp_recipients", list);
  }

  // ---------------------------------------------------------------- Automatik
  _automationHtml() {
    const persons = this._draft.persons || [];
    const ppl = persons
      .map((p) => {
        const s = this._hass.states[p];
        const home = s?.state === "home";
        const nm = (s?.attributes?.friendly_name || p).split(" ")[0];
        const pic = s?.attributes?.entity_picture;
        return `<div class="pp ${home ? "home" : ""}"><span class="av">${pic ? `<img src="${pesc(pic)}" alt="">` : pesc(nm[0] || "?")}</span><b>${pesc(nm)}</b><small>${home ? PT("Zuhause") : s ? pesc(s.state === "not_home" ? PT("Unterwegs") : s.state) : "?"}</small></div>`;
      })
      .join("");
    return `
      ${this._section(
        PT("Anwesenheit"),
        PT("Automatisch scharf und unscharf nach Standort deiner Personen."),
        `${this._modSwitchHtml("auto")}${persons.length ? `<div class="people">${ppl}</div>` : ""}<div class="formhost" data-form="presence"></div>`
      )}
      ${this._section(PT("Wochenplan"), PT("Feste Scharf-Zeiten je Wochentag – nur ohne „Anwesenheit“."), `<div class="wk-host">${this._weekHtml()}</div>`)}
      ${this._section(
        PT("Nachtmodus"),
        PT("Nachts nur die Nachtsensoren überwachen."),
        this._weekRules()
          ? `<div class="wk-off">${pi("timer")}<span>${PT("Pausiert – der Wochenplan legt fest, wann „Nacht“ scharf ist.")}</span></div>
             <div class="night-dis" inert aria-disabled="true">${this._modSwitchHtml("night")}<div class="formhost" data-form="night"></div></div>`
          : `${this._modSwitchHtml("night")}<div class="formhost" data-form="night"></div>`
      )}
      ${this._section(PT("So handelt Safe Home selbstständig"), PT("Zusammenfassung deiner Einstellungen."), `<div class="rules">${this._rulesHtml()}</div>`)}`;
  }

  /** Entität des Schalters „Home-Zone“ (auto) bzw. „Nachtzeit“ (night) – dieselbe wie auf den Karten. */
  _modEntity(kind) {
    const a = this._hass?.states?.[this._data?.entity_id]?.attributes || {};
    return kind === "auto" ? a.auto_mode_entity : a.night_auto_entity;
  }

  _modOn(kind) {
    const eid = this._modEntity(kind);
    return eid ? this._hass.states[eid]?.state === "on" : kind === "auto" ? !!(this._draft.auto_arm || this._draft.auto_disarm) : !!this._draft.night_auto;
  }

  _modSwitchHtml(kind) {
    const on = this._modOn(kind);
    const eid = this._modEntity(kind);
    const title = kind === "auto" ? PT("Home-Zone-Automatik") : PT("Nachtmodus nach Zeitplan");
    const txt = on ? PT("Eingeschaltet – gleicher Schalter wie „{n}“ auf den Karten", { n: kind === "auto" ? PT("Anwesenheit") : PT("Nachtzeit") }) : PT("Ausgeschaltet – gleicher Schalter wie „{n}“ auf den Karten", { n: kind === "auto" ? PT("Anwesenheit") : PT("Nachtzeit") });
    return `<div class="modsw ${on ? "on" : ""}" data-modsw="${kind}">
      ${pi(kind === "auto" ? "pin" : "night")}
      <div><b>${title}</b><small>${txt}</small></div>
      <button class="sw ${on ? "on" : ""}" data-modtoggle="${kind}" role="switch" aria-checked="${on}" aria-label="${title}" ${eid ? "" : "disabled"}><i></i></button>
    </div>`;
  }

  async _modToggle(kind) {
    const eid = this._modEntity(kind);
    if (!eid) return;
    try {
      await this._hass.callService("switch", this._modOn(kind) ? "turn_off" : "turn_on", { entity_id: eid });
    } catch (err) {
      this._showToast(err?.message || PT("Speichern fehlgeschlagen"), "err");
    }
  }

  _refreshModSwitches() {
    this.shadowRoot.querySelectorAll("[data-modsw]").forEach((el) => {
      const kind = el.dataset.modsw;
      if (el.classList.contains("on") === this._modOn(kind)) return;
      const tmp = document.createElement("div");
      tmp.innerHTML = this._modSwitchHtml(kind);
      const fresh = tmp.firstElementChild;
      el.replaceWith(fresh);
      fresh.querySelector("[data-modtoggle]")?.addEventListener("click", () => this._modToggle(kind));
      this._refreshRules();
    });
  }

  _rulesHtml() {
    const d = this._draft;
    const hm = (v) => String(v || "").slice(0, 5);
    const auto = this._modOn("auto");
    const night = this._modOn("night");
    const off = (txt) => `<span class="rule-off">${txt}</span>`;
    const rule = (ic, title, text, active = true) =>
      `<div class="rule ${active ? "" : "inactive"}">${pi(ic)}<div><b>${title}</b><span>${text}</span></div></div>`;
    const start = hm(d.night_start);
    const end = hm(d.night_end);
    const rearm = Number(d.night_rearm_delay) || 0;
    return [
      rule("away", PT("Alle gehen"), PT("Sobald die letzte Person die Home-Zone verlässt, wird nach {s} s auf Unterwegs geschaltet – auch aus dem Nachtmodus.", { s: d.auto_arm_delay ?? 120 }) + (d.auto_arm ? "" : " " + off(PT("(ausgeschaltet)"))), auto && !!d.auto_arm),
      rule("home", PT("Erste Person kommt heim"), PT("Unterwegs wird automatisch ausgeschaltet.") + (d.auto_disarm ? "" : " " + off(PT("(ausgeschaltet)"))), auto && !!d.auto_disarm),
      rule(
        "night",
        PT("{t} Uhr – Nachtbeginn", { t: start }),
        d.night_only_when_home
          ? PT("Ist jemand zuhause, beginnt der Nachtmodus. Ist niemand zuhause, bleibt bzw. wird Unterwegs scharf – kein Nachtmodus.")
          : PT("Der Nachtmodus beginnt – auch wenn niemand zuhause ist."),
        night
      ),
      rule(
        "person",
        PT("Heimkehr in der Nacht"),
        d.auto_disarm
          ? rearm > 0
            ? PT("Kommt jemand nachts heim, wird für ihn unscharf geschaltet und nach {m} Minuten wieder der Nachtmodus aktiv.", { m: rearm })
            : PT("Kommt jemand nachts heim, wird unscharf geschaltet und bleibt es.")
          : PT("Nachts wird für Heimkehrer nicht automatisch unscharf geschaltet.") + " " + off(PT("(Heimkehr-Automatik ausgeschaltet)")),
        night && auto && !!d.auto_disarm
      ),
      rule(
        "clock",
        PT("{t} Uhr – Nachtende", { t: end }),
        PT("Mit Personen zuhause wird ausgeschaltet. Ist niemand mehr da, wird nicht ausgeschaltet, sondern Unterwegs aktiviert. Unterwegs bleibt morgens immer scharf."),
        night
      ),
      !auto ? `<p class="muted small-note">${PT("Hinweis: Die Home-Zone-Automatik ist ausgeschaltet – Safe Home schaltet dann nur nach Zeitplan.")}</p>` : "",
      `<p class="muted small-note">${PT("Ein- und ausgeschaltet werden beide Automatiken nur über ihren Schalter – hier oben oder als „Anwesenheit“ und „Nachtzeit“ auf den Karten, beides ist derselbe Schalter. Von Hand gewähltes Unterwegs wird von der Automatik nie überschrieben.")}</p>`,
    ].join("");
  }

  // ----------------------------------------------------------------- Haushalt
  _hhItems() {
    return (Array.isArray(this._draft.household_sensors) ? this._draft.household_sensors : []).map((i) =>
      typeof i === "string" ? { entity: i, state: "on" } : { entity: i.entity, state: i.state || "on" }
    );
  }

  _hhIsBinary(eid) {
    return /^(binary_sensor|switch|input_boolean)\./.test(eid);
  }

  /** Lesbarer Name eines Zustands (z. B. on -> Feucht bei Wassersensoren). */
  _hhLabel(eid, state) {
    const s = this._hass.states[eid];
    if (this._hhIsBinary(eid) && (state === "on" || state === "off")) {
      const txt = STATE_TEXT[s?.attributes?.device_class] || ["Aus", "An"];
      return PT(state === "on" ? txt[1] : txt[0]);
    }
    if (state === "unavailable" || state === "unknown") return PT("Nicht erreichbar");
    return state;
  }

  _hhChip(eid) {
    const s = this._hass.states[eid];
    if (!s) return `<span class="st off">${PT("Nicht gefunden")}</span>`;
    const item = this._hhItems().find((i) => i.entity === eid);
    const alert = item && s.state === item.state;
    const cls = ["unavailable", "unknown"].includes(s.state) ? "off" : alert ? "on" : "ok";
    return `<span class="st ${cls}">${pesc(this._hhLabel(eid, s.state))}</span>`;
  }

  _hhSuggestions() {
    const have = new Set(this._hhItems().map((i) => i.entity));
    return Object.keys(this._hass.states).filter(
      (e) => e.startsWith("binary_sensor.") && !have.has(e) && ["moisture"].includes(this._hass.states[e].attributes?.device_class)
    );
  }

  _householdHtml() {
    const items = this._hhItems();
    const sugg = this._hhSuggestions();
    const rows = items
      .map((it, i) => {
        const eid = it.entity;
        const s = this._hass.states[eid];
        const dc = s?.attributes?.device_class;
        let picker;
        if (this._hhIsBinary(eid)) {
          picker = `<select class="fb" data-hhstate="${i}">${["on", "off"]
            .map((v) => `<option value="${v}" ${it.state === v ? "selected" : ""}>${pesc(this._hhLabel(eid, v))}</option>`)
            .join("")}</select>`;
        } else {
          const opts = [...new Set([...(s?.attributes?.options || []), s?.state, it.state].filter((x) => x && !["unavailable", "unknown"].includes(x)))];
          picker = `<input class="fb" data-hhstate="${i}" list="hhl-${i}" value="${pesc(it.state)}" placeholder="${PT("Zustand, z. B. fertig")}"><datalist id="hhl-${i}">${opts.map((o) => `<option value="${pesc(o)}">`).join("")}</datalist>`;
        }
        const bin = this._hhIsBinary(eid);
        return `<div class="hhrow">
          <div class="s-name">${pi(bin ? this._typeIcon(eid) : "bell")}<div><b>${pesc(this._name(eid))}</b><small>${pesc(eid)}${this._area(eid) ? ` · ${pesc(this._area(eid))}` : ""}</small></div></div>
          <div class="hh-state" data-hhlive="${pesc(eid)}">${this._hhChip(eid)}</div>
          <label class="hh-pick hh-typ"><span>${PT("Art")}</span>${bin ? this._typeSelect(eid) : `<span class="muted">–</span>`}</label>
          <label class="hh-pick"><span>${PT("Melden bei")}</span>${picker}</label>
          <div class="s-del"><button class="iconbtn" data-hhdel="${i}" aria-label="${PT("Entfernen")}">${pi("trash")}</button></div>
        </div>`;
      })
      .join("");
    return `
      ${this._section(
        PT("Haushalt"),
        PT("Wasser- und andere Sensoren – unabhängig von der Alarmanlage, ohne Sirene."),
        `<div class="formhost" data-form="household"></div><h3 class="sub-h">${pi("bell")} ${PT("Melden per")}</h3><div class="formhost" data-form="household_send"></div>`
      )}
      ${this._section(
        PT("Sensoren"),
        PT("Je Sensor: bei welchem Zustand gemeldet wird."),
        `<div class="toolbar">
          <div class="addhost hh-add"></div>
          ${sugg.length ? `<button class="btn soft" data-hhsuggest>${pi("spark")} ${PT("{n} Wassersensoren hinzufügen", { n: sugg.length })}</button>` : ""}
        </div>
        ${items.length ? `<div class="stable">${rows}</div>` : `<div class="emptybox">${pi("drop")}<p>${PT("Noch keine Sensoren. Füge oben z. B. deine Wassersensoren hinzu.")}</p></div>`}`
      )}`;
  }

  _hhSet(list) {
    this._set("household_sensors", list);
  }

  _hhAdd(eid) {
    if (!eid || this._hhItems().some((i) => i.entity === eid)) return;
    const s = this._hass.states[eid];
    const state = this._hhIsBinary(eid) ? "on" : s?.state && !["unavailable", "unknown"].includes(s.state) ? s.state : "";
    this._hhSet([...this._hhItems(), { entity: eid, state: state || "on" }]);
    this._render();
  }

  _bindHousehold(root) {
    root.querySelectorAll("[data-hhstate]").forEach((el) => {
      const i = Number(el.dataset.hhstate);
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", () => {
        const list = this._hhItems();
        list[i] = { ...list[i], state: el.value.trim() || "on" };
        this._hhSet(list);
        const chip = root.querySelector(`[data-hhlive="${CSS.escape(list[i].entity)}"]`);
        if (chip) chip.innerHTML = this._hhChip(list[i].entity);
      });
    });
    root.querySelectorAll("[data-hhdel]").forEach((b) =>
      b.addEventListener("click", () => {
        const list = this._hhItems();
        list.splice(Number(b.dataset.hhdel), 1);
        this._hhSet(list);
        this._render();
      })
    );
    root.querySelector("[data-hhsuggest]")?.addEventListener("click", () => {
      const add = this._hhSuggestions().map((e) => ({ entity: e, state: "on" }));
      this._hhSet([...this._hhItems(), ...add]);
      this._render();
    });
    const host = root.querySelector(".hh-add");
    if (!host) return;
    if (this._hasForm) {
      const f = document.createElement("ha-form");
      f.hass = this._hass;
      f.data = {};
      f.schema = [{ name: "add", selector: { entity: { filter: [{ domain: "binary_sensor" }, { domain: "sensor" }, { domain: "switch" }, { domain: "input_boolean" }] } } }];
      f.computeLabel = () => PT("Sensor hinzufügen");
      f.addEventListener("value-changed", (ev) => ev.detail.value.add && this._hhAdd(ev.detail.value.add));
      host.appendChild(f);
    } else {
      host.innerHTML = `<input class="fb" list="hh-all" placeholder="${PT("binary_sensor.… hinzufügen")}"><datalist id="hh-all">${Object.keys(this._hass.states)
        .filter((e) => /^(binary_sensor|sensor|switch|input_boolean)\./.test(e))
        .map((e) => `<option value="${pesc(e)}">`)
        .join("")}</datalist>`;
      host.querySelector("input").addEventListener("change", (e) => this._hhAdd(e.target.value.trim()));
    }
  }

  // --------------------------------------------------------------- Sicherheit
  _securityHtml() {
    if (!this._users && !this._usersLoading) this._loadUsers();
    const on = this._draft.pins_enabled !== false;
    const off = (inner) => (on ? inner : `<div class="night-dis" inert aria-disabled="true">${inner}</div>`);
    return `${this._section(
      PT("PIN-Eingabe"),
      PT("Wann ein PIN nötig ist und was bei falschen PINs passiert."),
      `<div class="area-sw pin-master">${pi("lock")}<div><b>${PT("PIN-Funktion")}</b><small>${on ? PT("Eingeschaltet") : PT("Ausgeschaltet – die Alarmanlage lässt sich ohne PIN bedienen.")}</small></div><button class="sw ${on ? "on" : ""}" data-pins-on role="switch" aria-checked="${on}" aria-label="${PT("PIN-Funktion")}"><i></i></button></div>
       ${off(`<div class="pa-host">${this._pinAreasHtml()}</div><div class="formhost" data-form="security"></div>`)}`
    )}
      ${this._section(PT("PINs verwalten"), PT("Ein PIN je Benutzer, dazu Gast-PINs mit Zeitraum."), off(`<div class="pin-host">${this._pinsHtml()}</div>`))}`;
  }

  /** Alle Bereiche: Hauptbereich + Teilbereiche → [[id, Name]] */
  _pinAreas() {
    return [["main", PT("Hauptbereich")], ...this._zones().map((z, i) => [z.id, this._zoneName(z, i)])];
  }

  _pinCovers(p, area) {
    return !Array.isArray(p.areas) || p.areas.includes(area);
  }

  _pinAreasHtml() {
    const offList = this._draft.pin_areas_off || [];
    const pins = this._pinList().filter((p) => p.code && p.enabled !== false);
    const rows = this._pinAreas()
      .map(([id, name]) => {
        const req = !offList.includes(id);
        const has = pins.some((p) => this._pinCovers(p, id));
        const note = !req ? PT("ohne PIN") : has ? PT("PIN nötig") : PT("kein PIN zugeordnet – ohne PIN bedienbar");
        return `<label class="pa-row ${req ? "" : "off"}"><input type="checkbox" data-pin-area-req="${pesc(id)}" ${req ? "checked" : ""}><span>${pi(id === "main" ? "shield" : "lock")}<b>${pesc(name)}</b></span><small class="${req && !has ? "warn" : ""}">${note}</small></label>`;
      })
      .join("");
    return `<h3 class="sub-h">${pi("shield")} ${PT("PIN verlangen für")}</h3><div class="pa-list">${rows}</div>`;
  }

  _pinAreaPills(p, key) {
    const areas = this._pinAreas();
    if (areas.length < 2 || !p || !p.code) return "";
    return `<div class="pin-areas" data-pa-key="${pesc(key)}"><span>${PT("Darf schalten")}:</span>${areas
      .map(([id, name]) => {
        const on = this._pinCovers(p, id);
        return `<button class="pill sm ${on ? "on" : ""}" data-pin-area="${pesc(id)}" aria-pressed="${on}">${pesc(name)}</button>`;
      })
      .join("")}</div>`;
  }

  // ---------------------------------------------------------------- PINs
  async _loadUsers() {
    this._usersLoading = true;
    try {
      const res = await this._ws({ type: "safe_home/users" });
      this._users = (res.users || []).filter((u) => u.active !== false);
    } catch (err) {
      this._users = [];
      this._usersErr = true;
    }
    this._usersLoading = false;
    this._redrawPins();
  }

  _pinList() {
    return (Array.isArray(this._draft.pins) ? this._draft.pins : []).map((p) => ({ ...p }));
  }

  static nowStamp() {
    const d = new Date();
    const z = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
  }

  _pinStatus(p) {
    if (!p || !p.code) return ["off", PT("Kein PIN")];
    if (p.type === "user") return ["ok", PT("PIN gesetzt")];
    if (p.enabled === false) return ["off", PT("Deaktiviert")];
    const now = SafeHomePanel.nowStamp();
    if (p.start && now < p.start) return ["plan", PT("Geplant")];
    if (p.end && now >= p.end) return ["exp", PT("Abgelaufen")];
    return ["ok", p.end ? PT("Aktiv") : PT("Unbegrenzt")];
  }

  _pinField(key, value) {
    return `<span class="pin-in"><input class="fb" type="password" inputmode="numeric" autocomplete="new-password" maxlength="32" data-pin="${key}" value="${pesc(value || "")}" placeholder="${PT("mind. 4 Ziffern")}" aria-label="${PT("PIN")}">
      <button class="iconbtn" data-pin-eye title="${PT("PIN anzeigen")}" aria-label="${PT("PIN anzeigen")}">${pi("eye")}</button>
      <button class="iconbtn" data-pin-dice title="${PT("Zufälligen PIN erzeugen")}" aria-label="${PT("Zufälligen PIN erzeugen")}">${pi("dice")}</button></span>`;
  }

  _pinsHtml() {
    const pins = this._pinList();
    const users = this._users || [];
    const userPins = pins.filter((p) => p.type === "user");
    const known = new Set(users.map((u) => u.id));
    const orphan = userPins.filter((p) => !known.has(p.user_id));
    const chip = (p) => {
      const [cls, txt] = this._pinStatus(p);
      return `<span class="pin-st ${cls}" data-pin-st>${txt}</span>`;
    };
    const userRows = [...users.map((u) => ({ u, p: userPins.find((p) => p.user_id === u.id) })), ...orphan.map((p) => ({ u: { id: p.user_id, name: p.name, gone: true }, p }))]
      .map(
        ({ u, p }) => `<div class="pin-row user" data-uid="${pesc(u.id)}" data-uname="${pesc(u.name)}">
          <span class="pin-av">${pesc((u.name || "?").trim()[0] || "?")}</span>
          <div class="pin-who"><b>${pesc(u.name || "–")}</b><small>${u.gone ? PT("Benutzer gelöscht") : u.admin ? PT("Administrator") : PT("Standardbenutzer")}</small></div>
          ${this._pinField("code", p?.code)}
          ${chip(p)}
          ${this._pinAreaPills(p, `u:${u.id}`)}
        </div>`
      )
      .join("");
    const guests = pins
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.type !== "user")
      .map(
        ({ p, i }) => `<div class="pin-row guest ${p.enabled === false ? "off" : ""}" data-gi="${i}">
          <label class="pin-on" title="${PT("Aktiv")}"><input type="checkbox" data-pin="enabled" ${p.enabled === false ? "" : "checked"}></label>
          <label class="pin-f name"><span>${PT("Name")}</span><input class="fb" data-pin="name" maxlength="40" value="${pesc(p.name || "")}" placeholder="${PT("Name, z. B. Handwerker")}"></label>
          <label class="pin-f code"><span>${PT("PIN")}</span>${this._pinField("code", p.code)}</label>
          <label class="pin-f d1"><span>${PT("Gültig ab")}</span><input class="fb" type="datetime-local" data-pin="start" value="${pesc(p.start || "")}"></label>
          <label class="pin-f d2"><span>${PT("Gültig bis")}</span><input class="fb" type="datetime-local" data-pin="end" value="${pesc(p.end || "")}"></label>
          ${chip(p)}
          <button class="iconbtn" data-pin-del="${i}" aria-label="${PT("Entfernen")}">${pi("trash")}</button>
          ${this._pinAreaPills(p, `g:${i}`)}
        </div>`
      )
      .join("");
    const none = !pins.some((p) => p.code);
    return `<div class="pins">
      <div class="wk-note">${pi("lock")}<span>${PT("Je PIN wählst du, welche Bereiche damit geschaltet werden dürfen. Protokoll und Benachrichtigungen nennen, wessen PIN verwendet wurde.")}</span></div>
      ${none ? `<div class="wa-note">${pi("warn")}<span>${PT("Noch kein PIN – jeder mit Zugriff aufs Dashboard kann die Alarmanlage bedienen. Lege am besten zuerst einen PIN für dich selbst an.")}</span></div>` : ""}
      <h3 class="pin-h">${pi("person")} ${PT("Benutzer")}</h3>
      <div class="stable pin-list">${userRows || `<div class="muted pad">${this._usersErr ? PT("Benutzer konnten nicht geladen werden.") : "…"}</div>`}</div>
      <h3 class="pin-h">${pi("key")} ${PT("Gäste")}</h3>
      ${guests ? `<div class="stable pin-list">${guests}</div>` : `<div class="emptybox">${pi("key")}<p>${PT("Noch keine Gast-PINs. Lege z. B. einen PIN für Handwerker, Babysitter oder Feriengäste an – auf Wunsch nur für einen bestimmten Zeitraum.")}</p></div>`}
      <div class="tests"><button class="btn soft" data-pin-add>${pi("plus")} ${PT("Gast-PIN hinzufügen")}</button></div>
    </div>`;
  }

  _redrawPins() {
    const host = this.shadowRoot.querySelector(".pin-host");
    if (!host) return;
    host.innerHTML = this._pinsHtml();
    this._bindPins();
  }

  _refreshPinAreas() {
    const ph = this.shadowRoot.querySelector(".pa-host");
    if (!ph) return;
    ph.innerHTML = this._pinAreasHtml();
    this._bindPinSecurity(ph);
  }

  _bindPinSecurity(root) {
    root.querySelector("[data-pins-on]")?.addEventListener("click", () => {
      this._set("pins_enabled", this._draft.pins_enabled === false);
      this._render();
    });
    root.querySelectorAll("[data-pin-area-req]").forEach((cb) =>
      cb.addEventListener("change", () => {
        const set = new Set(this._draft.pin_areas_off || []);
        cb.checked ? set.delete(cb.dataset.pinAreaReq) : set.add(cb.dataset.pinAreaReq);
        this._set("pin_areas_off", [...set]);
        this._render();
      })
    );
  }

  _bindPins() {
    const host = this.shadowRoot.querySelector(".pin-host");
    if (!host) return;
    const save = (list) => this._set("pins", list);
    const refreshChip = (row, p) => {
      const el = row.querySelector("[data-pin-st]");
      if (!el) return;
      const [cls, txt] = this._pinStatus(p);
      el.className = `pin-st ${cls}`;
      el.textContent = txt;
    };
    host.querySelectorAll(".pin-row.user").forEach((row) => {
      const inp = row.querySelector('[data-pin="code"]');
      inp.addEventListener("change", () => this._redrawPins()); // Bereichsauswahl erscheint, sobald ein PIN gesetzt ist
      inp.addEventListener("input", () => {
        const list = this._pinList();
        const uid = row.dataset.uid;
        const code = inp.value.trim();
        const idx = list.findIndex((p) => p.type === "user" && p.user_id === uid);
        if (idx >= 0 && !code) list.splice(idx, 1);
        else if (idx >= 0) list[idx] = { ...list[idx], code, name: row.dataset.uname };
        else if (code) list.push({ id: `u_${uid}`.slice(0, 16), type: "user", user_id: uid, name: row.dataset.uname, code, start: null, end: null, enabled: true });
        save(list);
        refreshChip(row, code ? { type: "user", code } : null);
        this._refreshPinAreas();
      });
    });
    host.querySelectorAll(".pin-row.guest").forEach((row) => {
      const i = Number(row.dataset.gi);
      row.querySelectorAll("[data-pin]").forEach((inp) => {
        const field = inp.dataset.pin;
        const ev = inp.type === "checkbox" || inp.type === "datetime-local" ? "change" : "input";
        inp.addEventListener(ev, () => {
          const list = this._pinList();
          if (!list[i]) return;
          list[i] = { ...list[i], [field]: inp.type === "checkbox" ? inp.checked : field === "code" || field === "name" ? inp.value : inp.value || null };
          save(list);
          row.classList.toggle("off", list[i].enabled === false);
          refreshChip(row, list[i]);
        });
      });
    });
    host.querySelectorAll("[data-pin-area]").forEach((b) =>
      b.addEventListener("click", () => {
        const key = b.closest("[data-pa-key]").dataset.paKey;
        const list = this._pinList();
        const idx = key.startsWith("u:") ? list.findIndex((p) => p.type === "user" && p.user_id === key.slice(2)) : Number(key.slice(2));
        if (!list[idx]) return;
        const all = this._pinAreas().map(([id]) => id);
        const cur = new Set(Array.isArray(list[idx].areas) ? list[idx].areas : all);
        const a = b.dataset.pinArea;
        if (cur.has(a)) {
          if (cur.size === 1) return; // mindestens ein Bereich
          cur.delete(a);
        } else cur.add(a);
        list[idx] = { ...list[idx], areas: all.every((x) => cur.has(x)) ? null : all.filter((x) => cur.has(x)) };
        save(list);
        this._redrawPins();
        this._refreshPinAreas();
      })
    );
    host.querySelectorAll("[data-pin-eye]").forEach((b) =>
      b.addEventListener("click", () => {
        const inp = b.parentElement.querySelector("input");
        inp.type = inp.type === "password" ? "text" : "password";
      })
    );
    host.querySelectorAll("[data-pin-dice]").forEach((b) =>
      b.addEventListener("click", () => {
        const used = new Set(this._pinList().map((p) => String(p.code)));
        let code;
        do {
          const a = new Uint32Array(1);
          crypto.getRandomValues(a);
          code = String(100000 + (a[0] % 900000));
        } while (used.has(code));
        const inp = b.parentElement.querySelector("input");
        inp.value = code;
        inp.type = "text";
        inp.dispatchEvent(new Event("input"));
      })
    );
    host.querySelectorAll("[data-pin-del]").forEach((b) =>
      b.addEventListener("click", () => {
        const list = this._pinList();
        list.splice(Number(b.dataset.pinDel), 1);
        save(list);
        this._redrawPins();
      })
    );
    host.querySelector("[data-pin-add]")?.addEventListener("click", () => {
      const list = this._pinList();
      list.push({ id: `g${Date.now().toString(36)}`.slice(0, 16), type: "guest", user_id: "", name: "", code: "", start: null, end: null, enabled: true });
      save(list);
      this._redrawPins();
      const names = this.shadowRoot.querySelectorAll('.pin-row.guest [data-pin="name"]');
      names[names.length - 1]?.focus();
    });
  }

  // --------------------------------------------------------------- Protokoll
  _logHtml() {
    const all = this._data.events || [];
    const groups = { all: null, alarm: ["triggered", "pending"], mode: ["armed", "disarmed", "arming"], warn: ["warning", "bypass", "household"] };
    const ev = all.filter((e) => !groups[this._logFilter] || groups[this._logFilter].includes(e.type));
    const tone = { armed: "away", disarmed: "home", triggered: "alarm", pending: "pending", arming: "arming", warning: "pending", bypass: "pending", household: "pending" };
    return this._section(
      PT("Protokoll"),
      PT("Die letzten 30 Ereignisse dieser Instanz."),
      `<div class="toolbar">
        <div class="seg-ctl">${[["all", PT("Alle")], ["alarm", PT("Alarme")], ["mode", PT("Schaltungen")], ["warn", PT("Warnungen")]]
          .map(([k, l]) => `<button class="${this._logFilter === k ? "on" : ""}" data-lf="${k}">${l}</button>`)
          .join("")}</div>
        <button class="btn soft" data-reload>${pi("refresh")} ${PT("Aktualisieren")}</button>
      </div>
      ${
        ev.length
          ? `<ul class="log">${ev
              .map((e) => `<li><i class="dot t-${tone[e.type] || "info"}"></i><span>${pesc(e.message)}</span><time>${this._fmt(e.time, true)}</time></li>`)
              .join("")}</ul>`
          : `<div class="emptybox">${pi("list")}<p>${PT("Keine Einträge.")}</p></div>`
      }`
    );
  }

  // --------------------------------------------------------------------- Info
  _resourceHtml() {
    const r = this._resource || { state: "pending", message: PT("Wird abgefragt …"), url: "/safe_home_static/safe-home-card.js" };
    const url = r.url || "/safe_home_static/safe-home-card.js";
    const badge = {
      ok: ["#34d399", PT("Eingetragen")],
      pending: ["#fbbf24", PT("Wird eingetragen")],
      yaml: ["#fbbf24", PT("Manuell nötig")],
      error: ["#ef2945", PT("Fehler")],
    }[r.state] || ["#64748b", r.state];
    const yaml = `lovelace:\n  resources:\n    - url: ${url}\n      type: module`;
    return this._section(
      PT("Dashboard-Ressource"),
      PT("Damit die Safe-Home-Karten beim Start der App zuverlässig erscheinen, muss die Kartendatei als Ressource eingetragen sein."),
      `<div class="res">
        <span class="pill" style="--tone:${badge[0]}">${pesc(badge[1])}</span>
        <p>${pesc(r.message || "")}</p>
      </div>
      <div class="res-url"><code>${pesc(url)}</code><span class="muted">${PT("Typ: JavaScript-Modul")}</span></div>
      ${r.state === "yaml" ? `<pre class="yaml">${pesc(yaml.replace(/\\n/g, "\n"))}</pre>` : ""}
      <div class="tests">
        ${r.state !== "yaml" ? `<button class="btn primary" data-res="register">${pi("refresh")} ${PT("Jetzt eintragen")}</button>` : ""}
        <button class="btn soft" data-res="copy">${pi("list")} ${PT("Adresse kopieren")}</button>
        <a class="btn soft" href="/config/lovelace/resources">${pi("ext")} ${PT("Ressourcen öffnen")}</a>
      </div>
      ${this._loadStatusHtml()}
      <p class="muted small-note">${PT("Manuell: Einstellungen → Dashboards → ⋮ (oben rechts) → Ressourcen → „Ressource hinzufügen“, Adresse oben eintragen, Typ „JavaScript-Modul“. Ist der Menüpunkt nicht sichtbar, im Benutzerprofil den „Erweiterten Modus“ einschalten.")}</p>`
    );
  }

  _loadStatusHtml() {
    const defined = !!customElements.get("safe-home-card");
    const tone = defined ? "#34d399" : "#ef2945";
    const text = defined
      ? PT("Kartendatei ist in diesem Browser geladen.")
      : PT("Kartendatei ist in diesem Browser nicht geladen – bitte Seite neu laden. Bleibt das so, die Adresse oben im Browser öffnen und prüfen, ob die Datei erreichbar ist.");
    return `<div class="loadstate"><i style="background:${tone}"></i><span>${pesc(text)}</span></div>`;
  }

  // ------------------------------------------------------------ Android-Widget
  _widgetOpts() {
    if (!this._wOpts) {
      let saved = {};
      try {
        saved = JSON.parse(localStorage.getItem("safe_home_widget_opts") || "{}") || {};
      } catch (e) {
        saved = {};
      }
      this._wOpts = { people: true, sensors: true, background: true, ...saved };
    }
    return this._wOpts;
  }

  /** Jinja-Template für das Template-Widget der Android Companion App (Stil der Kompakt-Karte). */
  _widgetTemplate() {
    const o = this._widgetOpts();
    const e = this._data.entity_id || "alarm_control_panel.safe_home";
    const q = (t) => String(t).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    const L = (t) => q(PT(t));
    const lines = [
      `{#- ${PT("Safe Home – Android-Widget im Stil der Kompakt-Karte")} -#}`,
      `{%- set e = '${e}' -%}`,
      `{%- set s = states(e) -%}`,
      `{%- set info = {`,
      `  'disarmed': ['#34d399', '🏠', '${L("Zuhause")}', '${L("Alarmanlage unscharf")}'],`,
      `  'armed_away': ['#ffba5e', '🛡️', '${L("Unterwegs")}', '${L("Alle Sensoren scharf")}'],`,
      `  'armed_night': ['#a78bfa', '🌙', '${L("Nacht")}', '${L("Nachtsensoren scharf")}'],`,
      `  'arming': ['#3b7bff', '⏳', '${L("Wird scharf")}', '${L("Ausgangsverzögerung")}'],`,
      `  'pending': ['#fbbf24', '⚠️', '${L("Bitte entschärfen")}', '${L("Eingangsverzögerung")}'],`,
      `  'triggered': ['#ef2945', '🚨', 'ALARM', '${L("Einbruch erkannt")}'],`,
      `} -%}`,
      `{%- set i = info.get(s, ['#64748b', '❔', '${L("Nicht verfügbar")}', '${L("Integration prüfen")}']) -%}`,
      `{%- set mode = state_attr(e, 'mode') -%}`,
      `{%- set target = state_attr(e, 'arming_target') -%}`,
      `{%- set sub = i[3] -%}`,
      `{%- if s in ['pending', 'triggered'] and state_attr(e, 'trigger_cause') -%}{%- set sub = state_attr(e, 'trigger_cause') -%}{%- endif -%}`,
      `{%- if s == 'triggered' and state_attr(e, 'silent_alarm') -%}{%- set sub = sub ~ ' · ${L("Stiller Alarm")}' -%}{%- endif -%}`,
      `{%- if s in ['arming', 'pending'] and state_attr(e, 'delay_until') -%}{%- set sub = sub ~ ' · ${L("bis")} ' ~ (as_timestamp(state_attr(e, 'delay_until')) | timestamp_custom('%H:%M:%S')) -%}{%- endif -%}`,
      `{%- if s == 'disarmed' and state_attr(e, 'auto_arm_pending') -%}{%- set sub = '${L("Alle weg – scharf in Kürze")}' -%}{%- endif -%}`,
      `{%- set active = 'home' if s == 'disarmed' else ('away' if s == 'armed_away' or (s == 'arming' and target == 'away') or (s in ['pending', 'triggered'] and mode == 'away') else ('night' if s == 'armed_night' or (s == 'arming' and target == 'night') or (s in ['pending', 'triggered'] and mode == 'night') else '')) -%}`,
      `{%- set modes = [['home', '#34d399', '${L("Zuhause")}'], ['away', '#ffba5e', '${L("Unterwegs")}'], ['night', '#a78bfa', '${L("Nacht")}']] -%}`,
      o.background ? `<p style="background-color:#0b2463; color:#eef3ff">` : `<p>`,
      `<small><font color="#9fb1d9"><b>SAFE HOME</b></font></small><br>`,
      `<big><big><font color="{{ i[0] }}"><b>{{ i[1] }} {{ i[2] }}</b></font></big></big><br>`,
      `<small><font color="#9fb1d9">{{ sub }}</font></small><br>`,
      `{%- for m in modes %}<font color="{{ m[1] if m[0] == active else '#64748b' }}">{{ '<b>● ' ~ m[2] ~ '</b>' if m[0] == active else '○ ' ~ m[2] }}</font>{% if not loop.last %}&nbsp;&nbsp;&nbsp;{% endif %}{% endfor %}`,
    ];
    // Zusatzzeile ohne Trenner am Anfang zusammensetzen (Listen sind in HA-Templates unveränderlich)
    if (o.people || o.sensors) {
      lines.push(`{%- set extra = '' -%}`);
      if (o.people)
        lines.push(
          `{%- set p = state_attr(e, 'persons') or [] -%}{%- if p | count > 0 -%}{%- set extra = '👤 ' ~ (state_attr(e, 'people_home') or 0) ~ '/' ~ (p | count) ~ ' ${q(PT("zuhause"))}' -%}{%- endif -%}`
        );
      if (o.sensors)
        lines.push(
          `{%- set os = state_attr(e, 'open_sensors') or [] -%}{%- set part = ('<font color="#fbbf24">🚪 ' ~ (os | count) ~ ' ${q(PT("offen"))}</font>') if os | count > 0 else '<font color="#34d399">✓ ${q(PT("alles zu"))}</font>' -%}{%- if s not in ['unavailable', 'unknown'] -%}{%- set extra = extra ~ ('&nbsp;&nbsp;·&nbsp;&nbsp;' if extra else '') ~ part -%}{%- endif -%}`
        );
      lines.push(`{%- if extra %}<br><small><font color="#9fb1d9">{{ extra }}</font></small>{% endif -%}`);
    }
    lines.push(`</p>`);
    return lines.join("\n");
  }

  _widgetHtml() {
    const o = this._widgetOpts();
    const tpl = this._widgetTemplate();
    const chk = (k, label) => `<label class="fb-check"><input type="checkbox" data-wopt="${k}" ${o[k] ? "checked" : ""}> ${label}</label>`;
    const steps = [
      PT("„Template kopieren“ tippen."),
      PT("In der Companion App: Startbildschirm lange gedrückt halten → Widgets → Home Assistant → „Template“ auf den Startbildschirm ziehen."),
      PT("Das kopierte Template in das Feld „Template“ einfügen – darunter erscheint die Vorschau. Als Design „Transparent“ oder ein dunkles Design wählen, falls angeboten."),
      PT("Speichern. Ändern lässt sich das Widget später unter Einstellungen → Companion App → Widgets verwalten."),
    ];
    return this._section(
      PT("Android-Widget (Companion App)"),
      PT("Erzeugt ein Template-Widget im Stil der Kompakt-Karte für den Android-Startbildschirm: Zustand, Hinweis und die drei Modi – der aktive ist hervorgehoben."),
      `<div class="wgen">
        <div class="wgen-l">
          <div class="fb-checks">${chk("people", PT("Personen zuhause"))}${chk("sensors", PT("Offene Sensoren"))}${chk("background", PT("Dunkelblauer Hintergrund"))}</div>
          <div class="wprev-h">${PT("Vorschau")}</div>
          <div class="wphone"><div class="wwidget" data-wprev>${this._wPreview ?? `<span class="muted">${PT("Vorschau wird geladen …")}</span>`}</div></div>
          <p class="muted small-note">${PT("Die Vorschau wird von deinem Home Assistant berechnet – so sieht es auch im Widget aus. Schrift und Abstände hängen vom Startbildschirm ab.")}</p>
        </div>
        <div class="wgen-r">
          <div class="wprev-h">${PT("Template")}</div>
          <textarea class="fb wtpl" readonly spellcheck="false" rows="12">${pesc(tpl)}</textarea>
          <div class="tests"><button class="btn primary" data-wcopy>${pi("list")} ${PT("Template kopieren")}</button></div>
          <ol class="wsteps">${steps.map((t) => `<li>${pesc(t)}</li>`).join("")}</ol>
          <p class="muted small-note">${PT("Tippen auf das Widget aktualisiert es. Für sofortige Aktualisierung im Hintergrund der Companion App den Benachrichtigungszugriff erlauben. Zum Schalten der Modi kannst du zusätzlich Button-Widgets mit den Aktionen alarm_control_panel.alarm_arm_away / alarm_arm_night / alarm_disarm anlegen.")}</p>
        </div>
      </div>`
    );
  }

  /** Nur die Formatierungen zulassen, die auch das Android-Widget kennt. */
  _wSanitize(html) {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const allowed = { P: ["style"], BR: [], B: [], STRONG: [], BIG: [], SMALL: [], FONT: ["color"], I: [] };
    const walk = (node) => {
      for (const ch of [...node.childNodes]) {
        if (ch.nodeType === 1) {
          if (!allowed[ch.tagName]) {
            ch.replaceWith(...ch.childNodes);
            continue;
          }
          for (const a of [...ch.attributes]) if (!allowed[ch.tagName].includes(a.name)) ch.removeAttribute(a.name);
          if (ch.hasAttribute("style")) {
            const keep = ch.getAttribute("style").split(";").map((x) => x.trim()).filter((x) => /^(background-color|color|text-align)\s*:\s*[#\w\s(),.%-]+$/i.test(x));
            ch.setAttribute("style", keep.join(";"));
          }
          walk(ch);
        } else if (ch.nodeType !== 3) ch.remove();
      }
    };
    const root = doc.body.firstElementChild;
    walk(root);
    return root.innerHTML;
  }

  _wStartPreview() {
    this._wStopPreview();
    const conn = this._hass?.connection;
    const box = () => this.shadowRoot.querySelector("[data-wprev]");
    if (!conn?.subscribeMessage) {
      this._wPreview = `<span class="muted">${PT("Keine Vorschau verfügbar – teste das Template unter Entwicklerwerkzeuge → Template.")}</span>`;
      if (box()) box().innerHTML = this._wPreview;
      return;
    }
    const token = (this._wToken = (this._wToken || 0) + 1);
    conn
      .subscribeMessage(
        (msg) => {
          if (token !== this._wToken) return;
          this._wPreview = msg?.error ? `<span class="werr">${pesc(msg.error)}</span>` : this._wSanitize(String(msg?.result ?? ""));
          if (box()) box().innerHTML = this._wPreview;
        },
        { type: "render_template", template: this._widgetTemplate(), report_errors: true }
      )
      .then((unsub) => {
        if (token === this._wToken) this._wUnsub = unsub;
        else unsub();
      })
      .catch((err) => {
        this._wPreview = `<span class="werr">${pesc(err?.message || err)}</span>`;
        if (box()) box().innerHTML = this._wPreview;
      });
  }

  _wStopPreview() {
    this._wToken = (this._wToken || 0) + 1;
    if (this._wUnsub) {
      try {
        this._wUnsub();
      } catch (e) {
        /* ignore */
      }
      this._wUnsub = null;
    }
  }

  _bindWidget(root) {
    root.querySelectorAll("[data-wopt]").forEach((cb) =>
      cb.addEventListener("change", () => {
        const o = this._widgetOpts();
        o[cb.dataset.wopt] = cb.checked;
        this._store("safe_home_widget_opts", JSON.stringify(o));
        const ta = this.shadowRoot.querySelector(".wtpl");
        if (ta) ta.value = this._widgetTemplate();
        this._wStartPreview();
      })
    );
    root.querySelector("[data-wcopy]")?.addEventListener("click", async () => {
      const text = this._widgetTemplate();
      try {
        await navigator.clipboard.writeText(text);
        this._showToast(PT("Template kopiert – jetzt im Widget einfügen"), "ok");
      } catch (err) {
        const ta = this.shadowRoot.querySelector(".wtpl");
        ta?.focus();
        ta?.select();
        this._showToast(PT("Kopieren nicht möglich – Text ist markiert, bitte manuell kopieren"), "err");
      }
    });
    this._wStartPreview();
  }

  _infoHtml() {
    return `
      <section class="box">
        <div class="box-h"><h2>${PT("Darstellung")}</h2><p>${PT("Wie die Einstellungsseite angezeigt wird – gilt für diesen Browser bzw. dieses Gerät.")}</p></div>
        <div class="opt-block">
          <label class="fb-check"><input type="checkbox" data-expand-all ${this._expandAll() ? "checked" : ""}> ${PT("Einstellungen standardmäßig ausklappen")}</label>
          <p class="muted small-note">${PT("Aus: Die Abschnitte in den Reitern sind zugeklappt und öffnen sich per Tipp auf die Überschrift – besonders übersichtlich auf dem Smartphone.")}</p>
        </div>
        <div class="opt-block">
          <label class="fb-check ha-theme-opt"><input type="checkbox" data-ui-theme ${this._draft.ui_theme === "ha" ? "checked" : ""}> ${PT("Home-Assistant-Design verwenden")} <span class="beta">${PT("(Beta)")}</span></label>
          <p class="muted small-note">${PT("Seite und alle Safe-Home-Karten übernehmen die Farben deines Home-Assistant-Designs statt des eigenen Safe-Home-Looks – hilfreich bei Darstellungsproblemen. Gilt für alle Geräte, nach dem Speichern.")}</p>
          <p class="muted small-note">${PT("Tipp: Unter Profil → Design kannst du außerdem das Design „Safe Home“ (hell und dunkel) für ganz Home Assistant auswählen.")}</p>
        </div>
      </section>
      ${this._widgetHtml()}
      ${this._resourceHtml()}
      <section class="box about">
        <img src="${this._draft?.ui_theme === "ha" || this.hasAttribute("data-ha") ? P_LOGO_COLOR : P_LOGO}" alt="" class="biglogo">
        <h2>Safe Home</h2>
        <p class="muted">${PT("Version")} ${pesc(this._data.version || PANEL_VERSION)}</p>
        <p>${PT("Die Alarmanlage für Home Assistant – weitestgehend automatisch.")}</p>
        <div class="links">
          <a class="btn soft" href="https://github.com/digital7even/safe_home" target="_blank" rel="noopener">${pi("ext")} ${PT("Dokumentation")}</a>
          <a class="btn soft" href="https://github.com/digital7even/safe_home/issues" target="_blank" rel="noopener">${pi("ext")} ${PT("Problem melden")}</a>
          <a class="btn soft" href="/config/integrations/integration/safe_home">${pi("ext")} Integration</a>
          <a class="btn soft" href="/config/integrations/dashboard/add?domain=safe_home">${pi("plus")} ${PT("Weitere Instanz")}</a>
        </div>
        <p class="thanks">${P_LANG === "de" ? `Mit <span class="heart">❤️</span> entwickelt in Deutschland` : `Made with <span class="heart">❤️</span> in Germany`}<br><a href="https://github.com/digital7even" target="_blank" rel="noopener">Digital7even</a></p>
      </section>`;
  }

  // ------------------------------------------------------------- Formulare
  _formSchema(key) {
    const o = this._draft;
    const S = {
      battery: o.battery_enabled === false
        ? [{ name: "battery_enabled", selector: bool }]
        : [
            { name: "battery_enabled", selector: bool },
            { name: "battery_threshold", selector: { number: { min: 5, max: 90, step: 5, mode: "slider", unit_of_measurement: "%" } } },
            { name: "battery_notify", selector: bool },
          ],
      sensor_behaviour: [
        {
          name: "open_sensor_policy",
          selector: {
            select: {
              mode: "list",
              options: [
                { value: "bypass", label: PT("Überbrücken und melden – wird überwacht, sobald er geschlossen ist") },
                { value: "block", label: PT("Scharfschalten verhindern und melden") },
              ],
            },
          },
        },
        { name: "tamper_notify", selector: bool },
      ],
      delays: [
        { type: "grid", name: "", schema: [{ name: "exit_delay_away", selector: sec() }, { name: "entry_delay_away", selector: sec() }] },
        { type: "grid", name: "", schema: [{ name: "exit_delay_night", selector: sec() }, { name: "entry_delay_night", selector: sec() }] },
      ],
      lights: [
        { name: "sirens", selector: ents(["siren", "switch", "input_boolean", "script"]) },
        { name: "alarm_lights", selector: ents("light") },
      ],
      alarm_time: [
        { type: "grid", name: "", schema: [{ name: "trigger_time", selector: { duration: {} } }, { name: "siren_duration", selector: { duration: {} } }] },
        { name: "rearm_after_trigger", selector: bool },
      ],
      actions: [
        { name: "critical_notifications", selector: bool },
        { name: "notification_disarm_action", selector: bool },
        { name: "notify_state_changes", selector: bool },
        { name: "cameras", selector: ents("camera") },
      ],
      tts: o.tts_enabled
        ? [
            { name: "tts_enabled", selector: bool },
            { type: "grid", name: "", schema: [{ name: "tts_entity", selector: ents("tts", false) }, { name: "media_players", selector: ents("media_player") }] },
            { name: "alexa_enabled", selector: bool },
            ...(o.alexa_enabled ? [{ name: "alexa_devices", selector: { entity: { multiple: true, filter: [{ domain: "media_player", integration: "alexa_media" }] } } }] : []),
            { name: "tts_silent_alarm", selector: bool },
            { name: "tts_entry_warning", selector: bool },
            ...(o.tts_entry_warning !== false ? [{ name: "tts_entry_repeat", selector: { number: { min: 0, max: 60, step: 5, mode: "box", unit_of_measurement: "s" } } }] : []),
          ]
        : [{ name: "tts_enabled", selector: bool }],
      presence: [
        { name: "persons", selector: ents(["person", "device_tracker"]) },
        { name: "auto_arm", selector: bool },
        { name: "auto_arm_delay", selector: sec() },
        { name: "auto_disarm", selector: bool },
      ],
      night: [
        { type: "grid", name: "", schema: [{ name: "night_start", selector: { time: {} } }, { name: "night_end", selector: { time: {} } }] },
        { name: "night_only_when_home", selector: bool },
        { name: "night_rearm_delay", selector: { number: { min: 0, max: 240, step: 1, mode: "box", unit_of_measurement: "min" } } },
      ],
      siren: [
        {
          name: "siren_modes",
          selector: {
            select: {
              multiple: true,
              mode: "list",
              options: [
                { value: "away", label: PT("Unterwegs") },
                { value: "night", label: PT("Nacht") },
              ],
            },
          },
        },
        { name: "siren_time_enabled", selector: bool },
        { type: "grid", name: "", schema: [{ name: "siren_time_start", selector: { time: {} } }, { name: "siren_time_end", selector: { time: {} } }] },
      ],
      whatsapp: [
        { name: "whatsapp_enabled", selector: bool },
        { name: "whatsapp_message", selector: { text: { multiline: true } } },
        { name: "whatsapp_all_clear", selector: bool },
        { name: "whatsapp_other_messages", selector: bool },
      ],
      household: [{ name: "household_enabled", selector: bool }],
      household_send: [
        { name: "household_notify", selector: bool },
        { name: "whatsapp_household", selector: bool },
        { name: "tts_household", selector: bool },
        { name: "household_resolved", selector: bool },
      ],
      security: [
        { name: "code_arm_required", selector: bool },
        { name: "silence_requires_code", selector: bool },
        { name: "notify_wrong_code", selector: bool },
        {
          type: "grid",
          name: "",
          schema: [
            { name: "code_max_attempts", selector: { number: { min: 0, max: 20, step: 1, mode: "box" } } },
            { name: "code_lockout_minutes", selector: { number: { min: 1, max: 120, step: 1, mode: "box", unit_of_measurement: "min" } } },
          ],
        },
      ],
    };
    return S[key];
  }

  _mountForms() {
    this.shadowRoot.querySelectorAll(".formhost").forEach((host) => {
      const key = host.dataset.form;
      const schema = this._formSchema(key);
      const toForm = () => {
        const o = { ...this._draft, name: this._title };
        for (const k of DURATION_KEYS) if (k in o) o[k] = toDur(o[k]);
        return o;
      };
      const data = this._hasForm ? toForm() : { ...this._draft, name: this._title };
      if (this._hasForm) {
        const f = document.createElement("ha-form");
        f.hass = this._hass;
        f.data = data;
        f.schema = schema;
        f.computeLabel = (s) => (LABELS[s.name] ? PT(LABELS[s.name]) : s.name);
        f.computeHelper = (s) => (HELPERS[s.name] ? PT(HELPERS[s.name]) : undefined);
        f.computeError = (err, s) => this._errors[s?.name] || err;
        const errs = {};
        for (const k of Object.keys(this._errors)) errs[k] = this._errors[k];
        f.error = errs;
        f.addEventListener("value-changed", (ev) => {
          const v = ev.detail.value;
          for (const name of flatNames(schema)) {
            const nv = DURATION_KEYS.includes(name) ? fromDur(v[name]) : v[name];
            const ov = name === "name" ? this._title : this._draft[name];
            if (JSON.stringify(nv ?? null) !== JSON.stringify(ov ?? null)) this._set(name, nv ?? (Array.isArray(ov) ? [] : nv));
          }
          f.data = toForm();
          if (key === "battery" && (v.battery_enabled !== false) !== f._shBat) return this._render();
          if (key === "tts" && `${!!v.tts_enabled}${!!v.alexa_enabled}${v.tts_entry_warning !== false}` !== f._shTts) return this._render();
          if (key === "tts") this._refreshTtsHint();
          if (key === "delays") this._refreshTimeline();
          if (key === "siren" || key === "lights") this._refreshSirenSummary();
          if (key === "presence" || key === "night") this._refreshRules();
        });
        f._shBat = this._draft.battery_enabled !== false;
        f._shTts = `${!!this._draft.tts_enabled}${!!this._draft.alexa_enabled}${this._draft.tts_entry_warning !== false}`;
        host.appendChild(f);
        this._forms.push(f);
      } else {
        host.innerHTML = fallbackForm(schema, data, this._errors);
        host.querySelectorAll("[data-f]").forEach((inp) =>
          inp.addEventListener("change", () => {
            this._set(inp.dataset.f, readFallback(inp, this._draft[inp.dataset.f]));
            if (key === "tts" && ["tts_enabled", "alexa_enabled", "tts_entry_warning"].includes(inp.dataset.f)) return this._render();
            if (key === "battery" && inp.dataset.f === "battery_enabled") return this._render();
            if (key === "tts") this._refreshTtsHint();
            if (key === "delays") this._refreshTimeline();
            if (key === "siren" || key === "lights") this._refreshSirenSummary();
            if (key === "presence" || key === "night") this._refreshRules();
          })
        );
      }
    });
  }

  _refreshSiren() {
    this._refreshSirenSummary();
    const host = this.shadowRoot.querySelector(".si-host");
    if (!host) return;
    host.innerHTML = this._sirenSensorsHtml();
    this._bindSiren(host);
  }

  _bindSiren(box) {
    box.querySelectorAll("[data-siren]").forEach((b) =>
      b.addEventListener("click", () => {
        const excl = new Set(this._draft.siren_excluded_sensors || []);
        if (excl.has(b.dataset.siren)) excl.delete(b.dataset.siren);
        else excl.add(b.dataset.siren);
        this._set("siren_excluded_sensors", [...excl]);
        this._refreshSiren();
      })
    );
    box.querySelectorAll("[data-siren-all]").forEach((b) =>
      b.addEventListener("click", () => {
        this._set("siren_excluded_sensors", b.dataset.sirenAll === "on" ? [] : this._monitored());
        this._refreshSiren();
      })
    );
  }

  _refreshRules() {
    const el = this.shadowRoot.querySelector(".rules");
    if (el) el.innerHTML = this._rulesHtml();
  }

  _refreshSirenSummary() {
    const el = this.shadowRoot.querySelector(".siren-sum");
    if (!el) return;
    const tmp = document.createElement("div");
    tmp.innerHTML = this._sirenSummaryHtml();
    el.replaceWith(tmp.firstElementChild);
  }

  _refreshTimeline() {
    const host = this.shadowRoot.querySelector(".tl-host");
    if (!host) return;
    const n = this._secN;
    const tmp = document.createElement("div");
    tmp.innerHTML = this._delaysHtml();
    this._secN = n;
    const fresh = tmp.querySelector(".tl-host");
    if (fresh) host.innerHTML = fresh.innerHTML;
  }

  _bindTab(tab) {
    const root = this.shadowRoot;
    this._forms = [];
    this._mountForms();
    this._bindSections(root);
    root.querySelectorAll("[data-modtoggle]").forEach((b) => b.addEventListener("click", () => this._modToggle(b.dataset.modtoggle)));
    root.querySelectorAll("[data-go]").forEach((b) =>
      b.addEventListener("click", () => {
        this._tab = b.dataset.go;
        this._store("safe_home_panel_tab", this._tab);
        this._render();
      })
    );
    if (tab === "overview") {
      const host = root.querySelector(".cardhost");
      const make = () => {
        const c = document.createElement("safe-home-tablet-card");
        c.setConfig({ entity: this._data.entity_id, show_events: false });
        c.hass = this._hass;
        host.appendChild(c);
        this._card = c;
      };
      if (customElements.get("safe-home-tablet-card")) make();
      else customElements.whenDefined("safe-home-tablet-card").then(() => host.isConnected && make());
    } else this._card = null;
    if (tab === "household") this._bindHousehold(root);
    if (tab === "automation") this._bindWeek();
    if (tab === "security") {
      this._bindPins();
      this._bindPinSecurity(root);
    }
    if (tab === "actions") root.querySelector(".wa-info")?.addEventListener("toggle", (e) => (this._waInfoOpen = e.target.open));
    if (tab === "sensors" || tab === "household") this._bindTypes(root);
    if (tab === "sensors") {
      this._bindZones(root);
      root.querySelectorAll("[data-sw]").forEach((b) => b.addEventListener("click", () => this._toggleSensor(b.dataset.sw, b.dataset.eid)));
      root.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => this._removeSensor(b.dataset.del)));
      const search = root.querySelector(".search input");
      search?.addEventListener("input", () => {
        this._search = search.value;
        const pos = search.selectionStart;
        this._render();
        const s2 = this.shadowRoot.querySelector(".search input");
        s2?.focus();
        s2?.setSelectionRange(pos, pos);
      });
      root.querySelector("[data-suggest]")?.addEventListener("click", () => {
        for (const e of this._suggestions()) {
          const dc = this._hass.states[e].attributes.device_class;
          this._draft.away_sensors = [...(this._draft.away_sensors || []), e];
          if (["door", "window", "opening", "garage_door"].includes(dc)) this._draft.night_sensors = [...(this._draft.night_sensors || []), e];
          if (dc === "door" && /haust|front|eingang|entry/i.test(e + this._name(e))) this._draft.delayed_sensors = [...(this._draft.delayed_sensors || []), e];
        }
        delete this._errors.base;
        this._render();
      });
      const addhost = root.querySelector(".addhost");
      if (this._hasForm) {
        const f = document.createElement("ha-form");
        f.hass = this._hass;
        f.data = {};
        f.schema = [{ name: "add", selector: { entity: { domain: "binary_sensor" } } }];
        f.computeLabel = () => PT("Sensor hinzufügen");
        f.addEventListener("value-changed", (ev) => ev.detail.value.add && this._addSensor(ev.detail.value.add));
        addhost.appendChild(f);
      } else {
        addhost.innerHTML = `<input class="fb" list="sh-bs" placeholder="${PT("binary_sensor.… hinzufügen")}"><datalist id="sh-bs">${Object.keys(this._hass.states)
          .filter((e) => e.startsWith("binary_sensor."))
          .map((e) => `<option value="${pesc(e)}">`)
          .join("")}</datalist>`;
        addhost.querySelector("input").addEventListener("change", (e) => this._addSensor(e.target.value.trim()));
      }
    }
    if (tab !== "info") this._wStopPreview();
    if (tab === "info") {
      this._bindWidget(root);
      root.querySelector("[data-ui-theme]")?.addEventListener("change", (e) => {
        this._set("ui_theme", e.target.checked ? "ha" : "safe_home");
        this._applyUiTheme();
      });
      root.querySelector("[data-expand-all]")?.addEventListener("change", (e) => {
        this._store("safe_home_expand_all", e.target.checked ? "1" : "0");
        this._secState = {};
        this._store("safe_home_sections", "{}");
        this._showToast(e.target.checked ? PT("Abschnitte werden ausgeklappt angezeigt") : PT("Abschnitte werden zugeklappt angezeigt"), "ok");
      });
      root.querySelector('[data-res="register"]')?.addEventListener("click", async (e) => {
        e.currentTarget.disabled = true;
        await this._loadResource(true);
        this._showToast(this._resource.state === "ok" ? PT("Ressource eingetragen") : this._resource.message, this._resource.state === "ok" ? "ok" : "err");
        this._render();
      });
      root.querySelector('[data-res="copy"]')?.addEventListener("click", async () => {
        const url = this._resource?.url || "/safe_home_static/safe-home-card.js";
        try {
          await navigator.clipboard.writeText(url);
          this._showToast(PT("Adresse kopiert"), "ok");
        } catch (err) {
          this._showToast(url, "ok");
        }
      });
    }
    if (tab === "actions") {
      root.querySelectorAll("[data-test]").forEach((b) => b.addEventListener("click", () => this._test(b.dataset.test)));
      this._bindPhones();
      this._bindDrill();
      this._refreshDrill();
      this._bindSiren(root);
      root.querySelectorAll(".wa-row [data-wa]").forEach((inp) => {
        const i = Number(inp.closest(".wa-row").dataset.i);
        const ev = inp.tagName === "SELECT" || inp.type === "checkbox" ? "change" : "input";
        inp.addEventListener(ev, () => this._waUpdate(i, inp.dataset.wa, inp.type === "checkbox" ? inp.checked : inp.value));
      });
      root.querySelectorAll("[data-wa-del]").forEach((b) =>
        b.addEventListener("click", () => {
          const list = [...(this._draft.whatsapp_recipients || [])];
          list.splice(Number(b.dataset.waDel), 1);
          this._set("whatsapp_recipients", list);
          this._render();
        })
      );
      root.querySelector("[data-wa-add]")?.addEventListener("click", () => {
        const list = [...(this._draft.whatsapp_recipients || [])];
        list.push({ name: "", phone: "", apikey: "", delay: list.length ? 5 : 0 });
        this._set("whatsapp_recipients", list);
        this._render();
        const rows = this.shadowRoot.querySelectorAll(".wa-row");
        rows[rows.length - 1]?.querySelector("input")?.focus();
      });
    }
    if (tab === "log") {
      root.querySelectorAll("[data-lf]").forEach((b) =>
        b.addEventListener("click", () => {
          this._logFilter = b.dataset.lf;
          this._render();
        })
      );
      root.querySelector("[data-reload]")?.addEventListener("click", async () => {
        const d = await this._ws({ type: "safe_home/config", entry_id: this._entryId });
        this._data.events = d.events;
        this._render();
      });
    }
  }

  _updateLive() {
    if (!this._data) return;
    const wk = this.shadowRoot.querySelector(".wk");
    if (wk && wk.classList.contains("dis") !== this._presenceOn()) this._redrawWeek();
    this.shadowRoot.querySelectorAll("[data-hhlive]").forEach((el) => {
      const html = this._hhChip(el.dataset.hhlive);
      if (el.innerHTML !== html) el.innerHTML = html;
    });
    this._refreshModSwitches();
    for (const f of this._forms) f.hass = this._hass;
    if (this._card) this._card.hass = this._hass;
    this.shadowRoot.querySelectorAll("[data-live]").forEach((el) => {
      const html = this._stateChip(el.dataset.live);
      if (el.innerHTML !== html) el.innerHTML = html;
    });
    const st = this._hass.states[this._data.entity_id];
    const pill = this.shadowRoot.querySelector(".top .pill");
    if (pill && st) {
      const info0 = STATE_PILL[st.state] || STATE_PILL.unknown;
      const info = { ...info0, l: PT(info0.l) };
      if (pill.textContent !== info.l) {
        pill.textContent = info.l;
        pill.style.setProperty("--tone", info.c);
      }
    }
  }

  _name(eid) {
    return this._hass.states[eid]?.attributes?.friendly_name || eid;
  }
  _area(eid) {
    const h = this._hass;
    const ent = h.entities?.[eid];
    const id = ent?.area_id || (ent?.device_id ? h.devices?.[ent.device_id]?.area_id : null);
    return id ? h.areas?.[id]?.name : null;
  }
  _fmt(iso, full = false) {
    if (!iso) return "";
    const d = new Date(iso);
    const t = d.toLocaleTimeString(P_LOCALE, { hour: "2-digit", minute: "2-digit", ...(full ? { second: "2-digit" } : {}) });
    if (d.toDateString() === new Date().toDateString()) return full ? `${PT("Heute")} ${t}` : t;
    return `${d.toLocaleDateString(P_LOCALE, { day: "2-digit", month: "2-digit", ...(full ? { year: "numeric" } : {}) })} ${t}`;
  }
}

const STATE_PILL = {
  disarmed: { l: "Zuhause", c: "#34d399" },
  armed_away: { l: "Unterwegs", c: "#ffba5e" },
  armed_night: { l: "Nacht", c: "#a78bfa" },
  arming: { l: "Wird scharf", c: "#3b7bff" },
  pending: { l: "Eingangsverzögerung", c: "#fbbf24" },
  triggered: { l: "ALARM", c: "#ef2945" },
  unknown: { l: "Nicht verfügbar", c: "#64748b" },
};

function flatNames(schema) {
  const out = [];
  for (const s of schema) {
    if (s.schema) out.push(...flatNames(s.schema));
    else if (s.name) out.push(s.name);
  }
  return out;
}

async function ensureHaForm() {
  if (customElements.get("ha-form")) return true;
  try {
    const helpers = await window.loadCardHelpers?.();
    if (helpers) {
      for (const cfg of [{ type: "button", entity: "sun.sun" }, { type: "entities", entities: [] }]) {
        const card = await helpers.createCardElement(cfg);
        await card?.constructor?.getConfigElement?.();
        if (customElements.get("ha-form")) break;
      }
    }
  } catch (e) {
    /* Fallback unten */
  }
  try {
    await Promise.race([customElements.whenDefined("ha-form"), new Promise((_, rej) => setTimeout(rej, 4000))]);
    return true;
  } catch (e) {
    return false;
  }
}

// Einfache Eingabefelder, falls ha-form nicht verfügbar ist
function fallbackForm(schema, data, errors) {
  return flatSchema(schema)
    .map((s) => {
      const label = pesc(LABELS[s.name] ? PT(LABELS[s.name]) : s.name);
      const v = data[s.name];
      const sel = s.selector || {};
      const err = errors[s.name] ? `<em class="fb-err">${pesc(errors[s.name])}</em>` : "";
      let input;
      if (sel.boolean) input = `<input type="checkbox" data-f="${s.name}" ${v ? "checked" : ""}>`;
      else if (sel.duration) input = `<input class="fb" type="number" min="0" step="1" data-f="${s.name}" value="${pesc(v)}" placeholder="s">`;
      else if (sel.number) input = `<input class="fb" type="number" min="${sel.number.min}" max="${sel.number.max}" data-f="${s.name}" value="${pesc(v)}">`;
      else if (sel.time) input = `<input class="fb" type="time" step="1" data-f="${s.name}" value="${pesc(v)}">`;
      else if (sel.select && sel.select.multiple && sel.select.mode === "list") {
        const cur = Array.isArray(v) ? v : [];
        input = `<span class="fb-checks">${sel.select.options
          .map((o) => `<label class="fb-check"><input type="checkbox" data-f="${s.name}" data-multi="${pesc(o.value)}" ${cur.includes(o.value) ? "checked" : ""}> ${pesc(o.label)}</label>`)
          .join("")}</span>`;
      } else if (sel.select && !sel.select.multiple)
        input = `<select class="fb" data-f="${s.name}">${sel.select.options.map((o) => `<option value="${pesc(o.value)}" ${o.value === v ? "selected" : ""}>${pesc(o.label)}</option>`).join("")}</select>`;
      else if (sel.entity || (sel.select && sel.select.multiple))
        input = `<input class="fb" data-f="${s.name}" data-list="${Array.isArray(v) || sel.select ? 1 : ""}" value="${pesc(Array.isArray(v) ? v.join(", ") : v || "")}" placeholder="${PT("Entitäten, durch Komma getrennt")}">`;
      else input = `<input class="fb" type="${sel.text?.type === "password" ? "password" : "text"}" data-f="${s.name}" value="${pesc(v)}">`;
      const tag = sel.select && sel.select.multiple && sel.select.mode === "list" ? "div" : "label"; // keine verschachtelten <label>
      return `<${tag} class="fb-row ${sel.boolean ? "inline" : ""}"><span>${label}</span>${input}${err}</${tag}>`;
    })
    .join("");
}
function flatSchema(schema) {
  const out = [];
  for (const s of schema) s.schema ? out.push(...flatSchema(s.schema)) : out.push(s);
  return out;
}
function readFallback(inp, old) {
  if (inp.dataset.multi !== undefined) {
    // Gruppe von Kästchen (Mehrfachauswahl)
    return [...inp.closest(".fb-checks").querySelectorAll("input[data-multi]")].filter((x) => x.checked).map((x) => x.dataset.multi);
  }
  if (inp.type === "checkbox") return inp.checked;
  if (inp.type === "number") return Number(inp.value);
  if (inp.dataset.list || Array.isArray(old))
    return inp.value.split(",").map((x) => x.trim()).filter(Boolean);
  return inp.value;
}

const PANEL_STYLE = `
:host{
  --sh-bg1:#071538; --sh-bg2:#0b2463; --sh-surface:rgba(255,255,255,.05); --sh-surface2:rgba(255,255,255,.09);
  --sh-line:rgba(160,190,255,.16); --sh-text:#eef3ff; --sh-muted:#9fb1d9; --sh-accent:#3b7bff;
  --sh-home:#34d399; --sh-away:#ffba5e; --sh-night:#a78bfa; --sh-pending:#fbbf24; --sh-alarm:#ef2945;
  display:block; height:100%; color:var(--sh-text); font-family:var(--ha-font-family-body, "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
}
/* Eigenes Design: HA-Formulare dunkel einfärben (im Home-Assistant-Design nicht) */
:host(:not([data-ha])){
  /* Home-Assistant-Formulare an das dunkle Design anpassen */
  --primary-color:#3b7bff; --accent-color:#3b7bff; --primary-text-color:#eef3ff; --secondary-text-color:#9fb1d9;
  --text-primary-color:#fff; --disabled-text-color:#64748b; --divider-color:rgba(160,190,255,.16);
  --card-background-color:#0f2560; --secondary-background-color:#0b1d4d; --primary-background-color:#071538;
  --input-fill-color:rgba(255,255,255,.06); --input-disabled-fill-color:rgba(255,255,255,.03); --input-ink-color:#eef3ff;
  --input-label-ink-color:#9fb1d9; --input-idle-line-color:rgba(160,190,255,.3); --input-hover-line-color:#9fb1d9;
  --input-dropdown-icon-color:#9fb1d9; --mdc-theme-primary:#3b7bff; --mdc-theme-surface:#0f2560; --mdc-theme-text-primary-on-background:#eef3ff;
  --mdc-text-field-fill-color:rgba(255,255,255,.06); --mdc-text-field-ink-color:#eef3ff; --mdc-text-field-label-ink-color:#9fb1d9;
  --mdc-select-fill-color:rgba(255,255,255,.06); --mdc-select-ink-color:#eef3ff; --mdc-select-label-ink-color:#9fb1d9;
  --mdc-checkbox-unchecked-color:#9fb1d9; --switch-checked-color:#3b7bff; --switch-unchecked-button-color:#cbd5e1; --switch-unchecked-track-color:#475569;
  --ha-card-background:#0f2560; --sidebar-selected-icon-color:#3b7bff;
  /* Neuere HA-Versionen: Formularfelder und Auswahllisten (sonst weißer Hintergrund mit heller Schrift) */
  --ha-color-form-background:#0b2463; --ha-color-form-background-hover:#123a9a; --ha-color-form-background-disabled:#091c4d;
  --ha-color-surface-default:#0b2463; --ha-color-surface-low:#091c4d; --ha-color-text-primary:#eef3ff; --ha-color-text-secondary:#9fb1d9;
  --input-outlined-idle-border-color:rgba(160,190,255,.3); --input-outlined-hover-border-color:#9fb1d9; --input-disabled-ink-color:#64748b;
  --mdc-select-container-color:#0b2463; --mdc-select-dropdown-icon-color:#9cc0ff; --mdc-theme-on-surface:#eef3ff;
  --md-sys-color-surface:#0b2463; --md-sys-color-surface-container:#0b2463; --md-sys-color-surface-container-low:#0b2463;
  --md-sys-color-surface-container-high:#0f2a6e; --md-sys-color-surface-container-highest:#123178; --md-sys-color-on-surface:#eef3ff;
  --md-sys-color-on-surface-variant:#9fb1d9; --md-menu-container-color:#0b2463; --md-list-container-color:#0b2463;
  --md-list-item-label-text-color:#eef3ff; --md-menu-item-label-text-color:#eef3ff;
  --wa-color-surface-default:#0b2463; --wa-color-surface-raised:#0b2463; --wa-color-surface-lowered:#091c4d;
  --wa-color-text-normal:#eef3ff; --wa-color-text-quiet:#9fb1d9;
  --paper-listbox-background-color:#0b2463; --paper-listbox-color:#eef3ff;
  --material-background-color:#0b2463; --material-body-text-color:#eef3ff; --lumo-base-color:#0b2463; --lumo-body-text-color:#eef3ff;
}
*{box-sizing:border-box}
.app{position:relative; min-height:100vh; min-height:100dvh; overflow:hidden;
  background:radial-gradient(90% 60% at 100% 0%, #123a9a 0%, transparent 60%), linear-gradient(160deg,var(--sh-bg2),var(--sh-bg1) 65%)}
.glow{position:absolute; top:-260px; right:-200px; width:640px; height:640px; background:radial-gradient(closest-side, rgba(59,123,255,.25), transparent); pointer-events:none}
.ic{width:20px; height:20px; flex:none}
.top{position:sticky; top:0; z-index:5; display:flex; align-items:center; gap:14px; padding:14px 24px; background:rgba(7,21,56,.72); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-bottom:1px solid var(--sh-line)}
.logo{width:40px; height:40px; object-fit:contain; filter:drop-shadow(0 3px 8px rgba(0,0,0,.45))}
.ttl{flex:1; min-width:0}
.ttl h1{margin:0; font-size:1.25rem; font-weight:800; letter-spacing:.2px}
.ttl span{font-size:.8rem; color:var(--sh-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block}
.pill{font-size:.78rem; font-weight:700; padding:6px 12px; border-radius:999px; color:var(--tone); background:color-mix(in srgb,var(--tone) 16%, transparent); border:1px solid color-mix(in srgb,var(--tone) 45%, transparent); white-space:nowrap}
.inst{appearance:none; background:var(--sh-surface); color:var(--sh-text); border:1px solid var(--sh-line); border-radius:10px; padding:8px 12px; font:inherit; font-size:.85rem}
.iconbtn{all:unset; cursor:pointer; display:grid; place-items:center; width:38px; height:38px; border-radius:10px; color:var(--sh-muted)}
.iconbtn:hover{background:var(--sh-surface2); color:var(--sh-text)}
.body{position:relative; display:grid; grid-template-columns:230px minmax(0,1fr); gap:24px; max-width:1240px; margin:0 auto; padding:24px 24px 120px}
.tabs{position:sticky; top:92px; align-self:start; display:flex; flex-direction:column; gap:4px}
.tab{all:unset; box-sizing:border-box; cursor:pointer; position:relative; display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:12px; color:var(--sh-muted); font-size:.92rem; font-weight:600}
.tab:hover{background:var(--sh-surface); color:var(--sh-text)}
.tab.active{background:linear-gradient(150deg,#3b7bff,#1d3fb8); color:#fff; box-shadow:0 6px 18px rgba(59,123,255,.35)}
.dot-err{position:absolute; right:12px; width:8px; height:8px; border-radius:50%; background:var(--sh-alarm)}
.body.narrow{grid-template-columns:minmax(0,1fr); padding:0 12px 120px; gap:12px}
.narrow .tabs{position:sticky; top:0; z-index:4; flex-direction:row; overflow-x:auto; gap:6px; padding:6px; margin:0 -12px; background:rgba(7,21,56,.8); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); scrollbar-width:none}
.narrow .tabs::-webkit-scrollbar{display:none}
.narrow .tab{flex:none; padding:9px 12px; font-size:.84rem}
.narrow .top{padding:10px 12px}
.app.is-narrow .top{position:relative}
.content{display:flex; flex-direction:column; gap:18px; min-width:0}
.box{background:rgba(255,255,255,.04); border:1px solid var(--sh-line); border-radius:20px; padding:20px}
.box-h{margin-bottom:16px}
.box-tg{all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:12px; width:100%; margin:0; border-radius:14px}
.box-tg:focus-visible{outline:2px solid #9cc0ff; outline-offset:4px}
.box-tt{flex:1; min-width:0}
.box-chev{flex:none; width:22px; height:22px; color:#9cc0ff; transition:transform .25s}
.box.coll{padding:0} .box.coll > .box-tg{padding:18px 20px}
.box.coll > .box-b{display:none; padding:0 20px 20px}
.box.coll.open > .box-b{display:block}
.box.coll.open > .box-tg{padding-bottom:14px}
.box.coll.open .box-chev{transform:rotate(180deg)}
.box.coll:not(.open) .box-tt p{display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden}
.box.coll:not(.open):hover{background:rgba(255,255,255,.06)}
@media (max-width:860px){ .box.coll > .box-tg{padding:15px 16px} .box.coll > .box-b{padding:0 14px 16px} }
.box-h h2{margin:0; font-size:1.05rem; font-weight:700}
.box-h p{margin:6px 0 0; font-size:.86rem; color:var(--sh-muted); line-height:1.5}
.muted{color:var(--sh-muted)} .pad{padding:16px}
.btn{all:unset; box-sizing:border-box; cursor:pointer; display:inline-flex; align-items:center; gap:8px; padding:10px 16px; border-radius:12px; font-size:.88rem; font-weight:700; white-space:nowrap}
.btn .ic{width:18px; height:18px}
.btn.primary{background:var(--sh-accent); color:#fff; box-shadow:0 6px 16px rgba(59,123,255,.35)}
.btn.primary[disabled]{opacity:.6; cursor:wait}
.btn.ghost{color:var(--sh-text); border:1px solid var(--sh-line)}
.btn.soft{background:rgba(59,123,255,.14); border:1px solid rgba(59,123,255,.4); color:#dbe7ff}
.btn.soft:hover{background:rgba(59,123,255,.25)}
.tiles{display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:12px}
.tile{all:unset; box-sizing:border-box; cursor:pointer; display:flex; flex-direction:column; gap:6px; padding:16px; border-radius:18px; background:rgba(255,255,255,.05); border:1px solid var(--sh-line)}
.tile .ic{color:#9cc0ff; width:22px; height:22px}
.tile b{font-size:1.8rem; font-weight:800; line-height:1.1} .tile b.sm{font-size:1.1rem; padding:8px 0 4px}
.tile span{font-size:.8rem; color:var(--sh-muted)}
.tile.warn{border-color:rgba(251,191,36,.45); background:rgba(251,191,36,.08)} .tile.warn .ic{color:var(--sh-pending)}
.hints{display:flex; flex-direction:column; gap:8px}
.hint{all:unset; box-sizing:border-box; cursor:pointer; display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:14px; background:rgba(251,191,36,.08); border:1px solid rgba(251,191,36,.3); font-size:.88rem; color:#fde68a}
.hint span{flex:1} .hint .go{opacity:.6; width:16px; height:16px}
.allgood{display:flex; align-items:center; gap:10px; color:#a7f3d0} .allgood .ic{color:var(--sh-home)}
.toolbar{display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-bottom:12px}
.search{display:flex; align-items:center; gap:8px; padding:0 12px; height:44px; border-radius:12px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-muted); min-width:200px; flex:1}
.search input{all:unset; flex:1; color:var(--sh-text); font-size:.9rem}
.addhost{flex:1; min-width:240px}
.counts{display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px}
.chip{font-size:.75rem; font-weight:600; padding:5px 10px; border-radius:999px; background:var(--sh-surface2); color:#c7d6ff}
.stable{border:1px solid var(--sh-line); border-radius:16px; overflow:hidden}
.shead,.srow{display:grid; grid-template-columns:minmax(0,2fr) 170px minmax(96px,.8fr) 84px 84px 84px 44px; align-items:center; gap:8px; padding:10px 14px}
.shead{font-size:.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--sh-muted); background:rgba(255,255,255,.03)}
.shead span{display:flex; align-items:center; gap:6px; justify-content:center} .shead span:first-child,.shead span:nth-child(2),.shead span:nth-child(3){justify-content:flex-start}
.shead .ic{width:15px; height:15px}
.srow{border-top:1px solid var(--sh-line)}
.srow:hover{background:rgba(255,255,255,.025)}
.s-name{display:flex; align-items:center; gap:12px; min-width:0}
.s-name > .ic{color:#9cc0ff}
.s-name div{display:flex; flex-direction:column; min-width:0}
.s-name b{font-size:.9rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.s-name small{font-size:.72rem; color:var(--sh-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.s-sw,.s-del{display:flex; justify-content:center}
.shead.has-area,.srow.has-area{grid-template-columns:minmax(0,1.5fr) 166px 90px minmax(128px,.9fr) 64px 64px 72px 38px; gap:6px}
.srow.has-area .fb{font-size:.8rem; padding:7px 6px}
.shead.has-area span{font-size:.66rem; letter-spacing:.6px} .shead.has-area span:nth-child(4){justify-content:flex-start} .shead.has-area .ic{display:none}
.s-type.fb{padding:7px 8px; min-width:0; appearance:auto; font-size:.82rem}
.tts-hint .wa-note{margin-top:10px}
.btn.danger{background:linear-gradient(135deg,#ef2945,#c81e3a); color:#fff; box-shadow:0 6px 16px rgba(239,41,69,.3)}
.btn.danger.confirm{animation:shPulse 1s ease-in-out infinite}
.btn[disabled]{opacity:.45; cursor:not-allowed; box-shadow:none}
@keyframes shPulse{50%{box-shadow:0 0 0 6px rgba(239,41,69,.25)}}
.drill{margin-top:16px; padding:16px; border-radius:16px; border:1px solid rgba(239,41,69,.3); background:linear-gradient(135deg,rgba(239,41,69,.08),rgba(239,41,69,.02))}
.drill.active{border-color:rgba(239,41,69,.7); background:linear-gradient(135deg,rgba(239,41,69,.2),rgba(239,41,69,.06))}
.drill-h{display:flex; gap:12px; align-items:flex-start; margin-bottom:14px}
.drill-h > .ic{flex:none; width:22px; height:22px; color:#fda4af; margin-top:2px}
.drill-h div{display:flex; flex-direction:column; gap:3px} .drill-h b{font-size:.95rem} .drill-h small{font-size:.8rem; color:var(--sh-muted); line-height:1.4}
.drill-row{display:flex; flex-wrap:wrap; gap:10px; align-items:center}
.drill-sel{flex:1; min-width:200px}
.seg2{display:inline-flex; padding:3px; border-radius:12px; background:rgba(255,255,255,.06); border:1px solid var(--sh-line)}
.seg2 button{all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:8px 12px; border-radius:9px; font-size:.84rem; font-weight:600; color:var(--sh-muted)}
.seg2 button .ic{width:15px; height:15px}
.seg2 button.on{background:var(--sh-accent); color:#fff}
.drill-note{display:flex; align-items:center; gap:8px; margin-top:10px; font-size:.82rem; color:#fde68a} .drill-note .ic{width:16px; height:16px}
.drill-live{display:flex; gap:10px; align-items:center; margin-top:12px; padding:10px 12px; border-radius:12px; background:rgba(239,41,69,.18); color:#fecdd3}
.drill-live > .ic{flex:none; color:#fb7185; animation:shPulse 1.2s infinite; border-radius:50%}
.drill-live span{display:flex; flex-direction:column} .drill-live small{font-size:.76rem; opacity:.85}
.np{position:relative; display:flex; flex-direction:column; gap:6px; margin-bottom:18px}
.np-label{font-size:.86rem; color:var(--sh-muted)}
.np-field{display:flex; align-items:center; gap:8px; min-height:48px; padding:6px 10px 6px 8px; border-radius:12px; background:var(--sh-bg2); border:1px solid var(--sh-line); cursor:pointer}
.np-field:hover,.np.open .np-field{border-color:rgba(156,192,255,.55)}
.np-field:focus-visible{outline:2px solid #9cc0ff; outline-offset:2px}
.np-chips{flex:1; display:flex; flex-wrap:wrap; gap:6px; min-width:0}
.np-ph{color:var(--sh-muted); padding-left:6px; font-size:.9rem}
.np-chip{display:inline-flex; align-items:center; gap:6px; padding:5px 6px 5px 10px; border-radius:999px; background:rgba(59,123,255,.22); border:1px solid rgba(79,141,255,.45); font-size:.84rem; font-weight:600}
.np-chip .ic{width:14px; height:14px; color:#9cc0ff} .np-chip.other{background:rgba(255,255,255,.08); border-color:var(--sh-line)}
.np-x{all:unset; cursor:pointer; display:grid; place-items:center; width:20px; height:20px; border-radius:50%; font-size:1rem; line-height:1; color:#c7d6ff}
.np-x:hover{background:rgba(255,255,255,.15)}
.np-chev .ic{width:18px; height:18px; color:#9cc0ff; transition:transform .2s} .np.open .np-chev .ic{transform:rotate(180deg)}
.np-box{position:relative}
.np-menu{position:absolute; z-index:20; left:0; right:0; top:calc(100% + 6px); display:flex; flex-direction:column; gap:2px; padding:6px; border-radius:14px; background:var(--sh-bg2); border:1px solid rgba(156,192,255,.4); box-shadow:0 16px 40px rgba(0,0,0,.45); max-height:320px; overflow:auto}
.np-item{all:unset; cursor:pointer; display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:10px}
.np-item:hover,.np-item:focus-visible{background:rgba(255,255,255,.06)}
.np-item.on{background:rgba(59,123,255,.18)}
.np-ic{flex:none; display:grid; place-items:center; width:34px; height:34px; border-radius:10px; background:rgba(79,141,255,.18); color:#9cc0ff}
.np-t{flex:1; display:flex; flex-direction:column; min-width:0} .np-t b{font-size:.9rem} .np-t small{font-size:.74rem; color:var(--sh-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis}
.np-check{width:22px; height:22px; display:grid; place-items:center; border-radius:7px; border:1.5px solid var(--sh-line)}
.np-item.on .np-check{background:var(--sh-accent); border-color:var(--sh-accent); color:#fff} .np-check .ic{width:15px; height:15px}
.np-empty{display:flex; gap:10px; align-items:center; padding:12px; font-size:.86rem; color:var(--sh-muted)}
.np-other{padding:8px 12px; font-size:.76rem; color:var(--sh-muted); border-top:1px solid var(--sh-line); margin-top:4px}
.np-help{font-size:.76rem; color:var(--sh-muted)}
.tts-prev{margin-top:14px; padding:14px 16px; border-radius:14px; background:rgba(79,141,255,.08); border:1px solid rgba(79,141,255,.25)}
.tts-prev > b{display:flex; align-items:center; gap:8px; font-size:.88rem; margin-bottom:8px}
.tts-prev ul{list-style:none; margin:0 0 8px; padding:0; display:flex; flex-direction:column; gap:8px}
.tts-prev li{display:flex; gap:10px; align-items:flex-start; font-size:.86rem; line-height:1.35}
.tts-prev li > .ic{flex:none; width:18px; height:18px; margin-top:2px; color:#9cc0ff}
.tts-prev li small{display:block; font-size:.7rem; text-transform:uppercase; letter-spacing:.8px; color:var(--sh-muted)}
.s-area select.fb{padding:7px 9px; appearance:auto; font-size:.84rem}
.srow.in-zone{background:rgba(124,92,255,.05)}
.na{color:var(--sh-muted); opacity:.6; cursor:help}
.chip.zc{display:inline-flex; align-items:center; gap:5px; background:rgba(124,92,255,.18); color:#d8ccff} .chip.zc .ic{width:13px; height:13px}
.areas{display:flex; flex-direction:column; gap:12px}
.area{border:1px solid var(--sh-line); border-radius:16px; padding:14px; background:var(--sh-surface)}
.area.main{background:linear-gradient(135deg,rgba(59,123,255,.16),rgba(59,123,255,.04)); border-color:rgba(79,141,255,.35)}
.area.zone{border-color:rgba(124,92,255,.35); background:linear-gradient(135deg,rgba(124,92,255,.12),rgba(124,92,255,.02))}
.area-h{display:flex; align-items:center; gap:12px}
.area-ic{flex:none; width:40px; height:40px; border-radius:12px; display:grid; place-items:center; background:rgba(79,141,255,.2); color:#9cc0ff}
.area.zone .area-ic{background:rgba(124,92,255,.22); color:#c4b5fd}
.area-t{display:flex; flex-direction:column; flex:1; min-width:0} .area-t b{font-size:.98rem} .area-t small{font-size:.78rem; color:var(--sh-muted)}
.area-h .zname{flex:1; min-width:0; font-weight:700; font-size:.98rem; padding:9px 12px}
.area-hint{display:flex; align-items:center; gap:8px; margin-top:10px; font-size:.82rem; color:#fde68a} .area-hint .ic{width:16px; height:16px}
.area-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:12px}
.area-grid label{display:flex; flex-direction:column; gap:5px; font-size:.76rem; color:var(--sh-muted)}
.area-grid .fb{padding:9px 10px; color-scheme:dark}
.area-opt{display:flex; flex-direction:column; gap:8px; margin-top:12px}
.area-sw{display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:12px; background:rgba(255,255,255,.04)}
.area-sw > .ic{flex:none; color:#c4b5fd}
.area-sw > div{flex:1; display:flex; flex-direction:column; min-width:0} .area-sw b{font-size:.9rem} .area-sw small{font-size:.76rem; color:var(--sh-muted)}
.area-sub{padding:0 4px 4px 4px} .area-sub .area-grid{margin-top:2px}
.pills{display:flex; flex-wrap:wrap; gap:6px; margin-top:10px}
.pill{all:unset; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:7px 12px; border-radius:999px; font-size:.8rem; font-weight:600; background:rgba(255,255,255,.06); border:1px solid var(--sh-line); color:var(--sh-muted)}
.pill .ic{width:14px; height:14px}
.pill.on{background:rgba(124,92,255,.3); border-color:rgba(167,139,250,.7); color:#fff}
.pill:focus-visible{outline:2px solid #9cc0ff; outline-offset:2px}
.zadd{align-self:flex-start}
.zs-seg{margin-top:2px; flex-wrap:wrap} .zs-add{margin-top:10px; padding:9px 10px}
.si-tags i.zt{background:rgba(124,92,255,.22); color:#d8ccff}
.st{font-size:.74rem; font-weight:700; padding:4px 9px; border-radius:8px}
.st.ok{color:#6ee7b7; background:rgba(52,211,153,.12)} .st.on{color:#fde68a; background:rgba(251,191,36,.15)} .st.off{color:#94a3b8; background:rgba(148,163,184,.12)}
.sw{all:unset; cursor:pointer; position:relative; width:44px; height:26px; border-radius:99px; background:rgba(255,255,255,.14); transition:background .2s}
.sw i{position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#cbd5e1; transition:transform .2s}
.sw.on{background:var(--sh-accent)} .sw.on i{transform:translateX(18px); background:#fff}
.sw:focus-visible{outline:2px solid #9cc0ff; outline-offset:2px}
.emptybox{display:flex; flex-direction:column; align-items:center; gap:8px; padding:30px; text-align:center; color:var(--sh-muted)}
.emptybox .ic{width:34px; height:34px}
.tl{margin-bottom:14px}
.tl-h{display:flex; align-items:center; gap:8px; font-size:.85rem; font-weight:700; margin-bottom:8px}
.tl-bar{display:flex; gap:4px; border-radius:12px; overflow:hidden}
.seg{display:flex; flex-direction:column; gap:2px; padding:10px 12px; min-width:0}
.seg b{font-size:.72rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis} .seg span{font-size:.8rem; font-weight:700}
.seg.exit{background:rgba(59,123,255,.25)} .seg.armed{background:rgba(79,141,255,.12)} .seg.entry{background:rgba(251,191,36,.2)} .seg.alarm{background:rgba(239,41,69,.25)} .seg.silent{background:rgba(239,41,69,.1); background-image:repeating-linear-gradient(135deg,rgba(239,41,69,.12) 0 6px,transparent 6px 12px)}
.tests{display:flex; flex-wrap:wrap; gap:10px}
.people{display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px}
.pp{display:flex; flex-direction:column; align-items:center; gap:3px; width:84px}
.pp .av{width:54px; height:54px; border-radius:50%; display:grid; place-items:center; font-weight:800; font-size:1.2rem; background:linear-gradient(150deg,#2a4a9a,#16306e); border:3px solid rgba(255,255,255,.14); overflow:hidden}
.pp .av img{width:100%; height:100%; object-fit:cover}
.pp.home .av{border-color:var(--sh-home)} .pp:not(.home) .av{filter:grayscale(.9); opacity:.6}
.pp b{font-size:.85rem} .pp small{font-size:.72rem; color:var(--sh-muted)} .pp.home small{color:#6ee7b7}
.seg-ctl{display:flex; gap:4px; padding:4px; border-radius:12px; background:var(--sh-surface); border:1px solid var(--sh-line); flex-wrap:wrap}
.seg-ctl button{all:unset; cursor:pointer; padding:7px 12px; border-radius:9px; font-size:.82rem; font-weight:600; color:var(--sh-muted)}
.seg-ctl button.on{background:var(--sh-accent); color:#fff}
.log{list-style:none; margin:0; padding:0}
.log li{display:flex; align-items:center; gap:12px; padding:11px 4px; border-top:1px solid var(--sh-line); font-size:.88rem}
.log li:first-child{border-top:none}
.log span{flex:1; min-width:0}
.log time{color:var(--sh-muted); font-size:.78rem; font-variant-numeric:tabular-nums; white-space:nowrap}
.dot{width:9px; height:9px; border-radius:50%; flex:none; background:#7c8db5}
.t-home{background:var(--sh-home)} .t-away{background:var(--sh-away)} .t-alarm{background:var(--sh-alarm); box-shadow:0 0 8px var(--sh-alarm)} .t-pending{background:var(--sh-pending)} .t-arming{background:var(--sh-accent)}
.res{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:12px}
.res p{margin:0; font-size:.88rem; flex:1; min-width:220px}
.res-url{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:14px}
.res-url code, .yaml{font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:.84rem; background:rgba(0,0,0,.3); border:1px solid var(--sh-line); border-radius:8px; padding:6px 10px; color:#dbe7ff}
.yaml{display:block; white-space:pre; padding:12px; margin:0 0 14px; overflow-x:auto}
.loadstate{display:flex; align-items:flex-start; gap:10px; margin-top:14px; padding:10px 12px; border-radius:10px; background:rgba(0,0,0,.2); font-size:.85rem}
.loadstate i{width:10px; height:10px; border-radius:50%; flex:none; margin-top:4px}
.small-note{font-size:.8rem; margin:14px 0 0; line-height:1.5}
.about{display:flex; flex-direction:column; align-items:center; text-align:center; gap:6px; padding:36px 20px}
.about h2{margin:6px 0 0; font-size:1.6rem}
.about p{margin:4px 0}
.biglogo{width:96px; height:96px; object-fit:contain; filter:drop-shadow(0 8px 20px rgba(0,0,0,.45))}
.links{display:flex; flex-wrap:wrap; justify-content:center; gap:8px; margin:16px 0}
.thanks{margin-top:14px !important; font-size:.92rem; color:var(--sh-muted); line-height:1.7}
.thanks a{color:#9cc0ff; font-weight:700; text-decoration:none}
.heart{display:inline-block; animation:beat 1.6s ease-in-out infinite}
@keyframes beat{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(1)}}
.banner{display:flex; gap:12px; padding:14px 16px; border-radius:14px; font-size:.88rem}
.banner.err{background:rgba(239,41,69,.12); border:1px solid rgba(239,41,69,.45); color:#fecdd3}
.banner ul{margin:6px 0 0; padding-left:18px}
.savebar{position:fixed; left:50%; bottom:20px; z-index:10; transform:translate(-50%, calc(100% + 60px)); visibility:hidden; display:flex; align-items:center; gap:10px; padding:10px 10px 10px 18px; border-radius:16px; background:rgba(11,29,77,.95); border:1px solid rgba(59,123,255,.5); box-shadow:0 18px 40px rgba(0,0,0,.5); backdrop-filter:blur(10px); transition:transform .25s ease, visibility .25s; max-width:calc(100% - 24px)}
.savebar.show{transform:translate(-50%,0); visibility:visible}
.savebar > span{display:flex; align-items:center; gap:8px; font-size:.88rem; font-weight:600; color:#fde68a; margin-right:6px; white-space:nowrap}
.toast-host{position:fixed; top:80px; right:20px; z-index:11}
.toast{display:flex; align-items:center; gap:10px; padding:12px 16px; border-radius:12px; font-size:.88rem; font-weight:600; box-shadow:0 12px 30px rgba(0,0,0,.45); animation:tin .25s ease}
.toast.ok{background:#047857; color:#fff} .toast.err{background:#be123c; color:#fff}
@keyframes tin{from{opacity:0; transform:translateY(-8px)}}
.center{display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:10px; min-height:60vh; padding:24px; position:relative}
.center.err .ic{width:36px; height:36px; color:var(--sh-alarm)}
.empty h2{margin:10px 0 0} .empty p{color:var(--sh-muted); max-width:420px}
.spinner{width:36px; height:36px; border-radius:50%; border:3px solid rgba(255,255,255,.15); border-top-color:var(--sh-accent); animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.siren-sum{display:flex; gap:12px; align-items:flex-start; padding:12px 14px; margin-bottom:14px; border-radius:12px; background:rgba(59,123,255,.1); border:1px solid rgba(59,123,255,.35)}
.siren-sum .ic{flex:none; width:22px; height:22px; color:#9cc0ff; margin-top:1px}
.siren-sum div{display:flex; flex-direction:column; gap:3px}
.siren-sum b{font-size:.9rem}
.siren-sum small{font-size:.8rem; color:var(--sh-muted)}
.siren-sum.warn{background:rgba(251,191,36,.1); border-color:rgba(251,191,36,.4)}
.siren-sum.warn .ic, .siren-sum.warn b{color:#fde68a}
.si-head{display:flex; justify-content:space-between; align-items:center; gap:10px; margin:18px 0 10px; font-size:.78rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--sh-muted)}
.si-all{display:flex; gap:6px}
.btn.sm{padding:6px 10px; font-size:.76rem; text-transform:none; letter-spacing:0}
.sirow{display:grid; grid-template-columns:minmax(0,2.2fr) minmax(0,1.2fr) auto; align-items:center; gap:10px; padding:10px 14px; border-top:1px solid var(--sh-line)}
.sirow:first-child{border-top:0}
.si-tags{display:flex; flex-wrap:wrap; gap:4px}
.si-tags i{font-style:normal; font-size:.68rem; font-weight:700; padding:3px 8px; border-radius:999px; background:var(--sh-surface2); color:#c7d6ff}
.si-sw{display:flex; align-items:center; gap:10px; justify-content:flex-end}
.si-lbl{font-size:.78rem; font-weight:700; color:#34d399; min-width:44px; text-align:right}
.si-lbl.off{color:var(--sh-muted)}
@media (max-width:860px){ .sirow{grid-template-columns:minmax(0,1fr) auto} .si-tags{grid-column:1; grid-row:2} .si-sw{grid-row:1 / span 2; grid-column:2} }
.wgen{display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1.25fr); gap:22px; align-items:start}
.wprev-h{margin:14px 0 8px; font-size:.75rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--sh-muted)}
.wgen-r .wprev-h{margin-top:0}
.wphone{padding:22px 16px; border-radius:22px; background:linear-gradient(160deg,#334155,#0f172a 70%); border:1px solid var(--sh-line)}
.wwidget{border-radius:18px; overflow:hidden; background:rgba(15,23,42,.55); color:#eef3ff; font-family:Roboto,system-ui,sans-serif; font-size:14px; line-height:1.35; min-height:60px}
.wwidget p{margin:0; padding:12px 14px}
.wwidget > span{display:block; padding:14px}
.werr{color:#fca5a5}
.wtpl{font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:.74rem; line-height:1.45; resize:vertical; white-space:pre; overflow:auto}
.wsteps{margin:14px 0 0; padding-left:20px; font-size:.86rem; line-height:1.55; color:var(--sh-text)}
.wsteps li{margin-bottom:4px}
@media (max-width:860px){ .wgen{grid-template-columns:1fr} }
.modsw{display:flex; align-items:center; gap:14px; padding:14px 16px; margin-bottom:14px; border-radius:14px; background:var(--sh-surface); border:1px solid var(--sh-line)}
.modsw > .ic{flex:none; width:26px; height:26px; color:var(--sh-muted)}
.modsw div{flex:1; display:flex; flex-direction:column; gap:2px; min-width:0}
.modsw b{font-size:.98rem}
.modsw small{font-size:.8rem; color:var(--sh-muted)}
.modsw.on{border-color:rgba(59,123,255,.55); background:rgba(59,123,255,.12)}
.modsw.on > .ic{color:#9cc0ff}
.modsw .sw[disabled]{opacity:.4; cursor:default}
.hhrow{display:grid; grid-template-columns:minmax(0,2fr) minmax(90px,.8fr) minmax(140px,.9fr) minmax(150px,1fr) 48px; align-items:center; gap:10px; padding:10px 14px; border-top:1px solid var(--sh-line)}
.hhrow:first-child{border-top:0}
.hh-pick{display:flex; flex-direction:column; gap:4px; font-size:.72rem; color:var(--sh-muted)}
.hh-pick .fb{padding:8px 10px}
.hh-pick select.fb{appearance:auto}
.hh-add{flex:1; min-width:220px}
@media (max-width:860px){ .hhrow{grid-template-columns:minmax(0,1fr) auto} .hh-pick{grid-column:1 / -1} .hhrow .s-del{grid-column:2; grid-row:1 / span 1} .hh-typ{grid-column:1 / -1} .hh-state{grid-column:1} }
.rules{display:flex; flex-direction:column; gap:8px}
.rule{display:flex; gap:12px; align-items:flex-start; padding:12px 14px; border-radius:12px; background:var(--sh-surface); border:1px solid var(--sh-line)}
.rule > .ic{flex:none; width:22px; height:22px; color:#9cc0ff; margin-top:1px}
.rule div{display:flex; flex-direction:column; gap:3px}
.rule b{font-size:.9rem}
.rule span{font-size:.84rem; color:var(--sh-muted); line-height:1.45}
.rule.inactive{opacity:.5}
.rule-off{color:#fbbf24 !important; font-weight:700}
.wa{margin-top:6px}
.wa-row{display:grid; grid-template-columns:52px minmax(0,1fr) minmax(0,1.15fr) minmax(0,1.15fr) 140px 38px; gap:10px; align-items:end; padding:12px 0; border-top:1px solid var(--sh-line)}
.wa-row label{display:flex; flex-direction:column; gap:5px; font-size:.76rem; color:var(--sh-muted); min-width:0}
.wa-row .fb{padding:9px 10px}
.wa-row select.fb{appearance:auto}
.wa-note{display:flex; gap:10px; align-items:flex-start; padding:12px 14px; margin-bottom:6px; border-radius:12px; font-size:.84rem; background:rgba(251,191,36,.1); border:1px solid rgba(251,191,36,.4); color:#fde68a}
.wa-note .ic{flex:none; width:20px; height:20px}
@media (max-width:860px){ .wa-row{grid-template-columns:1fr 1fr; } .wa-row .iconbtn{justify-self:end} .wa-on{grid-column:1 / -1; flex-direction:row !important; align-items:center} }
.wa-on{align-items:center; justify-content:flex-end; padding-bottom:10px; cursor:pointer}
.wa-on input{width:20px; height:20px; accent-color:var(--sh-accent); cursor:pointer; margin:0}
.wa-row.off > label:not(.wa-on){opacity:.45}
.chip.warnchip{background:rgba(251,191,36,.18); color:#fde68a}
.sub-h{display:flex; align-items:center; gap:8px; margin:18px 0 8px; font-size:.78rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--sh-muted)}
.sub-h .ic{width:15px; height:15px}
.area.main .area-t .zname{font-weight:700; font-size:.98rem; padding:8px 12px; margin-bottom:4px}
.pin-master{margin-bottom:6px}
.pin-master .sw{flex:none}
.pa-list{display:flex; flex-direction:column; gap:6px; margin-bottom:6px}
.pa-row{display:flex; align-items:center; gap:12px; padding:10px 12px; border-radius:12px; background:rgba(255,255,255,.04); cursor:pointer}
.pa-row input{width:20px; height:20px; accent-color:var(--sh-accent); margin:0; cursor:pointer}
.pa-row > span{flex:1; display:flex; align-items:center; gap:8px; min-width:0} .pa-row > span .ic{width:16px; height:16px; color:#9cc0ff}
.pa-row small{font-size:.76rem; color:var(--sh-muted); text-align:right} .pa-row small.warn{color:#fde68a}
.pa-row.off > span{opacity:.55}
.pin-areas{flex-basis:100%; display:flex; flex-wrap:wrap; align-items:center; gap:6px; padding:2px 0 2px 48px; font-size:.76rem; color:var(--sh-muted)}
.pin-row.guest .pin-areas{grid-column:1 / -1; padding-left:34px}
.pill.sm{padding:4px 10px; font-size:.74rem}
.night-dis{opacity:.38; filter:grayscale(.8); pointer-events:none; user-select:none}
.bat-list{display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px}
.chip.bat{display:inline-flex; align-items:center; gap:6px; background:rgba(251,191,36,.16); color:#fde68a; padding:6px 10px} .chip.bat .ic{width:15px; height:15px} .chip.bat em{font-style:normal; font-weight:800}
.bat-ok{margin-bottom:12px}
.wk-note{display:flex; gap:10px; align-items:center; padding:10px 14px; border-radius:12px; background:rgba(79,141,255,.1); border:1px solid rgba(79,141,255,.3); font-size:.84rem; margin-bottom:12px}
.wk-note .ic{flex:none; width:18px; height:18px; color:#9cc0ff}
.wk-off{display:flex; flex-wrap:wrap; gap:10px; align-items:center; padding:10px 14px; border-radius:12px; background:rgba(148,163,184,.12); border:1px solid rgba(148,163,184,.3); font-size:.84rem; margin-bottom:12px; color:#cbd5e1}
.wk-off span{flex:1; min-width:200px} .wk-off .ic{flex:none; width:18px; height:18px}
.wk.dis .wk-body{opacity:.38; filter:grayscale(.8); pointer-events:none; user-select:none}
.wk-en{margin-bottom:12px}
.wk-tools{display:flex; flex-wrap:wrap; gap:8px 10px; align-items:center; margin-bottom:14px}
.wk-lbl{font-size:.8rem; color:var(--sh-muted)} .wk-sp{flex:1}
.wk-tools .seg2 button[data-wktool="away"].on{background:linear-gradient(150deg,#ffba5e,#d97a1e)}
.wk-tools .seg2 button[data-wktool="night"].on{background:linear-gradient(150deg,#8b5cf6,#4c1d95)}
.wk-tools .seg2 button[data-wktool="off"].on{background:linear-gradient(150deg,#10b981,#047857)}
.wk-grid{display:flex; flex-direction:column; gap:6px; user-select:none}
.wk-row{display:flex; align-items:center; gap:10px}
.wk-day{flex:none; width:30px; font-size:.8rem; font-weight:700; color:var(--sh-muted)}
.wk-scale{position:relative; flex:1; height:16px}
.wk-scale span{position:absolute; transform:translateX(-50%); font-size:.68rem; color:var(--sh-muted)}
.wk-scale span:first-child{transform:none} .wk-scale span:last-child{transform:translateX(-100%)}
.wk-track{position:relative; flex:1; height:40px; border-radius:10px; cursor:crosshair; touch-action:none;
  background:linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px) 0 0/12.5% 100%, rgba(52,211,153,.08); border:1px solid var(--sh-line)}
.wk-bar{position:absolute; top:3px; bottom:3px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:grab; overflow:hidden; font-size:.72rem; font-weight:700; color:#fff; box-shadow:0 2px 8px rgba(0,0,0,.3)}
.wk-bar.m-away{background:linear-gradient(150deg,#ffba5e,#d97a1e); color:#3b1d00}
.wk-bar.m-night{background:linear-gradient(150deg,#8b5cf6,#5b21b6)}
.wk-bar span{pointer-events:none; white-space:nowrap; padding:0 10px}
.wk-bar{container-type:inline-size} @container (max-width:86px){ .wk-bar span{display:none} }
.wk-h{position:absolute; top:0; bottom:0; width:10px; cursor:ew-resize}
.wk-h[data-side="l"]{left:0} .wk-h[data-side="r"]{right:0}
.wk-h::after{content:""; position:absolute; top:30%; bottom:30%; left:4px; width:2px; border-radius:2px; background:rgba(255,255,255,.65)}
.wk-read{min-height:20px; margin-top:8px; font-size:.82rem; font-weight:600; color:#c7d6ff}
.wk-legend{display:flex; flex-wrap:wrap; gap:14px; font-size:.78rem; color:var(--sh-muted); margin-top:4px}
.wk-legend span{display:inline-flex; align-items:center; gap:6px}
.wk-legend i{width:14px; height:10px; border-radius:3px} .wk-legend .m-away{background:#ffba5e} .wk-legend .m-night{background:#8b5cf6} .wk-legend .m-off{background:rgba(52,211,153,.35)}
@media (max-width:860px){ .wk-scale span.odd{display:none} .wk-day{width:24px} .wk-sp{display:none} }
.pins .wk-note,.pins .wa-note{margin-bottom:12px}
.pin-h{display:flex; align-items:center; gap:8px; margin:18px 0 10px; font-size:.82rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--sh-muted)}
.pin-h .ic{width:16px; height:16px}
.pin-list{margin-bottom:8px}
.pin-row{display:flex; flex-wrap:wrap; align-items:center; gap:12px; padding:10px 14px; border-top:1px solid var(--sh-line)}
.pin-row:first-child{border-top:0}
.pin-av{flex:none; width:36px; height:36px; border-radius:50%; display:grid; place-items:center; font-weight:800; background:linear-gradient(150deg,#2a4a9a,#16306e); border:2px solid rgba(255,255,255,.14)}
.pin-who{flex:1; min-width:0; display:flex; flex-direction:column} .pin-who b{font-size:.92rem} .pin-who small{font-size:.74rem; color:var(--sh-muted)}
.pin-in{display:flex; align-items:center; gap:2px; min-width:0}
.pin-in .fb{width:170px; padding:9px 10px; font-variant-numeric:tabular-nums; letter-spacing:1px}
.pin-in .iconbtn{width:34px; height:34px}
.pin-st{flex:none; font-size:.72rem; font-weight:700; padding:4px 9px; border-radius:8px; white-space:nowrap}
.pin-st.ok{color:#6ee7b7; background:rgba(52,211,153,.14)} .pin-st.plan{color:#93c5fd; background:rgba(59,130,246,.16)}
.pin-st.exp{color:#fda4af; background:rgba(239,41,69,.14)} .pin-st.off{color:#94a3b8; background:rgba(148,163,184,.12)}
.pin-row.guest{display:grid; grid-template-columns:24px minmax(110px,1fr) minmax(170px,1.15fr) minmax(196px,1.2fr) minmax(196px,1.2fr) auto 36px; column-gap:10px; align-items:end}
.pin-row.guest .pin-st,.pin-row.guest .iconbtn[data-pin-del],.pin-on{align-self:center}
.pin-row.guest .pin-in .fb{width:100%}
.pin-f{display:flex; flex-direction:column; gap:5px; font-size:.74rem; color:var(--sh-muted); min-width:0}
.pin-f .fb{padding:9px 10px; color-scheme:dark}
.pin-on input{width:20px; height:20px; accent-color:var(--sh-accent); cursor:pointer; margin:0}
.pin-row.guest.off .pin-f{opacity:.45}
@media (max-width:1240px){
  .pin-row.guest{grid-template-columns:24px 1fr 1fr 36px; row-gap:10px}
  .pin-row.guest .pin-on{grid-area:1 / 1} .pin-row.guest .pin-f.name{grid-area:1 / 2} .pin-row.guest .pin-f.code{grid-area:1 / 3} .pin-row.guest [data-pin-del]{grid-area:1 / 4}
  .pin-row.guest .d1{grid-area:2 / 2} .pin-row.guest .d2{grid-area:2 / 3} .pin-row.guest .pin-st{grid-area:3 / 2 / 4 / 4; justify-self:start}
}
@media (max-width:860px){
  .pin-row.user{flex-wrap:wrap} .pin-row.user .pin-in{order:3; width:100%} .pin-row.user .pin-in .fb{flex:1; width:auto}
  .pin-row.guest{grid-template-columns:24px 1fr 36px}
  .pin-row.guest .pin-f.name{grid-area:1 / 2} .pin-row.guest [data-pin-del]{grid-area:1 / 3}
  .pin-row.guest .pin-f.code{grid-area:2 / 1 / 3 / 4} .pin-row.guest .d1{grid-area:3 / 1 / 4 / 4} .pin-row.guest .d2{grid-area:4 / 1 / 5 / 4} .pin-row.guest .pin-st{grid-area:5 / 1 / 6 / 4}
}
.wa-info{margin-bottom:14px; border-radius:14px; border:1px solid rgba(251,191,36,.5); background:rgba(251,191,36,.08); overflow:hidden}
.wa-info summary{list-style:none; cursor:pointer; display:flex; align-items:center; gap:10px; padding:12px 14px; color:#fde68a}
.wa-info summary::-webkit-details-marker{display:none}
.wa-info summary b{flex:1; font-size:.9rem}
.wa-info summary .ic{flex:none; width:20px; height:20px}
.wa-info .wa-chev{transition:transform .2s} .wa-info[open] .wa-chev{transform:rotate(180deg)}
.wa-info ul{margin:0; padding:0 18px 4px 40px; display:flex; flex-direction:column; gap:7px; font-size:.84rem; line-height:1.45; color:var(--sh-text)}
.wa-info .btn{margin:10px 14px 14px 40px; text-decoration:none}
.fb-row{display:flex; flex-direction:column; gap:6px; margin-bottom:14px; font-size:.86rem; color:var(--sh-muted)}
.fb-checks{display:flex; flex-wrap:wrap; gap:8px 22px}
.opt-block{margin-top:12px} .opt-block .small-note{margin:6px 0 0 26px}
.fb-check{display:inline-flex; align-items:center; gap:8px; color:var(--sh-text); font-size:.9rem; cursor:pointer}
.fb-row.inline{flex-direction:row-reverse; justify-content:flex-end; align-items:center; gap:10px}
.fb{width:100%; padding:11px 12px; border-radius:10px; background:var(--sh-surface); border:1px solid var(--sh-line); color:var(--sh-text); font:inherit}
:host(:not([data-ha])){color-scheme:dark}
select.fb,.fb select{-webkit-appearance:none !important; appearance:none !important; background-color:var(--sh-bg2) !important; color:var(--sh-text);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%239cc0ff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 10px center; padding-right:30px !important; cursor:pointer}
select.fb:hover{border-color:rgba(156,192,255,.5)}
select.fb option,select.fb optgroup{background-color:var(--sh-bg2); color:#fff}
.fb-err{color:#fda4af; font-style:normal; font-size:.78rem}
@media (max-width:860px){
  .shead{display:none}
  .srow,.srow.has-area{grid-template-columns:minmax(0,1fr) auto; row-gap:8px}
  .srow .s-sw.s-na{display:none} .srow .s-area select.fb,.srow .s-typ select.fb{width:auto; max-width:62%}
  .area-grid{grid-template-columns:1fr}
  .s-name{grid-column:1} .s-state{grid-column:2; grid-row:1; justify-self:end}
  .srow .s-sw{grid-column:1 / -1; display:flex; justify-content:space-between; align-items:center; padding-top:8px; border-top:1px dashed var(--sh-line)}
  .srow .s-sw::before{font-size:.84rem; color:var(--sh-muted)}
  .srow .s-sw::before{content:attr(data-label)}
  .s-del{grid-column:1 / -1; justify-content:flex-end}
  .savebar > span{display:none}
}

/* ---------- Home-Assistant-Design (Beta): Farben aus dem aktiven HA-Theme ---------- */
:host([data-ha]){
  --sh-bg1:var(--primary-background-color); --sh-bg2:var(--secondary-background-color, var(--primary-background-color));
  --sh-surface:color-mix(in srgb, var(--primary-text-color) 5%, transparent); --sh-surface2:color-mix(in srgb, var(--primary-text-color) 9%, transparent);
  --sh-line:var(--divider-color); --sh-text:var(--primary-text-color); --sh-muted:var(--secondary-text-color); --sh-accent:var(--primary-color);
}
:host([data-ha]) .app{background:var(--primary-background-color)}
:host([data-ha]) .glow{display:none}
:host([data-ha]) .top{background:var(--app-header-background-color, var(--primary-background-color)); color:var(--app-header-text-color, var(--primary-text-color)); backdrop-filter:none; -webkit-backdrop-filter:none}
:host([data-ha]) .top .ttl span,:host([data-ha]) .top .iconbtn{color:inherit; opacity:.8}
:host([data-ha]) .logo{filter:none}
:host([data-ha]) .top .pill{color:inherit; background:rgba(255,255,255,.18); border-color:rgba(255,255,255,.45)}
:host([data-ha]) .top .inst{color:inherit; background:rgba(255,255,255,.15); border-color:rgba(255,255,255,.4)}
:host([data-ha]) .narrow .tabs{background:var(--primary-background-color)}
:host([data-ha]) .tab.active{background:var(--primary-color); color:var(--text-primary-color, #fff); box-shadow:none}
:host([data-ha]) .box{background:var(--ha-card-background, var(--card-background-color)); border-color:var(--ha-card-border-color, var(--divider-color)); box-shadow:var(--ha-card-box-shadow, none)}
:host([data-ha]) .box.coll:not(.open):hover{background:var(--ha-card-background, var(--card-background-color)); filter:brightness(.98)}
:host([data-ha]) .fb,:host([data-ha]) select.fb,:host([data-ha]) .fb select,:host([data-ha]) .np-field,:host([data-ha]) .np-menu,:host([data-ha]) .search{background-color:var(--card-background-color) !important; color:var(--primary-text-color)}
:host([data-ha]) select.fb option{background-color:var(--card-background-color); color:var(--primary-text-color)}
:host([data-ha]) .chip,:host([data-ha]) .si-tags i,:host([data-ha]) .pill{color:var(--primary-text-color)}
:host([data-ha]) .pill.on{color:var(--text-primary-color, #fff); background:var(--primary-color); border-color:var(--primary-color)}
:host([data-ha]) .hint,:host([data-ha]) .wa-note,:host([data-ha]) .wk-off,:host([data-ha]) .area-hint,:host([data-ha]) .drill-note,:host([data-ha]) .wa-info summary,:host([data-ha]) .chip.bat{color:var(--primary-text-color)}
:host([data-ha]) .wa-note .ic,:host([data-ha]) .hint .ic,:host([data-ha]) .wa-info summary .ic,:host([data-ha]) .area-hint .ic{color:var(--warning-color, #f59e0b)}
:host([data-ha]) .allgood,:host([data-ha]) .st.ok{color:var(--success-color, #16a34a)}
:host([data-ha]) .st.on,:host([data-ha]) .pa-row small.warn{color:var(--warning-color, #b45309)}
:host([data-ha]) .area.main,:host([data-ha]) .area.zone{background:var(--secondary-background-color, transparent)}
:host([data-ha]) .area-ic,:host([data-ha]) .np-ic{color:var(--primary-color)}
:host([data-ha]) .s-name > .ic,:host([data-ha]) .area-sw > .ic,:host([data-ha]) .tts-prev li > .ic,:host([data-ha]) .chev,:host([data-ha]) .box-chev,:host([data-ha]) .np-chev .ic{color:var(--primary-color)}
:host([data-ha]) .np-chip{color:var(--primary-text-color)} :host([data-ha]) .np-chip .ic{color:var(--primary-color)}
:host([data-ha]) .wk-bar.m-night,:host([data-ha]) .btn.primary,:host([data-ha]) .btn.danger{color:#fff}
:host([data-ha]) .btn.soft{color:var(--primary-color); background:color-mix(in srgb, var(--primary-color) 12%, transparent); border-color:color-mix(in srgb, var(--primary-color) 40%, transparent)}
:host([data-ha]) .drill-live{color:var(--primary-text-color)}
:host([data-ha]) .savebar{background:var(--card-background-color); color:var(--primary-text-color); box-shadow:0 8px 30px rgba(0,0,0,.25)}
:host([data-ha]) .tts-prev{background:color-mix(in srgb, var(--primary-color) 7%, transparent)}
:host([data-ha]) .tile .ic,:host([data-ha]) .siren-sum .ic,:host([data-ha]) .modsw.on > .ic,:host([data-ha]) .rule > .ic,:host([data-ha]) .np-x,:host([data-ha]) .thanks a{color:var(--primary-color)}
:host([data-ha]) .chip.zc,:host([data-ha]) .si-tags i.zt,:host([data-ha]) .area.zone .area-ic,:host([data-ha]) .area-sw > .ic{color:var(--primary-text-color)}
:host([data-ha]) .res-url code,:host([data-ha]) .yaml{background:var(--secondary-background-color, rgba(127,127,127,.12)); color:var(--primary-text-color)}
:host([data-ha]) .loadstate{background:color-mix(in srgb, var(--primary-text-color) 6%, transparent); color:var(--primary-text-color)}
:host([data-ha]) .banner.err{color:var(--error-color, #db4437)}
:host([data-ha]) .savebar > span,:host([data-ha]) .siren-sum.warn .ic,:host([data-ha]) .siren-sum.warn b{color:var(--warning-color, #b45309)}
:host([data-ha]) .drill-h > .ic{color:var(--error-color, #db4437)}
:host([data-ha]) .area.main{border-color:var(--divider-color)}
:host([data-ha]) .wk-track{background:linear-gradient(90deg,var(--divider-color) 1px,transparent 1px) 0 0/12.5% 100%, color-mix(in srgb, var(--success-color, #16a34a) 10%, transparent)}
.beta{display:inline-block; margin-left:6px; padding:1px 7px; border-radius:6px; font-size:.7rem; font-weight:800; letter-spacing:.3px; background:#facc15; color:#3b2f00; vertical-align:middle}
`;

if (!customElements.get("safe-home-panel")) customElements.define("safe-home-panel", SafeHomePanel);
