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
  mastery: [number, number][]; // [ab Stufe, Anzahl]
  /** Stufe, auf der die Unterklasse gewählt wird. */
  subclassLevel: number;
  /** Erste Unterklasse = SRD mit Merkmalen; weitere nur mit Namen (Merkmale im Spielerhandbuch). */
  subclasses: Subclass[];
  features: Record<number, string[]>;
  /** Halbzauberer der 5e haben erst ab Stufe 2 Zauberplätze. */
  casterStart?: number;
}

export interface Subclass {
  id: string;
  name: string;
  features?: Record<number, string[]>;
}

export const f = (s: string) => {
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
    mastery: [[1, 2], [4, 3], [10, 4]],
    features: f("1:Kampfrausch|Ungerüstete Verteidigung|Waffenbeherrschung;2:Gefahrengespür|Tollkühner Angriff;3:Urwissen;4:ASI;5:Zusätzlicher Angriff|Schnelle Bewegung;7:Wilder Instinkt|Instinktiver Sprung;8:ASI;9:Brutaler Schlag;11:Unerbittlicher Kampfrausch;12:ASI;13:Verbesserter brutaler Schlag;15:Anhaltender Kampfrausch;16:ASI;17:Verbesserter brutaler Schlag;18:Unbezwingbare Stärke;19:Epische Gabe;20:Urchampion"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Pfad des Berserkers", features: f("3:Raserei;6:Blinder Kampfrausch;10:Vergeltung;14:Einschüchternde Präsenz") }, { id: "pfad-des-wildherzens", name: "Pfad des Wildherzens" }, { id: "pfad-des-weltenbaums", name: "Pfad des Weltenbaums" }, { id: "pfad-des-eiferers", name: "Pfad des Eiferers" }],
  },
  {
    id: "bard", name: "Barde", hitDie: 8, primary: "Charisma", saves: ["DEX", "CHA"],
    skillCount: 3, skillList: ALL_SKILLS, weapons: SIMPLE, armor: ["light"], shield: false,
    caster: "full", spellAbility: "CHA", mastery: [],
    features: f("1:Bardische Inspiration|Zauberwirken;2:Expertise|Alleskönner;4:ASI;5:Quell der Inspiration;7:Gegenbezauberung;8:ASI;9:Expertise;10:Magische Geheimnisse;12:ASI;16:ASI;18:Überlegene Inspiration;19:Epische Gabe;20:Worte der Schöpfung"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Schule des Wissens", features: f("3:Zusätzliche Übung|Schneidende Worte;6:Magische Entdeckungen;14:Unvergleichliches Können") }, { id: "schule-des-tanzes", name: "Schule des Tanzes" }, { id: "schule-des-glanzes", name: "Schule des Glanzes" }, { id: "schule-der-tapferkeit", name: "Schule der Tapferkeit" }],
  },
  {
    id: "cleric", name: "Kleriker", hitDie: 8, primary: "Weisheit", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
    weapons: SIMPLE, armor: ["light", "medium"], shield: true, caster: "full", spellAbility: "WIS",
    mastery: [],
    features: f("1:Zauberwirken|Göttliche Ordnung;2:Göttliche Macht fokussieren;4:ASI;5:Untote versengen;7:Gesegnete Schläge;8:ASI;10:Göttliches Eingreifen;12:ASI;14:Verbesserte gesegnete Schläge;16:ASI;19:Epische Gabe;20:Größeres göttliches Eingreifen"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Domäne des Lebens", features: f("3:Jünger des Lebens|Zauber der Domäne des Lebens|Leben bewahren;6:Gesegneter Heiler;17:Vollendete Heilung") }, { id: "domaene-des-lichts", name: "Domäne des Lichts" }, { id: "domaene-der-list", name: "Domäne der List" }, { id: "domaene-des-krieges", name: "Domäne des Krieges" }],
  },
  {
    id: "druid", name: "Druide", hitDie: 8, primary: "Weisheit", saves: ["INT", "WIS"],
    skillCount: 2, skillList: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
    weapons: SIMPLE, armor: ["light"], shield: true, caster: "full", spellAbility: "WIS",
    mastery: [],
    features: f("1:Zauberwirken|Druidisch|Urordnung;2:Tiergestalt|Wilder Begleiter;4:ASI;5:Wildes Wiedererstarken;7:Elementarzorn;8:ASI;12:ASI;15:Verbesserter Elementarzorn;16:ASI;18:Bestienzauber;19:Epische Gabe;20:Erzdruide"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Zirkel des Landes", features: f("3:Zauber des Zirkels des Landes|Hilfe des Landes;6:Natürliche Erholung;10:Schutz der Natur;14:Zuflucht der Natur") }, { id: "zirkel-des-mondes", name: "Zirkel des Mondes" }, { id: "zirkel-des-meeres", name: "Zirkel des Meeres" }, { id: "zirkel-der-sterne", name: "Zirkel der Sterne" }],
  },
  {
    id: "fighter", name: "Kämpfer", hitDie: 10, primary: "Stärke oder Geschicklichkeit", saves: ["STR", "CON"],
    skillCount: 2, skillList: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Persuasion", "Perception", "Survival"],
    weapons: "Einfache Waffen und Kriegswaffen", armor: ["light", "medium", "heavy"], shield: true, caster: null,
    mastery: [[1, 3], [4, 4], [10, 5], [16, 6]],
    features: f("1:Kampfstil|Durchatmen|Waffenbeherrschung;2:Tatendrang|Taktischer Verstand;4:ASI;5:Zusätzlicher Angriff|Taktischer Wechsel;6:ASI;8:ASI;9:Unbeugsam|Taktikmeister;11:Zwei zusätzliche Angriffe;12:ASI;13:Unbeugsam (2 Anwendungen)|Einstudierte Angriffe;14:ASI;16:ASI;17:Tatendrang (2 Anwendungen)|Unbeugsam (3 Anwendungen);19:Epische Gabe;20:Drei zusätzliche Angriffe"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Champion", features: f("3:Verbesserter kritischer Treffer|Bemerkenswerter Athlet;7:Zusätzlicher Kampfstil;10:Heroischer Krieger;15:Überlegener kritischer Treffer;18:Überlebender") }, { id: "kampfmeister", name: "Kampfmeister" }, { id: "mystischer-ritter", name: "Mystischer Ritter" }, { id: "psi-krieger", name: "Psi-Krieger" }],
  },
  {
    id: "monk", name: "Mönch", hitDie: 8, primary: "Geschicklichkeit und Weisheit", saves: ["STR", "DEX"],
    skillCount: 2, skillList: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
    weapons: "Einfache Waffen, Kriegswaffen mit der Eigenschaft Leicht", armor: [], shield: false, caster: null,
    mastery: [],
    features: f("1:Kampfkunst|Ungerüstete Verteidigung;2:Fokus des Mönchs|Ungerüstete Bewegung|Unheimlicher Stoffwechsel;3:Angriffe abwehren;4:ASI|Langsamer Fall;5:Zusätzlicher Angriff|Betäubender Schlag;6:Verstärkte Schläge;7:Entrinnen;8:ASI;9:Akrobatische Bewegung;10:Gesteigerter Fokus|Selbstheilung;12:ASI;13:Energie abwehren;14:Disziplinierter Überlebender;15:Perfekter Fokus;16:ASI;18:Überlegene Verteidigung;19:Epische Gabe;20:Körper und Geist"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Krieger der Offenen Hand", features: f("3:Technik der Offenen Hand;6:Ganzheit des Körpers;11:Flinker Schritt;17:Bebende Handfläche") }, { id: "krieger-der-barmherzigkeit", name: "Krieger der Barmherzigkeit" }, { id: "krieger-des-schattens", name: "Krieger des Schattens" }, { id: "krieger-der-elemente", name: "Krieger der Elemente" }],
  },
  {
    id: "paladin", name: "Paladin", hitDie: 10, primary: "Stärke und Charisma", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
    weapons: "Einfache Waffen und Kriegswaffen", armor: ["light", "medium", "heavy"], shield: true,
    caster: "half", spellAbility: "CHA", mastery: [[1, 2]],
    features: f("1:Handauflegen|Zauberwirken|Waffenbeherrschung;2:Kampfstil|Niederstrecken des Paladins;3:Göttliche Macht fokussieren;4:ASI;5:Zusätzlicher Angriff|Treues Ross;6:Aura des Schutzes;8:ASI;9:Feinde bannen;10:Aura des Mutes;11:Gleißende Schläge;12:ASI;14:Wiederherstellende Berührung;16:ASI;18:Aura-Erweiterung;19:Epische Gabe"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Eid der Hingabe", features: f("3:Zauber des Eids der Hingabe|Heilige Waffe;7:Aura der Hingabe;15:Schützendes Niederstrecken;20:Heiliger Nimbus") }, { id: "eid-der-alten", name: "Eid der Alten" }, { id: "eid-des-ruhms", name: "Eid des Ruhms" }, { id: "eid-der-rache", name: "Eid der Rache" }],
  },
  {
    id: "ranger", name: "Waldläufer", hitDie: 10, primary: "Geschicklichkeit und Weisheit", saves: ["STR", "DEX"],
    skillCount: 3, skillList: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
    weapons: "Einfache Waffen und Kriegswaffen", armor: ["light", "medium"], shield: true,
    caster: "half", spellAbility: "WIS", mastery: [[1, 2]],
    features: f("1:Zauberwirken|Erzfeind|Waffenbeherrschung;2:Geschickter Entdecker|Kampfstil;4:ASI;5:Zusätzlicher Angriff;6:Umherstreifen;8:ASI;9:Expertise;10:Unermüdlich;12:ASI;13:Unerbittlicher Jäger;14:Schleier der Natur;16:ASI;17:Präziser Jäger;18:Wilde Sinne;19:Epische Gabe;20:Feindtöter"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Jäger", features: f("3:Jägerwissen|Beute des Jägers;7:Defensive Taktiken;11:Überlegene Beute des Jägers;15:Überlegene Verteidigung des Jägers") }, { id: "tiermeister", name: "Tiermeister" }, { id: "feenwanderer", name: "Feenwanderer" }, { id: "duesterpirscher", name: "Düsterpirscher" }],
  },
  {
    id: "rogue", name: "Schurke", hitDie: 8, primary: "Geschicklichkeit", saves: ["DEX", "INT"],
    skillCount: 4, skillList: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Persuasion", "Sleight of Hand", "Stealth"],
    weapons: "Einfache Waffen, Kriegswaffen mit der Eigenschaft Finesse oder Leicht", armor: ["light"], shield: false,
    caster: null, mastery: [[1, 2]],
    features: f("1:Expertise|Hinterhältiger Angriff|Diebessprache|Waffenbeherrschung;2:Raffinierte Aktion;3:Ruhiges Zielen;4:ASI;5:Raffinierter Schlag|Unglaubliches Ausweichen;6:Expertise;7:Entrinnen|Verlässliches Talent;8:ASI;10:ASI;11:Verbesserter raffinierter Schlag;12:ASI;14:Hinterlistige Schläge;15:Schlüpfriger Verstand;16:ASI;18:Schwer zu fassen;19:Epische Gabe;20:Glückstreffer"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Dieb", features: f("3:Flinke Hände|Fassadenkletterer;9:Meisterschleicher;13:Magische Gegenstände benutzen;17:Diebesreflexe") }, { id: "arkaner-betrueger", name: "Arkaner Betrüger" }, { id: "assassine", name: "Assassine" }, { id: "seelenmesser", name: "Seelenmesser" }],
  },
  {
    id: "sorcerer", name: "Zauberer", hitDie: 6, primary: "Charisma", saves: ["CON", "CHA"],
    skillCount: 2, skillList: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"],
    weapons: SIMPLE, armor: [], shield: false, caster: "full", spellAbility: "CHA",
    mastery: [],
    features: f("1:Zauberwirken|Angeborene Zauberei;2:Quell der Magie|Metamagie;4:ASI;5:Zauberische Erholung;7:Fleischgewordene Zauberei;8:ASI;10:Metamagie;12:ASI;16:ASI;17:Metamagie;19:Epische Gabe;20:Arkane Apotheose"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Drakonische Zauberei", features: f("3:Drakonische Widerstandskraft|Drakonische Zauber;6:Elementare Affinität;14:Drachenflügel;18:Drachengefährte") }, { id: "aberrante-zauberei", name: "Aberrante Zauberei" }, { id: "uhrwerk-zauberei", name: "Uhrwerk-Zauberei" }, { id: "wilde-magie", name: "Wilde Magie" }],
  },
  {
    id: "warlock", name: "Hexenmeister", hitDie: 8, primary: "Charisma", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"],
    weapons: SIMPLE, armor: ["light"], shield: false, caster: "pact", spellAbility: "CHA",
    mastery: [],
    features: f("1:Schauerliche Anrufungen|Paktmagie;2:Magische Gerissenheit;4:ASI;8:ASI;9:Schutzpatron kontaktieren;11:Mystisches Arkanum (Zauber des 6. Grades);12:ASI;13:Mystisches Arkanum (Zauber des 7. Grades);15:Mystisches Arkanum (Zauber des 8. Grades);16:ASI;17:Mystisches Arkanum (Zauber des 9. Grades);19:Epische Gabe;20:Schauerlicher Meister"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Unhold-Schutzpatron", features: f("3:Segen des Dunklen|Unholdzauber;6:Glück des Dunklen;10:Unholdische Widerstandskraft;14:Durch die Hölle schleudern") }, { id: "erzfee-schutzpatron", name: "Erzfee-Schutzpatron" }, { id: "himmlischer-schutzpatron", name: "Himmlischer Schutzpatron" }, { id: "grosser-alter-schutzpatron", name: "Großer-Alter-Schutzpatron" }],
  },
  {
    id: "wizard", name: "Magier", hitDie: 6, primary: "Intelligenz", saves: ["INT", "WIS"],
    skillCount: 2, skillList: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Nature", "Religion"],
    weapons: SIMPLE, armor: [], shield: false, caster: "full", spellAbility: "INT",
    mastery: [],
    features: f("1:Zauberwirken|Ritualkundiger|Arkane Erholung;2:Gelehrter;4:ASI;5:Zauber einprägen;8:ASI;12:ASI;16:ASI;18:Zaubermeisterschaft;19:Epische Gabe;20:Charakteristische Zauber"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Hervorrufer", features: f("3:Experte für Hervorrufung|Mächtiger Zaubertrick;6:Zauber formen;10:Verstärkte Hervorrufung;14:Überladen") }, { id: "bannmagier", name: "Bannmagier" }, { id: "seher", name: "Seher" }, { id: "illusionist", name: "Illusionist" }],
  },
];

export const getClass = (id?: string) => CLASSES.find((c) => c.id === id);

const FULL: number[][] = [
  [], [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/** Slots pro Grad (Index 0 = Grad 1). */
export function spellSlots(c: ClassDef | undefined, level: number): number[] {
  if (!c?.caster || level < (c.casterStart ?? 1)) return [];
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

export function featuresAt(c: ClassDef, level: number, sub: Subclass | undefined): string[] {
  const base = c.features[level] ?? [];
  const extra = sub && level >= c.subclassLevel ? (sub.features?.[level] ?? []).map((x) => `${x} (${sub.name})`) : [];
  return [...base, ...extra];
}

/**
 * Merkmale der Unterklasse bis zur aktuellen Stufe, als [Stufe, Text].
 * early (Hausregel): Die Einstiegsmerkmale der Unterklasse gelten sofort, auch unterhalb der Unterklassen-Stufe;
 * spätere Merkmale kommen weiterhin auf ihrer Stufe.
 */
export function subclassFeatureList(c: ClassDef, sub: Subclass | undefined, level: number, early: boolean): [number, string][] {
  if (!sub?.features) return [];
  return Object.entries(sub.features)
    .map(([l, xs]) => [Number(l), xs] as const)
    .filter(([l]) => (l <= level && level >= c.subclassLevel) || (early && (l <= level || l === c.subclassLevel)))
    .sort((a, b) => a[0] - b[0])
    .flatMap(([l, xs]) => xs.map((x) => [l, `${x} (${sub.name})`] as [number, string]));
}

export const isAsiLevel = (c: ClassDef, level: number) =>
  (c.features[level] ?? []).some((x) => x === ASI || x === EPIC_BOON);
