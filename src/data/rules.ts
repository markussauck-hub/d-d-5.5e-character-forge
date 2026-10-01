export type Ab = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
export const ABILITIES: Ab[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
export const AB_NAMES: Record<Ab, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
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

export const CONDITIONS = [
  "Blinded", "Charmed", "Deafened", "Frightened", "Grappled", "Incapacitated", "Invisible",
  "Paralyzed", "Petrified", "Poisoned", "Prone", "Restrained", "Stunned", "Unconscious",
];

export const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "Neutral",
  "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

export type ArmorType = "light" | "medium" | "heavy";
export interface Armor { id: string; name: string; type: ArmorType; base: number }
export const ARMORS: Armor[] = [
  { id: "padded", name: "Padded Armor", type: "light", base: 11 },
  { id: "leather", name: "Leather Armor", type: "light", base: 11 },
  { id: "studded", name: "Studded Leather Armor", type: "light", base: 12 },
  { id: "hide", name: "Hide Armor", type: "medium", base: 12 },
  { id: "chainshirt", name: "Chain Shirt", type: "medium", base: 13 },
  { id: "scale", name: "Scale Mail", type: "medium", base: 14 },
  { id: "breastplate", name: "Breastplate", type: "medium", base: 14 },
  { id: "halfplate", name: "Half Plate Armor", type: "medium", base: 15 },
  { id: "ringmail", name: "Ring Mail", type: "heavy", base: 14 },
  { id: "chainmail", name: "Chain Mail", type: "heavy", base: 16 },
  { id: "splint", name: "Splint Armor", type: "heavy", base: 17 },
  { id: "plate", name: "Plate Armor", type: "heavy", base: 18 },
];

export const POINT_COST: Record<number, number> = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
