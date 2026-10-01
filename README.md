# D&D 5.5e Character Forge

Baue einen Charaktereditor für Dungeons & Dragons 5.5e (Regeln 2024) als Single-Page-Web-App. UI-Sprache: Deutsch. Spielbegriffe (Klassen, Völker, Fertigkeiten, Zauber, Feats) bleiben auf Englisch, wie im SRD.

WICHTIG – Inhalte/Lizenz:
- Verwende ausschließlich Inhalte aus dem System Reference Document 5.2 (SRD 5.2, CC-BY-4.0). Keine Inhalte aus den Kaufbüchern, die nicht im SRD stehen.
- Im Footer diese Attribution anzeigen: "This work includes material from the System Reference Document 5.2 (\"SRD 5.2\") by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode."
- Keine Wizards-/D&D-Logos oder Markenartwork.

Datenbasis (SRD 5.2), als strukturierte TypeScript-Daten in /src/data:
- Species: Dragonborn, Dwarf, Elf, Gnome, Goliath, Halfling, Human, Orc, Tiefling (inkl. Size, Speed, Traits; Untervarianten wie Elf-Lineage, Draconic Ancestry, Fiendish Legacy, Giant Ancestry, Gnomish Lineage als Auswahl).
- Backgrounds: Acolyte, Criminal, Sage, Soldier – jeweils mit den 3 Attributen für die Steigerung, Origin Feat, 2 Skill-Proficiencies, Tool-Proficiency, Ausrüstungsoption A oder 50 GP.
- Origin Feats: Alert, Magic Initiate, Savage Attacker, Skilled.
- Klassen (Level 1–20) mit je der SRD-Subklasse: Barbarian (Path of the Berserker), Bard (College of Lore), Cleric (Life Domain), Druid (Circle of the Land), Fighter (Champion), Monk (Warrior of the Open Hand), Paladin (Oath of Devotion), Ranger (Hunter), Rogue (Thief), Sorcerer (Draconic Sorcery), Warlock (Fiend Patron), Wizard (Evoker). Pro Klasse: Hit Die, Primary Ability, Saving-Throw-Proficiencies, Skill-Auswahl (Anzahl + Liste), Waffen-/Rüstungs-Proficiencies, Feature-Namen pro Level, Spell-Slots-Tabelle (falls Caster), Weapon-Mastery-Anzahl.

Funktionen:
1. Charakterliste (Startseite): Charaktere anlegen, duplizieren, löschen, öffnen. Speicherung in localStorage, zusätzlich Export/Import als JSON-Datei.
2. Erstellungs-Assistent in Schritten: Klasse → Background → Species → Attribute → Fertigkeiten/Ausrüstung → Details (Name, Gesinnung, Aussehen, Notizen). Fortschrittsanzeige, Vor/Zurück, jederzeit zum Bogen springen.
3. Attribute mit drei Methoden: Standard Array (15, 14, 13, 12, 10, 8 per Zuweisung), Point Buy (27 Punkte, 8–15, korrekte Kosten), Würfeln (4d6, niedrigsten streichen, mit Würfelanimation). Danach Background-Bonus: entweder +2/+1 oder +1/+1/+1 auf die drei Background-Attribute, Maximum 20.
4. Automatische Berechnungen: Modifikatoren, Proficiency Bonus nach Level, Saving Throws, alle 18 Skills (inkl. Expertise-Toggle), Passive Perception, Initiative, Max HP (Level 1: max. Hit Die + CON-Mod; danach Durchschnitt oder manuell gewürfelte Werte), AC (Rüstungsauswahl + DEX-Regeln, Schild, Unarmored Defense für Barbarian/Monk), Spell Save DC und Spell Attack Bonus für Caster.
5. Charakterbogen-Ansicht: übersichtliches Layout wie ein klassischer Bogen. Felder manuell überschreibbar (Override-Funktion mit Markierung). Aktuelle HP, Temp HP, Hit Dice, Death Saves, Conditions (SRD-Liste inkl. Exhaustion-Stufen), Spell Slots zum Abhaken, Geld (CP/SP/EP/GP/PP), Inventar mit Freitext, Zauberliste als Freitext-Einträge.
6. Level-Up-Button: erhöht Level, zeigt neue Klassenfeatures an, fragt HP (Durchschnitt oder Wurf) ab, bei Subklassen-Level die Subklasse zuweisen, bei ASI-Level Attributserhöhung (+2 / +1/+1) oder Feat als Freitext.
7. Druckansicht (CSS @media print) für einen sauberen Bogen auf A4.

Design: dunkles Fantasy-Theme mit Pergament-Akzenten für den Bogen, gut lesbare Schrift (z. B. Cinzel für Überschriften, Inter für Text), responsiv bis Handybreite. Kein Login, kein Backend nötig.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9dcd6cb0-3560-417d-800e-947117cf7af2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
