import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { EDITION_LABEL, ruleset, speciesOf, type Edition } from "@/data/edition";
import { ALIGNMENTS, ARMORS, ARMOR_TYPE_DE, AB_NAMES, AB_SHORT, SKILLS, alignmentName, sizeName, skillName } from "@/data/rules";
import { abilityIssues, derive, grantedSkills, skillIssues, updateCharacter, useCharacters, useHydratedStore, type Character } from "@/lib/character";
import { AbilityStep } from "@/components/AbilityStep";
import { PortraitPrompt } from "@/components/PortraitPrompt";

export const Route = createFileRoute("/wizard/$id")({
  head: () => ({
    meta: [
      { title: "Charaktererstellung – Heldenschmiede" },
      { name: "description", content: "Schritt für Schritt: Klasse, Hintergrund, Spezies, Attribute, Fertigkeiten und Details." },
      { property: "og:title", content: "Charaktererstellung – Heldenschmiede" },
      { property: "og:description", content: "Schritt-für-Schritt-Assistent für SRD-5.2-Charaktere." },
    ],
  }),
  component: Wizard,
});

const stepsFor = (speciesTerm: string) => ["Klasse", "Hintergrund", speciesTerm, "Attribute", "Fertigkeiten & Ausrüstung", "Details"];
const ABILITY_STEP = 3;
const SKILL_STEP = 4;

function Wizard() {
  const { id } = Route.useParams();
  const c = useCharacters().find((x) => x.id === id);
  const hydrated = useHydratedStore();
  const [step, setStep] = useState(0);

  if (!c) return <main className="p-10 text-center text-muted-foreground">{hydrated ? <>Charakter nicht gefunden. <Link to="/" className="underline">Zur Liste</Link></> : "Lade…"}</main>;
  const set = (p: Partial<Character>) => updateCharacter(id, () => p);
  const aIssues = abilityIssues(c);
  const sIssues = skillIssues(c);
  const issues = [...aIssues, ...sIssues];
  const STEPS = stepsFor(ruleset(c).speciesTerm);
  const stepIssues = (i: number) => (i === ABILITY_STEP ? aIssues : i === SKILL_STEP ? sIssues : []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Charakterliste</Link>
        <Link to="/sheet/$id" params={{ id }} className="btn btn-sm">Zum Charakterbogen →</Link>
      </div>
      <h1 className="mb-4 text-3xl font-bold text-primary">{c.name || "Neuer Charakter"} <span className="label align-middle">{EDITION_LABEL[c.edition]}</span></h1>

      <nav className="mb-8">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <ol className="flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <li key={s}>
              <button onClick={() => setStep(i)} className={`btn btn-sm ${i === step ? "btn-primary" : ""}`}
                title={stepIssues(i).length ? stepIssues(i).join(" ") : undefined}>
                {i + 1}. {s}{stepIssues(i).length > 0 && <span className="ml-1 text-ember">⚠</span>}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section className="min-h-[300px]">
        {step === 0 && <ClassStep c={c} set={set} />}
        {step === 1 && <BackgroundStep c={c} set={set} />}
        {step === 2 && <SpeciesStep c={c} set={set} />}
        {step === 3 && <AbilityStep c={c} set={set} />}
        {step === 4 && <SkillStep c={c} set={set} />}
        {step === 5 && <DetailStep c={c} set={set} />}
      </section>

      {step === STEPS.length - 1 && issues.length > 0 && (
        <div className="mt-6 rounded-lg border border-ember bg-ember/10 p-3 text-sm">
          <b>Noch nicht vollständig:</b>
          <ul className="ml-5 list-disc">{issues.map((i) => <li key={i}>{i}</li>)}</ul>
          <button className="underline" onClick={() => setStep(aIssues.length ? ABILITY_STEP : SKILL_STEP)}>
            {aIssues.length ? "Zu den Attributen →" : "Zu den Fertigkeiten →"}
          </button>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button className="btn" disabled={step === 0} onClick={() => setStep(step - 1)}>← Zurück</button>
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Weiter →</button>
        ) : (
          <Link to="/sheet/$id" params={{ id }} className="btn btn-primary">Fertig – Bogen öffnen</Link>
        )}
      </div>
    </main>
  );
}

type P = { c: Character; set: (p: Partial<Character>) => void };

