import { useRef, useState } from "react";
import type { Character } from "@/lib/character";
import {
  buildPortraitPrompt, FRAMING_LABELS, STYLE_LABELS, type PromptFraming, type PromptLang, type PromptStyle,
} from "@/lib/portrait-prompt";

/** Erzeugt einen kopierbaren Prompt für eine Bild-KI aus den Charakterdaten. */
export function PortraitPrompt({ c }: { c: Character }) {
  const [lang, setLang] = useState<PromptLang>("de");
  const [style, setStyle] = useState<PromptStyle>("painting");
  const [framing, setFraming] = useState<PromptFraming>("portrait");
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const prompt = buildPortraitPrompt(c, lang, style, framing);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // Fallback für Browser ohne Clipboard-API (z. B. ohne HTTPS)
      ref.current?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 sm:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <span className="label">Prompt für Charakterbild</span>
        <div className="flex flex-wrap gap-2">
          <select className="field !w-auto" value={style} onChange={(e) => setStyle(e.target.value as PromptStyle)} aria-label="Stil">
            {(Object.keys(STYLE_LABELS) as PromptStyle[]).map((s) => <option key={s} value={s}>{STYLE_LABELS[s]}</option>)}
          </select>
          <select className="field !w-auto" value={framing} onChange={(e) => setFraming(e.target.value as PromptFraming)} aria-label="Bildausschnitt">
            {(Object.keys(FRAMING_LABELS) as PromptFraming[]).map((f) => <option key={f} value={f}>{FRAMING_LABELS[f]}</option>)}
          </select>
          <select className="field !w-auto" value={lang} onChange={(e) => setLang(e.target.value as PromptLang)} aria-label="Sprache des Prompts">
            <option value="de">Deutsch</option>
            <option value="en">Englisch</option>
          </select>
        </div>
      </div>
      <textarea ref={ref} readOnly className="field min-h-32 font-mono text-xs" value={prompt} onFocus={(e) => e.target.select()} />
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary btn-sm" onClick={copy}>{copied ? "✓ Kopiert" : "Prompt kopieren"}</button>
        <span className="text-xs text-muted-foreground">
          In ChatGPT, Gemini, Midjourney, Leonardo o. Ä. einfügen. Viele Bild-KIs liefern mit englischen Prompts bessere Ergebnisse.
          Je genauer das Feld „Aussehen“, desto treffender das Bild.
        </span>
      </div>
    </div>
  );
}
