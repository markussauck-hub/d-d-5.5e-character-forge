import { ARMORS } from "@/data/rules";
import { backgroundOf, classOf, speciesOf, subclassOf } from "@/data/edition";
import type { Character } from "@/lib/character";

export type PromptLang = "de" | "en";
export type PromptStyle = "painting" | "illustration" | "realistic" | "watercolor" | "comic";
export type PromptFraming = "portrait" | "half" | "full";

export const STYLE_LABELS: Record<PromptStyle, string> = {
  painting: "Ölgemälde",
  illustration: "Fantasy-Illustration",
  realistic: "Fotorealistisch",
  watercolor: "Aquarell",
  comic: "Comic",
};
export const FRAMING_LABELS: Record<PromptFraming, string> = {
  portrait: "Porträt (Kopf & Schultern)",
  half: "Halbfigur",
  full: "Ganzkörper",
};

type L = Record<PromptLang, string>;

const STYLE: Record<PromptStyle, L> = {
  painting: { de: "detailreiches Fantasy-Ölgemälde, sichtbare Pinselstriche, dramatisches Licht", en: "detailed fantasy oil painting, visible brushstrokes, dramatic lighting" },
  illustration: { de: "hochwertige Fantasy-Illustration im Stil eines Rollenspiel-Regelwerks, klare Linien, satte Farben", en: "high-quality fantasy RPG rulebook illustration, clean linework, rich colors" },
  realistic: { de: "fotorealistisch, filmische Beleuchtung, geringe Schärfentiefe", en: "photorealistic, cinematic lighting, shallow depth of field" },
  watercolor: { de: "Aquarellmalerei, weiche Farbverläufe, Papierstruktur", en: "watercolor painting, soft color bleeds, paper texture" },
  comic: { de: "Comic-Stil, kräftige Konturen, flächige Farben", en: "comic book style, bold ink outlines, flat colors" },
};
const FRAMING: Record<PromptFraming, L> = {
  portrait: { de: "Porträt, Kopf und Schultern, Blick zum Betrachter", en: "portrait, head and shoulders, looking at the viewer" },
  half: { de: "Halbfigur, von der Hüfte aufwärts", en: "half-body shot, from the waist up" },
  full: { de: "Ganzkörperansicht, stehend, ganze Figur im Bild", en: "full-body shot, standing, entire figure in frame" },
};

const SPECIES: Record<string, L> = {
  dragonborn: { de: "Drachenblütiger: humanoider Drache mit Schuppenhaut, drachenartigem Kopf, ohne Schwanz", en: "dragonborn: humanoid dragon with scaled skin and a draconic head, no tail" },
  dwarf: { de: "Zwerg: stämmig, breitschultrig, kräftige Statur", en: "dwarf: stocky, broad-shouldered, sturdy build" },
  elf: { de: "Elf: schlank, anmutig, spitze Ohren", en: "elf: slender, graceful, pointed ears" },
  gnome: { de: "Gnom: kleine Gestalt, große ausdrucksstarke Augen, neugieriger Blick", en: "gnome: small stature, large expressive eyes, curious look" },
  goliath: { de: "Goliath: sehr groß und muskulös, graue steinartige Haut mit dunklen Mustern", en: "goliath: very tall and muscular, grey stone-like skin with dark markings" },
  halfling: { de: "Halbling: klein, rundliches freundliches Gesicht, barfuß", en: "halfling: small, round friendly face, barefoot" },
  human: { de: "Mensch", en: "human" },
  "half-elf": { de: "Halbelf: leicht spitze Ohren, Züge von Mensch und Elf", en: "half-elf: slightly pointed ears, mix of human and elven features" },
  warforged: { de: "Warforged: humanoides Konstrukt aus Holz, Stein und Metall, Panzerplatten statt Haut, leuchtende Augen, sichtbare Fasern und Bolzen", en: "warforged: humanoid construct of wood, stone and metal, armored plates instead of skin, glowing eyes, visible fibers and rivets" },
  "half-orc": { de: "Halbork: kräftig, grünlich-graue Haut, kleine Hauer, markante Stirn", en: "half-orc: powerful build, greenish-grey skin, small tusks, prominent brow" },
  orc: { de: "Ork: kräftig, graugrüne Haut, kleine Hauer im Unterkiefer", en: "orc: powerful build, grey-green skin, small tusks in the lower jaw" },
  tiefling: { de: "Tiefling: Hörner, langer Schwanz, leuchtende Augen ohne Pupillen", en: "tiefling: horns, long tail, glowing pupil-less eyes" },
};

