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

const NUM_FRETS = 5;

/**
 * Dedograma de violão seguindo o modelo de referência:
 * - Sem casa 0 (casas 1 a 5)
 * - Cordas soltas com bolinha cheia no topo
 * - Tarraxa com cor de destaque e borda
 * - Bolinhas azuis com número do dedo
 * - Baixo (bordão) em bolinha maior e mais escura
 * - Pestana (barre) como traço na primeira casa com indicação da casa real
 * - Abafadas com ✕
 *
 * @param chord objeto Chord gerado pelo módulo de acordes
 * @param showLegend exibe a legenda de dedos abaixo do diagrama
 * @param className classes Tailwind adicionais
 */
export default function ChordDiagram({ chord, showLegend = true, className = '' }) {
  if (!chord) return null;

  // Posições por corda: índice 0 = 6ª corda ... índice 5 = 1ª corda
  const positions = chord.shape?.positions ?? Array(6).fill(null);
  const preferSharp = !/b/.test(chord.root);

  // Informações de pestana
  const hasBarre = chord.barre?.barre ?? false;
  const barreFretReal = chord.barre?.fret ?? 0;

  // Número do dedo por corda (índice da corda -> dedo)
  const fingerByString = {};
  (chord.fingering || []).forEach((f) => {
    fingerByString[f.string] = f.finger;
  });

  // Baixo (bordão): corda mais grave (menor índice) tocada em casa > 0.
  // Cordas abertas (0) ficam com ○ de "corda solta".
  const bassStringIdx = positions.findIndex(
    (p) => typeof p === 'number' && p > 0
  );

  const isBass = (si) => bassStringIdx !== -1 && si === bassStringIdx;

  // Nota soante de cada corda (para o rodapé)
  const noteForString = (si, pos) => {
    if (pos === null || pos === 'X') return null;
    const st = noteToSemitone(openStringNote(si)) + pos;
    return semitoneToNote(st, preferSharp);
  };

  // Quando há pestana, notas na mesma casa da pestana são cobertas por ela
  const isOnBarre = (si, pos) => hasBarre && typeof pos === 'number' && pos === barreFretReal;

  // Casas visíveis: 1, 2, 3, 4, 5 (sem casa 0)
  const fretSpaces = [1, 2, 3, 4, 5];

  // Posição horizontal de cada corda (6% .. 94%)
  const stringX = (si) => 6 + si * (88 / 5);
  // Topo central de cada casa k (índice 0 = primeira casa)
  const fretSpaceTop = (k) => 14 + ((k + 0.5) / NUM_FRETS) * 86;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Marcadores do topo: ✕ (não tocar) e bolinha cheia (corda solta), alinhados às cordas */}
      <div className="relative h-[14%] flex items-end justify-center px-1 mb-1">
        {positions.map((pos, si) => {
          const x = stringX(si);
          if (pos === null || pos === 'X') {
            return (
              <div
                key={si}
                className="absolute text-[11px] font-black text-gray-700 dark:text-gray-300"
                style={{ left: `${x}%`, transform: 'translateX(-50%)' }}
              >
                ✕
              </div>
            );
          }
          if (pos === 0) {
            return (
              <div
                key={si}
                className="absolute w-6 h-6 rounded-full bg-purple-600 dark:bg-purple-500 flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md"
                style={{
                  left: `${x}%`,
                  transform: 'translateX(-50%)',
                  bottom: '-4px',
                }}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Braço do violão */}
      <div className="relative" style={{ aspectRatio: '4 / 5' }}>
        {/* Tarraxa com cor de destaque e borda */}
        <div
          className="absolute left-0 right-0 top-0 h-[14%] bg-purple-700 dark:bg-purple-900 border-b-2 border-red-600 dark:border-red-500 rounded-t-lg z-30"
        />

        {/* Linhas das casas */}
        {fretSpaces.map((_, k) => (
          <div
            key={k}
            className="absolute left-0 right-0 h-[1px] bg-gray-400 dark:bg-gray-600 z-10"
            style={{ top: `${14 + (k / NUM_FRETS) * 86}%` }}
          />
        ))}

        {/* Números das casas à esquerda (1 a 5, sem casa 0) */}
        {fretSpaces.map((absFret, k) => (
          <div
            key={k}
            className="absolute left-[-8px] top-0 -translate-y-1/2 text-[11px] font-bold text-gray-600 dark:text-gray-300 w-6 text-right z-10"
            style={{ top: `${fretSpaceTop(k)}%` }}
          >
            {absFret}
          </div>
        ))}

        {/* Cordas verticais */}
        {[0, 1, 2, 3, 4, 5].map((si) => (
          <div
            key={si}
            className="absolute top-[14%] bottom-[4%] w-[1.5px] bg-gray-600 dark:bg-gray-400 z-0"
            style={{ left: `${stringX(si)}%` }}
          />
        ))}

        {/* Pestana (barre): traço na primeira casa cobrindo todas as cordas */}
        {hasBarre && (
          <div
            className="absolute z-40 flex items-center justify-center text-white font-bold text-xs shadow-lg"
            style={{
              left: `${6 + (88 / 5) / 2}%`,
              top: `${fretSpaceTop(0)}%`,
              width: '82%',
              height: '26px',
              minWidth: '82px',
              minHeight: '26px',
              borderRadius: '6px',
              backgroundColor: '#1e3a8a',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {1}
          </div>
        )}

        {/* Bolinhas dos dedos nas casas */}
        {positions.map((pos, si) => {
          if (pos === null || pos === 'X' || pos === 0) return null;

          // Quando há pestana, a primeira casa é a pestana (k=0 para a casa real da pestana).
          // Outras notas ficam em casas relativas: pos - barreFretReal + 1
          const k = hasBarre ? pos - barreFretReal + 1 : pos;
          if (k < 0 || k >= NUM_FRETS) return null;

          // Notas cobertas pela pestana (na casa real da pestana) não recebem bolinha separada
          if (hasBarre && pos === barreFretReal) return null;

          const finger = fingerByString[si] || 0;
          const bass = isBass(si);

          return (
            <div
              key={si}
              className="absolute z-40 flex items-center justify-center text-white font-bold text-xs shadow-lg"
              style={{
                left: `${stringX(si)}%`,
                top: `${fretSpaceTop(k)}%`,
                width: bass ? '26px' : '20px',
                height: bass ? '26px' : '20px',
                minWidth: bass ? '26px' : '20px',
                minHeight: bass ? '26px' : '20px',
                borderRadius: '50%',
                backgroundColor: bass ? '#1e3a8a' : '#2563eb',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {finger}
            </div>
          );
        })}
      </div>

      {/* Indicação da pestana com casa real */}
      {hasBarre && (
        <div className="flex items-center gap-2 mt-1 px-[2%]">
          <div
            className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white font-bold text-xs shadow border border-gray-500"
          >
            {1}
          </div>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {barreFretReal}ª casa
          </span>
        </div>
      )}
      {/* Rodapé: cordas e notas soantes (da esquerda para a direita) */}
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
              className="w-5 h-5 rounded-full border-2 border-blue-600 dark:border-blue-400 flex items-center justify-center text-[9px] text-blue-600 dark:text-blue-400"
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


