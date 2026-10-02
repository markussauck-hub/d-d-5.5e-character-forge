import type { Ab, ArmorType } from "./rules";
import { ALL_SKILLS } from "./rules";

export type CasterType = "full" | "half" | "pact" | null;

export interface ClassDef {
  id: string;
  name: string;
  hitDie: number;
  primary: string;
  saves: [Ab, Ab];
  skillCount: number;
  skillList: string[];
  weapons: string;
  armor: ArmorType[];
  shield: boolean;
  caster: CasterType;
  spellAbility?: Ab;
  mastery: [number, number][]; // [ab Level, Anzahl]
  subclass: string;
  features: Record<number, string[]>;
  subFeatures: Record<number, string[]>;
}

const f = (s: string) => {
  const r: Record<number, string[]> = {};
  s.split(";").forEach((p) => {
    const [l, n] = p.split(":");
    r[Number(l)] = (n ?? "").split("|").filter(Boolean).map((x) => (x === "ASI" ? ASI : x));
  });
  return r;
};

export const ASI = "Attributswerterhöhung";
export const EPIC_BOON = "Epische Gabe";

const SIMPLE = "Einfache Waffen";

export const CLASSES: ClassDef[] = [
  {
    id: "barbarian", name: "Barbar", hitDie: 12, primary: "Stärke", saves: ["STR", "CON"],
    skillCount: 2, skillList: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
    weapons: "Einfache Waffen und Kriegswaffen", armor: ["light", "medium"], shield: true, caster: null,
    mastery: [[1, 2], [4, 3], [10, 4]], subclass: "Pfad des Berserkers",
    features: f("1:Kampfrausch|Ungerüstete Verteidigung|Waffenbeherrschung;2:Gefahrengespür|Tollkühner Angriff;3:Urwissen;4:ASI;5:Zusätzlicher Angriff|Schnelle Bewegung;7:Wilder Instinkt|Instinktiver Sprung;8:ASI;9:Brutaler Schlag;11:Unerbittlicher Kampfrausch;12:ASI;13:Verbesserter brutaler Schlag;15:Anhaltender Kampfrausch;16:ASI;17:Verbesserter brutaler Schlag;18:Unbezwingbare Stärke;19:Epische Gabe;20:Urchampion"),
    subFeatures: f("3:Raserei;6:Blinder Kampfrausch;10:Vergeltung;14:Einschüchternde Präsenz"),
  },
  {
    id: "bard", name: "Barde", hitDie: 8, primary: "Charisma", saves: ["DEX", "CHA"],
    skillCount: 3, skillList: ALL_SKILLS, weapons: SIMPLE, armor: ["light"], shield: false,
    caster: "full", spellAbility: "CHA", mastery: [], subclass: "Schule des Wissens",
    features: f("1:Bardische Inspiration|Zauberwirken;2:Expertise|Alleskönner;4:ASI;5:Quell der Inspiration;7:Gegenbezauberung;8:ASI;9:Expertise;10:Magische Geheimnisse;12:ASI;16:ASI;18:Überlegene Inspiration;19:Epische Gabe;20:Worte der Schöpfung"),
    subFeatures: f("3:Zusätzliche Übung|Schneidende Worte;6:Magische Entdeckungen;14:Unvergleichliches Können"),
  },
  {
    id: "cleric", name: "Kleriker", hitDie: 8, primary: "Weisheit", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
    weapons: SIMPLE, armor: ["light", "medium"], shield: true, caster: "full", spellAbility: "WIS",
    mastery: [], subclass: "Domäne des Lebens",
    features: f("1:Zauberwirken|Göttliche Ordnung;2:Göttliche Macht fokussieren;4:ASI;5:Untote versengen;7:Gesegnete Schläge;8:ASI;10:Göttliches Eingreifen;12:ASI;14:Verbesserte gesegnete Schläge;16:ASI;19:Epische Gabe;20:Größeres göttliches Eingreifen"),
    subFeatures: f("3:Jünger des Lebens|Zauber der Domäne des Lebens|Leben bewahren;6:Gesegneter Heiler;17:Vollendete Heilung"),
  },
  {
    id: "druid", name: "Druide", hitDie: 8, primary: "Weisheit", saves: ["INT", "WIS"],
    skillCount: 2, skillList: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
    weapons: SIMPLE, armor: ["light"], shield: true, caster: "full", spellAbility: "WIS",
    mastery: [], subclass: "Zirkel des Landes",
    features: f("1:Zauberwirken|Druidisch|Urordnung;2:Tiergestalt|Wilder Begleiter;4:ASI;5:Wildes Wiedererstarken;7:Elementarzorn;8:ASI;12:ASI;15:Verbesserter Elementarzorn;16:ASI;18:Bestienzauber;19:Epische Gabe;20:Erzdruide"),
    subFeatures: f("3:Zauber des Zirkels des Landes|Hilfe des Landes;6:Natürliche Erholung;10:Schutz der Natur;14:Zuflucht der Natur"),
  },
  {
    id: "fighter", name: "Kämpfer", hitDie: 10, primary: "Stärke oder Geschicklichkeit", saves: ["STR", "CON"],
    skillCount: 2, skillList: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Persuasion", "Perception", "Survival"],
    weapons: "Einfache Waffen und Kriegswaffen", armor: ["light", "medium", "heavy"], shield: true, caster: null,
    mastery: [[1, 3], [4, 4], [10, 5], [16, 6]], subclass: "Champion",
    features: f("1:Kampfstil|Durchatmen|Waffenbeherrschung;2:Tatendrang|Taktischer Verstand;4:ASI;5:Zusätzlicher Angriff|Taktischer Wechsel;6:ASI;8:ASI;9:Unbeugsam|Taktikmeister;11:Zwei zusätzliche Angriffe;12:ASI;13:Unbeugsam (2 Anwendungen)|Einstudierte Angriffe;14:ASI;16:ASI;17:Tatendrang (2 Anwendungen)|Unbeugsam (3 Anwendungen);19:Epische Gabe;20:Drei zusätzliche Angriffe"),
    subFeatures: f("3:Verbesserter kritischer Treffer|Bemerkenswerter Athlet;7:Zusätzlicher Kampfstil;10:Heroischer Krieger;15:Überlegener kritischer Treffer;18:Überlebender"),
  },
  {
    id: "monk", name: "Mönch", hitDie: 8, primary: "Geschicklichkeit und Weisheit", saves: ["STR", "DEX"],
    skillCount: 2, skillList: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
    weapons: "Einfache Waffen, Kriegswaffen mit der Eigenschaft Leicht", armor: [], shield: false, caster: null,
    mastery: [], subclass: "Krieger der Offenen Hand",
    features: f("1:Kampfkunst|Ungerüstete Verteidigung;2:Fokus des Mönchs|Ungerüstete Bewegung|Unheimlicher Stoffwechsel;3:Angriffe abwehren;4:ASI|Langsamer Fall;5:Zusätzlicher Angriff|Betäubender Schlag;6:Verstärkte Schläge;7:Entrinnen;8:ASI;9:Akrobatische Bewegung;10:Gesteigerter Fokus|Selbstheilung;12:ASI;13:Energie abwehren;14:Disziplinierter Überlebender;15:Perfekter Fokus;16:ASI;18:Überlegene Verteidigung;19:Epische Gabe;20:Körper und Geist"),
    subFeatures: f("3:Technik der Offenen Hand;6:Ganzheit des Körpers;11:Flinker Schritt;17:Bebende Handfläche"),
  },
  {
    id: "paladin", name: "Paladin", hitDie: 10, primary: "Stärke und Charisma", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
    weapons: "Einfache Waffen und Kriegswaffen", armor: ["light", "medium", "heavy"], shield: true,
    caster: "half", spellAbility: "CHA", mastery: [[1, 2]], subclass: "Eid der Hingabe",
    features: f("1:Handauflegen|Zauberwirken|Waffenbeherrschung;2:Kampfstil|Niederstrecken des Paladins;3:Göttliche Macht fokussieren;4:ASI;5:Zusätzlicher Angriff|Treues Ross;6:Aura des Schutzes;8:ASI;9:Feinde bannen;10:Aura des Mutes;11:Gleißende Schläge;12:ASI;14:Wiederherstellende Berührung;16:ASI;18:Aura-Erweiterung;19:Epische Gabe"),
    subFeatures: f("3:Zauber des Eids der Hingabe|Heilige Waffe;7:Aura der Hingabe;15:Schützendes Niederstrecken;20:Heiliger Nimbus"),
  },
  {
    id: "ranger", name: "Waldläufer", hitDie: 10, primary: "Geschicklichkeit und Weisheit", saves: ["STR", "DEX"],
    skillCount: 3, skillList: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
    weapons: "Einfache Waffen und Kriegswaffen", armor: ["light", "medium"], shield: true,
    caster: "half", spellAbility: "WIS", mastery: [[1, 2]], subclass: "Jäger",
    features: f("1:Zauberwirken|Erzfeind|Waffenbeherrschung;2:Geschickter Entdecker|Kampfstil;4:ASI;5:Zusätzlicher Angriff;6:Umherstreifen;8:ASI;9:Expertise;10:Unermüdlich;12:ASI;13:Unerbittlicher Jäger;14:Schleier der Natur;16:ASI;17:Präziser Jäger;18:Wilde Sinne;19:Epische Gabe;20:Feindtöter"),
    subFeatures: f("3:Jägerwissen|Beute des Jägers;7:Defensive Taktiken;11:Überlegene Beute des Jägers;15:Überlegene Verteidigung des Jägers"),
  },
  {
    id: "rogue", name: "Schurke", hitDie: 8, primary: "Geschicklichkeit", saves: ["DEX", "INT"],
    skillCount: 4, skillList: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Persuasion", "Sleight of Hand", "Stealth"],
    weapons: "Einfache Waffen, Kriegswaffen mit der Eigenschaft Finesse oder Leicht", armor: ["light"], shield: false,
    caster: null, mastery: [[1, 2]], subclass: "Dieb",
    features: f("1:Expertise|Hinterhältiger Angriff|Diebessprache|Waffenbeherrschung;2:Raffinierte Aktion;3:Ruhiges Zielen;4:ASI;5:Raffinierter Schlag|Unglaubliches Ausweichen;6:Expertise;7:Entrinnen|Verlässliches Talent;8:ASI;10:ASI;11:Verbesserter raffinierter Schlag;12:ASI;14:Hinterlistige Schläge;15:Schlüpfriger Verstand;16:ASI;18:Schwer zu fassen;19:Epische Gabe;20:Glückstreffer"),
    subFeatures: f("3:Flinke Hände|Fassadenkletterer;9:Meisterschleicher;13:Magische Gegenstände benutzen;17:Diebesreflexe"),
  },
  {
    id: "sorcerer", name: "Zauberer", hitDie: 6, primary: "Charisma", saves: ["CON", "CHA"],
    skillCount: 2, skillList: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"],
    weapons: SIMPLE, armor: [], shield: false, caster: "full", spellAbility: "CHA",
    mastery: [], subclass: "Drakonische Zauberei",
    features: f("1:Zauberwirken|Angeborene Zauberei;2:Quell der Magie|Metamagie;4:ASI;5:Zauberische Erholung;7:Fleischgewordene Zauberei;8:ASI;10:Metamagie;12:ASI;16:ASI;17:Metamagie;19:Epische Gabe;20:Arkane Apotheose"),
    subFeatures: f("3:Drakonische Widerstandskraft|Drakonische Zauber;6:Elementare Affinität;14:Drachenflügel;18:Drachengefährte"),
  },
  {
    id: "warlock", name: "Hexenmeister", hitDie: 8, primary: "Charisma", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"],
    weapons: SIMPLE, armor: ["light"], shield: false, caster: "pact", spellAbility: "CHA",
    mastery: [], subclass: "Unhold-Schutzpatron",
    features: f("1:Schauerliche Anrufungen|Paktmagie;2:Magische Gerissenheit;4:ASI;8:ASI;9:Schutzpatron kontaktieren;11:Mystisches Arkanum (Zauber des 6. Grades);12:ASI;13:Mystisches Arkanum (Zauber des 7. Grades);15:Mystisches Arkanum (Zauber des 8. Grades);16:ASI;17:Mystisches Arkanum (Zauber des 9. Grades);19:Epische Gabe;20:Schauerlicher Meister"),
    subFeatures: f("3:Segen des Dunklen|Unholdzauber;6:Glück des Dunklen;10:Unholdische Widerstandskraft;14:Durch die Hölle schleudern"),
  },
  {
    id: "wizard", name: "Magier", hitDie: 6, primary: "Intelligenz", saves: ["INT", "WIS"],
    skillCount: 2, skillList: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Nature", "Religion"],
    weapons: SIMPLE, armor: [], shield: false, caster: "full", spellAbility: "INT",
    mastery: [], subclass: "Hervorrufer",
    features: f("1:Zauberwirken|Ritualkundiger|Arkane Erholung;2:Gelehrter;4:ASI;5:Zauber einprägen;8:ASI;12:ASI;16:ASI;18:Zaubermeisterschaft;19:Epische Gabe;20:Charakteristische Zauber"),
    subFeatures: f("3:Experte für Hervorrufung|Mächtiger Zaubertrick;6:Zauber formen;10:Verstärkte Hervorrufung;14:Überladen"),
  },
];

