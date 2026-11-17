/**
 * Módulo de geração automática de acordes para violão.
 *
 * Exporta tipos, constantes, utilitários de teoria musical,
 * gerador de acordes, formas CAGED e registro com cache/busca.
 */

// Tipos
export type {
  Chord,
  ChordShape,
  ChordInversion,
  Fingering,
  ChordType,
  NoteName,
  BarreInfo,
  GenerateChordOptions,
  ChordSearchResult,
} from './types.ts';

// Constantes
export {
  CHROMATIC_SCALE_SHARP,
  CHROMATIC_SCALE_FLAT,
  NOTE_TO_SEMITONE,
  CHORD_FORMULAS,
  CAGED_SHAPES,
  ALL_ROOTS,
  ROOTS_SHARP,
  SUPPORTED_TYPES,
  TYPE_TO_SHAPES,
  OPEN_STRINGS_SEMITONES,
  OPEN_STRINGS_NOTES,
  INTERVALS,
} from './constants.ts';

// Teoria musical
export {
  noteToSemitone,
  semitoneToNote,
  normalizeNote,
  transposeNote,
  buildChordNotes,
  prefersFlat,
  openStringNote,
} from './music-theory.ts';

// Gerador
export {
  generateChord,
  generateInversions,
  transposeShape,
  generateFingering,
  parseChordName,
  normalizeType,
  getShapesForType,
  needsBarre,
} from './chord-generator.ts';

// Registro (cache + busca + exportação)
export { ChordRegistry, chordRegistry } from './chord-registry.ts';