# Release Notes

Alle wichtigen Änderungen an Safe Home. English version: [CHANGELOG.md](CHANGELOG.md)

## 1.20.0 – Reiterleiste bleibt stehen

### Behoben
- **Einstellungsseite auf dem Smartphone:** Nach dem Antippen eines Reiters sprang die waagerechte Reiterleiste wieder ganz an den Anfang. Sie bleibt jetzt an ihrer Position. Ein nur halb sichtbarer Reiter wird beim Antippen ganz ins Bild geschoben, damit der nächste Reiter direkt erreichbar ist.

## 1.19.0 – Home-Assistant-Design (Beta) & Design „Safe Home“

### Neu
- **Home-Assistant-Design (Beta):** Unter *Info → Darstellung* gibt es die neue, gelb mit **(Beta)** markierte Option **Home-Assistant-Design verwenden**.
  - Sie schaltet die Safe-Home-Seite und **alle Karten** (Standard, Kompakt, Tablet, Quadrat, Custom, Badge) zwischen dem eigenen Safe-Home-Look und den Farben deines aktiven Home-Assistant-Designs um, hell wie dunkel.
  - Gedacht gegen Darstellungsprobleme, z. B. mit eigenen Themes. Die Zustandsfarben bleiben erhalten.
  - Die Seite wechselt sofort beim Anhaken; für die Karten gilt die Einstellung nach dem Speichern, auf allen Geräten.
  - Auf hellem Hintergrund wird automatisch das rote Logo verwendet.
- **Design „Safe Home“:** Safe Home trägt beim Start automatisch ein eigenes Home-Assistant-Design ein, angelehnt an die Farben der Anwendung, mit hellem und dunklem Modus. Auswählbar unter *Profil → Design → Safe Home*. Nach „Designs neu laden“ wird es automatisch wieder eingetragen.

### Geändert
- *Info → Darstellung:* Jede Option hat jetzt ihren Hinweis direkt darunter.

## 1.18.0 – PINs je Bereich

### Neu
- **PIN-Funktion an/aus:** Unter *Sicherheit → PIN-Eingabe* gibt es einen neuen Hauptschalter. Ist er aus, wird nirgends ein PIN verlangt, und alle PIN-Einstellungen sind ausgegraut.
- **PIN je Bereich:** Unter *PIN verlangen für* hakst du den Hauptbereich und jeden Teilbereich einzeln an.
  - Ein Bereich ohne Haken braucht keinen PIN.
  - Ein Bereich, dem kein aktiver PIN zugeordnet ist, braucht ebenfalls keinen PIN. Die Seite weist darauf hin.
- **Bereiche je PIN:** Jeder Benutzer- und Gast-PIN hat die neue Zeile **Darf schalten**, mit je einem Häkchen für den Hauptbereich und jeden Teilbereich. Der Handwerker-PIN kann so z. B. nur für die *Garage* gelten.
  - Standard sind alle Bereiche, bestehende PINs funktionieren also unverändert weiter.
  - Ein PIN, der in einem anderen Bereich verwendet wird, wird abgewiesen, das Protokoll vermerkt *„PIN von … gilt nicht für …“*.
- Die Karten fragen den PIN bei jedem Teilbereich einzeln ab, passend zu diesen Einstellungen.

## 1.17.0 – Übersichtlichere Einstellungsseite

Keine Änderungen an den Funktionen. Die Einstellungsseite ist neu sortiert, die Texte sind kürzer.

### Geändert
- **Der Reiter *Kernzeiten* entfällt:**
  - Die **Verzögerungen** (mit Live-Ablauf) stehen jetzt in *Bereiche & Sensoren*.
  - Der **Wochenplan** steht jetzt unter *Automatik*, neben Anwesenheit und Nachtmodus. Damit ist auf einen Blick sichtbar, dass er Vorrang vor dem Nachtmodus hat.
  - **Alarmdauer, Sirenendauer und „danach wieder scharf“** stehen jetzt unter *Alarm-Aktionen → Sirene & Licht*.
- **Alarm-Aktionen** in neuer Reihenfolge:
  1. **Sirene & Licht**: Sirenen, Alarmlicht, Sirenen-Regeln, Sirene je Sensor, Dauer.
  2. **Benachrichtigungen**.
  3. **Sprachansagen**.
  4. **WhatsApp**.
  5. **Testen**.
