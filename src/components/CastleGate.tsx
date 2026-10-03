import type { Edition } from "@/data/edition";

/**
 * Auswahlbildschirm: eine Burg mit zwei Toren – links 5.5e (2024), rechts 5e (2014).
 * Die Burg ist ein SVG; die Tore sind echte Buttons, die exakt über den Toröffnungen liegen
 * (Koordinaten in Prozent des viewBox 1000×600).
 */

const GATES: { edition: Edition; x: number; title: string; year: string; text: string }[] = [
  { edition: "2024", x: 275, title: "5.5e", year: "2024", text: "Attributboni durch den Hintergrund, Herkunftstalente und Waffenbeherrschung." },
  { edition: "2014", x: 575, title: "5e", year: "2014", text: "Attributboni durch das Volk, klassische Klassenmerkmale und Unterklassen." },
];
const GATE_Y = 390;
const GATE_W = 150;
const GATE_H = 160;
const VB_W = 1000;
const VB_H = 600;

function Merlons({ x, w, y }: { x: number; w: number; y: number }) {
  const n = Math.floor(w / 34);
  const step = w / n;
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x + i * step + step * 0.18} y={y} width={step * 0.64} height={24} />
      ))}
    </>
  );
}

function Slit({ x, y }: { x: number; y: number }) {
  return <rect x={x} y={y} width={7} height={26} rx={3.5} className="castle-window" />;
}

export function CastleGate({ onEnter }: { onEnter: (e: Edition) => void }) {
  return (
    <div className="castle">
      <div className="castle-stage">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="castle-svg" aria-hidden="true">
          <defs>
            <pattern id="courses" width="48" height="24" patternUnits="userSpaceOnUse">
              <path d="M0 23.5H48M24 0V12M0 12H48M0 0V12M48 12V24" className="castle-courses" />
            </pattern>
            <linearGradient id="groundFade" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.15" stopColor="white" stopOpacity="1" />
              <stop offset="0.85" stopColor="white" stopOpacity="1" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="groundMask"><rect width={VB_W} height={VB_H} fill="url(#groundFade)" /></mask>
            <radialGradient id="moonGlow">
              <stop offset="0" stopColor="var(--parchment)" stopOpacity="0.35" />
              <stop offset="1" stopColor="var(--parchment)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="838" cy="96" r="110" fill="url(#moonGlow)" />
          <circle cx="838" cy="96" r="36" className="castle-moon" />

          <g className="castle-stone">
            {/* Bergfried */}
            <rect x="415" y="140" width="170" height="200" />
            <Merlons x={415} w={170} y={116} />
            {/* Türme */}
            <rect x="90" y="200" width="135" height="360" />
            <Merlons x={90} w={135} y={176} />
            <rect x="775" y="200" width="135" height="360" />
            <Merlons x={775} w={135} y={176} />
            {/* Ringmauer */}
            <rect x="210" y="300" width="580" height="260" />
            <Merlons x={210} w={580} y={276} />
          </g>
          <g fill="url(#courses)">
            <rect x="415" y="140" width="170" height="200" />
            <rect x="90" y="200" width="135" height="360" />
            <rect x="775" y="200" width="135" height="360" />
            <rect x="210" y="300" width="580" height="260" />
          </g>

          {/* Fahne */}
          <line x1="500" y1="56" x2="500" y2="118" className="castle-pole" />
          <path d="M502 60 C530 56 546 72 574 66 L574 92 C546 98 530 82 502 86 Z" className="castle-flag" />

          <Slit x={154} y={250} /> <Slit x={154} y={330} /> <Slit x={154} y={410} />
          <Slit x={839} y={250} /> <Slit x={839} y={330} /> <Slit x={839} y={410} />
          <Slit x={470} y={185} /> <Slit x={523} y={185} />

          {GATES.map((g) => {
            const cx = g.x + GATE_W / 2;
            return (
              <g key={g.edition}>
                {/* Torbogen aus Keilsteinen */}
                <path
                  d={`M${g.x - 10} ${GATE_Y + GATE_H} V${GATE_Y + 65} A${GATE_W / 2 + 10} 75 0 0 1 ${g.x + GATE_W + 10} ${GATE_Y + 65} V${GATE_Y + GATE_H}`}
                  className="castle-arch"
                />
                {/* Banner über dem Tor */}
                <path d={`M${cx - 44} 312 H${cx + 44} V372 L${cx} 386 L${cx - 44} 372 Z`} className="castle-banner" />
                <text x={cx} y={345} textAnchor="middle" className="castle-banner-title">{g.title}</text>
                <text x={cx} y={366} textAnchor="middle" className="castle-banner-year">{g.year}</text>
                {/* Lichtschein vor dem Tor */}
                <ellipse cx={cx} cy={GATE_Y + GATE_H + 8} rx={GATE_W * 0.7} ry={10} className="castle-spill" data-gate={g.edition} />
              </g>
            );
          })}

          <path d="M0 568 Q250 548 500 556 T1000 566 V600 H0 Z" className="castle-ground" mask="url(#groundMask)" />
        </svg>

        {GATES.map((g) => (
          <button
            key={g.edition}
            type="button"
            className="castle-gate"
            data-edition={g.edition}
            style={{
              left: `${(g.x / VB_W) * 100}%`,
              top: `${(GATE_Y / VB_H) * 100}%`,
              width: `${(GATE_W / VB_W) * 100}%`,
              height: `${(GATE_H / VB_H) * 100}%`,
            }}
            aria-label={`Neuen Charakter nach den Regeln ${g.year} (${g.title}) erschaffen`}
            onClick={() => onEnter(g.edition)}
          >
            <svg viewBox={`0 0 ${GATE_W} ${GATE_H}`} preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <clipPath id={`opening-${g.edition}`}>
                  <path d={`M0 ${GATE_H} V65 A75 65 0 0 1 ${GATE_W} 65 V${GATE_H} Z`} />
                </clipPath>
                <radialGradient id={`torch-${g.edition}`} cx="0.5" cy="0.8" r="0.8">
                  <stop offset="0" stopColor="var(--primary)" />
                  <stop offset="0.55" stopColor="var(--ember)" />
                  <stop offset="1" stopColor="var(--background)" />
                </radialGradient>
              </defs>
              <g clipPath={`url(#opening-${g.edition})`}>
                <rect width={GATE_W} height={GATE_H} fill={`url(#torch-${g.edition})`} />
                <rect width={GATE_W} height={GATE_H} className="castle-gate-dark" />
                <g className="castle-portcullis">
                  {Array.from({ length: 8 }, (_, i) => (
                    <rect key={`v${i}`} x={8 + i * 19} y={0} width={5} height={GATE_H + 4} />
                  ))}
                  {Array.from({ length: 7 }, (_, i) => (
                    <rect key={`h${i}`} x={0} y={18 + i * 22} width={GATE_W} height={4} />
                  ))}
                  {Array.from({ length: 8 }, (_, i) => (
                    <path key={`s${i}`} d={`M${8 + i * 19} ${GATE_H + 4} h5 l-2.5 8 Z`} />
                  ))}
                </g>
              </g>
            </svg>
          </button>
        ))}
      </div>

      <div className="castle-captions">
        {GATES.map((g) => (
          <div key={g.edition} className="castle-caption">
            <h2>Regeln {g.year} <span>({g.title})</span></h2>
            <p>{g.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
