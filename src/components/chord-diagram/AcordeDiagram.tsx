import {
  ChordDiagram,
  type ChordDiagramProps,
  type Finger,
  type Barre,
  type Instrument,
  type ViewId,
  DEFAULT_VIEW,
} from '@achorde/svguitar-react';
import type {
  FrettedInstrumentVoicing,
} from '@achorde/musical-domain';

/**
 * ============================================================================
 * COMPONENTE: AcordeDiagram
 * ============================================================================
 *
 * Componente reutilizável que renderiza diagramas de acordes de violão
 * utilizando a biblioteca svguitar-react.
 *
 * Suporta duas formas de entrada de dados:
 * 1. Objeto estruturado do tipo FrettedInstrumentVoicing (via prop `voicing`)
 * 2. Notação de casas (fret notation) via prop `instrument.chord` (ex: "x32010")
 *
 * Exemplos de visualização:
 * - view="horizontal-right": diagrama horizontal, nut à esquerda
 * - view="horizontal-left": diagrama horizontal espelhado
 * - view="vertical-right": diagrama vertical
 * - view="vertical-left": diagrama vertical espelhado
 */

// ============================================================================
// Props do componente AcordeDiagram
// ============================================================================

export interface AcordeDiagramProps {
  /**
   * Objeto de voz do acorde no formato FrettedInstrumentVoicing.
   * É a fonte de dados principal. Quando fornecido, tem precedência sobre
   * as propriedades legadas (instrument, fingers, barres, etc.).
   *
   * Exemplo (Fá Maior com pestana na 1ª casa):
   * {
   *   id: "f-major-barre-1",
   *   instrumentId: "guitar",
   *   tuningId: "standard",
   *   chordSymbol: "F",
   *   strings: [
   *     { stringIndex: 1, openNote: "E4", fret: 1, state: "fretted", finger: 1 },
   *     { stringIndex: 2, openNote: "B3", fret: 1, state: "fretted", finger: 1 },
   *     { stringIndex: 3, openNote: "G3", fret: 2, state: "fretted", finger: 2 },
   *     { stringIndex: 4, openNote: "D3", fret: 3, state: "fretted", finger: 3 },
   *     { stringIndex: 5, openNote: "A2", fret: 1, state: "fretted", finger: 1 },
   *     { stringIndex: 6, openNote: "E2", fret: 1, state: "fretted", finger: 1 },
   *   ],
   *   barres: [{ fret: 1, fromStringIndex: 1, toStringIndex: 6, finger: 1 }],
   *   baseFret: 1,
   *   source: "manual",
   *   quality: "exact",
   * }
   */
  voicing?: FrettedInstrumentVoicing;

  /**
   * Símbolo do acorde exibido como título (ex: "F", "C", "G7").
   * Útil quando não se usa o voicing completo.
   */
  chordSymbol?: string;

  /**
   * Número de cordas do instrumento (padrão: 6).
   */
  strings?: number;

  /**
   * Número de casas (frets) a exibir no diagrama (padrão: 4).
   */
  frets?: number;

  /**
   * Notas das cordas afinação, da mais grave para a mais aguda
   * (ex: ["E2", "A2", "D3", "G3", "B3", "E4"]).
   * Usado quando não se fornece `voicing`.
   */
  tuning?: string[];

  /**
   * Notação de casas (fret notation) do acorde (ex: "x32010").
   * Usado quando não se fornece `voicing`.
   */
  chord?: string;

  /**
   * Visão do diagrama. Valores válidos:
   * - "horizontal-right" (padrão): horizontal, nut à esquerda
   * - "horizontal-left": horizontal espelhado
   * - "vertical-right": vertical
   * - "vertical-left": vertical espelhado
   */
  view?: ViewId;

  /**
   * Primeira casa a ser exibida (útil para acordes em posições altas).
   * Ex: firstFret={3} indica que o diagrama começa na 3ª casa.
   * Quando o voicing possui `baseFret`, esse valor é usado automaticamente.
   */
  firstFret?: number;

  /**
   * Largura do SVG em pixels.
   */
  width?: number;

  /**
   * Altura do SVG em pixels.
   */
  height?: number;

  /**
   * Cor dos círculos dos dedos (padrão da biblioteca: preto).
   * Exemplo desejado: "#2c3e8f" (azul escuro).
   */
  dotColor?: string;

  /**
   * Cor do texto/número dentro dos círculos dos dedos (padrão: branco).
   * Exemplo desejado: "#FFFFFF".
   */
  dotTextColor?: string;

  /**
   * Tamanho dos círculos dos dedos, relativo ao espaçamento entre cordas
   * (padrão: ~0.7). Valores maiores = círculos maiores.
   */
  dotSize?: number;

  /**
   * Cor do retângulo da pestana (barre).
   */
  barreColor?: string;

  /**
   * Altura do retângulo da pestana, relativa ao espaçamento entre casas
   * (padrão: ~0.4).
   */
  barreHeight?: number;

  /**
   * Largura do retângulo da pestana, relativa ao espaçamento entre cordas
   * (padrão: ~0.8).
   */
  barresWidth?: number;

  /**
   * Opacidade da pestana de 0 a 1 (padrão: 1).
   */
  barresOpacity?: number;

  /**
   * Cor de fundo do diagrama (padrão: transparente).
   */
  backgroundColor?: string;

  /**
   * Função chamada quando ocorre um erro de validação.
   * Permite tratar dados inválidos de forma controlada.
   */
  onError?: (message: string, code: string) => void;

