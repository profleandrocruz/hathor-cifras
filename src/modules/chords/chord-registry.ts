/**
 * Registro de acordes com cache (Map), busca rápida, geração em lote
 * e exportação para JSON.
 */

import {
  ALL_ROOTS,
  CAGED_SHAPES,
  SUPPORTED_TYPES,
  TYPE_TO_SHAPES,
} from './constants.ts';
import {
  generateChord,
  generateInversions,
} from './chord-generator.ts';
import { noteToSemitone } from './music-theory.ts';
import type { Chord, ChordInversion } from './types.ts';

/**
 * Registro singleton de acordes com cache em memória.
 * Evita recálculo de acordes já gerados.
 */
export class ChordRegistry {
  private cache = new Map<string, Chord>();
  private inversionCache = new Map<string, ChordInversion[]>();

  /**
   * Busca um acorde pelo nome, usando cache quando disponível.
   */
  get(name: string, options: { preferSharp?: boolean } = {}): Chord | null {
    const key = `${name}|${options.preferSharp ?? false}`;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const chord = generateChord(name, {
      preferSharp: options.preferSharp,
    });
    if (chord) {
      this.cache.set(key, chord);
    }
    return chord;
  }

  /**
   * Gera (ou retorna do cache) um acorde, armazenando para futuras buscas.
   */
  set(name: string, chord: Chord): void {
    this.cache.set(name, chord);
  }

  /**
   * Remove um acorde do cache.
   */
  delete(name: string): boolean {
    return this.cache.delete(name);
  }

  /**
   * Limpa todo o cache.
   */
  clear(): void {
    this.cache.clear();
    this.inversionCache.clear();
  }

  /**
   * Retorna a quantidade de acordes em cache.
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Gera todos os acordes suportados para todas as raízes,
   * incluindo múltiplas voicings CAGED e inversões.
   * Pode gerar mais de 1000 acordes distintos.
   */
  generateAllChords(): Chord[] {
    this.clear();

    const chords: Chord[] = [];

    const inversionTypes = [
      '',
      'm',
      '7',
      'm7',
      'maj7',
      '6',
      'm6',
      'dim',
      'dim7',
      'aug',
      '9',
      'add9',
      'sus2',
      'sus4',
    ];

    for (const root of ALL_ROOTS) {
      const preferSharp = !/b/.test(root);

      for (const type of SUPPORTED_TYPES) {
        // Acorde base (teórico)
        const base = generateChord(`${root}${type}`, { preferSharp });
        if (base && !this.cache.has(base.name)) {
          chords.push(base);
          this.cache.set(base.name, base);
        }

        // Voicings via formas CAGED compatíveis (multiplica posições)
        const compatibleShapes = CAGED_SHAPES.filter((s) =>
          (TYPE_TO_SHAPES[type as any] ?? []).includes(s.name),
        );

        for (const shape of compatibleShapes) {
          const baseSt = noteToSemitone(shape.baseRoot);
          const targetSt = noteToSemitone(root);
          if (baseSt === -1 || targetSt === -1) continue;
          const voicing = generateChord(`${root}${type}`, {
            preferSharp,
            shapeName: shape.name,
          });
          if (!voicing) continue;
          // Nome distinto por forma CAGED (ex: "C E", "Cm Em", "C A")
          const voicingName = type
            ? `${root}${type} ${shape.name}`
            : `${root} ${shape.name}`;
          if (this.cache.has(voicingName)) continue;
          const distinctVoicing: Chord = { ...voicing, name: voicingName };
          chords.push(distinctVoicing);
          this.cache.set(voicingName, distinctVoicing);
        }

        // Inversões para tipos com 3+ notas
        if (inversionTypes.includes(type)) {
          const inversions = generateInversions(root, type, preferSharp);
          for (const inv of inversions) {
            const invChord = generateChord(inv.name, { preferSharp });
            if (invChord && !this.cache.has(invChord.name)) {
              const enriched: Chord = {
                ...invChord,
                bass: inv.bass,
                notes: inv.notes,
                name: inv.name,
              };
              chords.push(enriched);
              this.cache.set(enriched.name, enriched);
            }
          }
        }
      }
    }

    return chords;
  }

  /**
   * Busca rápida de acordes por nome parcial.
   * Ex: 'Cm' encontra Cm, Cm7, Cmaj7, etc.
   */
  searchChord(query: string): Chord[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    // Primeiro tenta cache existente
    const fromCache = Array.from(this.cache.values()).filter((c) =>
      c.name.toLowerCase().includes(q),
    );

    if (fromCache.length > 0) {
      return fromCache;
    }

    // Caso contrário, gera sob demanda
    const results: Chord[] = [];
    const exact = generateChord(q);
    if (exact) {
      results.push(exact);
    }

    // Tenta variações comuns
    const variations = [
      q,
      q + '7',
      q + 'm7',
      q + 'maj7',
      q + 'm',
      q.replace('m', ''),
      q.replace('7', ''),
    ];
    for (const v of variations) {
      const c = generateChord(v);
      if (c && !results.find((r) => r.name === c.name)) {
        results.push(c);
      }
    }

    return results;
  }

  /**
   * Exporta todos os acordes em cache para JSON.
   */
  toJSON(): string {
    const chords = Array.from(this.cache.values());
    return JSON.stringify(chords, null, 2);
  }

  /**
   * Retorna todos os acordes em cache como array.
   */
  getAll(): Chord[] {
    return Array.from(this.cache.values());
  }
}

/** Instância compartilhada (singleton) para uso na aplicação */
export const chordRegistry = new ChordRegistry();