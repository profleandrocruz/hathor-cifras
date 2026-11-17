/**
 * Gerador de acordes: parsing de nomes, transposição de formas CAGED,
 * detecção de pestanas, dedilhado e inversões.
 */

import {
  CHORD_FORMULAS,
  CAGED_SHAPES,
  TYPE_TO_SHAPES,
} from './constants.ts';
import {
  buildChordNotes,
  noteToSemitone,
  semitoneToNote,
} from './music-theory.ts';
import type {
  BarreInfo,
  Chord,
  ChordShape,
  ChordInversion,
  Fingering,
  GenerateChordOptions,
} from './types.ts';

const CHORD_REGEX = /^([A-G](#|b)?)(maj7|m7|dim7|m6|sus4|sus2|add9|dim|aug|m|7|6|9)?(\/([A-G](#|b)?))?$/i;

export function transposeShape(
  shape: ChordShape,
  semitones: number,
): {
  positions: (number | null)[];
  fret: number;
  barre: BarreInfo;
} {
  const positions = shape.positions.map((p) =>
    p === null ? null : p + semitones,
  );
  const defined = positions.filter((p): p is number => p !== null);
  const minFret = defined.length > 0 ? Math.min(...defined) : 0;
  return {
    positions,
    fret: minFret,
    barre: {
      barre: minFret > 0,
      fret: minFret,
    },
  };
}

export function generateFingering(
  positions: (number | null)[],
  barreFret: number,
): Fingering[] {
  const fingering: Fingering[] = Array(positions.length);
  let fingerCounter = 1;

  // Dedilhado da corda mais aguda (1ª, índice 5) para a mais grave (6ª, índice 0),
  // atribuindo os dedos inferiores às cordas mais finas tocadas.
  // Ex: em Dó maior (x32010) resulta em 1ª casa/2ª corda=d1, 2ª casa/4ª corda=d2,
  // 3ª casa/5ª corda=d3, que é a dedilhado padrão da referência.
  for (let stringIndex = positions.length - 1; stringIndex >= 0; stringIndex--) {
    const fret = positions[stringIndex];

    if (fret === null) {
      fingering[stringIndex] = { string: stringIndex, fret: 'X', finger: 0 };
      continue;
    }

    if (fret === 0) {
      fingering[stringIndex] = { string: stringIndex, fret: 0, finger: 0 };
      continue;
    }

    if (fret === barreFret && barreFret > 0) {
      fingering[stringIndex] = { string: stringIndex, fret, finger: 1 };
    } else {
      fingering[stringIndex] = {
        string: stringIndex,
        fret,
        finger: fingerCounter > 4 ? 4 : fingerCounter,
      };
      fingerCounter++;
    }
  }

  return fingering;
}

export function parseChordName(
  name: string,
): { root: string; type: string; bass?: string } | null {
  const match = CHORD_REGEX.exec(name.trim());
  if (!match) return null;

  const root = match[1];
  const type = (match[3] ?? '') as string;
  const bass = match[5] ? (match[5] as string) : undefined;

  return { root, type, bass };
}

export function normalizeType(type: string): string {
  return type.toLowerCase();
}

export function getShapesForType(type: string): ChordShape[] {
  const names = TYPE_TO_SHAPES[type as any] ?? [];
  return CAGED_SHAPES.filter((s) => names.includes(s.name));
}

/**
 * Gera um único acorde a partir do nome.
 * Calcula notas teóricas e tenta mapear para uma forma CAGED + transposição.
 */
export function generateChord(
  name: string,
  options: GenerateChordOptions = {},
): Chord | null {
  const parsed = parseChordName(name);
  if (!parsed) return null;

  const { root, type, bass } = parsed;
  const normalizedType = normalizeType(type);
  const formula = CHORD_FORMULAS[normalizedType];
  if (!formula) return null;

  const preferSharp = options.preferSharp ?? !/b/.test(root);
  const notes = buildChordNotes(root, formula, preferSharp);

  let finalNotes = notes;
  let bassNote = bass;
  if (bass) {
    const bassSt = noteToSemitone(bass);
    if (bassSt !== -1) {
      bassNote = semitoneToNote(bassSt, preferSharp);
      if (!finalNotes.includes(bassNote)) {
        finalNotes = [...finalNotes, bassNote];
      }
    }
  }

  let shape: ChordShape | undefined;
  let shapeResult:
    | {
        positions: (number | null)[];
        fret: number;
        barre: BarreInfo;
      }
    | undefined;

  const compatibleShapes = getShapesForType(normalizedType);
  const shapeName = options.shapeName;
  const candidates = shapeName
    ? compatibleShapes.filter((s) => s.name === shapeName)
    : compatibleShapes;

  if (candidates.length > 0) {
    let best: { shape: ChordShape; semitones: number } | null = null;

    for (const cand of candidates) {
      const baseSt = noteToSemitone(cand.baseRoot);
      const targetSt = noteToSemitone(root);
      if (baseSt === -1 || targetSt === -1) continue;
      const semitones = (targetSt - baseSt + 12) % 12;
      if (best === null || semitones < best.semitones) {
        best = { shape: cand, semitones };
      }
    }

    if (best) {
      shapeResult = transposeShape(best.shape, best.semitones);
      shape = best.shape;
    }
  }

  let fret = 0;
  let barre: BarreInfo = { barre: false, fret: 0 };
  let fingering: Fingering[] = [];

  if (shapeResult) {
    fret = shapeResult.fret;
    barre = shapeResult.barre;
    fingering = generateFingering(
      shapeResult.positions,
      shapeResult.barre.fret,
    );
  } else {
    fingering = notes.map((_, i) => ({
      string: i % 6,
      fret: 0,
      finger: 0,
    }));
  }

  return {
    name,
    root: semitoneToNote(noteToSemitone(root) ?? 0, preferSharp),
    type: normalizedType as any,
    ...(bass ? { bass: bassNote } : {}),
    notes: finalNotes,
    fret,
    barre,
    shape,
    fingering,
  };
}

/**
 * Gera inversões de um acorde (ex: C -> C/E, C/G).
 */
export function generateInversions(
  root: string,
  type: string,
  preferSharp: boolean = true,
): ChordInversion[] {
  const formula = CHORD_FORMULAS[type as any];
  if (!formula) return [];

  const notes = buildChordNotes(root, formula, preferSharp);
  if (notes.length < 3) return [];

  const inversions: ChordInversion[] = [];
  const rootSt = noteToSemitone(root);
  if (rootSt === -1) return [];

  for (let i = 1; i < notes.length; i++) {
    const bass = notes[i];
    const rotated = [...notes.slice(i), ...notes.slice(0, i)];
    const bassNote = semitoneToNote(
      noteToSemitone(bass) ?? rootSt,
      preferSharp,
    );
    const typeSuffix = type ? type : '';
    inversions.push({
      name: typeSuffix ? `${root}${typeSuffix}/${bass}` : `${root}/${bass}`,
      root,
      bass: bassNote,
      notes: rotated,
    });
  }

  return inversions;
}

export function needsBarre(chord: Chord): boolean {
  return chord.barre.barre;
}