- **Haushalt:** Die Schalter für Push, WhatsApp und Ansage bei Haushalts-Alarm stehen jetzt im Reiter *Haushalt* unter **Melden per**, zusammen mit der Entwarnung.
- **Name der Alarmanlage:** Er wird in der Kachel des Hauptbereichs unter *Bereiche* bearbeitet, nicht mehr unter *Sicherheit*.
- **Sicherheit:** Der erste Abschnitt heißt jetzt **PIN-Eingabe**.
- **Bereiche & Sensoren:** *Verhalten* und *Batterien* sind zu **Überwachung** zusammengefasst.
- **Kürzere Texte:** Bezeichnungen und Beschreibungen sind durchgehend kürzer. Beispiele: *„Automatisch scharf, wenn alle weg sind“* und *„Kritisch – klingelt auch bei Lautlos“*. Abschnittsbeschreibungen haben höchstens einen Satz.

## 1.16.0 – Batterie-Überwachung & Wochenplan vor Nachtmodus

### Neu
- **Batterie-Überwachung der Sensoren:** Safe Home prüft die Batterien aller überwachten Sensoren, im Hauptbereich und in den Teilbereichen.
  - Genutzt wird die Batterie-Entität desselben Geräts (in % oder *Batterie schwach*) oder das Attribut `battery_level` des Sensors.
  - Eine schwache Batterie erscheint als gelber Chip in den Karten und unter *Bereiche & Sensoren → Batterien*. Sie steht außerdem im Protokoll, und du bekommst eine Push-Nachricht.
  - **Einstellungen:** *Batterien der Sensoren überwachen* (an/aus), *Warnen ab Ladestand* (5–90 %, Standard 20 %) und *Push-Benachrichtigung bei schwacher Batterie* (an/aus).
  - Jede Batterie wird nur einmal gemeldet, auch über Neustarts hinweg, bis sie gewechselt wurde. Als gewechselt gilt sie ab 5 % über der Schwelle.

### Geändert
- **Der Wochenplan hat Vorrang vor dem Nachtmodus-Zeitplan:** Solange der Wochenplan aktiv ist, ist der Nachtmodus-Zeitplan pausiert.
  - Der Abschnitt *Nachtmodus* unter *Automatik* ist ausgegraut, mit Hinweis und Link zu den *Kernzeiten*.
  - Der Schalter in der Karte zeigt *Pausiert (Wochenplan)*.
  - So überschneiden sich die Schaltzeiten nicht mehr.

## 1.15.0 – Quadrat-Karte: Status, Personen & Wischen

### Neu
- **Quadrat-Karte – Inhalt der Mitte wählbar:** bis zu drei Elemente, jedes im Karteneditor einzeln zuschaltbar:
  - **Status**: der aktuelle Modus als großes Symbol, mit Countdown-Ring während einer Verzögerung.
  - **Personen**: Avatare, farbig wenn die Person zuhause ist, dazu *„2 von 3 zuhause“*.
  - **Panik-Taste**: die runde SOS-Taste, jetzt auch abschaltbar.
- **Anordnung:** *Alles auf einer Ansicht* (nebeneinander, automatisch verkleinert) oder *Zum Wischen (links/rechts)*.
  - Beim Wischen ist jeweils ein Element zu sehen, darunter Seitenpunkte zum Antippen. Wischen geht per Finger und mit der Maus.
  - Die gewählte Seite bleibt erhalten, wenn sich der Status ändert.
- Standardmäßig sieht die Karte aus wie in 1.14.0: Nur die Panik-Taste ist eingeschaltet.

## 1.14.0 – Quadrat-Karte

### Neu
- **Safe Home – Quadrat** (`custom:safe-home-square-card`): eine Karte im Format 1:1 für kleine Bedien-Displays.
  - Sie zeigt nur den Status (mit Countdown-Ring während einer Verzögerung) und die Modi **Zuhause**, **Unterwegs** und **Nacht**. Das PIN-Ziffernfeld füllt die ganze Karte.
  - Eine große **runde Panik-Taste** (SOS): 2 Sekunden halten, dabei füllt sich ein Ring um die Taste. Wer vorher loslässt, löst nichts aus.
  - Während eines Alarms steht statt der Taste die Ursache des Alarms.
  - Alles passt sich der Kartengröße an, ab etwa 200 px.
  - Option `show_panic: false` blendet die Panik-Taste aus. Im Karteneditor lässt sich die Karte auch als Layout *Quadrat* wählen.

