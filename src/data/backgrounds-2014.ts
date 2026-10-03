// 5e (2014). Akolyth stammt aus dem SRD 5.1 (mit Ausrüstung). Die übrigen Hintergründe aus dem
// Spielerhandbuch 2014 sind nur mit Namen, Fertigkeiten und Werkzeugen hinterlegt – Ausrüstung bitte selbst eintragen.
import type { Background } from "./backgrounds";

export const BACKGROUNDS_2014: Background[] = [
  {
    id: "acolyte", name: "Akolyth", skills: ["Insight", "Religion"], tool: "keins (dafür zwei Sprachen)",
    equipment: "Heiliges Symbol, Gebetbuch oder Gebetsmühle, 5 Räucherstäbchen, Gewänder, gewöhnliche Kleidung, Gürteltasche", gold: 15,
  },
  { id: "charlatan", name: "Scharlatan", skills: ["Deception", "Sleight of Hand"], tool: "Verkleidungsset, Fälscherwerkzeug", equipment: "", gold: 0 },
  { id: "criminal", name: "Krimineller", skills: ["Deception", "Stealth"], tool: "ein Spielset, Diebeswerkzeug", equipment: "", gold: 0 },
  { id: "entertainer", name: "Unterhaltungskünstler", skills: ["Acrobatics", "Performance"], tool: "Verkleidungsset, ein Musikinstrument", equipment: "", gold: 0 },
  { id: "folk-hero", name: "Volksheld", skills: ["Animal Handling", "Survival"], tool: "ein Handwerkerwerkzeug, Landfahrzeuge", equipment: "", gold: 0 },
  { id: "guild-artisan", name: "Gildenhandwerker", skills: ["Insight", "Persuasion"], tool: "ein Handwerkerwerkzeug (dazu eine Sprache)", equipment: "", gold: 0 },
  { id: "hermit", name: "Einsiedler", skills: ["Medicine", "Religion"], tool: "Kräuterkundeausrüstung (dazu eine Sprache)", equipment: "", gold: 0 },
  { id: "noble", name: "Adeliger", skills: ["History", "Persuasion"], tool: "ein Spielset (dazu eine Sprache)", equipment: "", gold: 0 },
  { id: "outlander", name: "Außenseiter", skills: ["Athletics", "Survival"], tool: "ein Musikinstrument (dazu eine Sprache)", equipment: "", gold: 0 },
  { id: "sage", name: "Weiser", skills: ["Arcana", "History"], tool: "keins (dafür zwei Sprachen)", equipment: "", gold: 0 },
  { id: "sailor", name: "Seefahrer", skills: ["Athletics", "Perception"], tool: "Navigatorwerkzeug, Wasserfahrzeuge", equipment: "", gold: 0 },
  { id: "soldier", name: "Soldat", skills: ["Athletics", "Intimidation"], tool: "ein Spielset, Landfahrzeuge", equipment: "", gold: 0 },
  { id: "urchin", name: "Straßenkind", skills: ["Sleight of Hand", "Stealth"], tool: "Verkleidungsset, Diebeswerkzeug", equipment: "", gold: 0 },
];
