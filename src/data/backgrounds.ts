import type { Ab } from "./rules";

export interface Background {
  id: string;
  name: string;
  abilities: [Ab, Ab, Ab];
  feat: string;
  skills: [string, string];
  tool: string;
  equipment: string;
  gold: number;
}

export const BACKGROUNDS: Background[] = [
  {
    id: "acolyte", name: "Acolyte", abilities: ["INT", "WIS", "CHA"], feat: "Magic Initiate (Cleric)",
    skills: ["Insight", "Religion"], tool: "Calligrapher's Supplies",
    equipment: "Calligrapher's Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe", gold: 8,
  },
  {
    id: "criminal", name: "Criminal", abilities: ["DEX", "CON", "INT"], feat: "Alert",
    skills: ["Sleight of Hand", "Stealth"], tool: "Thieves' Tools",
    equipment: "2 Daggers, Thieves' Tools, Crowbar, 2 Pouches, Traveler's Clothes", gold: 16,
  },
  {
    id: "sage", name: "Sage", abilities: ["CON", "INT", "WIS"], feat: "Magic Initiate (Wizard)",
    skills: ["Arcana", "History"], tool: "Calligrapher's Supplies",
    equipment: "Quarterstaff, Calligrapher's Supplies, Book (history), Parchment (8 sheets), Robe", gold: 8,
  },
  {
    id: "soldier", name: "Soldier", abilities: ["STR", "DEX", "CON"], feat: "Savage Attacker",
    skills: ["Athletics", "Intimidation"], tool: "Gaming Set (eine Art wählen)",
    equipment: "Spear, Shortbow, 20 Arrows, Gaming Set, Healer's Kit, Quiver, Traveler's Clothes", gold: 14,
  },
];

export const getBackground = (id?: string) => BACKGROUNDS.find((b) => b.id === id);

export const ORIGIN_FEATS = [
  { name: "Alert", text: "Proficiency Bonus auf Initiative (automatisch eingerechnet); Initiative mit einem willigen Verbündeten tauschen." },
  { name: "Magic Initiate", text: "Zwei Cantrips und ein Level-1-Zauber aus der Cleric-, Druid- oder Wizard-Liste; Zauber 1× pro Long Rest ohne Slot." },
  { name: "Savage Attacker", text: "Einmal pro Zug Waffenschadenswürfel zweimal würfeln und den höheren Wert nehmen." },
  { name: "Skilled", text: "Proficiency in drei beliebigen Kombinationen aus Skills oder Tools. Wiederholbar." },
];
