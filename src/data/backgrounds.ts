import type { Ab } from "./rules";

export interface Background {
  id: string;
  name: string;
  abilities: [Ab, Ab, Ab];
  feat: string;
  /** Interne (englische) Fertigkeitsschlüssel, Anzeige über skillName(). */
  skills: [string, string];
  tool: string;
  equipment: string;
  gold: number;
}

export const BACKGROUNDS: Background[] = [
  {
    id: "acolyte", name: "Akolyth", abilities: ["INT", "WIS", "CHA"], feat: "Magie-Eingeweihter (Kleriker)",
    skills: ["Insight", "Religion"], tool: "Kalligrafenwerkzeug",
    equipment: "Kalligrafenwerkzeug, Buch (Gebete), Heiliges Symbol, Pergament (10 Blatt), Robe", gold: 8,
  },
  {
    id: "criminal", name: "Krimineller", abilities: ["DEX", "CON", "INT"], feat: "Aufmerksam",
    skills: ["Sleight of Hand", "Stealth"], tool: "Diebeswerkzeug",
    equipment: "2 Dolche, Diebeswerkzeug, Brecheisen, 2 Beutel, Reisekleidung", gold: 16,
  },
  {
    id: "sage", name: "Weiser", abilities: ["CON", "INT", "WIS"], feat: "Magie-Eingeweihter (Magier)",
    skills: ["Arcana", "History"], tool: "Kalligrafenwerkzeug",
    equipment: "Kampfstab, Kalligrafenwerkzeug, Buch (Geschichte), Pergament (8 Blatt), Robe", gold: 8,
  },
  {
    id: "soldier", name: "Soldat", abilities: ["STR", "DEX", "CON"], feat: "Wilder Angreifer",
    skills: ["Athletics", "Intimidation"], tool: "Spielset (eine Art wählen)",
    equipment: "Speer, Kurzbogen, 20 Pfeile, Spielset, Heilerausrüstung, Köcher, Reisekleidung", gold: 14,
  },
];

export const getBackground = (id?: string) => BACKGROUNDS.find((b) => b.id === id);

export const ORIGIN_FEATS = [
  { name: "Aufmerksam", text: "Übungsbonus auf Initiative (automatisch eingerechnet); Initiative mit einem willigen Verbündeten tauschen." },
  { name: "Magie-Eingeweihter", text: "Zwei Zaubertricks und ein Zauber des 1. Grades aus der Kleriker-, Druiden- oder Magier-Liste; den Zauber 1× pro Langer Rast ohne Zauberplatz wirken." },
  { name: "Wilder Angreifer", text: "Einmal pro Zug die Schadenswürfel einer Waffe zweimal würfeln und den höheren Wert nehmen." },
  { name: "Geübt", text: "Übung in drei beliebigen Kombinationen aus Fertigkeiten oder Werkzeugen. Mehrfach wählbar." },
];
