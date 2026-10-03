import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ABILITIES, AB_NAMES, AB_SHORT, ARMOR_TYPE_DE, CONDITIONS, alignmentName, conditionName, sizeName, skillName, type Ab,
} from "@/data/rules";
import { featuresAt, isAsiLevel, masteryCount } from "@/data/classes";
import { EDITION_LABEL, ruleset } from "@/data/edition";
import { speciesOptionLabel } from "@/data/species";
import { abilityIssues, derive, skillIssues, fmt, updateCharacter, useCharacters, useHydratedStore, type Character } from "@/lib/character";

export const Route = createFileRoute("/sheet/$id")({
  head: () => ({
    meta: [
      { title: "Charakterbogen – Heldenschmiede" },
      { name: "description", content: "Charakterbogen mit automatischen Berechnungen, Stufenaufstieg und Druckansicht." },
      { property: "og:title", content: "Charakterbogen – Heldenschmiede" },
      { property: "og:description", content: "Charakterbogen für SRD-5.2-Charaktere." },
    ],
  }),
  component: Sheet,
});

/** Überschreibbares Zahlenfeld. Bewusst außerhalb von Sheet definiert, damit der Fokus beim Tippen erhalten bleibt. */
function OvField({ v, on, signed, big, onSet }: {
  v: number; on: boolean; signed?: boolean | undefined; big?: boolean | undefined; onSet: (v: number | null) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (signed ? fmt(v) : String(v));
  return (
    <span className="inline-flex items-center gap-1">
      <input type="text" inputMode="numeric" title="Wert überschreiben"
        className={`num ${big ? "text-2xl" : "text-sm"} ${on ? "overridden" : ""}`} style={{ width: big ? "4rem" : "3rem" }}
        value={shown}
        onFocus={() => setDraft(String(v))}
        onBlur={() => setDraft(null)}
        onChange={(e) => {
          setDraft(e.target.value);
          const raw = e.target.value.trim();
          if (raw === "" || raw === "-" || raw === "+") return;
          const n = Number(raw);
          if (!Number.isNaN(n)) onSet(n);
        }} />
      {on && <button className="no-print text-xs text-ember" title="Überschreibung entfernen" onClick={() => onSet(null)}>↺</button>}
    </span>
  );
}

function Sheet() {
  const { id } = Route.useParams();
  const c = useCharacters().find((x) => x.id === id);
  const hydrated = useHydratedStore();
  const [levelUp, setLevelUp] = useState(false);
  if (!c) return <main className="p-10 text-center text-muted-foreground">{hydrated ? <>Charakter nicht gefunden. <Link to="/" className="underline">Zur Liste</Link></> : "Lade…"}</main>;
  const set = (p: Partial<Character>) => updateCharacter(id, () => p);
  const d = derive(c);
  const aIssues = abilityIssues(c);
  const sIssues = skillIssues(c);
  const issues = [...aIssues, ...sIssues];
  const setOv = (k: string, v: number | null) => {
    const o = { ...c.overrides };
    if (v === null || Number.isNaN(v)) delete o[k]; else o[k] = v;
    set({ overrides: o });
  };
  // Als Funktion (nicht als Komponente) aufgerufen, damit React OvField nicht bei jedem Rendern neu mountet.
  const ov = (k: string, v: number, opts: { signed?: boolean; big?: boolean } = {}) => (
    <OvField key={k} v={v} on={k in c.overrides} signed={opts.signed} big={opts.big} onSet={(n) => setOv(k, n)} />
  );
  const hp = c.currentHp ?? d.maxHp;
  const sub = d.cls && c.level >= d.cls.subclassLevel ? d.sub : undefined;
  const features = d.cls ? Array.from({ length: c.level }, (_, i) => featuresAt(d.cls!, i + 1, sub).map((f) => `${i + 1}: ${f}`)).flat() : [];
  const exhaustion2014 = ["—", "Nachteil auf Attributswürfe", "+ Bewegungsrate halbiert", "+ Nachteil auf Angriffs- und Rettungswürfe",
    "+ TP-Maximum halbiert", "+ Bewegungsrate 0", "Tod"];

  return (
    <main className="mx-auto max-w-6xl px-3 py-6">
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <Link to="/" className="btn btn-sm">← Liste</Link>
        <Link to="/wizard/$id" params={{ id }} className="btn btn-sm">Assistent</Link>
        <button className="btn btn-primary btn-sm" disabled={!d.cls || c.level >= 20} onClick={() => setLevelUp(true)}>Stufenaufstieg</button>
        <button className="btn btn-sm" onClick={() => window.print()}>Drucken</button>
        <span className="text-xs text-muted-foreground self-center">Zahlen anklicken zum Überschreiben (rot = überschrieben)</span>
      </div>

      {issues.length > 0 && (
        <div className="no-print mb-4 rounded-lg border border-ember bg-ember/10 p-3 text-sm">
          <b>Charakter unvollständig:</b>
          <ul className="ml-5 list-disc">{issues.map((i) => <li key={i}>{i}</li>)}</ul>
          <Link to="/wizard/$id" params={{ id }} className="underline">
            Im Assistenten ergänzen{aIssues.length ? " (Attribute)" : ""}{sIssues.length ? " (Fertigkeiten & Ausrüstung)" : ""} →
          </Link>
        </div>
      )}

      <div className="parchment rounded-xl p-4 shadow-2xl sm:p-6">
        <header className="mb-4 grid gap-2 border-b-2 border-border pb-3 sm:grid-cols-[2fr_3fr]">
          <input className="num !text-left font-display text-3xl" value={c.name} placeholder="Name" onChange={(e) => set({ name: e.target.value })} />
          <div className="grid grid-cols-2 gap-x-4 text-sm sm:grid-cols-3">
            <Info l={`Klasse & Stufe · ${EDITION_LABEL[c.edition]}`} v={d.cls ? `${d.cls.name} ${c.level}${sub ? ` (${sub.name})` : ""}` : "—"} />
            <Info l={ruleset(c).speciesTerm} v={[d.sp?.name, speciesOptionLabel(d.sp, c.speciesOption)].filter(Boolean).join(" – ") || "—"} />
            <Info l="Hintergrund" v={d.bg?.name ?? "—"} />
            <Info l="Gesinnung" v={c.alignment ? alignmentName(c.alignment) : "—"} />
            <Info l="Größe" v={c.size ? sizeName(c.size) : "—"} />
            {c.edition === "2024" && <Info l="Herkunftstalent" v={d.bg?.feat ?? "—"} />}
          </div>
        </header>

        <div className="print-grid grid gap-4 md:grid-cols-3">
          <div className="space-y-4">
            <div className="sheet-box grid grid-cols-3 gap-2">
              {ABILITIES.map((a) => (
                <div key={a} className="rounded-lg border border-border p-2 text-center" title={AB_NAMES[a]}>
                  <div className="label">{AB_SHORT[a]}</div>
                  <div className="font-display text-xl font-bold">{fmt(d.mods[a])}</div>
                  {ov(`score:${a}`, d.scores[a])}
                </div>
              ))}
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Rettungswürfe</div>
              {ABILITIES.map((a) => (
                <Row key={a} dot={d.saves[a].prof} label={AB_NAMES[a]}>{ov(`save:${a}`, d.saves[a].v, { signed: true })}</Row>
              ))}
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Fertigkeiten · Übungsbonus {fmt(d.pb)}</div>
              {d.skills.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <button title="Übung" disabled={s.fromBg} className={`h-3 w-3 rounded-full border border-ink ${s.prof ? "bg-ink" : ""}`}
                    onClick={() => set({ skillProfs: c.skillProfs.includes(s.name) ? c.skillProfs.filter((x) => x !== s.name) : [...c.skillProfs, s.name] })} />
                  <button title="Expertise" disabled={!s.prof} className={`h-3 w-3 rotate-45 border border-ember ${s.exp ? "bg-ember" : ""}`}
                    onClick={() => set({ expertise: c.expertise.includes(s.name) ? c.expertise.filter((x) => x !== s.name) : [...c.expertise, s.name] })} />
                  <span className="flex-1">{skillName(s.name)} <span className="text-xs text-muted-foreground">({AB_SHORT[s.ab]})</span></span>
                  {ov(`skill:${s.name}`, s.v, { signed: true })}
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm"><span>Passive Wahrnehmung</span>{ov("passive", d.passive)}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Big l="RK">{ov("ac", d.ac, { big: true })}</Big>
              <Big l="Initiative">{ov("init", d.initiative, { signed: true, big: true })}</Big>
              <Big l="Bewegung">{ov("speed", d.speed, { big: true })}</Big>
            </div>
            <div className="sheet-box space-y-2">
              <div className="sheet-title">Trefferpunkte</div>
              <div className="flex items-center justify-between text-sm"><span>Maximale TP</span>{ov("maxHp", d.maxHp)}</div>
              <div className="flex items-center justify-between text-sm"><span>Aktuell</span>
                <span className="flex items-center gap-1">
                  <button className="no-print btn btn-sm" onClick={() => set({ currentHp: Math.max(0, hp - 1) })}>−</button>
                  <input type="number" className="num text-2xl" style={{ width: "4rem" }} value={hp} onChange={(e) => set({ currentHp: Number(e.target.value) })} />
                  <button className="no-print btn btn-sm" onClick={() => set({ currentHp: Math.min(d.maxHp, hp + 1) })}>+</button>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm"><span>Temporäre TP</span>
                <input type="number" className="num" style={{ width: "3rem" }} value={c.tempHp} onChange={(e) => set({ tempHp: Number(e.target.value) })} />
              </div>
              <div className="flex items-center justify-between text-sm"><span>Trefferwürfel (W{d.hd})</span>
                <span>verbraucht <input type="number" min={0} max={c.level} className="num" style={{ width: "2.5rem" }} value={c.hitDiceUsed} onChange={(e) => set({ hitDiceUsed: Number(e.target.value) })} /> / {c.level}</span>
              </div>
              <div className="text-sm">
                <div className="label mb-1">Todesrettungswürfe</div>
                <div className="flex justify-between">
                  {(["s", "f"] as const).map((k) => (
                    <span key={k} className="flex items-center gap-1">{k === "s" ? "Erfolge" : "Fehlschläge"}
                      {[1, 2, 3].map((n) => (
                        <input key={n} type="checkbox" checked={c.deathSaves[k] >= n} onChange={() => set({ deathSaves: { ...c.deathSaves, [k]: c.deathSaves[k] >= n ? n - 1 : n } })} />
                      ))}
                    </span>
                  ))}
                </div>
              </div>
              <button className="no-print btn btn-sm w-full" onClick={() => set({ currentHp: null, tempHp: 0, hitDiceUsed: Math.max(0, c.hitDiceUsed - Math.max(1, Math.floor(c.level / 2))), deathSaves: { s: 0, f: 0 }, slotsUsed: [], exhaustion: Math.max(0, c.exhaustion - 1) })}>Lange Rast</button>
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Zustände</div>
              <div className="flex flex-wrap gap-1">
                {CONDITIONS.map((x) => (
                  <button key={x} className={`rounded border px-1.5 py-0.5 text-xs ${c.conditions.includes(x) ? "border-ember bg-ember text-parchment" : "border-border"}`}
                    onClick={() => set({ conditions: c.conditions.includes(x) ? c.conditions.filter((y) => y !== x) : [...c.conditions, x] })}>{conditionName(x)}</button>
                ))}
              </div>
              <label className="mt-2 flex items-center justify-between gap-2 text-sm">Erschöpfung ({c.edition === "2014" ? exhaustion2014[c.exhaustion] : `−${c.exhaustion * 2} auf W20-Tests`})
                <select className="field !w-16" value={c.exhaustion} onChange={(e) => set({ exhaustion: Number(e.target.value) })}>
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
                </select>
              </label>
            </div>
            {d.cls?.spellAbility && (
              <div className="sheet-box">
                <div className="sheet-title">Zauberwirken ({AB_NAMES[d.cls.spellAbility]})</div>
                <div className="flex justify-between text-sm"><span>Zauberrettungswurf-SG</span>{ov("spellDc", d.spellDc!)}</div>
                <div className="flex justify-between text-sm"><span>Zauberangriffsbonus</span>{ov("spellAtk", d.spellAtk!, { signed: true })}</div>
                <div className="mt-2 space-y-1">
                  <div className="label">Zauberplätze</div>
                  {d.slots.map((n, i) => n > 0 && (
                    <div key={i} className="flex items-center gap-2 text-sm"><span className="w-14">Grad {i + 1}</span>
                      {Array.from({ length: n }, (_, j) => (
                        <input key={j} type="checkbox" checked={(c.slotsUsed[i] ?? 0) > j} onChange={() => {
                          const u = [...c.slotsUsed]; u[i] = (u[i] ?? 0) > j ? j : j + 1; set({ slotsUsed: u });
                        }} />
                      ))}
                    </div>
                  ))}
                </div>
                <PrintableText className="field mt-2 min-h-28" placeholder="Zauber (ein Eintrag pro Zeile)" value={c.spells} onChange={(v) => set({ spells: v })} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="sheet-box">
              <div className="sheet-title">Merkmale & Fähigkeiten</div>
              <ul className="max-h-80 space-y-0.5 overflow-auto text-sm print:max-h-none">
                {features.map((f) => <li key={f}>{f}</li>)}
                {d.sp?.traits.map((t) => <li key={t.name} className="text-muted-foreground">{t.name} ({d.sp!.name})</li>)}
                {d.bg?.feat && <li className="text-muted-foreground">{d.bg.feat} (Herkunftstalent)</li>}
                {sub && !sub.features && <li className="text-muted-foreground">Merkmale von {sub.name}: siehe Spielerhandbuch</li>}
                {c.feats.map((f, i) => <li key={i}>Talent: {f}</li>)}
              </ul>
              {d.cls && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Waffen: {d.cls.weapons} · Rüstung: {d.cls.armor.map((a) => ARMOR_TYPE_DE[a]).join(", ") || "keine"}{d.cls.shield ? ", Schilde" : ""}
                  {masteryCount(d.cls, c.level) > 0 && ` · Waffenbeherrschung: ${masteryCount(d.cls, c.level)}`}
                  {d.bg && ` · Werkzeug: ${d.bg.tool}`}
                </p>
              )}
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Geld</div>
              <div className="grid grid-cols-5 gap-1 text-center">
                {([["cp", "KM"], ["sp", "SM"], ["ep", "EM"], ["gp", "GM"], ["pp", "PM"]] as const).map(([k, l]) => (
                  <label key={k}><span className="label">{l}</span>
                    <input type="number" className="num" value={c.money[k]} onChange={(e) => set({ money: { ...c.money, [k]: Number(e.target.value) } })} />
                  </label>
                ))}
              </div>
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Inventar</div>
              <PrintableText className="field min-h-32" value={c.inventory} onChange={(v) => set({ inventory: v })} />
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Aussehen & Notizen</div>
              <PrintableText className="field min-h-20" value={c.appearance} placeholder="Aussehen" onChange={(v) => set({ appearance: v })} />
              <PrintableText className="field mt-2 min-h-24" value={c.notes} placeholder="Notizen" onChange={(v) => set({ notes: v })} />
            </div>
          </div>
        </div>
      </div>
      {levelUp && <LevelUp c={c} onClose={() => setLevelUp(false)} />}
    </main>
  );
}

/** Textfeld am Bildschirm; im Druck vollständiger Text statt abgeschnittener, scrollender Textarea. */
const PrintableText = ({ value, onChange, placeholder, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className: string;
}) => (
  <>
    <textarea className={`screen-only ${className}`} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    <div className="print-only whitespace-pre-wrap text-sm">{value}</div>
  </>
);
const Info = ({ l, v }: { l: string; v: string }) => (<div><div className="label">{l}</div><div className="font-semibold">{v}</div></div>);
const Big = ({ l, children }: { l: string; children: React.ReactNode }) => (<div className="sheet-box text-center"><div className="label">{l}</div>{children}</div>);
const Row = ({ dot, label, children }: { dot: boolean; label: string; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-sm"><span className={`h-3 w-3 rounded-full border border-ink ${dot ? "bg-ink" : ""}`} /><span className="flex-1">{label}</span>{children}</div>
);

function LevelUp({ c, onClose }: { c: Character; onClose: () => void }) {
  const d = derive(c);
  const cls = d.cls!;
  const L = c.level + 1;
  const avg = cls.hitDie / 2 + 1;
  const [hp, setHp] = useState(avg);
  const pickSub = L === cls.subclassLevel;
  const [subId, setSubId] = useState<string | undefined>(c.hasSubclass ? (c.subclassId ?? cls.subclasses[0]!.id) : pickSub ? cls.subclasses[0]!.id : undefined);
  const sub = cls.subclasses.find((s) => s.id === subId);
  const [mode, setMode] = useState<"2" | "11" | "feat">("2");
  const [a1, setA1] = useState<Ab>("STR");
  const [a2, setA2] = useState<Ab>("DEX");
  const [feat, setFeat] = useState("");
  const asi = isAsiLevel(cls, L);
  const feats = featuresAt(cls, L, sub);

  const apply = () => {
    const rolls = [...c.hpRolls]; rolls[L - 2] = hp;
    const p: Partial<Character> = { level: L, hpRolls: rolls, hasSubclass: !!sub, subclassId: sub?.id };
    if (asi) {
      if (mode === "feat") p.feats = [...c.feats, feat || "Talent"];
      else {
        const n = { ...c.asi };
        if (mode === "2") n[a1] += 2; else { n[a1] += 1; n[a2] += 1; }
        p.asi = n;
      }
    }
    updateCharacter(c.id, () => p);
    onClose();
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="panel w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-primary">{cls.name} Stufe {L}</h2>
        <div><p className="label">Neue Merkmale</p>
          <ul className="list-disc pl-5 text-sm">{feats.length ? feats.map((f) => <li key={f}>{f}</li>) : <li>Keine neuen Klassenmerkmale</li>}</ul>
          {d.slots.length > 0 && <p className="mt-1 text-xs text-muted-foreground">Zauberplätze werden automatisch aktualisiert.</p>}
        </div>
        {pickSub && (
          <label className="block space-y-1 text-sm"><span className="label">Unterklasse wählen</span>
            <select className="field" value={subId ?? ""} onChange={(e) => setSubId(e.target.value || undefined)}>
              {cls.subclasses.map((s) => <option key={s.id} value={s.id}>{s.name}{s.features ? " (SRD)" : " – Merkmale siehe Spielerhandbuch"}</option>)}
            </select>
          </label>
        )}
        <div><p className="label">Trefferpunkte (W{cls.hitDie} + KO {fmt(d.mods.CON)})</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <button className="btn btn-sm" onClick={() => setHp(avg)}>Durchschnitt ({avg})</button>
            <button className="btn btn-sm" onClick={() => setHp(1 + Math.floor(Math.random() * cls.hitDie))}>🎲 Würfeln</button>
            <input type="number" min={1} max={cls.hitDie} className="field !w-20" value={hp} onChange={(e) => setHp(Number(e.target.value))} />
            <span className="text-sm">= +{Math.max(1, hp + d.mods.CON)} TP</span>
          </div>
        </div>
        {asi && (
          <div className="space-y-2"><p className="label">Attributswerterhöhung oder Talent</p>
            <div className="flex gap-2">
              {([["2", "+2"], ["11", "+1 / +1"], ["feat", "Talent"]] as const).map(([m, l]) => (
                <button key={m} className={`btn btn-sm ${mode === m ? "btn-primary" : ""}`} onClick={() => setMode(m)}>{l}</button>
              ))}
            </div>
            {mode === "feat" ? <input className="field" placeholder="Name des Talents & Notiz" value={feat} onChange={(e) => setFeat(e.target.value)} /> : (
              <div className="flex gap-2">
                <select className="field" value={a1} onChange={(e) => setA1(e.target.value as Ab)}>{ABILITIES.map((a) => <option key={a} value={a}>{AB_NAMES[a]}</option>)}</select>
                {mode === "11" && <select className="field" value={a2} onChange={(e) => setA2(e.target.value as Ab)}>{ABILITIES.filter((a) => a !== a1).map((a) => <option key={a} value={a}>{AB_NAMES[a]}</option>)}</select>}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Maximum 20.</p>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={apply}>Stufe {L} übernehmen</button>
        </div>
      </div>
    </div>
  );
}
