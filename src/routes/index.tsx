import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import {
  deleteCharacter, download, importCharacters, newCharacter, saveCharacter, useCharacters, useHydratedStore,
} from "@/lib/character";
import { CastleGate } from "@/components/CastleGate";
import { backgroundOf, classOf, EDITION_LABEL, speciesOf, type Edition } from "@/data/edition";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heldenschmiede – Deine Charaktere (D&D 5e & 5.5e)" },
      { name: "description", content: "Charaktere für D&D 5e (2014) und 5.5e (2024) erstellen, verwalten, leveln und drucken." },
      { property: "og:title", content: "Heldenschmiede – Charaktereditor 5e & 5.5e" },
      { property: "og:description", content: "Charaktere für die SRD-5.2-Regeln erstellen, verwalten, leveln und drucken." },
    ],
  }),
  component: Index,
});

function Index() {
  const chars = useCharacters();
  const hydrated = useHydratedStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const create = (edition: Edition) => {
    const c = newCharacter(edition);
    saveCharacter(c);
    navigate({ to: "/wizard/$id", params: { id: c.id } });
  };

  const onImport = async (file?: File) => {
    if (!file) return;
    try {
      const n = importCharacters(JSON.parse(await file.text()));
      alert(`${n} Charakter(e) importiert.`);
    } catch {
      alert("Datei konnte nicht gelesen werden.");
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-4 text-center">
        <h1 className="text-4xl font-bold text-primary sm:text-5xl">Heldenschmiede</h1>
        <p className="mt-3 text-muted-foreground">Wähle ein Tor, um einen neuen Helden zu erschaffen.</p>
      </header>

      <CastleGate onEnter={create} />

      <div className="mb-6 mt-14 flex flex-wrap items-baseline justify-between gap-3 border-t border-border pt-8">
        <h2 className="text-2xl font-bold">Deine Helden</h2>
        <div className="flex flex-wrap gap-2">
        <button className="btn" onClick={() => download("charaktere.json", chars)} disabled={!chars.length}>
          Alle exportieren
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>JSON importieren</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { onImport(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
      </div>

      {hydrated && chars.length === 0 && (
        <div className="panel py-14 text-center text-muted-foreground">
          <p className="font-display text-xl text-foreground">Noch keine Helden</p>
          <p className="mt-2 text-sm">Tritt oben durch eines der beiden Tore, um deinen ersten Charakter anzulegen.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chars.map((c) => {
          const cls = classOf(c);
          return (
            <article key={c.id} className="panel flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-bold">{c.name || "Unbenannt"} <span className="label align-middle">{EDITION_LABEL[c.edition]}</span></h2>
                <p className="text-sm text-muted-foreground">
                  {[speciesOf(c)?.name, cls ? `${cls.name} ${c.level}` : null, backgroundOf(c)?.name]
                    .filter(Boolean).join(" · ") || "In Erstellung"}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <Link to="/sheet/$id" params={{ id: c.id }} className="btn btn-primary btn-sm">Öffnen</Link>
                <Link to="/wizard/$id" params={{ id: c.id }} className="btn btn-sm">Assistent</Link>
                <button className="btn btn-sm" onClick={() => saveCharacter({ ...structuredClone(c), id: crypto.randomUUID(), name: `${c.name || "Unbenannt"} (Kopie)` })}>
                  Duplizieren
                </button>
                <button className="btn btn-sm" onClick={() => download(`${c.name || "charakter"}.json`, c)}>Exportieren</button>
                <button className="btn btn-danger btn-sm" onClick={() => confirm(`„${c.name || "Unbenannt"}“ löschen?`) && deleteCharacter(c.id)}>
                  Löschen
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