## 1.13.0 – PIN-Schutz

### Neu
- **PIN auch zum Stummschalten der Sirene:** *Sirene stumm* in den Karten öffnet jetzt das Ziffernfeld.
  - Option *Sicherheit → PIN auch zum Stummschalten der Sirene verlangen*, standardmäßig an.
  - Automationen und Skripte, die `safe_home.silence` aufrufen, brauchen keinen PIN. Der Dienst hat das neue optionale Feld `code`.
- **Sperre nach falschen PINs:**
  - Nach 5 falschen Eingaben in Folge ist die PIN-Eingabe 5 Minuten gesperrt. Beide Werte lassen sich unter *Sicherheit* einstellen, 0 bedeutet nie sperren.
  - Während der Sperre wird auch der richtige PIN abgewiesen, beim Entschärfen, Scharfschalten, bei Teilbereichen und beim Stummschalten.
  - Beim Sperren kommt sofort eine **kritische Push-Nachricht** *„🔐 Mehrere falsche PINs“*, auch wenn *Bei falscher PIN-Eingabe benachrichtigen* ausgeschaltet ist.
  - Das Ziffernfeld zeigt *„Zu viele falsche PINs – noch X Min. gesperrt“*, das Protokoll vermerkt jeden abgewiesenen Versuch.
  - Ein richtiger PIN setzt den Zähler zurück, und die Sperre übersteht einen Neustart von Home Assistant.

### Behoben
- Die Taste *Sirene stumm* in den Karten hat die PIN-Prüfung bisher ganz übersprungen.

## 1.12.0 – Sirenen je Teilbereich & ausklappbare Einstellungen

### Neu
- **Sirene je Teilbereich:** Jeder Teilbereich hat unter *Bereiche & Sensoren* die neue Einstellung *Sirene*:
  - **Wie Hauptbereich**: die Sirenen unter *Alarm-Aktionen*. Das ist der Standard und entspricht dem bisherigen Verhalten.
  - **Eigene Sirenen**: Nur die hier gewählten Sirenen ertönen, z. B. nur die Außensirene an der Garage. Jede Sirene, jeder Schalter und jedes Skript lässt sich hinzufügen.
  - **Keine Sirene**: ein stiller Alarm. Benachrichtigungen, Alarmlicht und Ansage laufen trotzdem.
  - Eine Sirene geht erst aus, wenn kein Bereich sie mehr braucht. Sind Hauptbereich und Garage gleichzeitig im Alarm und du entschärfst die Garage, läuft die gemeinsame Sirene weiter.
- **Ausklappbare Einstellungen:** Die Abschnitte in den Reitern (z. B. *Alarm-Aktionen*) sind standardmäßig zugeklappt und öffnen sich per Tipp auf die Überschrift. Jeder Abschnitt merkt sich, ob er auf- oder zugeklappt ist. Enthalten die Einstellungen Fehler, klappen alle Abschnitte automatisch auf.
- **Info → Darstellung → „Einstellungen standardmäßig ausklappen“:** zeigt wieder alle Abschnitte offen an. Die Einstellung gilt je Browser bzw. Gerät.

## 1.11.0 – Strengere Eingangsverzögerung & Hinweis in Schleife

### Geändert
- **Sofortiger Alarm während der Eingangsverzögerung:** Meldet ein Melder **ohne** Verzögerung, während die Eingangsverzögerung läuft (z. B. Bewegung im Wohnzimmer nach dem Öffnen der Haustür), beginnt der Alarm jetzt **sofort**. Bisher kam er erst am Ende des Countdowns. Das gilt für den Hauptbereich und alle Teilbereiche. Das Schließen der Tür beendet den Countdown weiterhin nicht, nur das Entschärfen.

### Neu
- **Hinweis-Ansage in Schleife:** Die Ansage *„Bitte Alarmanlage innerhalb von 30 Sekunden ausschalten.“* wiederholt sich jetzt mit der Restzeit (*„… noch 20 Sekunden.“*), bis du entschärfst oder der Alarm beginnt.
  - Der Abstand ist einstellbar unter *Alarm-Aktionen → Sprachansagen → Hinweis wiederholen alle … Sekunden*. Standard sind 10 s, 0 bedeutet nur einmal.
  - Das funktioniert mit TTS-Lautsprechern und Alexa, im Hauptbereich und in Teilbereichen.
  - In den letzten 3 Sekunden vor dem Alarm kommt kein Hinweis mehr, damit er sich nicht mit der Alarm-Ansage überschneidet.

