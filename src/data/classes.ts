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
    r[Number(l)] = n.split("|").map((x) => (x === "ASI" ? "Ability Score Improvement" : x));
  });
  return r;
};

const SIMPLE = "Simple Weapons";

export const CLASSES: ClassDef[] = [
  {
    id: "barbarian", name: "Barbarian", hitDie: 12, primary: "Strength", saves: ["STR", "CON"],
    skillCount: 2, skillList: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
    weapons: "Simple and Martial Weapons", armor: ["light", "medium"], shield: true, caster: null,
    mastery: [[1, 2], [4, 3], [10, 4]], subclass: "Path of the Berserker",
    features: f("1:Rage|Unarmored Defense|Weapon Mastery;2:Danger Sense|Reckless Attack;3:Primal Knowledge;4:ASI;5:Extra Attack|Fast Movement;7:Feral Instinct|Instinctive Pounce;8:ASI;9:Brutal Strike;11:Relentless Rage;12:ASI;13:Improved Brutal Strike;15:Persistent Rage;16:ASI;17:Improved Brutal Strike;18:Indomitable Might;19:Epic Boon;20:Primal Champion"),
    subFeatures: f("3:Frenzy;6:Mindless Rage;10:Retaliation;14:Intimidating Presence"),
  },
  {
    id: "bard", name: "Bard", hitDie: 8, primary: "Charisma", saves: ["DEX", "CHA"],
    skillCount: 3, skillList: ALL_SKILLS, weapons: SIMPLE, armor: ["light"], shield: false,
    caster: "full", spellAbility: "CHA", mastery: [], subclass: "College of Lore",
    features: f("1:Bardic Inspiration|Spellcasting;2:Expertise|Jack of All Trades;4:ASI;5:Font of Inspiration;7:Countercharm;8:ASI;9:Expertise;10:Magical Secrets;12:ASI;16:ASI;18:Superior Inspiration;19:Epic Boon;20:Words of Creation"),
    subFeatures: f("3:Bonus Proficiencies|Cutting Words;6:Magical Discoveries;14:Peerless Skill"),
  },
  {
    id: "cleric", name: "Cleric", hitDie: 8, primary: "Wisdom", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
    weapons: SIMPLE, armor: ["light", "medium"], shield: true, caster: "full", spellAbility: "WIS",
    mastery: [], subclass: "Life Domain",
    features: f("1:Spellcasting|Divine Order;2:Channel Divinity;4:ASI;5:Sear Undead;7:Blessed Strikes;8:ASI;10:Divine Intervention;12:ASI;14:Improved Blessed Strikes;16:ASI;19:Epic Boon;20:Greater Divine Intervention"),
    subFeatures: f("3:Disciple of Life|Life Domain Spells|Preserve Life;6:Blessed Healer;17:Supreme Healing"),
  },
  {
    id: "druid", name: "Druid", hitDie: 8, primary: "Wisdom", saves: ["INT", "WIS"],
    skillCount: 2, skillList: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
    weapons: SIMPLE, armor: ["light"], shield: true, caster: "full", spellAbility: "WIS",
    mastery: [], subclass: "Circle of the Land",
    features: f("1:Spellcasting|Druidic|Primal Order;2:Wild Shape|Wild Companion;4:ASI;5:Wild Resurgence;7:Elemental Fury;8:ASI;12:ASI;15:Improved Elemental Fury;16:ASI;18:Beast Spells;19:Epic Boon;20:Archdruid"),
    subFeatures: f("3:Circle of the Land Spells|Land's Aid;6:Natural Recovery;10:Nature's Ward;14:Nature's Sanctuary"),
  },
  {
    id: "fighter", name: "Fighter", hitDie: 10, primary: "Strength oder Dexterity", saves: ["STR", "CON"],
    skillCount: 2, skillList: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Persuasion", "Perception", "Survival"],
    weapons: "Simple and Martial Weapons", armor: ["light", "medium", "heavy"], shield: true, caster: null,
    mastery: [[1, 3], [4, 4], [10, 5], [16, 6]], subclass: "Champion",
    features: f("1:Fighting Style|Second Wind|Weapon Mastery;2:Action Surge|Tactical Mind;4:ASI;5:Extra Attack|Tactical Shift;6:ASI;8:ASI;9:Indomitable|Tactical Master;11:Two Extra Attacks;12:ASI;13:Indomitable (2 uses)|Studied Attacks;14:ASI;16:ASI;17:Action Surge (2 uses)|Indomitable (3 uses);19:Epic Boon;20:Three Extra Attacks"),
    subFeatures: f("3:Improved Critical|Remarkable Athlete;7:Additional Fighting Style;10:Heroic Warrior;15:Superior Critical;18:Survivor"),
  },
  {
    id: "monk", name: "Monk", hitDie: 8, primary: "Dexterity und Wisdom", saves: ["STR", "DEX"],
    skillCount: 2, skillList: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
    weapons: "Simple Weapons, Martial Weapons mit Light-Eigenschaft", armor: [], shield: false, caster: null,
    mastery: [], subclass: "Warrior of the Open Hand",
    features: f("1:Martial Arts|Unarmored Defense;2:Monk's Focus|Unarmored Movement|Uncanny Metabolism;3:Deflect Attacks;4:ASI|Slow Fall;5:Extra Attack|Stunning Strike;6:Empowered Strikes;7:Evasion;8:ASI;9:Acrobatic Movement;10:Heightened Focus|Self-Restoration;12:ASI;13:Deflect Energy;14:Disciplined Survivor;15:Perfect Focus;16:ASI;18:Superior Defense;19:Epic Boon;20:Body and Mind"),
    subFeatures: f("3:Open Hand Technique;6:Wholeness of Body;11:Fleet Step;17:Quivering Palm"),
  },
  {
    id: "paladin", name: "Paladin", hitDie: 10, primary: "Strength und Charisma", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
    weapons: "Simple and Martial Weapons", armor: ["light", "medium", "heavy"], shield: true,
    caster: "half", spellAbility: "CHA", mastery: [[1, 2]], subclass: "Oath of Devotion",
    features: f("1:Lay On Hands|Spellcasting|Weapon Mastery;2:Fighting Style|Paladin's Smite;3:Channel Divinity;4:ASI;5:Extra Attack|Faithful Steed;6:Aura of Protection;8:ASI;9:Abjure Foes;10:Aura of Courage;11:Radiant Strikes;12:ASI;14:Restoring Touch;16:ASI;18:Aura Expansion;19:Epic Boon"),
    subFeatures: f("3:Oath of Devotion Spells|Sacred Weapon;7:Aura of Devotion;15:Smite of Protection;20:Holy Nimbus"),
  },
  {
    id: "ranger", name: "Ranger", hitDie: 10, primary: "Dexterity und Wisdom", saves: ["STR", "DEX"],
    skillCount: 3, skillList: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
    weapons: "Simple and Martial Weapons", armor: ["light", "medium"], shield: true,
    caster: "half", spellAbility: "WIS", mastery: [[1, 2]], subclass: "Hunter",
    features: f("1:Spellcasting|Favored Enemy|Weapon Mastery;2:Deft Explorer|Fighting Style;4:ASI;5:Extra Attack;6:Roving;8:ASI;9:Expertise;10:Tireless;12:ASI;13:Relentless Hunter;14:Nature's Veil;16:ASI;17:Precise Hunter;18:Feral Senses;19:Epic Boon;20:Foe Slayer"),
    subFeatures: f("3:Hunter's Lore|Hunter's Prey;7:Defensive Tactics;11:Superior Hunter's Prey;15:Superior Hunter's Defense"),
  },
  {
    id: "rogue", name: "Rogue", hitDie: 8, primary: "Dexterity", saves: ["DEX", "INT"],
    skillCount: 4, skillList: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Persuasion", "Sleight of Hand", "Stealth"],
    weapons: "Simple Weapons, Martial Weapons mit Finesse- oder Light-Eigenschaft", armor: ["light"], shield: false,
    caster: null, mastery: [[1, 2]], subclass: "Thief",
    features: f("1:Expertise|Sneak Attack|Thieves' Cant|Weapon Mastery;2:Cunning Action;3:Steady Aim;4:ASI;5:Cunning Strike|Uncanny Dodge;6:Expertise;7:Evasion|Reliable Talent;8:ASI;10:ASI;11:Improved Cunning Strike;12:ASI;14:Devious Strikes;15:Slippery Mind;16:ASI;18:Elusive;19:Epic Boon;20:Stroke of Luck"),
    subFeatures: f("3:Fast Hands|Second-Story Work;9:Supreme Sneak;13:Use Magic Device;17:Thief's Reflexes"),
  },
  {
    id: "sorcerer", name: "Sorcerer", hitDie: 6, primary: "Charisma", saves: ["CON", "CHA"],
    skillCount: 2, skillList: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"],
    weapons: SIMPLE, armor: [], shield: false, caster: "full", spellAbility: "CHA",
    mastery: [], subclass: "Draconic Sorcery",
    features: f("1:Spellcasting|Innate Sorcery;2:Font of Magic|Metamagic;4:ASI;5:Sorcerous Restoration;7:Sorcery Incarnate;8:ASI;10:Metamagic;12:ASI;16:ASI;17:Metamagic;19:Epic Boon;20:Arcane Apotheosis"),
    subFeatures: f("3:Draconic Resilience|Draconic Spells;6:Elemental Affinity;14:Dragon Wings;18:Dragon Companion"),
  },
  {
    id: "warlock", name: "Warlock", hitDie: 8, primary: "Charisma", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"],
    weapons: SIMPLE, armor: ["light"], shield: false, caster: "pact", spellAbility: "CHA",
    mastery: [], subclass: "Fiend Patron",
    features: f("1:Eldritch Invocations|Pact Magic;2:Magical Cunning;4:ASI;8:ASI;9:Contact Patron;11:Mystic Arcanum (level 6 spell);12:ASI;13:Mystic Arcanum (level 7 spell);15:Mystic Arcanum (level 8 spell);16:ASI;17:Mystic Arcanum (level 9 spell);19:Epic Boon;20:Eldritch Master"),
    subFeatures: f("3:Dark One's Blessing|Fiend Spells;6:Dark One's Own Luck;10:Fiendish Resilience;14:Hurl Through Hell"),
  },
  {
    id: "wizard", name: "Wizard", hitDie: 6, primary: "Intelligence", saves: ["INT", "WIS"],
    skillCount: 2, skillList: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Nature", "Religion"],
    weapons: SIMPLE, armor: [], shield: false, caster: "full", spellAbility: "INT",
    mastery: [], subclass: "Evoker",
    features: f("1:Spellcasting|Ritual Adept|Arcane Recovery;2:Scholar;4:ASI;5:Memorize Spell;8:ASI;12:ASI;16:ASI;18:Spell Mastery;19:Epic Boon;20:Signature Spells"),
    subFeatures: f("3:Evocation Savant|Potent Cantrip;6:Sculpt Spells;10:Empowered Evocation;14:Overchannel"),
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
  if (c.caster === "full") return FULL[level];
  if (c.caster === "half") return FULL[Math.ceil(level / 2)];
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
  (c.features[level] ?? []).some((x) => x === "Ability Score Improvement" || x === "Epic Boon");
