import { useSyncExternalStore } from "react";
import { ABILITIES, ARMORS, SKILLS, type Ab } from "@/data/rules";
import { getClass, spellSlots } from "@/data/classes";
import { getBackground } from "@/data/backgrounds";
import { getSpecies } from "@/data/species";

export type Method = "standard" | "pointbuy" | "roll";

export interface Character {
  id: string;
  name: string;
  classId?: string;
  hasSubclass: boolean;
  level: number;
  backgroundId?: string;
  speciesId?: string;
  speciesOption?: string | undefined;
  size?: string | undefined;
  method: Method;
  baseScores: Record<Ab, number>;
  assign: Record<Ab, number>; // Index in Pool, -1 = leer
  rolled: number[];
  bgMode: "21" | "111";
  bgPlus2?: Ab | undefined;
  bgPlus1?: Ab | undefined;
  asi: Record<Ab, number>;
  skillProfs: string[];
  expertise: string[];
  hpRolls: (number | null)[]; // Index = Level-2
  armorId: string;
  shield: boolean;
  overrides: Record<string, number>;
  currentHp: number | null;
  tempHp: number;
  hitDiceUsed: number;
  deathSaves: { s: number; f: number };
  conditions: string[];
  exhaustion: number;
  slotsUsed: number[];
  money: { cp: number; sp: number; ep: number; gp: number; pp: number };
  equipmentChoice?: "A" | "GP";
  inventory: string;
  spells: string;
  feats: string[];
  alignment: string;
  appearance: string;
  notes: string;
  updatedAt: number;
}

const zero = (): Record<Ab, number> => ({ STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 });
const eight = (): Record<Ab, number> => ({ STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 });
const empty = (): Record<Ab, number> => ({ STR: -1, DEX: -1, CON: -1, INT: -1, WIS: -1, CHA: -1 });

export function newCharacter(): Character {
  return {
    id: crypto.randomUUID(), name: "", hasSubclass: false, level: 1, method: "standard",
    baseScores: eight(), assign: empty(), rolled: [], bgMode: "21", asi: zero(), skillProfs: [],
    expertise: [], hpRolls: [], armorId: "", shield: false, overrides: {}, currentHp: null, tempHp: 0,
    hitDiceUsed: 0, deathSaves: { s: 0, f: 0 }, conditions: [], exhaustion: 0, slotsUsed: [],
    money: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }, inventory: "", spells: "", feats: [],
    alignment: "", appearance: "", notes: "", updatedAt: Date.now(),
  };
}

// ---------- Store ----------
const KEY = "dnd55-characters";
const EMPTY: Character[] = [];
let cache: Character[] | null = null;
const listeners = new Set<() => void>();