## 1.10.0 – Weißes Logo bei den Badges

### Geändert
- Das **Safe-Home-Badge** zeigt jetzt standardmäßig das **weiße** Safe-Home-Logo. Für helle Dashboards gibt es die Option *Rotes Logo (für helle Hintergründe)* (`red_logo: true`). Sie ersetzt `white_logo` aus 1.9.0.

## 1.9.0 – Badge-Karte & Teilbereiche ausblenden

### Neu
- **Safe Home – Badge** (`custom:safe-home-badge-card`): eine kleine Karte mit **transparentem Hintergrund**.
  - Sie zeigt das Safe-Home-Logo und den aktuellen Status in seiner Farbe: grün *Zuhause*, orange *Unterwegs*, lila *Nacht*. *ALARM* und die Eingangsverzögerung blinken.
  - Optional: Teilbereiche als farbige Punkte (auf Wunsch mit Namen) und der Name der Alarmanlage.
  - Ein Tipp öffnet die Details der Alarmanlage.
  - Sie lässt sich auch als echtes Home-Assistant-**Badge** in der Badge-Leiste einsetzen: `custom:safe-home-badge`. Ein visueller Editor ist dabei.
- **Teilbereiche ganz ausblenden:** Die *Custom*- und die *Tablet*-Karte haben die dritte Option *Ausblenden* (`zones_display: hidden`). Liste, Punkte und das Widget *Teilbereiche* verschwinden. Nur das rote Banner bei einem Alarm im Teilbereich bleibt, damit kein Alarm übersehen wird.

## 1.8.0 – PINs verwalten & animierte Rollos

### Neu
- **PINs verwalten** unter *Sicherheit*:
  - Jeder **Home-Assistant-Benutzer** kann einen eigenen PIN bekommen.
  - **Gast-PINs** haben einen Namen und optional *Gültig ab* und *Gültig bis*, so lassen sich Zugänge planen. Jeder Gast-PIN lässt sich per Häkchen ausschalten, ein Status zeigt *Aktiv*, *Geplant*, *Abgelaufen*, *Deaktiviert* oder *Unbegrenzt*.
  - 🎲 erzeugt einen zufälligen 6-stelligen PIN, der noch nicht vergeben ist, 👁 zeigt den PIN an.
  - Diese PINs **ersetzen den allgemeinen PIN**. Ein vorhandener allgemeiner PIN wird als *Bisheriger PIN* übernommen.
  - Protokoll und Benachrichtigungen zeigen, wessen PIN verwendet wurde. Ein geplanter, abgelaufener oder deaktivierter Gast-PIN wird abgelehnt, und das Protokoll nennt den Grund.
  - Die PINs gelten für den Hauptbereich und alle Teilbereiche.
- **Animierte Rollos:** Im Karteneditor unter *Rollos* wählst du zwischen **Klassisch (Balken)** und **Animiertes Rollo**.
  - Die animierte Darstellung zeigt jedes Rollo als kleines Fenster. Der Rollladen bedeckt genau den geschlossenen Anteil, die Öffnung in Prozent steht im Fenster.
  - Während das Rollo fährt, rollen die Lamellen.
  - Das Fenster ist so groß wie die Tasten, die Karte wird also nicht größer.

### Geändert
- Das einzelne Feld *PIN-Code* im Formular *Sicherheit* ist entfallen. *PINs verwalten* ersetzt es.

### Hinweise zum Update
- Keine inkompatiblen Änderungen. Ein vorhandener allgemeiner PIN funktioniert weiter, bis du speicherst. Danach ist er der Eintrag *Bisheriger PIN*.

## 1.7.0 – Wochenplan, WhatsApp-Empfänger ein/aus

