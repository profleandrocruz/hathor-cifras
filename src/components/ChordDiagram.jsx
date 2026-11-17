import {
  noteToSemitone,
  semitoneToNote,
  openStringNote,
} from '../modules/chords';

/** Rótulos das cordas (6ª → 1ª), da esquerda para a direita. */
const STRING_LABELS = [
  '6ª Mi grave',
  '5ª Lá',
  '4ª Ré',
  '3ª Sol',
  '2ª Si',
  '1ª Mi agudo',
];

/** Nome por número do dedo. */
const FINGER_LABELS = {
  1: 'Indicador',
  2: 'Dedo do meio',
  3: 'Anelar',
  4: 'Mindinho',
};

// ============================================================================
// Constantes de geometria SVG
// ============================================================================
const NUM_STRINGS = 6;
const NUM_FRETS = 5;
const SVG_WIDTH = 400;
const SVG_HEIGHT = 500;
const NUT_HEIGHT = 6;
const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 40;
const TOP_OFFSET = 70;
const BOTTOM_OFFSET = 60;

const STRING_AREA_WIDTH = SVG_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const FRET_AREA_HEIGHT = SVG_HEIGHT - TOP_OFFSET - BOTTOM_OFFSET;
const STRING_SPACING = STRING_AREA_WIDTH / (NUM_STRINGS - 1);
const FRET_SPACING = FRET_AREA_HEIGHT / NUM_FRETS;

const getStringX = (stringIndex) => MARGIN_LEFT + stringIndex * STRING_SPACING;
const getFretY = (relativeFret) => TOP_OFFSET + FRET_SPACING * (relativeFret - 0.5);
const getFretLineY = (relativeFret) => TOP_OFFSET + FRET_SPACING * (relativeFret - 1);

