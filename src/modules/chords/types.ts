/**
 * Tipos do módulo de geração de acordes (violão).
 * Segue Clean Architecture: entidades puras, sem dependência de UI/React.
 */

/** Nota musical válida (ex: C, C#, Db, D, ... B) */
export type NoteName = string;

/** Tipo/qualidade harmônica do acorde */
export type ChordType =
  | ''
  | 'm'
  | '7'
  | 'm7'
  | 'maj7'
  | 'sus2'
  | 'sus4'
  | 'dim'
  | 'dim7'
  | 'aug'
  | '6'
  | 'm6'
  | '9'
  | 'add9';

/** Forma base do sistema CAGED */
export interface ChordShape {
  name: string; // 'E' | 'Em' | 'A' | 'Am' | 'C' | 'D' | 'G'
  /** Índice da corda que contém a nota fundamental (0 = 6ª corda E grave, 5 = 1ª corda e aguda) */
  rootString: number;
  /** Nota fundamental da forma aberta (ex: 'E' para forma E) */
  baseRoot: NoteName;
  /** Posições por corda (6ª → 1ª). null = corda não tocada (X). 0 = corda aberta. */
  positions: (number | null)[];
  /** Qualidade harmônica da forma aberta */
  chordType: ChordType;
}

/** Dedilhado de uma corda específica */
export interface Fingering {
  string: number; // 0 = 6ª corda, 5 = 1ª corda
  fret: number | string; // número da casa ou 'X' / '0'
  finger: number; // 1=indicador, 2=médio, 3=anelar, 4=mindinho, 0=aberto
}

/** Informação de pestana (barre) */
export interface BarreInfo {
  barre: boolean;
  fret: number;
}

/** Acorde gerado */
export interface Chord {
  name: string; // ex: 'C', 'Cm', 'G/B', 'F#m7'
  root: NoteName; // nota fundamental (ex: 'C')
  type: ChordType;
  bass?: NoteName; // nota do baixo para inversões (ex: 'E' em C/E)
  notes: string[]; // notas do acorde (ex: ['C','E','G'])
  fret: number; // traste base da posição
  barre: BarreInfo;
  shape?: ChordShape; // forma CAGED usada (opcional)
  fingering: Fingering[];
}

/** Inversão de acorde */
export interface ChordInversion {
  name: string; // ex: 'C/E'
  root: NoteName;
  bass: NoteName;
  notes: string[];
}

/** Resultado de busca */
export interface ChordSearchResult {
  chord: Chord;
  score: number;
}

/** Opções de geração */
export interface GenerateChordOptions {
  /** Forçar uso de sustenidos (#) ao invés de bemóis (b) nos nomes das notas */
  preferSharp?: boolean;
  /** Tentar mapear para uma forma CAGED específica */
  shapeName?: string;
}