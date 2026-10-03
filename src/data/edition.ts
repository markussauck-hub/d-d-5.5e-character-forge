// Zentrale Zuordnung: welche Regeldaten gelten für welche Edition.
import { CLASSES, type ClassDef, type Subclass } from "./classes";
import { CLASSES_2014 } from "./classes-2014";
import { SPECIES, type Species } from "./species";
import { SPECIES_2014 } from "./species-2014";
import { BACKGROUNDS, ORIGIN_FEATS, type Background } from "./backgrounds";
import { BACKGROUNDS_2014 } from "./backgrounds-2014";

export type Edition = "2024" | "2014";

export const EDITION_LABEL: Record<Edition, string> = { "2024": "5.5e (2024)", "2014": "5e (2014)" };

export interface Ruleset {
  classes: ClassDef[];
  species: Species[];
  backgrounds: Background[];
  originFeats: { name: string; text: string }[];
  /** Anzeigename für „Spezies“ bzw. „Volk“. */
  speciesTerm: string;
}

const RULES: Record<Edition, Ruleset> = {
  "2024": { classes: CLASSES, species: SPECIES, backgrounds: BACKGROUNDS, originFeats: ORIGIN_FEATS, speciesTerm: "Spezies" },
  "2014": { classes: CLASSES_2014, species: SPECIES_2014, backgrounds: BACKGROUNDS_2014, originFeats: [], speciesTerm: "Volk" },
};

type HasEdition = {
  edition?: Edition | undefined; classId?: string | undefined; speciesId?: string | undefined;
  backgroundId?: string | undefined; hasSubclass?: boolean | undefined; subclassId?: string | undefined;
};

export const ruleset = (c: HasEdition) => RULES[c.edition ?? "2024"];
export const classOf = (c: HasEdition) => ruleset(c).classes.find((x) => x.id === c.classId);
export const speciesOf = (c: HasEdition) => ruleset(c).species.find((x) => x.id === c.speciesId);
export const backgroundOf = (c: HasEdition) => ruleset(c).backgrounds.find((x) => x.id === c.backgroundId);

/** Gewählte Unterklasse; ältere Charaktere ohne subclassId bekommen die SRD-Unterklasse. */
export function subclassOf(c: HasEdition): Subclass | undefined {
  const cls = classOf(c);
  if (!cls || !c.hasSubclass) return undefined;
  return cls.subclasses.find((s) => s.id === c.subclassId) ?? cls.subclasses[0];
}
