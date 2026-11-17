 import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaHeart, FaShareAlt, FaPrint, FaExpand, FaPause, FaPlay } from 'react-icons/fa'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'

const lyricLines = [
  '[C] Eu navegarei',
  '[G] No oceano do Espírito',
  '[Em] E ali adorarei',
  '[C] Ao Deus do meu amor',
  '[G] Com todo o meu ser',
  '[D] Te louvarei sempre',
  '[Em] Em espírito e verdade',
  '[C] Só por Ti viver',
]

const chords = [
  { name: 'C', formation: 'x32010' },
  { name: 'G', formation: '320003' },
  { name: 'D', formation: 'xx0232' },
  { name: 'Em', formation: '022000' },
]

const MusicDetail = () => {
  const { id } = useParams()
  const [favorited, setFavorited] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [speed, setSpeed] = useState('medium')
  const [scrollVelocity, setScrollVelocity] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFavorite = () => {
    setFavorited(!favorited)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hathor Cifras',
          text: 'Confira esta cifra no Hathor Cifras',
          url: window.location.href,
        })
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed)
    switch (newSpeed) {
      case 'slow':
        setScrollVelocity(0.5)
        break
      case 'medium':
        setScrollVelocity(1)
        break
      case 'fast':
        setScrollVelocity(2)
        break
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setCurrentLine(0)
    setIsPlaying(false)
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Música {id}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                Artista Exemplo
              </p>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  Gospel
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                  Tom: C
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                  Capotraste: 2
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleFavorite} className={`p-2 rounded-lg transition-colors ${favorited ? 'text-red-500 bg-red-100 dark:bg-red-900' : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900'}`}>
                <FaHeart />
              </button>
              <button onClick={handleShare} className="p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900">
                <FaShareAlt />
              </button>
              <button onClick={handlePrint} className="p-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50">
                <FaPrint />
              </button>
              <button onClick={handleFullscreen} className={`p-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900`}>
                <FaExpand />
              </button>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6 min-h-[300px] ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen p-8' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cifra</h2>
            <div className="flex space-x-2">
              <button onClick={handlePlayPause} className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={handleRestart} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                <IoIosArrowUp />
              </button>
              <button onClick={handleRestart} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                <IoIosArrowDown />
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            {['slow', 'medium', 'fast'].map((s) => (
              <button key={s} onClick={() => handleSpeedChange(s)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${speed === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative border-b border-gray-300 dark:border-gray-600 mb-4 overflow-x-auto">
            <div className="min-w-max space-x-2">
              {lyricLines.map((line, index) => (
                <div key={index} className={`flex-shrink-0 w-32 h-12 flex items-center justify-center text-center font-mono transition-colors ${index === currentLine ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`} onClick={() => setCurrentLine(index)}>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {lyricLines.map((line, index) => (
              <div key={index} className={`flex items-center py-2 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${index === currentLine ? 'font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`} onClick={() => setCurrentLine(index)}>
                <span className="w-8 text-sm font-mono">{index + 1}</span>
                <span className="flex-1 text-sm">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Dicionário de Acordes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {chords.map((chord) => (
              <div key={chord.name} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{chord.name}</div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-400">{chord.formation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MusicDetail

