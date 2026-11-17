/**
 * Teoria musical pura: conversão nota <-> semitom, construção de notas de acordes
 * e transposição. Sem dependência de React ou UI.
 */

import {
  CHROMATIC_SCALE_FLAT,
  CHROMATIC_SCALE_SHARP,
  NOTE_TO_SEMITONE,
  OPEN_STRINGS_NOTES,
} from './constants.ts';
import type { NoteName } from './types';

/**
 * Converte uma nota musical para seu valor em semitons (C = 0).
 * Retorna -1 se a nota não for reconhecida.
 */
export function noteToSemitone(note: string): number {
  const normalized = note.trim();
  return NOTE_TO_SEMITONE[normalized] ?? -1;
}

/**
 * Converte um semitom (0-11) de volta para nome de nota.
 * @param preferSharp se true usa sustenidos, senão bemóis
 */
export function semitoneToNote(
  semitone: number,
  preferSharp: boolean = true,
): NoteName {
  const idx = ((semitone % 12) + 12) % 12;
  return (preferSharp
    ? CHROMATIC_SCALE_SHARP
    : CHROMATIC_SCALE_FLAT
  )[idx] as NoteName;
}

/**
 * Normaliza uma nota para a escrita enharmônica desejada.
 */
export function normalizeNote(
  note: string,
  preferSharp: boolean = true,
): NoteName {
  const st = noteToSemitone(note);
  if (st === -1) return note as NoteName;
  return semitoneToNote(st, preferSharp);
}

/**
 * Transpõe uma nota por X semitons.
 */
export function transposeNote(
  note: string,
  semitones: number,
  preferSharp: boolean = true,
): NoteName {
  const st = noteToSemitone(note);
  if (st === -1) return note as NoteName;
  return semitoneToNote(st + semitones, preferSharp);
}

/**
 * Converte semitom para nota da corda aberta do violão (6ª → 1ª).
 */
export function openStringNote(stringIndex: number): NoteName {
  return OPEN_STRINGS_NOTES[stringIndex] as NoteName;
}

/**
 * Calcula as notas de um acorde dada a raiz e os intervalos em semitons.
 * @param root nota fundamental (ex: 'C', 'F#', 'Bb')
 * @param intervals array de semitons (ex: [0, 4, 7] para maior)
 * @param preferSharp preferência de escrita enharmônica
 */
export function buildChordNotes(
  root: string,
  intervals: readonly number[],
  preferSharp: boolean = true,
): string[] {
  const rootSt = noteToSemitone(root);
  if (rootSt === -1) return [];
  return intervals.map((interval) =>
    semitoneToNote(rootSt + interval, preferSharp),
  );
}

/**
 * Detecta se uma raíz deve ser escrita com bemóis (true) ou sustenidos (false).
 * Heurística: se a nota contém 'b', prefere bemol.
 */
export function prefersFlat(root: string): boolean {
  return /b/.test(root);
}