/** Optische Details zu Spezies-Optionen (Schlüssel = gespeicherter englischer Wert). */
const OPTION: Record<string, L> = {
  Black: { de: "schwarze Schuppen", en: "black scales" }, Blue: { de: "blaue Schuppen", en: "blue scales" },
  Brass: { de: "messingfarbene Schuppen", en: "brass-colored scales" }, Bronze: { de: "bronzene Schuppen", en: "bronze scales" },
  Copper: { de: "kupferne Schuppen", en: "copper scales" }, Gold: { de: "goldene Schuppen", en: "golden scales" },
  Green: { de: "grüne Schuppen", en: "green scales" }, Red: { de: "rote Schuppen", en: "red scales" },
  Silver: { de: "silberne Schuppen", en: "silver scales" }, White: { de: "weiße Schuppen", en: "white scales" },
  Drow: { de: "Drow mit dunkler Haut und weißem Haar", en: "drow with dark skin and white hair" },
  "High Elf": { de: "Hochelf mit edlen Gesichtszügen", en: "high elf with noble features" },
  "Wood Elf": { de: "Waldelf mit erdfarbener Kleidung", en: "wood elf in earth-toned clothing" },
  "Forest Gnome": { de: "Waldgnom", en: "forest gnome" }, "Rock Gnome": { de: "Felsgnom mit kleinem Werkzeug", en: "rock gnome with small tinker tools" },
  Abyssal: { de: "abyssisches Erbe, Haut mit giftgrünem Schimmer", en: "abyssal heritage, skin with a sickly green sheen" },
  Chthonic: { de: "chthonisches Erbe, fahle Haut, Hauch von Grabesnebel", en: "chthonic heritage, pallid skin, wisps of grave mist" },
  Infernal: { de: "infernalisches Erbe, rote Haut, glühende Augen", en: "infernal heritage, red skin, ember-glowing eyes" },
};

const CLASS: Record<string, L> = {
  barbarian: { de: "Barbar, wilde Kriegerin oder wilder Krieger mit großer Waffe, Kampfspuren", en: "barbarian, fierce warrior with a large weapon, battle scars" },
  bard: { de: "Barde, charismatisch, mit Laute oder anderem Musikinstrument, farbenfrohe Kleidung", en: "bard, charismatic, holding a lute or other musical instrument, colorful clothing" },
  cleric: { de: "Kleriker, heiliges Symbol, göttliches Licht", en: "cleric, holy symbol, divine light" },
  druid: { de: "Druide, Naturmaterialien, Holzstab, Blätter und Ranken", en: "druid, natural materials, wooden staff, leaves and vines" },
  fighter: { de: "Kämpfer, kampferprobt, Schwert und Ausrüstung eines Soldaten", en: "fighter, battle-hardened, sword and soldier's gear" },
  monk: { de: "Mönch, schlichte Gewänder, Kampfhaltung, innere Ruhe", en: "monk, simple robes, martial arts stance, inner calm" },
  paladin: { de: "Paladin, heiliger Krieger, glänzende Rüstung, entschlossener Blick", en: "paladin, holy warrior, shining armor, determined gaze" },
  ranger: { de: "Waldläufer, Bogen, Kapuzenumhang, Wildnis", en: "ranger, longbow, hooded cloak, wilderness" },
  rogue: { de: "Schurke, dunkle Kleidung, Dolche, verschmitzter Blick", en: "rogue, dark clothing, daggers, sly expression" },
  sorcerer: { de: "Zauberer, angeborene Magie, Funken und Energie um die Hände", en: "sorcerer, innate magic, sparks and energy around the hands" },
  warlock: { de: "Hexenmeister, mysteriös, unheimliche Magie, okkulte Symbole", en: "warlock, mysterious, eldritch magic, occult symbols" },
  wizard: { de: "Magier, Zauberbuch, Robe, Arkansymbole", en: "wizard, spellbook, robes, arcane symbols" },
};

/** Optische Hinweise zum Hintergrund – bewusst ohne das Wort „Hintergrund“, das die Bild-KI als Bildhintergrund liest. */
const BACKGROUND_LOOK: Record<string, L> = {
  acolyte: { de: "einstiger Tempeldiener, schlichte religiöse Gewandteile", en: "former temple acolyte, simple religious garments" },
  criminal: { de: "Vergangenheit als Krimineller, wachsamer Blick, abgetragene Kleidung", en: "criminal past, wary eyes, worn clothing" },
  sage: { de: "gelehrsame Ausstrahlung, Schriftrollen oder Bücher dabei", en: "scholarly air, carrying scrolls or books" },
  soldier: { de: "militärische Haltung, Spuren eines Soldatenlebens", en: "military bearing, marks of a soldier's life" },
  charlatan: { de: "gewinnendes, falsches Lächeln, auffällige Kleidung", en: "charming, insincere smile, flashy clothes" },
  entertainer: { de: "Bühnenkostüm, theatralische Pose", en: "stage costume, theatrical pose" },
  "folk-hero": { de: "einfache ländliche Kleidung, bodenständig und entschlossen", en: "simple rural clothes, down-to-earth and determined" },
  "guild-artisan": { de: "Handwerkerschürze, Werkzeug am Gürtel", en: "artisan's apron, tools on the belt" },
  hermit: { de: "zurückgezogener Einsiedler, abgetragene Kleidung, Kräuterbeutel", en: "reclusive hermit, worn clothes, herb pouch" },
  noble: { de: "edle Kleidung, Siegelring, stolze Haltung", en: "fine clothes, signet ring, proud bearing" },
  outlander: { de: "wettergegerbt, Felle und Wildniskleidung", en: "weather-beaten, furs and wilderness clothing" },
  sailor: { de: "Seemannskleidung, salzzerzauste Haare, Seil über der Schulter", en: "sailor's clothes, salt-tousled hair, rope over the shoulder" },
  urchin: { de: "Straßenkind, zerlumpte Kleidung, wachsamer Blick", en: "street urchin, ragged clothes, watchful eyes" },
};