export const SUBCLASS_LEVEL = 3;
export const getClass = (id?: string) => CLASSES.find((c) => c.id === id);

const FULL: number[][] = [
  [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/** Slots pro Grad (Index 0 = Grad 1). */
export function spellSlots(c: ClassDef | undefined, level: number): number[] {
  if (!c?.caster) return [];
  if (c.caster === "full") return FULL[level] ?? [];
  if (c.caster === "half") return FULL[Math.ceil(level / 2)] ?? [];
  const count = level >= 17 ? 4 : level >= 11 ? 3 : level >= 2 ? 2 : 1;
  const slotLvl = Math.min(5, Math.ceil(level / 2));
  return Array.from({ length: slotLvl }, (_, i) => (i === slotLvl - 1 ? count : 0));
}

export function masteryCount(c: ClassDef | undefined, level: number) {
  if (!c) return 0;
  let n = 0;
  for (const [l, v] of c.mastery) if (level >= l) n = v;
  return n;
}

export function featuresAt(c: ClassDef, level: number, withSub: boolean): string[] {
  const base = c.features[level] ?? [];
  const sub = withSub ? (c.subFeatures[level] ?? []).map((x) => `${x} (${c.subclass})`) : [];
  return [...base, ...sub];
}

export const isAsiLevel = (c: ClassDef, level: number) =>
  (c.features[level] ?? []).some((x) => x === ASI || x === EPIC_BOON);
