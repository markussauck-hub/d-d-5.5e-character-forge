// 5e (2014) – Klassen nach SRD 5.1. Die erste Unterklasse je Klasse ist die SRD-Unterklasse mit Merkmalen,
// weitere Unterklassen aus dem Spielerhandbuch 2014 nur mit Namen.
import { ALL_SKILLS } from "./rules";
import { f, type ClassDef, type Subclass } from "./classes";

const SIMPLE = "Einfache Waffen";
const MARTIAL = "Einfache Waffen und Kriegswaffen";
const names = (...n: string[]): Subclass[] =>
  n.map((x) => ({ id: x.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z]+/g, "-"), name: x }));

export const CLASSES_2014: ClassDef[] = [
  {
    id: "barbarian", name: "Barbar", hitDie: 12, primary: "Stärke", saves: ["STR", "CON"],
    skillCount: 2, skillList: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
    weapons: MARTIAL, armor: ["light", "medium"], shield: true, caster: null, mastery: [],
    features: f("1:Kampfrausch|Ungerüstete Verteidigung;2:Tollkühner Angriff|Gefahrengespür;3:Primitiver Pfad;4:ASI;5:Zusätzlicher Angriff|Schnelle Bewegung;7:Wilder Instinkt;8:ASI;9:Brutaler kritischer Treffer (1 Würfel);11:Unerbittlicher Kampfrausch;12:ASI;13:Brutaler kritischer Treffer (2 Würfel);15:Anhaltender Kampfrausch;16:ASI;17:Brutaler kritischer Treffer (3 Würfel);18:Unbezwingbare Stärke;19:ASI;20:Urchampion"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Pfad des Berserkers", features: f("3:Raserei;6:Blinder Kampfrausch;10:Einschüchternde Präsenz;14:Vergeltung") }, ...names("Pfad des Totemkriegers")],
  },
  {
    id: "bard", name: "Barde", hitDie: 8, primary: "Charisma", saves: ["DEX", "CHA"],
    skillCount: 3, skillList: ALL_SKILLS, weapons: "Einfache Waffen, Handarmbrüste, Langschwerter, Rapiere, Kurzschwerter",
    armor: ["light"], shield: false, caster: "full", spellAbility: "CHA", mastery: [],
    features: f("1:Zauberwirken|Bardische Inspiration (W6);2:Alleskönner|Lied der Erholung (W6);3:Bardenschule|Expertise;4:ASI;5:Bardische Inspiration (W8)|Quell der Inspiration;6:Gegenbezauberung;8:ASI;9:Lied der Erholung (W8);10:Bardische Inspiration (W10)|Expertise|Magische Geheimnisse;12:ASI;13:Lied der Erholung (W10);14:Magische Geheimnisse;15:Bardische Inspiration (W12);16:ASI;17:Lied der Erholung (W12);18:Magische Geheimnisse;19:ASI;20:Überlegene Inspiration"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Schule des Wissens", features: f("3:Zusätzliche Übung|Schneidende Worte;6:Zusätzliche magische Geheimnisse;14:Unvergleichliches Können") }, ...names("Schule der Tapferkeit")],
  },
  {
    id: "cleric", name: "Kleriker", hitDie: 8, primary: "Weisheit", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["History", "Insight", "Medicine", "Persuasion", "Religion"],
    weapons: SIMPLE, armor: ["light", "medium"], shield: true, caster: "full", spellAbility: "WIS", mastery: [],
    features: f("1:Zauberwirken|Göttliche Domäne;2:Göttliche Macht fokussieren (1/Rast)|Untote vertreiben;4:ASI;5:Untote zerstören (HG 1/2);6:Göttliche Macht fokussieren (2/Rast);8:ASI|Untote zerstören (HG 1);10:Göttliches Eingreifen;11:Untote zerstören (HG 2);12:ASI;14:Untote zerstören (HG 3);16:ASI;17:Untote zerstören (HG 4);18:Göttliche Macht fokussieren (3/Rast);19:ASI;20:Verbessertes göttliches Eingreifen"),
    subclassLevel: 1,
    subclasses: [{ id: "srd", name: "Domäne des Lebens", features: f("1:Bonusübung (schwere Rüstung)|Jünger des Lebens|Domänenzauber;2:Göttliche Macht: Leben bewahren;6:Gesegneter Heiler;8:Göttlicher Schlag;17:Vollendete Heilung") },
      ...names("Domäne des Wissens", "Domäne des Lichts", "Domäne der Natur", "Domäne des Sturms", "Domäne der List", "Domäne des Krieges")],
  },
  {
    id: "druid", name: "Druide", hitDie: 8, primary: "Weisheit", saves: ["INT", "WIS"],
    skillCount: 2, skillList: ["Arcana", "Animal Handling", "Insight", "Medicine", "Nature", "Perception", "Religion", "Survival"],
    weapons: "Keulen, Dolche, Wurfpfeile, Wurfspeere, Streitkolben, Kampfstäbe, Krummsäbel, Sicheln, Schleudern, Speere",
    armor: ["light", "medium"], shield: true, caster: "full", spellAbility: "WIS", mastery: [],
    features: f("1:Druidisch|Zauberwirken;2:Tiergestalt|Druidenzirkel;4:Verbesserte Tiergestalt|ASI;8:Verbesserte Tiergestalt|ASI;12:ASI;16:ASI;18:Zeitloser Körper|Bestienzauber;19:ASI;20:Erzdruide"),
    subclassLevel: 2,
    subclasses: [{ id: "srd", name: "Zirkel des Landes", features: f("2:Zusätzlicher Zaubertrick|Natürliche Erholung;3:Zirkelzauber;6:Schreiten durchs Land;10:Schutz der Natur;14:Zuflucht der Natur") }, ...names("Zirkel des Mondes")],
  },
  {
    id: "fighter", name: "Kämpfer", hitDie: 10, primary: "Stärke oder Geschicklichkeit", saves: ["STR", "CON"],
    skillCount: 2, skillList: ["Acrobatics", "Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"],
    weapons: MARTIAL, armor: ["light", "medium", "heavy"], shield: true, caster: null, mastery: [],
    features: f("1:Kampfstil|Durchatmen;2:Tatendrang;3:Kriegerischer Archetyp;4:ASI;5:Zusätzlicher Angriff;6:ASI;8:ASI;9:Unbeugsam;11:Zwei zusätzliche Angriffe;12:ASI;13:Unbeugsam (2 Anwendungen);14:ASI;16:ASI;17:Tatendrang (2 Anwendungen)|Unbeugsam (3 Anwendungen);19:ASI;20:Drei zusätzliche Angriffe"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Champion", features: f("3:Verbesserter kritischer Treffer;7:Bemerkenswerter Athlet;10:Zusätzlicher Kampfstil;15:Überlegener kritischer Treffer;18:Überlebender") }, ...names("Kampfmeister", "Mystischer Ritter")],
  },
  {
    id: "monk", name: "Mönch", hitDie: 8, primary: "Geschicklichkeit und Weisheit", saves: ["STR", "DEX"],
    skillCount: 2, skillList: ["Acrobatics", "Athletics", "History", "Insight", "Religion", "Stealth"],
    weapons: "Einfache Waffen, Kurzschwerter", armor: [], shield: false, caster: null, mastery: [],
    features: f("1:Ungerüstete Verteidigung|Kampfkunst;2:Ki|Ungerüstete Bewegung;3:Klösterliche Tradition|Geschosse abwehren;4:ASI|Langsamer Fall;5:Zusätzlicher Angriff|Betäubender Schlag;6:Ki-verstärkte Schläge;7:Entrinnen|Geistige Ruhe;8:ASI;9:Verbesserte ungerüstete Bewegung;10:Reinheit des Körpers;12:ASI;13:Zunge von Sonne und Mond;14:Diamantseele;15:Zeitloser Körper;16:ASI;18:Leere Hülle;19:ASI;20:Vollkommenes Selbst"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Weg der Offenen Hand", features: f("3:Technik der Offenen Hand;6:Ganzheit des Körpers;11:Ruhe;17:Bebende Handfläche") }, ...names("Weg des Schattens", "Weg der vier Elemente")],
  },
  {
    id: "paladin", name: "Paladin", hitDie: 10, primary: "Stärke und Charisma", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["Athletics", "Insight", "Intimidation", "Medicine", "Persuasion", "Religion"],
    weapons: MARTIAL, armor: ["light", "medium", "heavy"], shield: true, caster: "half", casterStart: 2, spellAbility: "CHA", mastery: [],
    features: f("1:Göttliches Gespür|Handauflegen;2:Kampfstil|Zauberwirken|Göttliches Niederstrecken;3:Göttliche Gesundheit|Heiliger Eid;4:ASI;5:Zusätzlicher Angriff;6:Aura des Schutzes;8:ASI;10:Aura des Mutes;11:Verbessertes göttliches Niederstrecken;12:ASI;14:Reinigende Berührung;16:ASI;18:Aura-Verbesserungen;19:ASI"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Eid der Hingabe", features: f("3:Eidzauber|Göttliche Macht fokussieren;7:Aura der Hingabe;15:Reinheit des Geistes;20:Heiliger Nimbus") }, ...names("Eid der Alten", "Eid der Rache")],
  },
  {
    id: "ranger", name: "Waldläufer", hitDie: 10, primary: "Geschicklichkeit und Weisheit", saves: ["STR", "DEX"],
    skillCount: 3, skillList: ["Animal Handling", "Athletics", "Insight", "Investigation", "Nature", "Perception", "Stealth", "Survival"],
    weapons: MARTIAL, armor: ["light", "medium"], shield: true, caster: "half", casterStart: 2, spellAbility: "WIS", mastery: [],
    features: f("1:Erzfeind|Erfahrener Entdecker;2:Kampfstil|Zauberwirken;3:Waldläufer-Archetyp|Urtümliches Gespür;4:ASI;5:Zusätzlicher Angriff;6:Erzfeind und Erfahrener Entdecker (Verbesserung);8:ASI|Schnelle Durchquerung;10:Erfahrener Entdecker (Verbesserung)|Im Verborgenen;12:ASI;14:Erzfeind (Verbesserung)|Verschwinden;16:ASI;18:Wilde Sinne;19:ASI;20:Feindtöter"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Jäger", features: f("3:Beute des Jägers;7:Defensive Taktiken;11:Mehrfachangriff;15:Überlegene Verteidigung des Jägers") }, ...names("Tiermeister")],
  },
  {
    id: "rogue", name: "Schurke", hitDie: 8, primary: "Geschicklichkeit", saves: ["DEX", "INT"],
    skillCount: 4, skillList: ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "Investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"],
    weapons: "Einfache Waffen, Handarmbrüste, Langschwerter, Rapiere, Kurzschwerter", armor: ["light"], shield: false, caster: null, mastery: [],
    features: f("1:Expertise|Hinterhältiger Angriff|Diebessprache;2:Raffinierte Aktion;3:Schurken-Archetyp;4:ASI;5:Unglaubliches Ausweichen;6:Expertise;7:Entrinnen;8:ASI;10:ASI;11:Verlässliches Talent;12:ASI;14:Blindgespür;15:Schlüpfriger Verstand;16:ASI;18:Schwer zu fassen;19:ASI;20:Glückstreffer"),
    subclassLevel: 3,
    subclasses: [{ id: "srd", name: "Dieb", features: f("3:Flinke Hände|Fassadenkletterer;9:Meisterschleicher;13:Magische Gegenstände benutzen;17:Diebesreflexe") }, ...names("Assassine", "Arkaner Betrüger")],
  },
  {
    id: "sorcerer", name: "Zauberer", hitDie: 6, primary: "Charisma", saves: ["CON", "CHA"],
    skillCount: 2, skillList: ["Arcana", "Deception", "Insight", "Intimidation", "Persuasion", "Religion"],
    weapons: "Dolche, Wurfpfeile, Schleudern, Kampfstäbe, leichte Armbrüste", armor: [], shield: false, caster: "full", spellAbility: "CHA", mastery: [],
    features: f("1:Zauberwirken|Zauberische Herkunft;2:Quell der Magie;3:Metamagie;4:ASI;8:ASI;10:Metamagie;12:ASI;16:ASI;17:Metamagie;19:ASI;20:Zauberische Erholung"),
    subclassLevel: 1,
    subclasses: [{ id: "srd", name: "Drakonische Blutlinie", features: f("1:Drachenahn|Drakonische Widerstandskraft;6:Elementare Affinität;14:Drachenflügel;18:Drakonische Präsenz") }, ...names("Wilde Magie")],
  },
  {
    id: "warlock", name: "Hexenmeister", hitDie: 8, primary: "Charisma", saves: ["WIS", "CHA"],
    skillCount: 2, skillList: ["Arcana", "Deception", "History", "Intimidation", "Investigation", "Nature", "Religion"],
    weapons: SIMPLE, armor: ["light"], shield: false, caster: "pact", spellAbility: "CHA", mastery: [],
    features: f("1:Andersweltlicher Schutzpatron|Paktmagie;2:Schauerliche Anrufungen;3:Paktgabe;4:ASI;8:ASI;11:Mystisches Arkanum (Zauber des 6. Grades);12:ASI;13:Mystisches Arkanum (Zauber des 7. Grades);15:Mystisches Arkanum (Zauber des 8. Grades);16:ASI;17:Mystisches Arkanum (Zauber des 9. Grades);19:ASI;20:Schauerlicher Meister"),
    subclassLevel: 1,
    subclasses: [{ id: "srd", name: "Der Unhold", features: f("1:Segen des Dunklen;6:Glück des Dunklen;10:Unholdische Widerstandskraft;14:Durch die Hölle schleudern") }, ...names("Die Erzfee", "Der Große Alte")],
  },
  {
    id: "wizard", name: "Magier", hitDie: 6, primary: "Intelligenz", saves: ["INT", "WIS"],
    skillCount: 2, skillList: ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
    weapons: "Dolche, Wurfpfeile, Schleudern, Kampfstäbe, leichte Armbrüste", armor: [], shield: false, caster: "full", spellAbility: "INT", mastery: [],
    features: f("1:Zauberwirken|Arkane Erholung;2:Arkane Tradition;4:ASI;8:ASI;12:ASI;16:ASI;18:Zaubermeisterschaft;19:ASI;20:Charakteristische Zauber"),
    subclassLevel: 2,
    subclasses: [{ id: "srd", name: "Schule der Hervorrufung", features: f("2:Experte für Hervorrufung|Zauber formen;6:Mächtiger Zaubertrick;10:Verstärkte Hervorrufung;14:Überladen") },
      ...names("Schule der Bannmagie", "Schule der Beschwörung", "Schule der Erkenntnismagie", "Schule der Verzauberung", "Schule der Illusion", "Schule der Nekromantie", "Schule der Verwandlung")],
  },
];