### Neu
- **Wochenplan** im Reiter *Kernzeiten*:
  - Ein Wochenkalender von Montag bis Sonntag. Balken für *Unterwegs* (orange) oder *Nacht* (lila) ziehst du per Maus oder Finger hinein. Außerhalb der Balken ist die Anlage unscharf.
  - An den Rändern ziehen ändert die Zeit, den Balken ziehen verschiebt ihn. Mit *Unscharf* radierst du Zeiten weg. Die Zeiten rasten auf 15 Minuten ein.
  - Abkürzungen: *Montag auf Di–Fr kopieren* und *Alles leeren*.
  - **Nur aktiv, wenn „Anwesenheit“ ausgeschaltet ist.** Sonst ist der Bereich ausgegraut, mit einem kurzen Hinweis und einem Link zur Automatik.
  - Zum Beginn eines Balkens wird scharf geschaltet (mit Ausgangsverzögerung). Zum Ende wird unscharf geschaltet, aber nur, wenn der Wochenplan scharf geschaltet hat. Über Mitternacht aneinanderstoßende Balken gelten als ein Zeitraum.
- **WhatsApp-Empfänger ein- und ausschalten:** Jeder Empfänger hat ein Häkchen *Aktiv*, z. B. um zeitweise nur eine Person zu benachrichtigen. Ein Zähler zeigt, wie viele Empfänger aktiv sind.
- **Wichtige Hinweise zu WhatsApp-Benachrichtigungen:** ein ausklappbares Feld mit Hinweisen zu TextMeBot:
  - TextMeBot ist ein **kostenpflichtiges Angebot eines Drittanbieters**. Preise und Bedingungen stehen auf [textmebot.com](https://textmebot.com).
  - Gesendet wird über das WhatsApp-Konto, das mit dem API-Key verbunden ist.
  - Es gibt keine Zustellgarantie.
  - Telefonnummern und Nachrichtentexte werden an TextMeBot weitergegeben.

### Geändert
- Der Schalter in den Karten heißt jetzt kurz **„Anwesenheit“**. Auf Englisch bleibt es **„Presence detection“**.

### Hinweise zum Update
- Keine inkompatiblen Änderungen. Bestehende WhatsApp-Empfänger sind aktiv. Der Wochenplan ist aus, bis du *Wochenplan verwenden* anhakst.

## 1.6.0 – Neue Bezeichnungen & Farbe für Unterwegs

### Geändert
- **„Unterwegs“ erscheint jetzt in Orange (`#FFBA5E`) statt Blau:**
  - In allen Karten: aktive Modus-Taste, Statusring und Leuchten, Hintergrundton und Badge.
  - Auf der Einstellungsseite und im Android-Widget.
- **Teilbereiche in derselben Farbe:** Ein scharfer Teilbereich zeigt einen orangefarbenen Punkt und eine orange umrandete Zeile, auch die Taste *Scharf* ist orange.
- In den Karten heißt der Schalter **„Home-Zone“** in der Automatik-Box jetzt **„Anwesenheit erkennen“**. Die Einstellungsseite verweist mit dem neuen Namen darauf.
- Der Reiter **„Zeiten“** auf der Einstellungsseite heißt jetzt **„Kernzeiten“**.

## 1.5.0 – Ansage bei jedem Alarm

### Behoben
- **Alexa (und alle anderen Lautsprecher) blieben bei einem Alarm stumm**, obwohl der Knopf *Ansage testen* funktionierte. Ursache: Sobald eine Sirenen-Regel griff, galt der Alarm als *stiller Alarm*, und dann entfiel auch die Ansage. Sirenen-Regeln sind z. B. das Zeitfenster außerhalb von 22–06 Uhr, ein Sensor ohne Sirene oder ein Modus ohne Sirene. Das betraf auch Alarme, die im Bereich *Testen* von einem Sensor ausgelöst wurden.
- Die Ansage kommt jetzt bei **jedem Alarm**, auch bei einem stillen Alarm: Nur die Sirene bleibt aus.

### Neu
- Option **Ansage auch bei stillem Alarm** (standardmäßig an). Schalte sie aus, wenn ein stiller Alarm ganz still bleiben soll.
- **Gründe im Protokoll:** Entfällt eine Ansage (stiller Alarm mit ausgeschalteter Option, oder keine Lautsprecher bzw. Alexa-Geräte ausgewählt) oder meldet Alexa Media Player einen Fehler, steht das im Protokoll. Beispiel: *„Alexa-Ansage fehlgeschlagen: …“*.

## 1.4.0 – Alarm von einem Sensor auslösen & Smartphone-Auswahl

### Neu
- **Echten Alarm von einem Sensor auslösen:** Unter *Alarm-Aktionen → Testen* gibt es einen neuen Bereich, in dem du einen Alarm ausgehend von einem angelegten Sensor auslöst.
  - Wählbar sind **Alarmanlage** (Hauptbereich und Teilbereiche, nach Bereich gruppiert) und **Haushalt**.
  - Ausgelöst wird mit zwei Klicks: *Alarm auslösen*, dann *Jetzt wirklich auslösen?*.
  - Alles läuft genau wie im Ernstfall: Sirenen, Alarmlicht, Ansage, Push mit Kamerabild, WhatsApp, Protokoll und das Alarm-Banner in den Karten. Die Texte passen zur Art des Sensors, z. B. *„Fenster geöffnet: Küche“*. Das Wort „Test“ taucht nirgends auf.
  - **Rückstellung** beendet den Alarm und stellt den Zustand davor wieder her: unscharf bleibt unscharf, *Nacht* oder *Unterwegs* wird wieder scharf, ein Teilbereich kehrt in seinen vorherigen Zustand zurück. WhatsApp-Empfänger erhalten die übliche Entwarnung. Bei Haushalts-Sensoren kommt die gewohnte Entwarnung.
  - Entschärfen über eine Karte beendet den Alarm ebenfalls. Ist die Alarmdauer abgelaufen, stellt Safe Home automatisch zurück, statt die Anlage scharf zu schalten.
- **Smartphone-Auswahl für Benachrichtigungen:** Das bisherige Feld für Benachrichtigungsdienste ist durch ein Dropdown-Menü im Safe-Home-Design ersetzt.
  - Es zeigt **nur Smartphones mit Companion App**, mit Gerätenamen, Modell und Betriebssystem (z. B. *„Pixel 8 von Max · Google Pixel 8 · Android 15“*).
  - Ausgewählte Geräte erscheinen als Chips, die du mit × wieder entfernst.
  - Früher eingetragene andere Dienste wie `telegram` bleiben sichtbar und lassen sich entfernen.

### Hinweise zum Update
- Keine inkompatiblen Änderungen. Deine ausgewählten Benachrichtigungsdienste bleiben unverändert.

## 1.3.0 – Alexa-Geräte

### Neu
- **Alexa-Geräte getrennt von den Lautsprechern:** Unter *Alarm-Aktionen → Sprachansagen* gibt es die neue Checkbox **Alexa-Geräte verwenden (Alexa Media Player)**. Sie ist **standardmäßig aus**. Erst wenn sie angehakt ist, lassen sich Echo-Geräte auswählen. Die Auswahl zeigt nur Geräte der Integration `alexa_media`.
- **Normale Alexa-Stimme:** Echo-Geräte bekommen die Ansage über `notify.alexa_media` (`type: tts`). Es wird kein TTS-Dienst übergeben, Alexa spricht also mit ihrer eigenen Stimme. Wer nur Alexa nutzt, braucht gar keinen Sprachausgabe-Dienst.
  - Lautsprecher (z. B. Sonos oder Google über TTS) und Alexa-Geräte lassen sich kombinieren. Jede Ansage geht an beide.
  - Das gilt für alle Ansagen: Alarm, Eingangsverzögerung, Haushalt, Teilbereiche und den Test-Knopf.
- **Echo versehentlich als Lautsprecher gewählt?** Die Einstellungsseite zeigt einen Hinweis. Safe Home schickt die Ansage trotzdem mit der Alexa-Stimme. Die Alexa-Checkbox wird dabei nicht automatisch angehakt.

### Verbessert
- **Lesbare Auswahllisten:** Alle Dropdown-Menüs auf der Einstellungsseite haben jetzt den dunkelblauen Seitenhintergrund statt Weiß, dazu einen Pfeil im Safe-Home-Stil. Das gilt für Art, Bereich, Haushalts-Zustand, die WhatsApp-Wartezeit und die Auswahlfelder von Home Assistant. Dasselbe gilt für eigene YAML-Widgets in der Custom-Karte. Bisher war die helle Schrift auf weißem Grund erst beim Darüberfahren lesbar.

### Hinweise zum Update
- Keine inkompatiblen Änderungen. Echo-Geräte, die bisher unter *Lautsprecher* ausgewählt waren, sprechen ab sofort automatisch mit der Alexa-Stimme. Sie werden nicht verschoben – bei Bedarf über die Alexa-Checkbox auswählen.

## 1.2.0 – Art der Sensoren & Sprachansagen

### Neu
- **Art für jeden Sensor:** Türkontakt, Fensterkontakt, Bewegungsmelder, Präsenzmelder, Wassersensor oder Kamera.
  - Auswählbar in der neuen Spalte **Art** im Reiter *Bereiche & Sensoren*. Binäre Sensoren im Reiter *Haushalt* haben sie ebenfalls.
  - Safe Home schlägt die Art anhand der Geräteklasse und des Entitätsnamens vor.
  - Die Art bestimmt auch das Symbol auf der Einstellungsseite.
- **Meldungen passend zum Sensor:** Push, WhatsApp und Protokoll nennen jetzt, was passiert ist, z. B. *„Fenster geöffnet: Küche“*, *„Bewegung erkannt: Flur“*, *„Wasser erkannt: Keller“*. Bisher stand dort *„Küche ausgelöst“*.
- **Sprachansagen mit eigenem Ein/Aus-Schalter** (*Alarm-Aktionen → Sprachansagen*):
  - Bei einem Alarm richtet sich die Ansage nach der Art des Melders, z. B. *„Achtung, möglicher Einbruch! Geöffnetes Fenster erkannt: Küche. Die Bewohner werden benachrichtigt.“* Bei einem Wassersensor heißt es *„Achtung, Wasseralarm! …“*.
  - Teilbereiche nennen den Bereich: *„Achtung, möglicher Einbruch im Bereich Garage! …“*.
  - Optional eine **Ansage während der Eingangsverzögerung**, die ans Ausschalten der Alarmanlage erinnert.
  - Optional eine **Ansage bei Haushalts-Alarm**, z. B. bei einem Wassersensor.
  - Eine **Vorschau** zeigt alle Ansagen mit deinen eigenen Sensornamen.
  - Sprachausgabe-Dienst und Lautsprecher erscheinen nur, wenn die Ansagen eingeschaltet sind. Dann sind ein Dienst und mindestens ein Lautsprecher Pflicht.
  - Bei einem stillen Alarm gibt es keine Ansage.

### Hinweise zum Update
- Keine inkompatiblen Änderungen.
  - Wer bereits Sprachausgabe-Dienst und Lautsprecher eingerichtet hatte, behält die Ansagen eingeschaltet.
  - Die Art der Sensoren wird automatisch vorgeschlagen. Bitte unter *Bereiche & Sensoren* kurz prüfen.
- Automationen, die im Feld `cause` nach dem alten Text *„… ausgelöst“* suchen, sollten den neuen Wortlaut oder das Ereignis `safe_home_triggered` verwenden.

## 1.1.0 – Teilbereiche

### Neu
- **Teilbereiche:** bis zu 3 Teilbereiche neben der Haupt-Alarmanlage, z. B. *Garage*, *Nebengebäude* oder *Werkstatt*. Die Alarmanlage mit Zuhause, Unterwegs und Nacht bleibt der **Hauptbereich** und zählt nicht als Teilbereich.
  - Jeder Teilbereich hat einen eigenen **Namen**, eigene **Sensoren** und eine eigene **Ausgangs- und Eingangsverzögerung**. Die Eingangsverzögerung lässt sich zusätzlich je Sensor festlegen.
  - Ein Teilbereich kennt nur **Scharf** und **Unscharf**.
  - **Kernzeiten:** zur Startzeit scharf und zur Endzeit unscharf, an den Wochentagen, die du auswählst (Mo–So).
  - **Eigene Anwesenheit:** scharf, wenn alle gewählten Personen weg sind, unscharf, sobald eine zurückkommt. Das funktioniert unabhängig vom Hauptbereich.
  - Jeder Teilbereich bekommt eine eigene Entität `alarm_control_panel.<name>` (`alarm_arm_away` / `alarm_disarm`) und nutzt denselben PIN wie der Hauptbereich.
  - Nach einem Neustart von Home Assistant ist der Teilbereich wieder so scharf wie vorher.
  - Die Regeln für offene Sensoren beim Scharfschalten, für nicht erreichbare Sensoren und für „wieder scharf nach Alarm“ gelten auch für Teilbereiche.
- **Alarme in Teilbereichen** laufen über dieselben Ausgänge wie beim Hauptbereich: Sirenen, Alarmlicht, Push mit Entschärfen-Knopf, Ansage, WhatsApp, Hinweis in Home Assistant und Protokoll. Jeder Alarm nennt den Bereich, z. B. *„🚨 ALARM – Garage“*.
  - Die Einstellungen unter *Akustischer Alarm* gelten auch hier (Zeitfenster, Sensoren ohne Sirene). Die Modus-Auswahl gilt nicht, weil Teilbereiche keine Modi haben.
  - Die Sirenen gehen erst aus, wenn kein Bereich sie mehr braucht.
- **Dashboard-Karten:**
  - **Kompakt:** bis zu 3 Punkte oben rechts, einer pro Teilbereich, gefärbt nach Zustand (grün unscharf, blau scharf, gelb Verzögerung, rot Alarm). Ein Tipp darauf klappt die Steuerung auf.
  - **Standard:** die Teilbereiche stehen direkt unter den Modus-Tasten.
  - **Tablet & Custom:** im Karteneditor wählbar, ob die Teilbereiche als Liste oder nur als Punkte erscheinen (`zones_display: inline | dots`). In der Custom-Karte ist die Liste ein eigenes Widget *Teilbereiche*, das du verschieben und in der Größe ändern kannst.
  - Bei einem Alarm in einem Teilbereich zeigt jede Karte ein rotes Banner mit Entschärfen-Knopf.
  - In jeder Karte kannst du Teilbereiche scharf und unscharf schalten, die Ausgangsverzögerung mit *Sofort* überspringen und das Scharfschalten abbrechen. Ist ein PIN gesetzt, wird er abgefragt.
- **Einstellungsseite:** Der Reiter *Sensoren* heißt jetzt **Bereiche & Sensoren**.
  - Dort legst du Teilbereiche an, benennst sie um oder löschst sie und stellst Verzögerungen, Kernzeiten und Anwesenheit ein.
  - Die Sensortabelle hat die neue Spalte **Bereich**. Darüber ordnest du jeden Sensor genau einem Bereich zu.
  - Wenn du einen Teilbereich löschst, gehören seine Sensoren wieder zum Hauptbereich.
- **Dienste & Ereignisse:**
  - `safe_home.skip_exit_delay` funktioniert auch für die Entitäten der Teilbereiche.
  - `safe_home_triggered` enthält zusätzlich `zone` und `zone_id` (mit `mode: zone`).
  - Die Haupt-Entität hat das neue Attribut `zones` mit dem Zustand aller Teilbereiche.

### Hinweise zum Update
- Keine inkompatiblen Änderungen. Deine bisherige Konfiguration bleibt unverändert. Teilbereiche sind optional.
- Starte Home Assistant nach dem Update neu. Die Dashboard-Ressource bekommt automatisch eine neue Versionsnummer, damit Browser und Companion App die neuen Karten laden.

## 1.0.0 – Erste Version

- Alarmanlage mit den Modi **Zuhause**, **Unterwegs** und **Nacht**, Ausgangs- und Eingangsverzögerung, Panikalarm und PIN.
- **Home-Zone-Automatik:**
  - Scharf, wenn alle weg sind (mit Verzögerung), unscharf bei Rückkehr.
  - Nachtmodus nach Zeitplan, abhängig davon, wer zuhause ist, und wieder scharf nach spätem Heimkommen.
  - Pro Automatik genau ein Schalter.
- **Alarm-Aktionen:**
  - Sirenen mit feinen Regeln: Modus, Zeitfenster, je Sensor, stiller Alarm.
  - Alarmdauer und Sirenendauer getrennt einstellbar.
  - Rotes Alarmlicht, Push (auch als kritische Benachrichtigung), Kameras und Sprachansage.
- **WhatsApp über TextMeBot:**
  - Mehrere Empfänger mit Eskalation über Wartezeiten.
  - Entwarnung und Statusmeldungen.
- **Haushalt:** Überwachung von Wassersensoren u. Ä. mit wählbarem Alarmzustand.
- **Vier Dashboard-Karten:**
  - Standard, Kompakt, Tablet und Custom.
  - Die Custom-Karte hat Module für Personen, Wetter, Klima, Rollläden, Licht, Szenen, Kameras, Uhr, Spritpreise und eigene YAML-Widgets.
  - Drag & Drop, einstellbare Widget-Größen und eigene Hintergrundfarbe.
- **Einstellungsseite in der Seitenleiste:**
  - Übersicht, Sensoren, Zeiten mit Zeitstrahl, Alarm-Aktionen mit Test-Knöpfen, Automatik, Haushalt, Sicherheit und Protokoll.
  - Generator für ein Widget der Android Companion App.
- Durchgehend zweisprachig: Deutsch und Englisch.