export default function ChordDiagram({ chord, showLegend = true, className = '' }) {
  if (!chord) return null;

  const positions = chord.shape?.positions ?? Array(6).fill(null);
  const preferSharp = !/b/.test(chord.root);

  const hasBarre = chord.barre?.barre ?? false;
  const barreFretReal = chord.barre?.fret ?? 0;

  const fingerByString = {};
  (chord.fingering || []).forEach((f) => {
    fingerByString[f.string] = f.finger;
  });

  const bassStringIdx = positions.findIndex(
    (p) => typeof p === 'number' && p > 0
  );
  const isBass = (si) => bassStringIdx !== -1 && si === bassStringIdx;

  const noteForString = (si, pos) => {
    if (pos === null || pos === 'X') return null;
    const st = noteToSemitone(openStringNote(si)) + pos;
    return semitoneToNote(st, preferSharp);
  };

  const isOnBarre = (si, pos) =>
    hasBarre && typeof pos === 'number' && pos === barreFretReal;

  let firstVisibleFret = 1;
  if (hasBarre && barreFretReal > 1) {
    firstVisibleFret = barreFretReal - 1;
  }
  firstVisibleFret = Math.max(1, firstVisibleFret);

  const lastVisibleFret = firstVisibleFret + NUM_FRETS - 1;

  let barreFromString = 0;
  let barreToString = NUM_STRINGS - 1;
  if (hasBarre) {
    const barreStringIndices = positions
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => typeof p === 'number' && p === barreFretReal);
    if (barreStringIndices.length > 0) {
      barreFromString = Math.min(...barreStringIndices.map(({ i }) => i));
      barreToString = Math.max(...barreStringIndices.map(({ i }) => i));
    }
  }

  const barreRelativeFret = barreFretReal - firstVisibleFret + 1;
  const showBarreLabel = hasBarre && barreFretReal > 5;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      {showBarreLabel && (
        <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
          Pestana {barreFretReal}ª casa
        </div>
      )}

      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="block w-full max-w-md mx-auto"
        role="img"
        aria-labelledby="chord-title"
      >
        <title id="chord-title">Diagrama de acorde de violão</title>

        <defs>
          <style>{`
            .string { stroke: #94a3b8; stroke-width: 1; }
            .fret-line { stroke: #cbd5e1; stroke-width: 1; }
            .fret-line-nut { stroke: #475569; stroke-width: 2; }
            .nut { fill: #dc2626; stroke: #b91c1c; stroke-width: 1; }
            .barre { fill: #1e3a8a; stroke: #1e40af; stroke-width: 1; }
            .dot { fill: #2563eb; stroke: #ffffff; stroke-width: 2; }
            .dot-bass { fill: #1e3a8a; stroke: #ffffff; stroke-width: 2; }
            .dot-text { fill: #ffffff; font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
            .fret-num { fill: #64748b; font-family: system-ui, sans-serif; font-size: 12px; font-weight: 700; text-anchor: end; pointer-events: none; }
            .open-dot { fill: #7c3aed; stroke: #ffffff; stroke-width: 2; }
            .muted-text { fill: #94a3b8; font-family: system-ui, sans-serif; font-size: 14px; font-weight: 700; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }
            .string-label { fill: #64748b; font-family: system-ui, sans-serif; font-size: 11px; text-anchor: middle; pointer-events: none; }
            .note-text { fill: #475569; font-family: system-ui, sans-serif; font-size: 11px; font-weight: 700; text-anchor: middle; pointer-events: none; }
            .note-open { fill: #7c3aed; }
          `}</style>
        </defs>

        {/* Cordas verticais */}
        {[...Array(NUM_STRINGS)].map((_, si) => (
          <line
            key={si}
            className="string"
            x1={getStringX(si)}
            y1={TOP_OFFSET}
            x2={getStringX(si)}
            y2={TOP_OFFSET + FRET_AREA_HEIGHT}
          />
        ))}

        {/* Linhas dos trastes */}
        {[...Array(NUM_FRETS + 1)].map((_, k) => (
          <line
            key={k}
            className={k === 0 ? 'fret-line-nut' : 'fret-line'}
            x1={getStringX(0)}
            y1={getFretLineY(k + 1)}
            x2={getStringX(NUM_STRINGS - 1)}
            y2={getFretLineY(k + 1)}
          />
        ))}

        {/* Nut */}
        <rect
          className="nut"
          x={getStringX(0) - 6}
          y={TOP_OFFSET - NUT_HEIGHT}
          width={STRING_AREA_WIDTH + 12}
          height={NUT_HEIGHT}
          rx={2}
        />

        {/* Números das casas */}
        {[...Array(NUM_FRETS)].map((_, k) => {
          const realFret = firstVisibleFret + k;
          return (
            <text
              key={k}
              className="fret-num"
              x={getStringX(0) - 8}
              y={getFretY(k + 1) + 4}
            >
              {realFret}
            </text>
          );
        })}

        {/* Marcadores acima do nut */}
        {positions.map((pos, si) => {
          const x = getStringX(si);
          const y = TOP_OFFSET - NUT_HEIGHT - 24;

          if (pos === null || pos === 'X') {
            return (
              <text key={si} className="muted-text" x={x} y={y}>
                ✕
              </text>
            );
          }

          if (pos === 0) {
            return (
              <circle key={si} className="open-dot" cx={x} cy={y} r={8} />
            );
          }

          return null;
        })}

        {/* Pestana (Barre) — desenhada ANTES dos dedos para ficar por baixo */}
        {hasBarre &&
          barreRelativeFret >= 1 &&
          barreRelativeFret <= NUM_FRETS &&
          barreStringIndices.length > 0 && (
          <rect
            className="barre"
            x={getStringX(barreFromString) - 10}
            y={getFretY(barreRelativeFret) - 4}
            width={getStringX(barreToString) - getStringX(barreFromString) + 20}
            height={8}
            rx={4}
          />
        )}

        {/* Bolinhas dos dedos */}
        {positions.map((pos, si) => {
          if (pos === null || pos === 'X' || pos === 0) return null;

          const relativeFret = pos - firstVisibleFret + 1;
          if (relativeFret < 1 || relativeFret > NUM_FRETS) return null;

          if (hasBarre && pos === barreFretReal) return null;

          const finger = fingerByString[si] || 0;
          const bass = isBass(si);
          const x = getStringX(si);
          const y = getFretY(relativeFret);

          return (
            <g key={si}>
              <circle
                className={bass ? 'dot-bass' : 'dot'}
                cx={x}
                cy={y}
                r={bass ? 10 : 8}
              />
              {finger > 0 && (
                <text className="dot-text" x={x} y={y}>
                  {finger}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Rodapé: notas soantes */}
      <div className="flex justify-between mt-2 px-[2%] text-[10px]">
        {positions.map((pos, si) => (
          <div key={si} className="text-center w-[16%]">
            <div className="text-gray-500 dark:text-gray-400 font-medium leading-tight">
              {STRING_LABELS[si]}
            </div>
            {pos === null || pos === 'X' ? (
              <div className="text-gray-400">—</div>
            ) : (
              <div
                className={`font-bold leading-tight ${
                  pos === 0
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {noteForString(si, pos)}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-[-6px] px-[2%] text-center">
        Notas soantes (da esquerda para a direita)
      </div>

      {showLegend && (
        <div
          className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs"
        >
          {[1, 2, 3, 4].map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-xs shadow"
                style={{ backgroundColor: '#2563eb' }}
              >
                {f}
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {FINGER_LABELS[f]}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 col-span-2">
            <span
              className="w-5 h-5 rounded-full border-2 border-purple-600 dark:border-purple-400 flex items-center justify-center text-[9px] text-purple-600 dark:text-purple-400"
            >
              ○
            </span>
            <span className="text-gray-700 dark:text-gray-300">Corda solta</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <span className="text-gray-700 dark:text-gray-300 font-black text-[10px]">
              ✕
            </span>
            <span className="text-gray-700 dark:text-gray-300">Não tocar</span>
          </div>
        </div>
      )}
    </div>
  );
}