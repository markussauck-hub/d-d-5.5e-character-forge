// Interne Schlüssel (STR, "Acrobatics", "Blinded" …) bleiben englisch, damit gespeicherte
// Charaktere kompatibel bleiben. Alles, was angezeigt wird, läuft über die deutschen Maps.

export type Ab = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
export const ABILITIES: Ab[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
export const AB_NAMES: Record<Ab, string> = {
  STR: "Stärke",
  DEX: "Geschicklichkeit",
  CON: "Konstitution",
  INT: "Intelligenz",
  WIS: "Weisheit",
  CHA: "Charisma",
};
export const AB_SHORT: Record<Ab, string> = {
  STR: "ST",
  DEX: "GE",
  CON: "KO",
  INT: "IN",
  WIS: "WE",
  CHA: "CH",
};

export const SKILLS: { name: string; ab: Ab }[] = [
  { name: "Acrobatics", ab: "DEX" },
  { name: "Animal Handling", ab: "WIS" },
  { name: "Arcana", ab: "INT" },
  { name: "Athletics", ab: "STR" },
  { name: "Deception", ab: "CHA" },
  { name: "History", ab: "INT" },
  { name: "Insight", ab: "WIS" },
  { name: "Intimidation", ab: "CHA" },
  { name: "Investigation", ab: "INT" },
  { name: "Medicine", ab: "WIS" },
  { name: "Nature", ab: "INT" },
  { name: "Perception", ab: "WIS" },
  { name: "Performance", ab: "CHA" },
  { name: "Persuasion", ab: "CHA" },
  { name: "Religion", ab: "INT" },
  { name: "Sleight of Hand", ab: "DEX" },
  { name: "Stealth", ab: "DEX" },
  { name: "Survival", ab: "WIS" },
];
export const ALL_SKILLS = SKILLS.map((s) => s.name);

const SKILL_DE: Record<string, string> = {
  Acrobatics: "Akrobatik",
  "Animal Handling": "Mit Tieren umgehen",
  Arcana: "Arkane Kunde",
  Athletics: "Athletik",
  Deception: "Täuschen",
  History: "Geschichte",
  Insight: "Motiv erkennen",
  Intimidation: "Einschüchtern",
  Investigation: "Nachforschungen",
  Medicine: "Medizin",
  Nature: "Naturkunde",
  Perception: "Wahrnehmung",
  Performance: "Auftreten",
  Persuasion: "Überzeugen",
  Religion: "Religion",
  "Sleight of Hand": "Fingerfertigkeit",
  Stealth: "Heimlichkeit",
  Survival: "Überlebenskunst",
};
/** Deutscher Anzeigename einer Fertigkeit (Schlüssel bleibt englisch). */
export const skillName = (s: string) => SKILL_DE[s] ?? s;

export const CONDITIONS = [
  "Blinded", "Charmed", "Deafened", "Frightened", "Grappled", "Incapacitated", "Invisible",
  "Paralyzed", "Petrified", "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious",
];
const CONDITION_DE: Record<string, string> = {
  Blinded: "Blind",
  Charmed: "Bezaubert",
  Deafened: "Taub",
  Frightened: "Verängstigt",
  Grappled: "Gepackt",
  Incapacitated: "Kampfunfähig",
  Invisible: "Unsichtbar",
  Paralyzed: "Gelähmt",
  Petrified: "Versteinert",
  Poisoned: "Vergiftet",
  Prone: "Liegend",
  Restrained: "Festgesetzt",
  Stunned: "Betäubt",
  Unconscious: "Bewusstlos",
};
export const conditionName = (c: string) => CONDITION_DE[c] ?? c;

export const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "Neutral",
  "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];
const ALIGNMENT_DE: Record<string, string> = {
  "Lawful Good": "Rechtschaffen gut",
  "Neutral Good": "Neutral gut",
  "Chaotic Good": "Chaotisch gut",
  "Lawful Neutral": "Rechtschaffen neutral",
  Neutral: "Neutral",
  "Chaotic Neutral": "Chaotisch neutral",
  "Lawful Evil": "Rechtschaffen böse",
  "Neutral Evil": "Neutral böse",
  "Chaotic Evil": "Chaotisch böse",
};
export const alignmentName = (a: string) => ALIGNMENT_DE[a] ?? a;

const SIZE_DE: Record<string, string> = { Small: "Klein", Medium: "Mittelgroß", Large: "Groß" };
export const sizeName = (s: string) => SIZE_DE[s] ?? s;

export type ArmorType = "light" | "medium" | "heavy";
export const ARMOR_TYPE_DE: Record<ArmorType, string> = { light: "leicht", medium: "mittel", heavy: "schwer" };
export interface Armor { id: string; name: string; type: ArmorType; base: number }
export const ARMORS: Armor[] = [
  { id: "padded", name: "Gepolsterte Rüstung", type: "light", base: 11 },
  { id: "leather", name: "Lederrüstung", type: "light", base: 11 },
  { id: "studded", name: "Beschlagene Lederrüstung", type: "light", base: 12 },
  { id: "hide", name: "Fellrüstung", type: "medium", base: 12 },
  { id: "chainshirt", name: "Kettenhemd", type: "medium", base: 13 },
  { id: "scale", name: "Schuppenpanzer", type: "medium", base: 14 },
  { id: "breastplate", name: "Brustplatte", type: "medium", base: 14 },
  { id: "halfplate", name: "Halbplattenrüstung", type: "medium", base: 15 },
  { id: "ringmail", name: "Ringpanzer", type: "heavy", base: 14 },
  { id: "chainmail", name: "Kettenpanzer", type: "heavy", base: 16 },
  { id: "splint", name: "Schienenpanzer", type: "heavy", base: 17 },
  { id: "plate", name: "Plattenpanzer", type: "heavy", base: 18 },
];

export const POINT_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
