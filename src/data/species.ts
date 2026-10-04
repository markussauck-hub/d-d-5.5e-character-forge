import type { Ab } from "./rules";

export interface Species {
  id: string;
  name: string;
  /** Interne Größen-Schlüssel ("Medium", "Small"), Anzeige über sizeName(). */
  sizes: string[];
  speed: number;
  traits: { name: string; text: string }[];
  optionLabel?: string;
  /** `name` ist der gespeicherte Schlüssel (englisch), `label` die deutsche Anzeige. */
  options?: { name: string; label: string; text: string; speed?: number }[];
  /** 5e: feste Attributboni des Volks. */
  bonuses?: Partial<Record<Ab, number>>;
  /** 5e (Halbelf): frei wählbare Boni, z. B. 2× +1 auf andere Attribute. */
  chooseBonus?: { count: number; amount: number; exclude: Ab[] };
  /** Feste Fertigkeiten durch das Volk (interne Schlüssel). */
  skills?: string[];
  /** Anzahl frei wählbarer Fertigkeiten durch das Volk (Halbelf). */
  skillChoices?: number;
  /** Zusätzliche maximale TP pro Stufe (Zwerg). */
  hpPerLevel?: number;
  /** Fester RK-Bonus (Warforged: Integrierter Schutz). */
  acBonus?: number;
  /** Quelle, falls nicht aus dem SRD. */
  source?: string;
}

export const SPECIES: Species[] = [
  {
    id: "dragonborn", name: "Drachenblütiger", sizes: ["Medium"], speed: 30,
    traits: [
      { name: "Drachenabstammung", text: "Wähle eine Drachenart; sie bestimmt die Schadensart von Odemwaffe und Schadensresistenz." },
      { name: "Odemwaffe", text: "Ersetzt einen Angriff: 15-ft-Kegel oder 30-ft-Linie, GE-Rettungswurf, 1W10 Schaden (steigt mit der Stufe). Anwendungen = Übungsbonus pro Langer Rast." },
      { name: "Schadensresistenz", text: "Resistenz gegen die Schadensart deiner Drachenabstammung." },
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Drakonischer Flug", text: "Ab Stufe 5: Bonusaktion für 10 Minuten Flugbewegung in Höhe deiner Bewegungsrate, 1× pro Langer Rast." },
    ],
    optionLabel: "Drachenabstammung",
    options: ([
      ["Black", "Schwarz", "Säure"], ["Blue", "Blau", "Blitz"], ["Brass", "Messing", "Feuer"], ["Bronze", "Bronze", "Blitz"],
      ["Copper", "Kupfer", "Säure"], ["Gold", "Gold", "Feuer"], ["Green", "Grün", "Gift"], ["Red", "Rot", "Feuer"],
      ["Silver", "Silber", "Kälte"], ["White", "Weiß", "Kälte"],
    ] as [string, string, string][]).map(([n, l, d]) => ({ name: n, label: l, text: `Schadensart: ${d}` })),
  },
  {
    id: "dwarf", name: "Zwerg", sizes: ["Medium"], speed: 30, hpPerLevel: 1,
    traits: [
      { name: "Dunkelsicht", text: "120 ft." },
      { name: "Zwergische Widerstandskraft", text: "Resistenz gegen Giftschaden; Vorteil auf Rettungswürfe gegen den Zustand Vergiftet." },
      { name: "Zwergische Zähigkeit", text: "Maximale TP +1 pro Stufe (automatisch eingerechnet)." },
      { name: "Steingespür", text: "Bonusaktion: 10 Minuten Erschütterungssinn 60 ft auf/in Stein. Anwendungen = Übungsbonus pro Langer Rast." },
    ],
  },
  {
    id: "elf", name: "Elf", sizes: ["Medium"], speed: 30,
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Elfische Abstammung", text: "Wähle eine Abstammungslinie mit eigenen Vorteilen und Zaubern." },
      { name: "Feenblut", text: "Vorteil auf Rettungswürfe gegen den Zustand Bezaubert." },
      { name: "Geschärfte Sinne", text: "Übung in Motiv erkennen, Wahrnehmung oder Überlebenskunst." },
      { name: "Trance", text: "Lange Rast in 4 Stunden meditativer Trance." },
    ],
    optionLabel: "Elfische Abstammung",
    options: [
      { name: "Drow", label: "Drow", text: "Dunkelsicht 120 ft; Tanzende Lichter, später Feenfeuer und Dunkelheit." },
      { name: "High Elf", label: "Hochelf", text: "Taschenspielerei (austauschbar), später Magie entdecken und Nebelschritt." },
      { name: "Wood Elf", label: "Waldelf", text: "Bewegungsrate 35 ft; Druidenkunst, später Schritte beschleunigen und Spurloses Gehen.", speed: 35 },
    ],
  },
  {
    id: "gnome", name: "Gnom", sizes: ["Small"], speed: 30,
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Gnomische Gerissenheit", text: "Vorteil auf IN-, WE- und CH-Rettungswürfe." },
      { name: "Gnomische Abstammung", text: "Wähle eine Abstammungslinie." },
    ],
    optionLabel: "Gnomische Abstammung",
    options: [
      { name: "Forest Gnome", label: "Waldgnom", text: "Kleine Illusion; Mit Tieren sprechen (Übungsbonus × pro Langer Rast)." },
      { name: "Rock Gnome", label: "Felsgnom", text: "Ausbessern und Taschenspielerei; kleine Uhrwerk-Geräte bauen." },
    ],
  },
  {
    id: "goliath", name: "Goliath", sizes: ["Medium"], speed: 35,
    traits: [
      { name: "Riesenabstammung", text: "Wähle eine übernatürliche Gabe; Anwendungen = Übungsbonus pro Langer Rast." },
      { name: "Große Gestalt", text: "Ab Stufe 5: Bonusaktion, 10 Minuten Größe Groß, Vorteil auf ST-Würfe, +10 ft Bewegungsrate." },
      { name: "Kräftiger Körperbau", text: "Vorteil, um den Zustand Gepackt zu beenden; Tragkraft wie eine Größenkategorie größer." },
    ],
    optionLabel: "Riesenabstammung",
    options: [
      { name: "Cloud's Jaunt", label: "Wolkensprung", text: "Bonusaktion: Teleport bis 30 ft." },
      { name: "Fire's Burn", label: "Feuersglut", text: "Bei Treffer +1W10 Feuerschaden." },
      { name: "Frost's Chill", label: "Frostkälte", text: "Bei Treffer +1W6 Kälteschaden und −10 ft Bewegungsrate." },
      { name: "Hill's Tumble", label: "Hügelsturz", text: "Bei Treffer wird ein Ziel (Groß oder kleiner) liegend." },
      { name: "Stone's Endurance", label: "Steinerne Ausdauer", text: "Reaktion: Schaden um 1W12 + KO-Modifikator verringern." },
      { name: "Storm's Thunder", label: "Sturmdonner", text: "Reaktion: 1W8 Schallschaden an einen Angreifer innerhalb von 60 ft." },
    ],
  },
  {
    id: "halfling", name: "Halbling", sizes: ["Small"], speed: 30,
    traits: [
      { name: "Mutig", text: "Vorteil auf Rettungswürfe gegen den Zustand Verängstigt." },
      { name: "Halblingsgewandtheit", text: "Du kannst dich durch den Bereich größerer Kreaturen bewegen." },
      { name: "Glück", text: "Eine gewürfelte 1 bei einem W20-Test neu würfeln." },
      { name: "Natürlich verstohlen", text: "Verstecken-Aktion möglich, wenn du von einer größeren Kreatur verdeckt bist." },
    ],
  },
  {
    id: "human", name: "Mensch", sizes: ["Medium", "Small"], speed: 30,
    traits: [
      { name: "Einfallsreich", text: "Heroische Inspiration nach jeder Langen Rast." },
      { name: "Geschickt", text: "Übung in einer Fertigkeit deiner Wahl." },
      { name: "Vielseitig", text: "Ein zusätzliches Herkunftstalent deiner Wahl (z. B. Geübt)." },
    ],
  },
  {
    id: "orc", name: "Ork", sizes: ["Medium"], speed: 30,
    traits: [
      { name: "Adrenalinschub", text: "Bonusaktion Spurten + temporäre TP in Höhe des Übungsbonus. Anwendungen = Übungsbonus pro Kurzer/Langer Rast." },
      { name: "Dunkelsicht", text: "120 ft." },
      { name: "Unermüdliche Ausdauer", text: "Fällt auf 1 TP statt auf 0, 1× pro Langer Rast." },
    ],
  },
  {
    id: "tiefling", name: "Tiefling", sizes: ["Medium", "Small"], speed: 30,
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Unholdisches Vermächtnis", text: "Wähle ein Vermächtnis mit Resistenz und Zaubern." },
      { name: "Außerweltliche Präsenz", text: "Zaubertrick Thaumaturgie." },
    ],
    optionLabel: "Unholdisches Vermächtnis",
    options: [
      { name: "Abyssal", label: "Abyssisch", text: "Giftresistenz; Giftspritzer, später Strahl der Übelkeit und Person festhalten." },
      { name: "Chthonic", label: "Chthonisch", text: "Nekrotische Resistenz; Kalte Hand, später Falsches Leben und Schwächestrahl." },
      { name: "Infernal", label: "Infernalisch", text: "Feuerresistenz; Feuerpfeil, später Höllischer Tadel und Dunkelheit." },
    ],
  },
];

