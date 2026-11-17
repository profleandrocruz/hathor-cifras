import { useState, useMemo } from 'react'
import { chordRegistry } from '../modules/chords'
import ChordDiagram from '../components/ChordDiagram'

const Dicionario = () => {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('todos')
  const allChords = useMemo(() => chordRegistry.generateAllChords(), [])
  const filtered = useMemo(() => allChords.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) &&
    (typeFilter === 'todos' || c.type === typeFilter || c.name.includes(typeFilter))
  ), [query, typeFilter, allChords])
  const types = ['todos', '', 'm', '7', 'm7', 'maj7', 'sus2', 'sus4', 'dim', 'dim7', 'aug', '6', 'm6', '9', 'add9']
  const labels = { todos: 'Todos', '': 'Maior', m: 'Menor', '7': '7', m7: 'm7', maj7: 'maj7', sus2: 'sus2', sus4: 'sus4', dim: 'dim', dim7: 'dim7', aug: 'aug', '6': '6', m6: 'm6', '9': '9', add9: 'add9' }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dicionário de Acordes</h1>
          <p className="text-gray-600 dark:text-gray-400">Geração automática de acordes para violão. Teoria musical e formas CAGED. {filtered.length} encontrados.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Buscar</h4>
              <input type="text" placeholder="Ex: C, Cm, F#m7, G/B" value={query} onChange={e => setQuery(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tipo</h4>
              <div className="space-y-1">
                {types.map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${typeFilter === t ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{labels[t]}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex justify-between items-end mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} acorde(s)</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">Gerado dinamicamente</span>
            </div>
            {filtered.map(chord => (
              <div key={chord.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{chord.name}</h3>
                  {chord.barre?.barre && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">Pestana casa {chord.barre.fret}</span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Notas: {chord.notes.join(', ')}</p>
                <div className="mt-3">
                  <ChordDiagram chord={chord} showLegend />
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="col-span-2 text-center py-10 text-gray-500 dark:text-gray-400">Nenhum acorde encontrado.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dicionario