import AcordeDiagram from './AcordeDiagram';
import type { FrettedInstrumentVoicing } from '@achorde/musical-domain';

/**
 * ============================================================================
 * EXEMPLO DE USO - Componente AcordeDiagram
 * ============================================================================
 *
 * Este arquivo demonstra como usar o AcordeDiagram dentro do projeto hathor-cifras.
 * Não substitui o App.jsx existente; é um exemplo autônomo que pode ser
 * importado em qualquer rota ou página.
 */

// --------------------------------------------------------------------------
// Exemplo 1: Fá Maior (F) com pestana na 1ª casa (barre chord)
// --------------------------------------------------------------------------
const fMajorVoicing: FrettedInstrumentVoicing = {
  id: 'f-major-barre-1',
  instrumentId: 'guitar',
  tuningId: 'standard',
  chordSymbol: 'F',
  strings: [
    { stringIndex: 1, openNote: 'E4', fret: 1, state: 'fretted', finger: 1 },
    { stringIndex: 2, openNote: 'B3', fret: 1, state: 'fretted', finger: 1 },
    { stringIndex: 3, openNote: 'G3', fret: 2, state: 'fretted', finger: 2 },
    { stringIndex: 4, openNote: 'D3', fret: 3, state: 'fretted', finger: 3 },
    { stringIndex: 5, openNote: 'A2', fret: 1, state: 'fretted', finger: 1 },
    { stringIndex: 6, openNote: 'E2', fret: 1, state: 'fretted', finger: 1 },
  ],
  barres: [
    {
      fret: 1,
      fromStringIndex: 1,
      toStringIndex: 6,
      finger: 1,
    },
  ],
  baseFret: 1,
  source: 'manual',
  quality: 'exact',
};

// --------------------------------------------------------------------------
// Exemplo 2: Dó Maior (C) SEM pestana (acorde aberto)
// --------------------------------------------------------------------------
const cMajorVoicing: FrettedInstrumentVoicing = {
  id: 'c-major-open',
  instrumentId: 'guitar',
  tuningId: 'standard',
  chordSymbol: 'C',
  strings: [
    { stringIndex: 1, openNote: 'E4', fret: 0, state: 'open' },
    { stringIndex: 2, openNote: 'B3', fret: 1, state: 'fretted', finger: 1 },
    { stringIndex: 3, openNote: 'G3', fret: 0, state: 'open' },
    { stringIndex: 4, openNote: 'D3', fret: 2, state: 'fretted', finger: 2 },
    { stringIndex: 5, openNote: 'A2', fret: 3, state: 'fretted', finger: 3 },
    { stringIndex: 6, openNote: 'E2', fret: null, state: 'muted' },
  ],
  barres: [],
  baseFret: 1,
  source: 'manual',
  quality: 'exact',
};

const handleChordError = (message: string, code: string) => {
  console.error(`[ChordDiagram Error ${code}] ${message}`);
};

export default function ChordDiagramExample() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Diagramas de Acorde de Violão</h1>
      <p>
        Renderizados com <strong>svguitar-react</strong> e
        <strong>achorde-musical-domain</strong>.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Fá Maior com pestana */}
        <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h2>Fá Maior (F) – Pestana na 1ª casa</h2>
          <AcordeDiagram
            voicing={fMajorVoicing}
            view="horizontal-right"
            width={320}
            height={240}
            dotColor="#2c3e8f"
            dotTextColor="#FFFFFF"
            dotSize={0.85}
            barreColor="#2c3e8f"
            barreHeight={0.5}
            barresWidth={0.85}
            barresOpacity={0.9}
            onError={handleChordError}
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            baseFret={fMajorVoicing.baseFret} → diagrama inicia na 1ª casa.
          </p>
        </section>

        {/* Dó Maior sem pestana */}
        <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h2>Dó Maior (C) – Sem pestana</h2>
          <AcordeDiagram
            voicing={cMajorVoicing}
            view="horizontal-right"
            width={320}
            height={240}
            dotColor="#2c3e8f"
            dotTextColor="#FFFFFF"
            dotSize={0.85}
            onError={handleChordError}
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            baseFret={cMajorVoicing.baseFret} → diagrama inicia na 1ª casa.
          </p>
        </section>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      {/* Dó Maior via notação de casas */}
      <section style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
        <h2>Dó Maior (C) – Notação de casas ("x32010")</h2>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
          Alternativa ao objeto estruturado: usa a notação de tab
          <code>chord="x32010"</code> junto com a afinação.
        </p>
        <AcordeDiagram
          strings={6}
          frets={4}
          tuning={['E2', 'A2', 'D3', 'G3', 'B3', 'E4']}
          chord="x32010"
          view="horizontal-right"
          width={320}
          height={240}
          dotColor="#2c3e8f"
          dotTextColor="#FFFFFF"
          dotSize={0.85}
          onError={handleChordError}
        />
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
          Notação "x32010": 6ª corda abafada (x), 5ª na casa 3, 4ª na casa 2,
          3ª aberta (0), 2ª na casa 1, 1ª aberta (0).
        </p>
      </section>
    </div>
  );
}
