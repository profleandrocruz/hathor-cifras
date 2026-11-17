# 🎸 Diagramas de Acorde de Violão - hathor-cifras

Este documento explica como usar o componente `AcordeDiagram` integrado ao projeto **hathor-cifras**, utilizando **[svguitar-react](https://www.npmjs.com/package/@achorde/svguitar-react)** (v3) e **[achorde-musical-domain](https://www.npmjs.com/package/achorde-musical-domain)** (v0.4.0).

## 📦 Dependências já instaladas

Adicionadas ao `package.json` do `hathor-cifras`:

```json
"@achorde/svguitar-react": "^3.0.0",
"achorde-musical-domain": "^0.4.0"
```

## 📁 Arquivos criados

| Caminho | Descrição |
|---------|-----------|
| `src/components/chord-diagram/AcordeDiagram.tsx` | Componente reutilizável de diagrama de acorde |
| `src/components/chord-diagram/ChordDiagramExample.tsx` | Exemplo de uso com Fá Maior e Dó Maior |

## 🚀 Como usar

### 1. Importar o componente

```tsx
import AcordeDiagram from '@/components/chord-diagram/AcordeDiagram';
```

### 2. Exemplo com pestana (barre chord) - Fá Maior

```tsx
import type { FrettedInstrumentVoicing } from '@achorde/musical-domain';

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
  barres: [{ fret: 1, fromStringIndex: 1, toStringIndex: 6, finger: 1 }],
  baseFret: 1,
  source: 'manual',
  quality: 'exact',
};

// No JSX:
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
/>
```

### 3. Exemplo sem pestana - Dó Maior

```tsx
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

<AcordeDiagram voicing={cMajorVoicing} view="horizontal-right" />
```

### 4. Exemplo com notação de casas (fret notation)

```tsx
<AcordeDiagram
  strings={6}
  frets={4}
  tuning={['E2', 'A2', 'D3', 'G3', 'B3', 'E4']}
  chord="x32010"
  view="horizontal-right"
/>
```

## 📋 Props do AcordeDiagram

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `voicing` | `FrettedInstrumentVoicing` | — | Dados do acorde (fonte principal) |
| `view` | `ViewId` | `"horizontal-right"` | `"horizontal-right"`, `"horizontal-left"`, `"vertical-right"`, `"vertical-left"` |
| `strings` | `number` | `6` | Número de cordas |
| `frets` | `number` | `4` | Número de casas a exibir |
| `tuning` | `string[]` | — | Afinação das cordas (notação científica) |
| `chord` | `string` | — | Notação de casas (ex: `"x32010"`) |
| `firstFret` | `number` | — | Primeira casa exibida (indicação de posição) |
| `width` / `height` | `number` | — | Dimensões do SVG em pixels |
| `dotColor` | `string` | `"#2c3e8f"` | Cor dos círculos dos dedos |
| `dotTextColor` | `string` | `"#FFFFFF"` | Cor dos números dentro dos dedos |
| `dotSize` | `number` | `0.8` | Tamanho dos círculos dos dedos |
| `barreColor` | `string` | `"#2c3e8f"` | Cor do retângulo da pestana |
| `barreHeight` | `number` | `0.5` | Altura da pestana |
| `barresWidth` | `number` | `0.8` | Largura da pestana |
| `barresOpacity` | `number` | `1` | Opacidade da pestana (0-1) |
| `backgroundColor` | `string` | `"transparent"` | Cor de fundo |
| `onError` | `(message, code) => void` | — | Callback de erro de validação |
| `invalidBehavior` | `"keep-previous" \| "render-fallback" \| "suppress"` | `"keep-previous"` | Comportamento com dados inválidos |

## ℹ️ Indicação de Casa (Fret / Posição)

Quando a pestana não está na primeira casa, use:

- **`baseFret`** no objeto `FrettedInstrumentVoicing` — indica a primeira casa do diagrama
- **`firstFret`** como prop do `AcordeDiagram` — alternativa direta

A biblioteca **não** adiciona automaticamente o rótulo da casa (ex: "3ª casa"); você deve definir `baseFret` ou `firstFret` explicitamente.

## 🎨 Customização Visual (padrão do exemplo)

- **Dedos**: círculos azuis (`#2c3e8f`) com números brancos (`#FFFFFF`)
- **Pestana**: retângulo na mesma cor azul

Ajuste `dotColor`, `dotTextColor`, `dotSize`, `barreColor`, `barreHeight`, `barresWidth` e `barresOpacity` conforme necessário.

## 🔧 Executar

```bash
cd hathor-cifras
npm run dev      # servidor de desenvolvimento
npm run build    # build para produção
npm run preview  # preview da build
```

## ✅ Validação TypeScript

O projeto já passa em `npx tsc --noEmit` com o componente `AcordeDiagram` integrado.

## 📚 Referências

- [svguitar-react (npm)](https://www.npmjs.com/package/@achorde/svguitar-react)
- [achorde-musical-domain (npm)](https://www.npmjs.com/package/achorde-musical-domain)
- [Storybook svguitar-react](https://storybook-svguitar-react.vercel.app/)
- [Documentação svguitar (core)](https://omnibrain.github.io/svguitar/)