function ClassStep({ c, set }: P) {
  const rules = ruleset(c);
  const cls = rules.classes.find((k) => k.id === c.classId);
  const switchEdition = (e: Edition) => {
    if (e === c.edition) return;
    if ((c.classId || c.speciesId || c.backgroundId) && !confirm("Beim Wechsel der Edition werden Klasse, Hintergrund, Spezies/Volk und Fertigkeiten zurückgesetzt. Fortfahren?")) return;
    set({
      edition: e, classId: undefined, backgroundId: undefined, speciesId: undefined, speciesOption: undefined,
      hasSubclass: false, subclassId: undefined, skillProfs: [], expertise: [], raceSkills: [], raceBonusChoice: [],
      bgPlus1: undefined, bgPlus2: undefined, slotsUsed: [],
    });
  };
  return (
    <div className="space-y-6">
      <div className="panel flex flex-wrap items-center gap-2">
        <span className="label mr-2">Regelwerk</span>
        {(["2024", "2014"] as const).map((e) => (
          <button key={e} className={`btn btn-sm ${c.edition === e ? "btn-primary" : ""}`} onClick={() => switchEdition(e)}>{EDITION_LABEL[e]}</button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rules.classes.map((k) => (
          <button key={k.id} className="choice" data-active={c.classId === k.id}
            onClick={() => set({
              classId: k.id, skillProfs: [], expertise: [], slotsUsed: [],
              hasSubclass: c.level >= k.subclassLevel, subclassId: k.subclassLevel <= c.level ? k.subclasses[0]!.id : undefined,
            })}>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg font-bold">{k.name}</span>
              <span className="label">W{k.hitDie}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Primär: {k.primary} · Rettungswürfe: {k.saves.map((a) => AB_SHORT[a]).join(", ")}</p>
            <p className="mt-1 text-xs text-muted-foreground">Unterklasse ab Stufe {k.subclassLevel}</p>
            <p className="mt-2 text-xs">{k.features[1]?.join(", ")}</p>
          </button>
        ))}
      </div>
      {cls && (
        <div className="panel space-y-2">
          <h3 className="font-bold">Unterklasse</h3>
          {c.level < cls.subclassLevel ? (
            <p className="text-sm text-muted-foreground">Die Unterklasse wird auf Stufe {cls.subclassLevel} gewählt (beim Stufenaufstieg).</p>
          ) : (
            <SubclassPicker c={c} set={set} />
          )}
        </div>
      )}
    </div>
  );
}

/** Auswahl der Unterklasse; die SRD-Unterklasse hat Merkmale, die übrigen nur Namen. */
export function SubclassPicker({ c, set }: P) {
  const cls = ruleset(c).classes.find((k) => k.id === c.classId);
  if (!cls) return null;
  const current = c.hasSubclass ? (c.subclassId ?? cls.subclasses[0]!.id) : "";
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {cls.subclasses.map((s) => (
        <button key={s.id} className="choice" data-active={current === s.id} onClick={() => set({ hasSubclass: true, subclassId: s.id })}>
          <b>{s.name}</b>
          <p className="text-xs text-muted-foreground">{s.features ? "SRD – Merkmale werden automatisch eingetragen" : "Merkmale siehe Spielerhandbuch"}</p>
        </button>
      ))}
    </div>
  );
}

function BackgroundStep({ c, set }: P) {
  const rules = ruleset(c);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {rules.backgrounds.map((b) => (
          <button key={b.id} className="choice" data-active={c.backgroundId === b.id}
            onClick={() => set({ backgroundId: b.id, bgPlus1: undefined, bgPlus2: undefined, equipmentChoice: undefined, skillProfs: c.skillProfs.filter((s) => !b.skills.includes(s)) })}>
            <span className="font-display text-lg font-bold">{b.name}</span>
            <dl className="mt-2 space-y-1 text-xs">
              {b.abilities && <div><b>Attribute:</b> {b.abilities.map((a) => AB_NAMES[a]).join(", ")}</div>}
              {b.feat && <div><b>Herkunftstalent:</b> {b.feat}</div>}
              <div><b>Fertigkeiten:</b> {b.skills.map(skillName).join(", ")}</div>
              <div><b>Werkzeug:</b> {b.tool}</div>
              {b.equipment
                ? <div className="text-muted-foreground"><b>Ausrüstung:</b> {b.equipment}, {b.gold} GM{b.abilities ? " · oder 50 GM" : ""}</div>
                : <div className="text-muted-foreground">Ausrüstung bitte selbst ins Inventar eintragen (Spielerhandbuch).</div>}
            </dl>
          </button>
        ))}
      </div>
      {rules.originFeats.length > 0 && (
        <div className="panel">
          <h3 className="mb-2 font-bold">Herkunftstalente (SRD)</h3>
          <ul className="space-y-1 text-sm">
            {rules.originFeats.map((f) => <li key={f.name}><b>{f.name}:</b> <span className="text-muted-foreground">{f.text}</span></li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function SpeciesStep({ c, set }: P) {
  const rules = ruleset(c);
  const sp = speciesOf(c);
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {rules.species.map((s) => (
          <button key={s.id} className="choice" data-active={c.speciesId === s.id}
            onClick={() => set({ speciesId: s.id, speciesOption: undefined, size: s.sizes[0], raceBonusChoice: [], raceSkills: [] })}>
            <span className="font-display text-lg font-bold">{s.name}</span>
            <p className="text-xs text-muted-foreground">{s.sizes.map(sizeName).join(" / ")} · {s.speed} ft</p>
            {s.bonuses && (
              <p className="text-xs text-muted-foreground">
                {Object.entries(s.bonuses).map(([a, v]) => `${AB_SHORT[a as keyof typeof AB_SHORT]} +${v}`).join(", ")}
                {s.chooseBonus && `, ${s.chooseBonus.count}× +${s.chooseBonus.amount} frei`}
              </p>
            )}
          </button>
        ))}
      </div>
      {sp && (
        <div className="panel space-y-4">
          <h3 className="text-xl font-bold">{sp.name}</h3>
          <ul className="space-y-1 text-sm">
            {sp.traits.map((t) => <li key={t.name}><b>{t.name}:</b> <span className="text-muted-foreground">{t.text}</span></li>)}
          </ul>
          {sp.sizes.length > 1 && (
            <label className="block max-w-xs space-y-1"><span className="label">Größe</span>
              <select className="field" value={c.size} onChange={(e) => set({ size: e.target.value })}>
                {sp.sizes.map((s) => <option key={s} value={s}>{sizeName(s)}</option>)}
              </select>
            </label>
          )}
          {sp.options && (
            <div>
              <p className="label mb-2">{sp.optionLabel}</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {sp.options.map((o) => (
                  <button key={o.name} className="choice" data-active={c.speciesOption === o.name} onClick={() => set({ speciesOption: o.name })}>
                    <b>{o.label}</b>
                    <p className="text-xs text-muted-foreground">{o.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SkillStep({ c, set }: P) {
  const d = derive(c);
  const cls = d.cls;
  const bgSkills: string[] = d.bg?.skills ?? [];
  const granted = grantedSkills(c);
  const picked = c.skillProfs.filter((s) => cls?.skillList.includes(s) && !granted.includes(s));
  const toggle = (s: string) =>
    set({ skillProfs: c.skillProfs.includes(s) ? c.skillProfs.filter((x) => x !== s) : [...c.skillProfs, s] });

  const chooseEquip = (choice: "A" | "GP") => {
    if (!d.bg) return;
    set({
      equipmentChoice: choice,
      inventory: choice === "A" ? d.bg.equipment.split(", ").join("\n") : "",
      money: { ...c.money, gp: choice === "A" ? d.bg.gold : 50 },
    });
  };

  return (
    <div className="space-y-6">
      <div className="panel">
        <h3 className="font-bold">Fertigkeiten mit Übung {cls && `(${picked.length}/${cls.skillCount} aus ${cls.name})`}</h3>
        {!cls ? <p className="text-sm text-muted-foreground">Wähle zuerst eine Klasse.</p> : (
          <div className="mt-3 flex flex-wrap gap-2">
            {cls.skillList.map((s) => {
              const fromBg = bgSkills.includes(s);
              const fromRace = !fromBg && granted.includes(s);
              const on = fromBg || fromRace || c.skillProfs.includes(s);
              return (
                <button key={s} disabled={fromBg || fromRace || (!on && picked.length >= cls.skillCount)} onClick={() => toggle(s)}
                  className={`btn btn-sm ${on ? "btn-primary" : ""}`} title={fromBg ? "Durch Hintergrund" : fromRace ? "Durch Volk/Spezies" : ""}>
                  {skillName(s)}{fromBg && " (HG)"}{fromRace && " (Volk)"}
                </button>
              );
            })}
          </div>
        )}
        {bgSkills.length > 0 && <p className="mt-3 text-xs text-muted-foreground">Durch Hintergrund: {bgSkills.map(skillName).join(", ")}. Weitere Übungen (z. B. Mensch: Geschickt, Talent Geübt) kannst du auf dem Bogen setzen.</p>}
      </div>

      {d.sp?.skillChoices && (
        <div className="panel">
          <h3 className="font-bold">Fertigkeiten durch das Volk ({c.raceSkills.length}/{d.sp.skillChoices} aus {d.sp.name})</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {SKILLS.map(({ name: s }) => {
              const on = c.raceSkills.includes(s);
              const taken = !on && (granted.includes(s) || c.skillProfs.includes(s));
              return (
                <button key={s} disabled={taken || (!on && c.raceSkills.length >= d.sp!.skillChoices!)}
                  onClick={() => set({ raceSkills: on ? c.raceSkills.filter((x) => x !== s) : [...c.raceSkills, s] })}
                  className={`btn btn-sm ${on ? "btn-primary" : ""}`}>
                  {skillName(s)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="panel space-y-3">
        <h3 className="font-bold">Ausrüstung des Hintergrunds</h3>
        {!d.bg ? <p className="text-sm text-muted-foreground">Wähle zuerst einen Hintergrund.</p> : !d.bg.equipment ? (
          <p className="text-sm text-muted-foreground">Für {d.bg.name} ist keine Ausrüstung hinterlegt – bitte unten ins Inventar eintragen.</p>
        ) : !d.bg.abilities ? (
          <button className="choice" data-active={c.equipmentChoice === "A"} onClick={() => chooseEquip("A")}>
            <b>Ausrüstung übernehmen</b><p className="text-xs text-muted-foreground">{d.bg.equipment}, {d.bg.gold} GM</p>
          </button>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            <button className="choice" data-active={c.equipmentChoice === "A"} onClick={() => chooseEquip("A")}>
              <b>Option A</b><p className="text-xs text-muted-foreground">{d.bg.equipment}, {d.bg.gold} GM</p>
            </button>
            <button className="choice" data-active={c.equipmentChoice === "GP"} onClick={() => chooseEquip("GP")}>
              <b>Option B</b><p className="text-xs text-muted-foreground">50 GM</p>
            </button>
          </div>
        )}
      </div>

      <div className="panel grid gap-4 sm:grid-cols-2">
        <label className="space-y-1"><span className="label">Rüstung</span>
          <select className="field" value={c.armorId} onChange={(e) => set({ armorId: e.target.value })}>
            <option value="">Keine Rüstung</option>
            {ARMORS.map((a) => (
              <option key={a.id} value={a.id}>{a.name} (RK {a.base}, {ARMOR_TYPE_DE[a.type]}){cls && !cls.armor.includes(a.type) ? " – keine Übung" : ""}</option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" checked={c.shield} onChange={(e) => set({ shield: e.target.checked })} />
          Schild (+2 RK){cls && !cls.shield ? " – keine Übung" : ""}
        </label>
        <p className="text-sm text-muted-foreground sm:col-span-2">Aktuelle RK: <b className="text-primary">{d.ac}</b>{cls && ` · Waffen: ${cls.weapons}`}</p>
        <label className="space-y-1 sm:col-span-2"><span className="label">Inventar</span>
          <textarea className="field min-h-28" value={c.inventory} onChange={(e) => set({ inventory: e.target.value })} />
        </label>
      </div>
    </div>
  );
}

function DetailStep({ c, set }: P) {
  return (
    <div className="panel grid gap-4 sm:grid-cols-2">
      <label className="space-y-1"><span className="label">Name</span>
        <input className="field" value={c.name} onChange={(e) => set({ name: e.target.value })} placeholder="z. B. Thalia Sturmwind" />
      </label>
      <label className="space-y-1"><span className="label">Gesinnung</span>
        <select className="field" value={c.alignment} onChange={(e) => set({ alignment: e.target.value })}>
          <option value="">—</option>
          {ALIGNMENTS.map((a) => <option key={a} value={a}>{alignmentName(a)}</option>)}
        </select>
      </label>
      <label className="space-y-1 sm:col-span-2"><span className="label">Aussehen</span>
        <textarea className="field min-h-24" value={c.appearance} placeholder="z. B. kurzes rotes Haar, Narbe über dem linken Auge, grüner Reisemantel" onChange={(e) => set({ appearance: e.target.value })} />
      </label>
      <PortraitPrompt c={c} />
      <label className="space-y-1 sm:col-span-2"><span className="label">Notizen</span>
        <textarea className="field min-h-32" value={c.notes} onChange={(e) => set({ notes: e.target.value })} />
      </label>
    </div>
  );
}
