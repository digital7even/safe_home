# Release Notes

Alle wichtigen Änderungen an Safe Home. English version: [CHANGELOG.md](CHANGELOG.md)

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
