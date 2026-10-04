// 5e (2014) – Völker nach SRD 5.1 (je Volk die SRD-Unterart).
import type { Species } from "./species";

export const SPECIES_2014: Species[] = [
  {
    id: "dwarf", name: "Zwerg (Hügelzwerg)", sizes: ["Medium"], speed: 25, hpPerLevel: 1, bonuses: { CON: 2, WIS: 1 },
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Zwergische Widerstandskraft", text: "Vorteil auf Rettungswürfe gegen Gift, Resistenz gegen Giftschaden." },
      { name: "Zwergische Kampfausbildung", text: "Übung mit Streitaxt, Handaxt, leichtem Hammer und Kriegshammer." },
      { name: "Werkzeugübung", text: "Übung mit Schmiede-, Brauer- oder Steinmetzwerkzeug." },
      { name: "Steingespür", text: "Doppelter Übungsbonus auf Geschichte-Würfe zu Steinarbeiten." },
      { name: "Zwergische Zähigkeit", text: "Maximale TP +1 pro Stufe (automatisch eingerechnet). Bewegungsrate sinkt nicht durch schwere Rüstung." },
    ],
  },
  {
    id: "elf", name: "Elf (Hochelf)", sizes: ["Medium"], speed: 30, bonuses: { DEX: 2, INT: 1 }, skills: ["Perception"],
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Geschärfte Sinne", text: "Übung in Wahrnehmung (automatisch eingerechnet)." },
      { name: "Feenblut", text: "Vorteil auf Rettungswürfe gegen Bezauberung; Magie kann dich nicht einschlafen lassen." },
      { name: "Trance", text: "4 Stunden Meditation statt 8 Stunden Schlaf." },
      { name: "Elfische Waffenausbildung", text: "Übung mit Langschwert, Kurzschwert, Kurzbogen und Langbogen." },
      { name: "Zaubertrick", text: "Ein Zaubertrick von der Magier-Liste (IN)." },
      { name: "Zusätzliche Sprache", text: "Eine weitere Sprache deiner Wahl." },
    ],
  },
  {
    id: "halfling", name: "Halbling (Leichtfuß)", sizes: ["Small"], speed: 25, bonuses: { DEX: 2, CHA: 1 },
    traits: [
      { name: "Glück", text: "Eine gewürfelte 1 bei Angriffs-, Attributs- oder Rettungswurf neu würfeln." },
      { name: "Mutig", text: "Vorteil auf Rettungswürfe gegen Furcht." },
      { name: "Halblingsgewandtheit", text: "Du kannst dich durch den Bereich größerer Kreaturen bewegen." },
      { name: "Natürlich verstohlen", text: "Verstecken möglich, wenn du von einer mindestens eine Größe größeren Kreatur verdeckt bist." },
    ],
  },
  {
    id: "human", name: "Mensch", sizes: ["Medium"], speed: 30, bonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    traits: [{ name: "Zusätzliche Sprache", text: "Eine weitere Sprache deiner Wahl." }],
  },
  {
    id: "dragonborn", name: "Drachenblütiger", sizes: ["Medium"], speed: 30, bonuses: { STR: 2, CHA: 1 },
    traits: [
      { name: "Drachenabstammung", text: "Bestimmt Schadensart und Form deiner Odemwaffe." },
      { name: "Odemwaffe", text: "Aktion: 2W6 Schaden (steigt mit der Stufe), Rettungswurf-SG 8 + KO-Mod + Übungsbonus, 1× pro kurzer oder langer Rast." },
      { name: "Schadensresistenz", text: "Resistenz gegen die Schadensart deiner Drachenabstammung." },
    ],
    optionLabel: "Drachenabstammung",
    options: ([
      ["Black", "Schwarz", "Säure, 5×30-ft-Linie (GE)"], ["Blue", "Blau", "Blitz, 5×30-ft-Linie (GE)"], ["Brass", "Messing", "Feuer, 5×30-ft-Linie (GE)"],
      ["Bronze", "Bronze", "Blitz, 5×30-ft-Linie (GE)"], ["Copper", "Kupfer", "Säure, 5×30-ft-Linie (GE)"], ["Gold", "Gold", "Feuer, 15-ft-Kegel (GE)"],
      ["Green", "Grün", "Gift, 15-ft-Kegel (KO)"], ["Red", "Rot", "Feuer, 15-ft-Kegel (GE)"], ["Silver", "Silber", "Kälte, 15-ft-Kegel (KO)"],
      ["White", "Weiß", "Kälte, 15-ft-Kegel (KO)"],
    ] as [string, string, string][]).map(([n, l, d]) => ({ name: n, label: l, text: d })),
  },
  {
    id: "gnome", name: "Gnom (Felsgnom)", sizes: ["Small"], speed: 25, bonuses: { INT: 2, CON: 1 },
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Gnomische Gerissenheit", text: "Vorteil auf IN-, WE- und CH-Rettungswürfe gegen Magie." },
      { name: "Wissen des Handwerkers", text: "Doppelter Übungsbonus auf Geschichte-Würfe zu magischen, alchemistischen oder technischen Gegenständen." },
      { name: "Bastler", text: "Übung mit Tüftlerwerkzeug; kleine Uhrwerk-Geräte bauen." },
    ],
  },
  {
    id: "half-elf", name: "Halbelf", sizes: ["Medium"], speed: 30, bonuses: { CHA: 2 },
    chooseBonus: { count: 2, amount: 1, exclude: ["CHA"] }, skillChoices: 2,
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Feenblut", text: "Vorteil auf Rettungswürfe gegen Bezauberung; Magie kann dich nicht einschlafen lassen." },
      { name: "Fertigkeitsvielseitigkeit", text: "Übung in zwei Fertigkeiten deiner Wahl." },
      { name: "Zusätzliche Sprache", text: "Eine weitere Sprache deiner Wahl." },
    ],
  },
  {
    id: "half-orc", name: "Halbork", sizes: ["Medium"], speed: 30, bonuses: { STR: 2, CON: 1 }, skills: ["Intimidation"],
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Bedrohlich", text: "Übung in Einschüchtern (automatisch eingerechnet)." },
      { name: "Unermüdliche Ausdauer", text: "Fällt auf 1 TP statt auf 0, 1× pro langer Rast." },
      { name: "Wilde Angriffe", text: "Bei einem kritischen Nahkampftreffer einen Schadenswürfel der Waffe zusätzlich würfeln." },
    ],
  },
  {
    // Nicht-SRD: Eberron – Rising from the Last War (2019). Regelwerte, Merkmale in eigenen Worten zusammengefasst.
    id: "warforged", name: "Warforged", sizes: ["Medium"], speed: 30, bonuses: { CON: 2 },
    chooseBonus: { count: 1, amount: 1, exclude: ["CON"] }, acBonus: 1, skillChoices: 1,
    source: "Eberron: Rising from the Last War",
    traits: [
      { name: "Konstrukt-Widerstandskraft", text: "Vorteil gegen Vergiftung, Resistenz gegen Giftschaden, immun gegen Krankheiten; kein Atmen, Essen oder Trinken nötig." },
      { name: "Wächterruhe", text: "Lange Rast in 6 Stunden regungslos, aber bei Bewusstsein; Magie kann dich nicht einschlafen lassen." },
      { name: "Integrierter Schutz", text: "+1 RK (automatisch eingerechnet); angelegte Rüstung kann dir nicht gegen deinen Willen abgenommen werden." },
      { name: "Spezialisierte Bauweise", text: "Übung in einer Fertigkeit und einem Werkzeug deiner Wahl." },
    ],
  },
  {
    id: "tiefling", name: "Tiefling", sizes: ["Medium"], speed: 30, bonuses: { CHA: 2, INT: 1 },
    traits: [
      { name: "Dunkelsicht", text: "60 ft." },
      { name: "Höllische Resistenz", text: "Resistenz gegen Feuerschaden." },
      { name: "Infernalisches Vermächtnis", text: "Zaubertrick Thaumaturgie; ab Stufe 3 Höllischer Tadel, ab Stufe 5 Dunkelheit (je 1× pro langer Rast, CH)." },
    ],
  },
];