// Nicht-SRD: Eberron – Forge of the Artificer (2025). Regelwerte, Merkmale in eigenen Worten zusammengefasst.
SPECIES.push({
  id: "warforged", name: "Warforged", sizes: ["Medium", "Small"], speed: 30, acBonus: 1, skillChoices: 1,
  source: "Eberron: Forge of the Artificer",
  traits: [
    { name: "Konstrukt-Widerstandskraft", text: "Resistenz gegen Giftschaden, Vorteil gegen den Zustand Vergiftet, immun gegen Krankheiten; kein Atmen, Essen oder Trinken nötig." },
    { name: "Integrierter Schutz", text: "+1 RK (automatisch eingerechnet); angelegte Rüstung kann dir nicht gegen deinen Willen abgenommen werden." },
    { name: "Wächterruhe", text: "Lange Rast in 6 Stunden regungslos, aber bei Bewusstsein; Magie kann dich nicht einschlafen lassen." },
    { name: "Spezialisierte Bauweise", text: "Übung in einer Fertigkeit und einem Werkzeug deiner Wahl." },
  ],
});

export const getSpecies = (id?: string) => SPECIES.find((s) => s.id === id);

/** Deutscher Anzeigename der gewählten Spezies-Option (gespeichert wird der englische Schlüssel). */
export const speciesOptionLabel = (sp: Species | undefined, key?: string) =>
  sp?.options?.find((o) => o.name === key)?.label ?? key;
