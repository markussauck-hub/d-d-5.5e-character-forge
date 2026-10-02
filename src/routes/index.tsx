import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import {
  deleteCharacter, download, importCharacters, newCharacter, saveCharacter, useCharacters, useHydratedStore,
} from "@/lib/character";
import { getClass } from "@/data/classes";
import { getSpecies } from "@/data/species";
import { getBackground } from "@/data/backgrounds";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heldenschmiede – Deine Charaktere (D&D 5.5e SRD)" },
      { name: "description", content: "Charaktere für die SRD-5.2-Regeln erstellen, verwalten, leveln und drucken." },
      { property: "og:title", content: "Heldenschmiede – Charaktereditor 5.5e" },
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

  const create = () => {
    const c = newCharacter();
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
      <header className="mb-10 text-center">
        <p className="label mb-2">Regeln 2024 · SRD 5.2</p>
        <h1 className="text-4xl font-bold text-primary sm:text-5xl">Heldenschmiede</h1>
        <p className="mt-3 text-muted-foreground">Erschaffe, verwalte und levele deine Abenteurer.</p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={create}>+ Neuer Charakter</button>
        <button className="btn" onClick={() => download("charaktere.json", chars)} disabled={!chars.length}>
          Alle exportieren
        </button>
        <button className="btn" onClick={() => fileRef.current?.click()}>JSON importieren</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => { onImport(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      {hydrated && chars.length === 0 && (
        <div className="panel py-14 text-center text-muted-foreground">
          <p className="font-display text-xl text-foreground">Noch keine Helden</p>
          <p className="mt-2 text-sm">Lege deinen ersten Charakter an, um loszulegen.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chars.map((c) => {
          const cls = getClass(c.classId);
          return (
            <article key={c.id} className="panel flex flex-col gap-3">
              <div>
                <h2 className="text-lg font-bold">{c.name || "Unbenannt"}</h2>
                <p className="text-sm text-muted-foreground">
                  {[getSpecies(c.speciesId)?.name, cls ? `${cls.name} ${c.level}` : null, getBackground(c.backgroundId)?.name]
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
