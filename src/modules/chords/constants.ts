/**
 * Constantes de teoria musical e formas CAGED.
 */

import type { ChordShape, ChordType } from './types.ts';

export const CHROMATIC_SCALE_SHARP: readonly string[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const CHROMATIC_SCALE_FLAT: readonly string[] = [
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B',
];

/** Mapeamento nota -> semitom (C = 0). Inclui ambas as escritas enharmônicas. */
export const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

/** Notas das cordas abertas do violão (6ª → 1ª corda) em semitons desde C=0 */
export const OPEN_STRINGS_SEMITONES: readonly number[] = [4, 9, 2, 7, 11, 4]; // E, A, D, G, B, e

/** Nomes das cordas abertas (6ª → 1ª) */
export const OPEN_STRINGS_NOTES: readonly string[] = ['E', 'A', 'D', 'G', 'B', 'E'];

/** Intervalos em semitons */
export const INTERVALS: Record<string, number> = {
  '1': 0,
  'b2': 1,
  '2': 2,
  'b3': 3,
  '3': 4,
  '4': 5,
  '#4': 6,
  'b5': 6,
  '5': 7,
  'b6': 8,
  '6': 9,
  'b7': 10,
  '7': 11,
  '8': 12,
  '9': 14,
};

/** Fórmulas harmônicas por tipo de acorde */
export const CHORD_FORMULAS: Record<string, readonly number[]> = {
  '': [0, 4, 7], // maior: 1 3 5
  m: [0, 3, 7], // menor: 1 b3 5
  '7': [0, 4, 7, 10], // dominante: 1 3 5 b7
  m7: [0, 3, 7, 10], // menor sétima: 1 b3 5 b7
  maj7: [0, 4, 7, 11], // maior sétima: 1 3 5 7
  sus2: [0, 2, 7], // suspenso 2: 1 2 5
  sus4: [0, 5, 7], // suspenso 4: 1 4 5
  dim: [0, 3, 6], // diminuto: 1 b3 b5
  dim7: [0, 3, 6, 9], // diminuto 7: 1 b3 b5 bb7 (bb7 = 9 semitons)
  aug: [0, 4, 8], // aumentado: 1 3 #5
  '6': [0, 4, 7, 9], // sexta: 1 3 5 6
  m6: [0, 3, 7, 9], // menor sexta: 1 b3 5 6
  '9': [0, 4, 7, 10, 14], // nona: 1 3 5 b7 9
  add9: [0, 4, 7, 14], // add9: 1 3 5 9
};

/** Raízes canônicas (sustenidos) usadas para geração */
export const ROOTS_SHARP: readonly string[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

/** Todas as raízes aceitas (inclui bemóis) */
export const ALL_ROOTS: readonly string[] = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
];

/** Tipos suportados para geração em lote */
export const SUPPORTED_TYPES: readonly ChordType[] = [
  '',
  'm',
  '7',
  'm7',
  'maj7',
  'sus2',
  'sus4',
  'dim',
  'dim7',
  'aug',
  '6',
  'm6',
  '9',
  'add9',
];

/** Formas base do sistema CAGED (6ª → 1ª corda) */
export const CAGED_SHAPES: readonly ChordShape[] = [
  {
    name: 'E',
    rootString: 0,
    baseRoot: 'E',
    positions: [0, 2, 2, 1, 0, 0],
    chordType: '',
  },
  {
    name: 'Em',
    rootString: 0,
    baseRoot: 'E',
    positions: [0, 2, 2, 0, 0, 0],
    chordType: 'm',
  },
  {
    name: 'A',
    rootString: 1,
    baseRoot: 'A',
    positions: [null, 0, 2, 2, 2, 0],
    chordType: '',
  },
  {
    name: 'Am',
    rootString: 1,
    baseRoot: 'A',
    positions: [null, 0, 2, 2, 1, 0],
    chordType: 'm',
  },
  {
    name: 'C',
    rootString: 1,
    baseRoot: 'C',
    positions: [null, 3, 2, 0, 1, 0],
    chordType: '',
  },
  {
    name: 'D',
    rootString: 2,
    baseRoot: 'D',
    positions: [null, null, 0, 2, 3, 2],
    chordType: '',
  },
  {
    name: 'G',
    rootString: 0,
    baseRoot: 'G',
    positions: [3, 2, 0, 0, 0, 3],
    chordType: '',
  },
];

/** Mapeamento tipo -> formas CAGED compatíveis (para geração de diagramas) */
export const TYPE_TO_SHAPES: Record<ChordType, readonly string[]> = {
  '': ['E', 'A', 'C', 'D', 'G'],
  m: ['Em', 'Am'],
  '7': ['E'], // aproximação: forma E com ajuste teórico
  m7: ['Em'],
  maj7: ['E'],
  sus2: ['E'],
  sus4: ['E'],
  dim: ['E'],
  dim7: ['E'],
  aug: ['E'],
  '6': ['E'],
  m6: ['Em'],
  '9': ['E'],
  add9: ['E'],
};

/** Dedos padrão (1=indicador ... 4=mindinho, 0=aberto) */
export const DEFAULT_FINGER = 0;