  /**
   * Comportamento quando os dados são inválidos:
   * - "keep-previous": mantém o último diagrama válido renderizado
   * - "render-fallback": renderiza um diagrama vazio/fallback
   * - "suppress": não renderiza nada
   * (padrão: "keep-previous")
   */
  invalidBehavior?: 'keep-previous' | 'render-fallback' | 'suppress';
}

/**
 * Verifica se um objeto está no formato correto de FrettedInstrumentVoicing.
 */
export function isValidFrettedInstrumentVoicing(
  voicing: unknown
): voicing is FrettedInstrumentVoicing {
  if (!voicing || typeof voicing !== 'object') {
    return false;
  }
  const v = voicing as Record<string, unknown>;
  if (typeof v.id !== 'string') return false;
  if (typeof v.instrumentId !== 'string') return false;
  if (typeof v.tuningId !== 'string') return false;
  if (typeof v.chordSymbol !== 'string') return false;
  if (typeof v.source !== 'string') return false;
  if (typeof v.quality !== 'string') return false;
  if (!Array.isArray(v.strings)) return false;
  for (const s of v.strings) {
    if (typeof s !== 'object' || s === null) return false;
    const str = s as Record<string, unknown>;
    if (typeof str.stringIndex !== 'number') return false;
    if (typeof str.openNote !== 'string') return false;
    if (!(typeof str.fret === 'number' || str.fret === null)) return false;
    if (str.state !== 'fretted' && str.state !== 'open' && str.state !== 'muted') {
      return false;
    }
  }
  if (v.barres !== undefined) {
    if (!Array.isArray(v.barres)) return false;
    for (const b of v.barres) {
      if (typeof b !== 'object' || b === null) return false;
      const barre = b as Record<string, unknown>;
      if (typeof barre.fret !== 'number') return false;
      if (typeof barre.fromStringIndex !== 'number') return false;
      if (typeof barre.toStringIndex !== 'number') return false;
    }
  }
  return true;
}

/**
 * Converte um FrettedInstrumentVoicing para as propriedades legadas
 * (fingers, barres) entendidas pelo ChordDiagram.
 */
export function voicingToChordProps(
  voicing: FrettedInstrumentVoicing
): {
  fingers: Finger[];
  barres: Barre[];
  instrument: Instrument;
  firstFret?: number;
} {
  const fingers: Finger[] = voicing.strings.map((s) => ({
    fret: s.fret ?? 0,
    string: s.stringIndex,
    is_muted: s.state === 'muted',
    text: s.finger?.toString(),
  }));
  const barres: Barre[] = (voicing.barres ?? []).map((b) => ({
    fret: b.fret,
    fromString: b.fromStringIndex,
    toString: b.toStringIndex,
    text: b.finger?.toString(),
  }));
  const instrument: Instrument = {
    strings: voicing.strings.length,
    frets: 4,
    tuning: voicing.strings.map((s) => s.openNote),
    chord: '',
  };
  return { fingers, barres, instrument, firstFret: voicing.baseFret };
}

/**
 * Componente principal AcordeDiagram.
 *
 * Renderiza um diagrama de acorde de violão usando o ChordDiagram do
 * svguitar-react com suporte a pestanas (barre chords), numeração de
 * dedos e indicação de casa.
 */
export function AcordeDiagram(props: AcordeDiagramProps) {
  const {
    voicing,
    chordSymbol,
    strings = 6,
    frets = 4,
    view = DEFAULT_VIEW,
    firstFret,
    width,
    height,
    dotColor = '#2c3e8f',
    dotTextColor = '#FFFFFF',
    dotSize = 0.8,
    barreColor = '#2c3e8f',
    barreHeight = 0.5,
    barresWidth = 0.8,
    barresOpacity = 1,
    backgroundColor = 'transparent',
    onError,
    invalidBehavior = 'keep-previous',
    ...rest
  } = props;

  // --------------------------------------------------------------------------
  // 1. Validação de tipo do voicing (TypeScript + runtime)
  // --------------------------------------------------------------------------
  const voicingIsValid =
    voicing === undefined || isValidFrettedInstrumentVoicing(voicing);

  if (voicing !== undefined && !voicingIsValid) {
    const msg =
      'AcordeDiagram: a prop "voicing" não está no formato FrettedInstrumentVoicing válido.';
    if (onError) {
      onError(msg, 'INVALID_VOICING');
    }
    console.error(msg, voicing);
    return null;
  }

  // --------------------------------------------------------------------------
  // 2. Determina a primeira casa (fret) a ser exibida
  // --------------------------------------------------------------------------
  const resolvedFirstFret = voicing?.baseFret ?? firstFret;

  // --------------------------------------------------------------------------
  // 3. Monta as props do ChordDiagram
  // --------------------------------------------------------------------------
  const chordDiagramProps: ChordDiagramProps = {
    ...(voicing ? { voicing } : {}),
    strings,
    frets,
    view,
    ...(resolvedFirstFret !== undefined ? { firstFret: resolvedFirstFret } : {}),
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    dotColor,
    dotTextColor,
    dotSize,
    barreColor,
    barreHeight,
    barresWidth,
    barresOpacity,
    backgroundColor,
    invalidBehavior,
    ...(onError
      ? {
          // Converte o ErrorContext da biblioteca para o formato simples (message, code)
          onError: (ctx: Parameters<NonNullable<ChordDiagramProps['onError']>>[0]) => {
            onError(ctx.message, ctx.code);
          },
        }
      : {}),
  };

  return (
    <div className="acorde-diagram-wrapper" style={{ display: 'inline-block' }}>
      <ChordDiagram {...chordDiagramProps} {...rest} />
    </div>
  );
}

export default AcordeDiagram;
