import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ABILITIES, AB_NAMES, CONDITIONS, type Ab } from "@/data/rules";
import { featuresAt, isAsiLevel, masteryCount, SUBCLASS_LEVEL } from "@/data/classes";
import { derive, fmt, updateCharacter, useCharacters, useHydratedStore, type Character } from "@/lib/character";

export const Route = createFileRoute("/sheet/$id")({
  head: () => ({
    meta: [
      { title: "Charakterbogen – Heldenschmiede" },
      { name: "description", content: "Charakterbogen mit automatischen Berechnungen, Level-Up und Druckansicht." },
      { property: "og:title", content: "Charakterbogen – Heldenschmiede" },
      { property: "og:description", content: "Charakterbogen für SRD-5.2-Charaktere." },
    ],
  }),
  component: Sheet,
});

function Sheet() {
  const { id } = Route.useParams();
  const c = useCharacters().find((x) => x.id === id);
  const hydrated = useHydratedStore();
  const [levelUp, setLevelUp] = useState(false);
  if (!c) return <main className="p-10 text-center text-muted-foreground">{hydrated ? <>Charakter nicht gefunden. <Link to="/" className="underline">Zur Liste</Link></> : "Lade…"}</main>;
  const set = (p: Partial<Character>) => updateCharacter(id, () => p);
  const d = derive(c);
  const setOv = (k: string, v: number | null) => {
    const o = { ...c.overrides };
    if (v === null || Number.isNaN(v)) delete o[k]; else o[k] = v;
    set({ overrides: o });
  };
  const Ov = ({ k, v, signed, big }: { k: string; v: number; signed?: boolean; big?: boolean }) => {
    const on = k in c.overrides;
    return (
      <span className="inline-flex items-center gap-1">
        <input type="number" title="Wert überschreiben" className={`num ${big ? "text-2xl" : "text-sm"} ${on ? "overridden" : ""}`} style={{ width: big ? "4rem" : "3rem" }}
          value={v} onChange={(e) => setOv(k, e.target.value === "" ? null : Number(e.target.value))} />
        {signed && !on && <span className="sr-only">{fmt(v)}</span>}
        {on && <button className="no-print text-xs text-ember" title="Override entfernen" onClick={() => setOv(k, null)}>↺</button>}
      </span>
    );
  };
  const hp = c.currentHp ?? d.maxHp;
  const withSub = c.hasSubclass && c.level >= SUBCLASS_LEVEL;
  const features = d.cls ? Array.from({ length: c.level }, (_, i) => featuresAt(d.cls!, i + 1, withSub).map((f) => `${i + 1}: ${f}`)).flat() : [];

  return (
    <main className="mx-auto max-w-6xl px-3 py-6">
      <div className="no-print mb-4 flex flex-wrap gap-2">
        <Link to="/" className="btn btn-sm">← Liste</Link>
        <Link to="/wizard/$id" params={{ id }} className="btn btn-sm">Assistent</Link>
        <button className="btn btn-primary btn-sm" disabled={!d.cls || c.level >= 20} onClick={() => setLevelUp(true)}>Level-Up</button>
        <button className="btn btn-sm" onClick={() => window.print()}>Drucken</button>
        <span className="text-xs text-muted-foreground self-center">Zahlen anklicken zum Überschreiben (rot = Override)</span>
      </div>

      <div className="parchment rounded-xl p-4 shadow-2xl sm:p-6">
        <header className="mb-4 grid gap-2 border-b-2 border-border pb-3 sm:grid-cols-[2fr_3fr]">
          <input className="num !text-left font-display text-3xl" value={c.name} placeholder="Name" onChange={(e) => set({ name: e.target.value })} />
          <div className="grid grid-cols-2 gap-x-4 text-sm sm:grid-cols-3">
            <Info l="Klasse & Level" v={d.cls ? `${d.cls.name} ${c.level}${withSub ? ` (${d.cls.subclass})` : ""}` : "—"} />
            <Info l="Species" v={[d.sp?.name, c.speciesOption].filter(Boolean).join(" – ") || "—"} />
            <Info l="Background" v={d.bg?.name ?? "—"} />
            <Info l="Alignment" v={c.alignment || "—"} />
            <Info l="Size" v={c.size ?? "—"} />
            <Info l="Origin Feat" v={d.bg?.feat ?? "—"} />
          </div>
        </header>

        <div className="print-grid grid gap-4 md:grid-cols-3">
          <div className="space-y-4">
            <div className="sheet-box grid grid-cols-3 gap-2">
              {ABILITIES.map((a) => (
                <div key={a} className="rounded-lg border border-border p-2 text-center">
                  <div className="label">{a}</div>
                  <div className="font-display text-xl font-bold">{fmt(d.mods[a])}</div>
                  <Ov k={`score:${a}`} v={d.scores[a]} />
                </div>
              ))}
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Saving Throws</div>
              {ABILITIES.map((a) => (
                <Row key={a} dot={d.saves[a].prof} label={AB_NAMES[a]}><Ov k={`save:${a}`} v={d.saves[a].v} /></Row>
              ))}
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Skills · Proficiency {fmt(d.pb)}</div>
              {d.skills.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <button title="Proficiency" disabled={s.fromBg} className={`h-3 w-3 rounded-full border border-ink ${s.prof ? "bg-ink" : ""}`}
                    onClick={() => set({ skillProfs: c.skillProfs.includes(s.name) ? c.skillProfs.filter((x) => x !== s.name) : [...c.skillProfs, s.name] })} />
                  <button title="Expertise" disabled={!s.prof} className={`h-3 w-3 rotate-45 border border-ember ${s.exp ? "bg-ember" : ""}`}
                    onClick={() => set({ expertise: c.expertise.includes(s.name) ? c.expertise.filter((x) => x !== s.name) : [...c.expertise, s.name] })} />
                  <span className="flex-1">{s.name} <span className="text-xs text-muted-foreground">({s.ab})</span></span>
                  <Ov k={`skill:${s.name}`} v={s.v} />
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm"><span>Passive Perception</span><Ov k="passive" v={d.passive} /></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Big l="AC"><Ov k="ac" v={d.ac} big /></Big>
              <Big l="Initiative"><Ov k="init" v={d.initiative} big /></Big>
              <Big l="Speed"><Ov k="speed" v={d.speed} big /></Big>
            </div>
            <div className="sheet-box space-y-2">
              <div className="sheet-title">Hit Points</div>
              <div className="flex items-center justify-between text-sm"><span>Max HP</span><Ov k="maxHp" v={d.maxHp} /></div>
              <div className="flex items-center justify-between text-sm"><span>Aktuell</span>
                <span className="flex items-center gap-1">
                  <button className="no-print btn btn-sm" onClick={() => set({ currentHp: Math.max(0, hp - 1) })}>−</button>
                  <input type="number" className="num text-2xl" style={{ width: "4rem" }} value={hp} onChange={(e) => set({ currentHp: Number(e.target.value) })} />
                  <button className="no-print btn btn-sm" onClick={() => set({ currentHp: Math.min(d.maxHp, hp + 1) })}>+</button>
                </span>
              </div>
              <div className="flex items-center justify-between text-sm"><span>Temp HP</span>
                <input type="number" className="num" style={{ width: "3rem" }} value={c.tempHp} onChange={(e) => set({ tempHp: Number(e.target.value) })} />
              </div>
              <div className="flex items-center justify-between text-sm"><span>Hit Dice (d{d.hd})</span>
                <span>verbraucht <input type="number" min={0} max={c.level} className="num" style={{ width: "2.5rem" }} value={c.hitDiceUsed} onChange={(e) => set({ hitDiceUsed: Number(e.target.value) })} /> / {c.level}</span>
              </div>
              <div className="flex justify-between text-sm">
                {(["s", "f"] as const).map((k) => (
                  <span key={k} className="flex items-center gap-1">{k === "s" ? "Erfolge" : "Fehlschläge"}
                    {[1, 2, 3].map((n) => (
                      <input key={n} type="checkbox" checked={c.deathSaves[k] >= n} onChange={() => set({ deathSaves: { ...c.deathSaves, [k]: c.deathSaves[k] >= n ? n - 1 : n } })} />
                    ))}
                  </span>
                ))}
              </div>
              <button className="no-print btn btn-sm w-full" onClick={() => set({ currentHp: null, tempHp: 0, hitDiceUsed: Math.max(0, c.hitDiceUsed - Math.max(1, Math.floor(c.level / 2))), deathSaves: { s: 0, f: 0 }, slotsUsed: [], exhaustion: Math.max(0, c.exhaustion - 1) })}>Long Rest</button>
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Conditions</div>
              <div className="flex flex-wrap gap-1">
                {CONDITIONS.map((x) => (
                  <button key={x} className={`rounded border px-1.5 py-0.5 text-xs ${c.conditions.includes(x) ? "border-ember bg-ember text-parchment" : "border-border"}`}
                    onClick={() => set({ conditions: c.conditions.includes(x) ? c.conditions.filter((y) => y !== x) : [...c.conditions, x] })}>{x}</button>
                ))}
              </div>
              <label className="mt-2 flex items-center justify-between text-sm">Exhaustion (−{c.exhaustion * 2} auf d20-Tests)
                <select className="field !w-16" value={c.exhaustion} onChange={(e) => set({ exhaustion: Number(e.target.value) })}>
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
                </select>
              </label>
            </div>
            {d.cls?.spellAbility && (
              <div className="sheet-box">
                <div className="sheet-title">Spellcasting ({d.cls.spellAbility})</div>
                <div className="flex justify-between text-sm"><span>Spell Save DC</span><Ov k="spellDc" v={d.spellDc!} /></div>
                <div className="flex justify-between text-sm"><span>Spell Attack</span><Ov k="spellAtk" v={d.spellAtk!} /></div>
                <div className="mt-2 space-y-1">
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
                <textarea className="field mt-2 min-h-28" placeholder="Zauber (ein Eintrag pro Zeile)" value={c.spells} onChange={(e) => set({ spells: e.target.value })} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="sheet-box">
              <div className="sheet-title">Features & Traits</div>
              <ul className="max-h-80 space-y-0.5 overflow-auto text-sm print:max-h-none">
                {features.map((f) => <li key={f}>{f}</li>)}
                {d.sp?.traits.map((t) => <li key={t.name} className="text-muted-foreground">{t.name} ({d.sp!.name})</li>)}
                {d.bg && <li className="text-muted-foreground">{d.bg.feat} (Origin Feat)</li>}
                {c.feats.map((f, i) => <li key={i}>Feat/ASI: {f}</li>)}
              </ul>
              {d.cls && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Weapons: {d.cls.weapons} · Armor: {d.cls.armor.join(", ") || "keine"}{d.cls.shield ? ", Shields" : ""}
                  {masteryCount(d.cls, c.level) > 0 && ` · Weapon Mastery: ${masteryCount(d.cls, c.level)}`}
                  {d.bg && ` · Tool: ${d.bg.tool}`}
                </p>
              )}
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Geld</div>
              <div className="grid grid-cols-5 gap-1 text-center">
                {(["cp", "sp", "ep", "gp", "pp"] as const).map((k) => (
                  <label key={k}><span className="label">{k.toUpperCase()}</span>
                    <input type="number" className="num" value={c.money[k]} onChange={(e) => set({ money: { ...c.money, [k]: Number(e.target.value) } })} />
                  </label>
                ))}
              </div>
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Inventar</div>
              <textarea className="field min-h-32" value={c.inventory} onChange={(e) => set({ inventory: e.target.value })} />
            </div>
            <div className="sheet-box">
              <div className="sheet-title">Aussehen & Notizen</div>
              <textarea className="field min-h-20" value={c.appearance} placeholder="Aussehen" onChange={(e) => set({ appearance: e.target.value })} />
              <textarea className="field mt-2 min-h-24" value={c.notes} placeholder="Notizen" onChange={(e) => set({ notes: e.target.value })} />
            </div>
          </div>
        </div>
      </div>
      {levelUp && <LevelUp c={c} onClose={() => setLevelUp(false)} />}
    </main>
  );
}

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
  const [sub, setSub] = useState(c.hasSubclass || L === SUBCLASS_LEVEL);
  const [mode, setMode] = useState<"2" | "11" | "feat">("2");
  const [a1, setA1] = useState<Ab>("STR");
  const [a2, setA2] = useState<Ab>("DEX");
  const [feat, setFeat] = useState("");
  const asi = isAsiLevel(cls, L);
  const feats = featuresAt(cls, L, sub && L >= SUBCLASS_LEVEL);

  const apply = () => {
    const rolls = [...c.hpRolls]; rolls[L - 2] = hp;
    const p: Partial<Character> = { level: L, hpRolls: rolls, hasSubclass: sub };
    if (asi) {
      if (mode === "feat") p.feats = [...c.feats, feat || "Feat"];
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
        <h2 className="text-2xl font-bold text-primary">{cls.name} Level {L}</h2>
        <div><p className="label">Neue Features</p>
          <ul className="list-disc pl-5 text-sm">{feats.length ? feats.map((f) => <li key={f}>{f}</li>) : <li>Keine neuen Klassenfeatures</li>}</ul>
          {d.slots.length > 0 && <p className="mt-1 text-xs text-muted-foreground">Spell Slots werden automatisch aktualisiert.</p>}
        </div>
        {L === SUBCLASS_LEVEL && (
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sub} onChange={(e) => setSub(e.target.checked)} /> Subklasse zuweisen: <b>{cls.subclass}</b></label>
        )}
        <div><p className="label">Hit Points (d{cls.hitDie} + CON {fmt(d.mods.CON)})</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <button className="btn btn-sm" onClick={() => setHp(avg)}>Durchschnitt ({avg})</button>
            <button className="btn btn-sm" onClick={() => setHp(1 + Math.floor(Math.random() * cls.hitDie))}>🎲 Würfeln</button>
            <input type="number" min={1} max={cls.hitDie} className="field !w-20" value={hp} onChange={(e) => setHp(Number(e.target.value))} />
            <span className="text-sm">= +{Math.max(1, hp + d.mods.CON)} HP</span>
          </div>
        </div>
        {asi && (
          <div className="space-y-2"><p className="label">Ability Score Improvement oder Feat</p>
            <div className="flex gap-2">
              {([["2", "+2"], ["11", "+1 / +1"], ["feat", "Feat"]] as const).map(([m, l]) => (
                <button key={m} className={`btn btn-sm ${mode === m ? "btn-primary" : ""}`} onClick={() => setMode(m)}>{l}</button>
              ))}
            </div>
            {mode === "feat" ? <input className="field" placeholder="Feat-Name & Notiz" value={feat} onChange={(e) => setFeat(e.target.value)} /> : (
              <div className="flex gap-2">
                <select className="field" value={a1} onChange={(e) => setA1(e.target.value as Ab)}>{ABILITIES.map((a) => <option key={a}>{a}</option>)}</select>
                {mode === "11" && <select className="field" value={a2} onChange={(e) => setA2(e.target.value as Ab)}>{ABILITIES.filter((a) => a !== a1).map((a) => <option key={a}>{a}</option>)}</select>}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Maximum 20.</p>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={apply}>Level {L} übernehmen</button>
        </div>
      </div>
    </div>
  );
}
