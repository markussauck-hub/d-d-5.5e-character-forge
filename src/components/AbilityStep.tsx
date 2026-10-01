import { useState } from "react";
import { ABILITIES, AB_NAMES, POINT_COST, STANDARD_ARRAY, type Ab } from "@/data/rules";
import { getBackground } from "@/data/backgrounds";
import { bgBonus, computedScore, fmt, mod, type Character, type Method } from "@/lib/character";

const d6 = () => 1 + Math.floor(Math.random() * 6);

export function AbilityStep({ c, set }: { c: Character; set: (p: Partial<Character>) => void }) {
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState<number[][]>([]);
  const bg = getBackground(c.backgroundId);
  const pool = c.method === "standard" ? STANDARD_ARRAY : c.rolled;
  const spent = ABILITIES.reduce((s, a) => s + (POINT_COST[c.baseScores[a]] ?? 0), 0);
  const bonus = bgBonus(c);

  const setMethod = (m: Method) => {
    const base = { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 };
    set({ method: m, baseScores: base, assign: { STR: -1, DEX: -1, CON: -1, INT: -1, WIS: -1, CHA: -1 } });
  };

  const assign = (a: Ab, idx: number) => {
    const next = { ...c.assign, [a]: idx };
    const base = { ...c.baseScores };
    ABILITIES.forEach((x) => (base[x] = next[x] >= 0 ? pool[next[x]] : 8));
    set({ assign: next, baseScores: base });
  };

  const roll = () => {
    setRolling(true);
    const final = Array.from({ length: 6 }, () => [d6(), d6(), d6(), d6()]);
    let t = 0;
    const iv = setInterval(() => {
      setDice(Array.from({ length: 6 }, () => [d6(), d6(), d6(), d6()]));
      if (++t > 8) {
        clearInterval(iv);
        setDice(final);
        setRolling(false);
        const totals = final.map((r) => r.reduce((s, x) => s + x, 0) - Math.min(...r));
        set({ rolled: totals, assign: { STR: -1, DEX: -1, CON: -1, INT: -1, WIS: -1, CHA: -1 }, baseScores: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 } });
      }
    }, 80);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {([["standard", "Standard Array"], ["pointbuy", "Point Buy"], ["roll", "Würfeln (4d6)"]] as const).map(([m, l]) => (
          <button key={m} className={`btn ${c.method === m ? "btn-primary" : ""}`} onClick={() => setMethod(m)}>{l}</button>
        ))}
      </div>

      {c.method === "pointbuy" && (
        <p className={`text-sm ${spent > 27 ? "text-destructive" : "text-muted-foreground"}`}>
          Punkte: <b className="text-foreground">{27 - spent}</b> von 27 übrig (Werte 8–15)
        </p>
      )}

      {c.method === "roll" && (
        <div className="panel space-y-3">
          <button className="btn btn-primary" onClick={roll} disabled={rolling}>🎲 {c.rolled.length ? "Neu würfeln" : "Würfeln"}</button>
          <div className="grid gap-2 sm:grid-cols-2">
            {dice.map((r, i) => {
              const lowIdx = r.indexOf(Math.min(...r));
              return (
                <div key={i} className="flex items-center gap-2">
                  {r.map((v, j) => (
                    <span key={j} className={`die ${rolling ? "die-rolling" : ""} ${!rolling && j === lowIdx ? "die-dropped" : ""}`}>{v}</span>
                  ))}
                  {!rolling && <span className="ml-2 font-display text-lg text-primary">= {c.rolled[i]}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ABILITIES.map((a) => {
          const total = computedScore(c, a);
          return (
            <div key={a} className="panel">
              <div className="flex items-baseline justify-between">
                <span className="font-display font-bold">{AB_NAMES[a]}</span>
                <span className="label">{a}</span>
              </div>
              <div className="mt-2">
                {c.method === "pointbuy" ? (
                  <div className="flex items-center gap-2">
                    <button className="btn btn-sm" disabled={c.baseScores[a] <= 8} onClick={() => set({ baseScores: { ...c.baseScores, [a]: c.baseScores[a] - 1 } })}>−</button>
                    <span className="w-8 text-center text-lg font-bold">{c.baseScores[a]}</span>
                    <button className="btn btn-sm" disabled={c.baseScores[a] >= 15 || spent + POINT_COST[c.baseScores[a] + 1] - POINT_COST[c.baseScores[a]] > 27} onClick={() => set({ baseScores: { ...c.baseScores, [a]: c.baseScores[a] + 1 } })}>+</button>
                    <span className="label ml-auto">Kosten {POINT_COST[c.baseScores[a]]}</span>
                  </div>
                ) : (
                  <select className="field" value={c.assign[a]} onChange={(e) => assign(a, Number(e.target.value))} disabled={!pool.length}>
                    <option value={-1}>— wählen —</option>
                    {pool.map((v, i) => {
                      const used = ABILITIES.some((x) => x !== a && c.assign[x] === i);
                      return !used && <option key={i} value={i}>{v}</option>;
                    })}
                  </select>
                )}
              </div>
              <div className="mt-3 flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">{bonus[a] ? `Background ${fmt(bonus[a])}` : ""}</span>
                <span><b className="text-xl text-primary">{total}</b> <span className="text-muted-foreground">({fmt(mod(total))})</span></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel space-y-3">
        <h3 className="font-bold">Background-Bonus {bg ? `(${bg.name}: ${bg.abilities.join(", ")})` : ""}</h3>
        {!bg ? (
          <p className="text-sm text-muted-foreground">Wähle zuerst einen Background.</p>
        ) : (
          <>
            <div className="flex gap-2">
              <button className={`btn btn-sm ${c.bgMode === "21" ? "btn-primary" : ""}`} onClick={() => set({ bgMode: "21" })}>+2 / +1</button>
              <button className={`btn btn-sm ${c.bgMode === "111" ? "btn-primary" : ""}`} onClick={() => set({ bgMode: "111" })}>+1 / +1 / +1</button>
            </div>
            {c.bgMode === "21" && (
              <div className="grid max-w-md grid-cols-2 gap-3">
                <label className="space-y-1"><span className="label">+2 auf</span>
                  <select className="field" value={c.bgPlus2 ?? ""} onChange={(e) => set({ bgPlus2: e.target.value as Ab })}>
                    <option value="">—</option>
                    {bg.abilities.map((a) => <option key={a} value={a}>{AB_NAMES[a]}</option>)}
                  </select>
                </label>
                <label className="space-y-1"><span className="label">+1 auf</span>
                  <select className="field" value={c.bgPlus1 ?? ""} onChange={(e) => set({ bgPlus1: e.target.value as Ab })}>
                    <option value="">—</option>
                    {bg.abilities.filter((a) => a !== c.bgPlus2).map((a) => <option key={a} value={a}>{AB_NAMES[a]}</option>)}
                  </select>
                </label>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Kein Attribut kann über 20 steigen.</p>
          </>
        )}
      </div>
    </div>
  );
}