const ARMOR_LOOK: Record<string, L> = {
  padded: { de: "gepolsterte Stoffrüstung", en: "padded cloth armor" }, leather: { de: "Lederrüstung", en: "leather armor" },
  studded: { de: "beschlagene Lederrüstung", en: "studded leather armor" }, hide: { de: "Fellrüstung", en: "hide armor" },
  chainshirt: { de: "Kettenhemd", en: "chain shirt" }, scale: { de: "Schuppenpanzer", en: "scale mail" },
  breastplate: { de: "Brustplatte", en: "breastplate" }, halfplate: { de: "Halbplattenrüstung", en: "half plate armor" },
  ringmail: { de: "Ringpanzer", en: "ring mail" }, chainmail: { de: "Kettenpanzer", en: "chain mail" },
  splint: { de: "Schienenpanzer", en: "splint armor" }, plate: { de: "Plattenpanzer", en: "full plate armor" },
};

const ALIGN_MOOD: Record<string, L> = {
  Good: { de: "warme, freundliche Ausstrahlung", en: "warm, kind demeanor" },
  Evil: { de: "bedrohliche, finstere Ausstrahlung", en: "menacing, sinister demeanor" },
  Neutral: { de: "ruhige, schwer lesbare Ausstrahlung", en: "calm, unreadable demeanor" },
};

export function buildPortraitPrompt(c: Character, lang: PromptLang, style: PromptStyle, framing: PromptFraming): string {
  const cls = classOf(c);
  const sp = speciesOf(c);
  const bg = backgroundOf(c);
  const sub = subclassOf(c);
  const armor = ARMORS.find((a) => a.id === c.armorId);
  const parts: string[] = [];

  parts.push(lang === "de" ? "Charakterbild für ein Fantasy-Rollenspiel" : "Fantasy tabletop RPG character portrait");
  parts.push(FRAMING[framing][lang]);

  if (sp) {
    const opt = c.speciesOption ? OPTION[c.speciesOption]?.[lang] : undefined;
    parts.push([SPECIES[sp.id]?.[lang] ?? sp.name, opt].filter(Boolean).join(", "));
  }
  if (c.size === "Small" && sp && !["gnome", "halfling"].includes(sp.id)) {
    parts.push(lang === "de" ? "kleine Statur" : "small stature");
  }
  if (cls) {
    parts.push(CLASS[cls.id]?.[lang] ?? cls.name);
    if (sub) parts.push(lang === "de" ? `Unterklasse: ${sub.name}` : `subclass (German name): ${sub.name}`);
  }
  if (bg && BACKGROUND_LOOK[bg.id]) parts.push(BACKGROUND_LOOK[bg.id]![lang]);
  if (armor) parts.push(lang === "de" ? `trägt ${ARMOR_LOOK[armor.id]!.de}` : `wearing ${ARMOR_LOOK[armor.id]!.en}`);
  if (c.shield) parts.push(lang === "de" ? "mit Schild" : "carrying a shield");

  if (c.alignment) {
    const key = c.alignment.includes("Good") ? "Good" : c.alignment.includes("Evil") ? "Evil" : "Neutral";
    parts.push(ALIGN_MOOD[key]![lang]);
  }

  const looks = c.appearance.trim().replace(/\s+/g, " ");
  if (looks) parts.push(lang === "de" ? `Aussehen: ${looks}` : `appearance (described in German, interpret accordingly): ${looks}`);

  parts.push(STYLE[style][lang]);
  parts.push(lang === "de"
    ? "stimmungsvoller, unaufdringlicher Hintergrund, hohe Detailtiefe, kein Text, keine Schrift, kein Wasserzeichen"
    : "atmospheric, unobtrusive background, highly detailed, no text, no lettering, no watermark");

  return parts.join(", ") + ".";
}
