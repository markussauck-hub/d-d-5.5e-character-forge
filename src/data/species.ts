export interface Species {
  id: string;
  name: string;
  sizes: string[];
  speed: number;
  traits: { name: string; text: string }[];
  optionLabel?: string;
  options?: { name: string; text: string; speed?: number }[];
}

export const SPECIES: Species[] = [
  {
    id: "dragonborn", name: "Dragonborn", sizes: ["Medium"], speed: 30,
    traits: [
      { name: "Draconic Ancestry", text: "Wähle einen Drachentyp; er bestimmt Schadensart von Breath Weapon und Damage Resistance." },
      { name: "Breath Weapon", text: "Ersetzt einen Angriff: 15-ft-Kegel oder 30-ft-Linie, DEX-Save, 1d10 Schaden (steigt mit Level). Anwendungen = Proficiency Bonus pro Long Rest." },
      { name: "Damage Resistance", text: "Resistenz gegen die Schadensart deiner Draconic Ancestry." },
      { name: "Darkvision", text: "60 ft." },
      { name: "Draconic Flight", text: "Ab Level 5: Bonusaktion für 10 Minuten Flugbewegung gleich deiner Speed, 1× pro Long Rest." },
    ],
    optionLabel: "Draconic Ancestry",
    options: [
      ["Black", "Acid"], ["Blue", "Lightning"], ["Brass", "Fire"], ["Bronze", "Lightning"], ["Copper", "Acid"],
      ["Gold", "Fire"], ["Green", "Poison"], ["Red", "Fire"], ["Silver", "Cold"], ["White", "Cold"],
    ].map(([n, d]) => ({ name: n, text: `Schadensart: ${d}` })),
  },
  {
    id: "dwarf", name: "Dwarf", sizes: ["Medium"], speed: 30,
    traits: [
      { name: "Darkvision", text: "120 ft." },
      { name: "Dwarven Resilience", text: "Resistenz gegen Poison-Schaden; Advantage auf Saves gegen Poisoned." },
      { name: "Dwarven Toughness", text: "Max HP +1 pro Level (automatisch eingerechnet)." },
      { name: "Stonecunning", text: "Bonusaktion: 10 Minuten Tremorsense 60 ft auf/in Stein. Anwendungen = Proficiency Bonus pro Long Rest." },
    ],
  },
  {
    id: "elf", name: "Elf", sizes: ["Medium"], speed: 30,
    traits: [
      { name: "Darkvision", text: "60 ft." },
      { name: "Elven Lineage", text: "Wähle eine Lineage mit eigenen Vorteilen und Zaubern." },
      { name: "Fey Ancestry", text: "Advantage auf Saves gegen Charmed." },
      { name: "Keen Senses", text: "Proficiency in Insight, Perception oder Survival." },
      { name: "Trance", text: "Long Rest in 4 Stunden meditativer Trance." },
    ],
    optionLabel: "Elven Lineage",
    options: [
      { name: "Drow", text: "Darkvision 120 ft; Dancing Lights, später Faerie Fire und Darkness." },
      { name: "High Elf", text: "Prestidigitation (austauschbar), später Detect Magic und Misty Step." },
      { name: "Wood Elf", text: "Speed 35 ft; Druidcraft, später Longstrider und Pass without Trace.", speed: 35 },
    ],
  },
  {
    id: "gnome", name: "Gnome", sizes: ["Small"], speed: 30,
    traits: [
      { name: "Darkvision", text: "60 ft." },
      { name: "Gnomish Cunning", text: "Advantage auf INT-, WIS- und CHA-Saves." },
      { name: "Gnomish Lineage", text: "Wähle eine Lineage." },
    ],
    optionLabel: "Gnomish Lineage",
    options: [
      { name: "Forest Gnome", text: "Minor Illusion; Speak with Animals (Proficiency Bonus × pro Long Rest)." },
      { name: "Rock Gnome", text: "Mending und Prestidigitation; kleine Uhrwerk-Geräte bauen." },
    ],
  },
  {
    id: "goliath", name: "Goliath", sizes: ["Medium"], speed: 35,
    traits: [
      { name: "Giant Ancestry", text: "Wähle eine übernatürliche Gabe; Anwendungen = Proficiency Bonus pro Long Rest." },
      { name: "Large Form", text: "Ab Level 5: Bonusaktion, 10 Minuten Large, Advantage auf STR-Checks, +10 ft Speed." },
      { name: "Powerful Build", text: "Advantage gegen Grappled beenden; Tragkraft wie eine Größe größer." },
    ],
    optionLabel: "Giant Ancestry",
    options: [
      { name: "Cloud's Jaunt", text: "Bonusaktion: Teleport bis 30 ft." },
      { name: "Fire's Burn", text: "Bei Treffer +1d10 Fire-Schaden." },
      { name: "Frost's Chill", text: "Bei Treffer +1d6 Cold-Schaden und −10 ft Speed." },
      { name: "Hill's Tumble", text: "Bei Treffer Ziel (Large oder kleiner) Prone." },
      { name: "Stone's Endurance", text: "Reaktion: Schaden um 1d12 + CON-Mod reduzieren." },
      { name: "Storm's Thunder", text: "Reaktion: 1d8 Thunder-Schaden an Angreifer in 60 ft." },
    ],
  },
  {
    id: "halfling", name: "Halfling", sizes: ["Small"], speed: 30,
    traits: [
      { name: "Brave", text: "Advantage auf Saves gegen Frightened." },
      { name: "Halfling Nimbleness", text: "Durch den Raum größerer Kreaturen bewegen." },
      { name: "Luck", text: "Eine 1 auf dem d20-Test neu würfeln." },
      { name: "Naturally Stealthy", text: "Hide-Aktion möglich, wenn von größerer Kreatur verdeckt." },
    ],
  },
  {
    id: "human", name: "Human", sizes: ["Medium", "Small"], speed: 30,
    traits: [
      { name: "Resourceful", text: "Heroic Inspiration nach jedem Long Rest." },
      { name: "Skillful", text: "Proficiency in einer Fertigkeit deiner Wahl." },
      { name: "Versatile", text: "Ein zusätzliches Origin Feat deiner Wahl (z. B. Skilled)." },
    ],
  },
  {
    id: "orc", name: "Orc", sizes: ["Medium"], speed: 30,
    traits: [
      { name: "Adrenaline Rush", text: "Bonusaktion Dash + Temp HP = Proficiency Bonus. Anwendungen = Proficiency Bonus pro Short/Long Rest." },
      { name: "Darkvision", text: "120 ft." },
      { name: "Relentless Endurance", text: "Fällt auf 1 HP statt 0, 1× pro Long Rest." },
    ],
  },
  {
    id: "tiefling", name: "Tiefling", sizes: ["Medium", "Small"], speed: 30,
    traits: [
      { name: "Darkvision", text: "60 ft." },
      { name: "Fiendish Legacy", text: "Wähle eine Legacy mit Resistenz und Zaubern." },
      { name: "Otherworldly Presence", text: "Thaumaturgy-Cantrip." },
    ],
    optionLabel: "Fiendish Legacy",
    options: [
      { name: "Abyssal", text: "Poison-Resistenz; Poison Spray, später Ray of Sickness und Hold Person." },
      { name: "Chthonic", text: "Necrotic-Resistenz; Chill Touch, später False Life und Ray of Enfeeblement." },
      { name: "Infernal", text: "Fire-Resistenz; Fire Bolt, später Hellish Rebuke und Darkness." },
    ],
  },
];

export const getSpecies = (id?: string) => SPECIES.find((s) => s.id === id);