function read(): Character[] {
  if (cache) return cache;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    cache = Array.isArray(raw) ? raw.map((c) => ({ ...newCharacter(), ...c })) : [];
  } catch {
    cache = [];
  }
  return cache!;
}
function write(list: Character[]) {
  cache = list;
  localStorage.setItem(KEY, JSON.stringify(list));
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useCharacters = () => useSyncExternalStore(subscribe, read, () => EMPTY);
export const useHydratedStore = () => useSyncExternalStore(subscribe, () => true, () => false);

export function saveCharacter(c: Character) {
  const list = read();
  const next = { ...c, updatedAt: Date.now() };
  write(list.some((x) => x.id === c.id) ? list.map((x) => (x.id === c.id ? next : x)) : [...list, next]);
}
export function updateCharacter(id: string, fn: (c: Character) => Partial<Character>) {
  const c = read().find((x) => x.id === id);
  if (c) saveCharacter({ ...c, ...fn(c) });
}
export function deleteCharacter(id: string) {
  write(read().filter((x) => x.id !== id));
}
export function importCharacters(data: unknown) {
  const arr = (Array.isArray(data) ? data : [data]) as Partial<Character>[];
  const list = read();
  const added = arr
    .filter((x) => x && typeof x === "object")
    .map((x) => ({ ...newCharacter(), ...x, id: crypto.randomUUID() }));
  write([...list, ...added]);
  return added.length;
}

// ---------- Berechnungen ----------
export const mod = (s: number) => Math.floor((s - 10) / 2);
export const fmt = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
export const profBonus = (level: number) => 2 + Math.floor((level - 1) / 4);
const ov = (c: Character, key: string, v: number) => c.overrides[key] ?? v;

export function bgBonus(c: Character): Record<Ab, number> {
  const r = zero();
  const bg = getBackground(c.backgroundId);
  if (!bg) return r;
  if (c.bgMode === "111") bg.abilities.forEach((a) => (r[a] += 1));
  else {
    if (c.bgPlus2) r[c.bgPlus2] += 2;
    if (c.bgPlus1 && c.bgPlus1 !== c.bgPlus2) r[c.bgPlus1] += 1;
  }
  return r;
}

export function computedScore(c: Character, a: Ab) {
  return Math.min(20, c.baseScores[a] + bgBonus(c)[a] + (c.asi[a] ?? 0));
}

export function derive(c: Character) {
  const cls = getClass(c.classId);
  const bg = getBackground(c.backgroundId);
  const sp = getSpecies(c.speciesId);
  const pb = ov(c, "prof", profBonus(c.level));
  const scores = {} as Record<Ab, number>;
  const mods = {} as Record<Ab, number>;
  for (const a of ABILITIES) {
    scores[a] = ov(c, `score:${a}`, computedScore(c, a));
    mods[a] = mod(scores[a]);
  }
  const saves = {} as Record<Ab, { v: number; prof: boolean }>;
  for (const a of ABILITIES) {
    const prof = !!cls?.saves.includes(a);
    saves[a] = { prof, v: ov(c, `save:${a}`, mods[a] + (prof ? pb : 0)) };
  }
  const bgSkills: string[] = bg?.skills ?? [];
  const skills = SKILLS.map((s) => {
    const prof = bgSkills.includes(s.name) || c.skillProfs.includes(s.name);
    const exp = prof && c.expertise.includes(s.name);
    const v = ov(c, `skill:${s.name}`, mods[s.ab] + (exp ? pb * 2 : prof ? pb : 0));
    return { ...s, prof, exp, fromBg: bgSkills.includes(s.name), v };
  });
  const perception = skills.find((s) => s.name === "Perception")!;
  const passive = ov(c, "passive", 10 + perception.v);
  const alert = bg?.feat === "Alert" || c.feats.some((f) => /alert/i.test(f));
  const initiative = ov(c, "init", mods.DEX + (alert ? pb : 0));

  const hd = cls?.hitDie ?? 8;
  const avg = hd / 2 + 1;
  let hp = Math.max(1, hd + mods.CON);
  for (let l = 2; l <= c.level; l++) hp += Math.max(1, (c.hpRolls[l - 2] ?? avg) + mods.CON);
  if (sp?.id === "dwarf") hp += c.level;
  const maxHp = ov(c, "maxHp", hp);

  const armor = ARMORS.find((a) => a.id === c.armorId);
  let ac: number;
  if (armor) {
    ac = armor.base + (armor.type === "light" ? mods.DEX : armor.type === "medium" ? Math.min(2, mods.DEX) : 0);
  } else if (cls?.id === "barbarian") ac = 10 + mods.DEX + mods.CON;
  else if (cls?.id === "monk" && !c.shield) ac = 10 + mods.DEX + mods.WIS;
  else ac = 10 + mods.DEX;
  if (c.shield) ac += 2;
  ac = ov(c, "ac", ac);

  const opt = sp?.options?.find((o) => o.name === c.speciesOption);
  const speed = ov(c, "speed", opt?.speed ?? sp?.speed ?? 30);

  const sa = cls?.spellAbility;
  const spellDc = sa ? ov(c, "spellDc", 8 + pb + mods[sa]) : null;
  const spellAtk = sa ? ov(c, "spellAtk", pb + mods[sa]) : null;
  const slots = spellSlots(cls, c.level);

  return { cls, bg, sp, pb, scores, mods, saves, skills, passive, initiative, maxHp, ac, speed, spellDc, spellAtk, slots, hd };
}

export function download(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}
