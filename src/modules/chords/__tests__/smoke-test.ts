/**
 * Teste de funcionalidade do módulo de acordes.
 * Rodar com: node --experimental-strip-types src/modules/chords/__tests__/smoke-test.ts
 */

import {
  generateChord,
  generateInversions,
  transposeShape,
  needsBarre,
} from '../chord-generator.ts';
import {
  buildChordNotes,
  noteToSemitone,
  semitoneToNote,
} from '../music-theory.ts';
import { CAGED_SHAPES } from '../constants.ts';
import { ChordRegistry } from '../chord-registry.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`✅ ${message}`);
  } else {
    failed++;
    console.error(`❌ ${message}`);
  }
}

// 1. Notas cromáticas
assert(
  noteToSemitone('C') === 0,
  'noteToSemitone(C) === 0',
);
assert(
  noteToSemitone('E') === 4,
  'noteToSemitone(E) === 4',
);
assert(
  semitoneToNote(0) === 'C',
  'semitoneToNote(0) === C',
);
assert(
  semitoneToNote(7) === 'G',
  'semitoneToNote(7) === G',
);

// 2. Notas de acorde maior C = C E G
const cNotes = buildChordNotes('C', [0, 4, 7]);
assert(
  cNotes.join(',') === 'C,E,G',
  `buildChordNotes(C, major) => ${cNotes.join(',')}`,
);

// 3. Cm = C Eb G (usando flat)
const cmNotes = buildChordNotes('C', [0, 3, 7], false);
assert(
  cmNotes.includes('Eb'),
  `buildChordNotes(C, minor, flat) includes Eb => ${cmNotes.join(',')}`,
);

// 4. Geração de acorde C
const cChord = generateChord('C');
assert(!!cChord, 'generateChord(C) não retornou null');
assert(
  cChord?.root === 'C',
  `generateChord(C).root === C (got ${cChord?.root})`,
);
assert(
  cChord?.type === '',
  `generateChord(C).type === '' (got ${cChord?.type})`,
);
assert(
  Array.isArray(cChord?.notes) && cChord?.notes.length > 0,
  'generateChord(C).notes é array não vazio',
);

// 5. Geração com pestana (F via forma E + 1 casa)
const fChord = generateChord('F');
assert(!!fChord, 'generateChord(F) não retornou null');
assert(
  fChord?.root === 'F',
  `generateChord(F).root === F (got ${fChord?.root})`,
);
assert(
  fChord?.barre.barre === true,
  `generateChord(F) deve ter barre (got ${fChord?.barre.barre})`,
);
assert(
  fChord?.barre.fret === 1,
  `generateChord(F).barre.fret === 1 (got ${fChord?.barre.fret})`,
);
assert(
  !!fChord?.shape,
  'generateChord(F) tem shape associado',
);

// 6. Geração de acorde com sustenido
const fSharpM7 = generateChord('F#m7');
assert(!!fSharpM7, 'generateChord(F#m7) não retornou null');
assert(
  fSharpM7?.root === 'F#',
  `generateChord(F#m7).root === F# (got ${fSharpM7?.root})`,
);
assert(
  fSharpM7?.type === 'm7',
  `generateChord(F#m7).type === m7 (got ${fSharpM7?.type})`,
);

// 7. Inversões C -> C/E, C/G
const inversions = generateInversions('C', '', true);
assert(
  inversions.length >= 2,
  `generateInversions(C) gera pelo menos 2 inversões (got ${inversions.length})`,
);
assert(
  inversions.some((inv) => inv.name === 'C/E'),
  'generateInversions(C) inclui C/E',
);
assert(
  inversions.some((inv) => inv.name === 'C/G'),
  'generateInversions(C) inclui C/G',
);

// 8. Detecção de pestana
assert(
  needsBarre(fChord!),
  'needsBarre(F) === true',
);
assert(
  needsBarre(cChord!) === false,
  'needsBarre(C) === false',
);

// 9. Transposição de forma E
const eShape = CAGED_SHAPES.find((s) => s.name === 'E');
assert(!!eShape, 'Forma E existe em CAGED_SHAPES');
const transposed = transposeShape(eShape!, 1);
assert(
  transposed.barre.barre === true,
  'transposeShape(E, 1) gera barre',
);
assert(
  transposed.barre.fret === 1,
  `transposeShape(E, 1).barre.fret === 1 (got ${transposed.barre.fret})`,
);

// 10. Registry com cache e generateAllChords
const registry = new ChordRegistry();
const all = registry.generateAllChords();
assert(
  all.length > 1000,
  `generateAllChords() gera mais de 1000 acordes (got ${all.length})`,
);
assert(
  registry.size() > 1000,
  `registry.size() > 1000 (got ${registry.size()})`,
);

// Verifica acordes específicos esperados
const expected = ['C', 'Cm', 'C7', 'Cm7', 'Cmaj7', 'Csus2', 'Csus4', 'Cdim', 'Caug', 'C9', 'Cadd9'];
for (const name of expected) {
  const found = all.find((c) => c.name === name);
  assert(!!found, `generateAllChords inclui ${name}`);
}

// 11. Busca rápida
const searchResults = registry.searchChord('Cm');
assert(
  searchResults.length > 0,
  `searchChord('Cm') retorna resultados (got ${searchResults.length})`,
);
assert(
  searchResults.some((c) => c.name === 'Cm'),
  "searchChord('Cm') inclui exatamente 'Cm'",
);

// 12. Exportação JSON
const json = registry.toJSON();
assert(
  json.startsWith('['),
  'toJSON() retorna JSON array',
);
const parsed = JSON.parse(json);
assert(
  parsed.length === all.length,
  'toJSON() parseável e com mesmo tamanho',
);

// 13. Acordes invertidos esperados
const invNames = all.map((c) => c.name);
const slashExpected = ['C/E', 'C/G', 'G/B', 'G/D', 'D/F#', 'A/C#', 'Am/C', 'Em/G'];
for (const name of slashExpected) {
  assert(
    invNames.includes(name),
    `generateAllChords inclui inversão ${name}`,
  );
}

console.log(`\n📊 Resultado: ${passed} passou, ${failed} falhou`);
// process.exit não disponível sem @types/node; código de saída implícito 0