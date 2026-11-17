import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {
  const { data: popular, isLoading } = useQuery({
    queryKey: ['popular-musicas'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8080/api/musicas/popular')
      return response.data
    },
  })

  const { data: recentes, isLoading: isLoadingRecentes } = useQuery({
    queryKey: ['recentes'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8080/api/musicas/recentes')
      return response.data
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Banner Principal */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-purple-800 text-white mb-8 sm:mb-10">
        <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            Cifras de Violão para Todos
          </h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl">
            Descubra, estude e compartilhe as melhores cifras de violão.
            Aplicativo PWA com suporte offline e instalação nativa.
          </p>
          <Link
            to="/cifras"
            className="inline-flex items-center px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
          >
            Explorar Cifras
          </Link>
        </div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
      </section>

      {/* Músicas Populares */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Músicas Populares
          </h3>
          <Link
            to="/cifras"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
          >
            Ver todas →
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : popular?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {popular.map((music) => (
              <Link
                key={music.id}
                to={`/music/${music.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow group"
              >
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {music.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">
                  {music.artist}
                </p>
                <div className="flex items-center text-yellow-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={i < music.popularity ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhuma música popular encontrada.</p>
        )}
      </section>


      {/* Últimas Adicionadas */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Últimas Adicionadas
          </h3>
          <Link
            to="/cifras?ordenar=recentes"
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
          >
            Ver todas →
          </Link>
        </div>
        {isLoadingRecentes ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 sm:h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : recentes?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentes.map((music) => (
              <Link
                key={music.id}
                to={`/music/${music.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow group"
              >
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {music.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">
                  {music.artist}
                </p>
                <span className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  {new Date(music.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhuma música recente encontrada.</p>
        )}
      </section>

      {/* Categorias Populares */}
      <section>
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
          Categorias Populares
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['Gospel', 'Sertanejo', 'Rock', 'Pop', 'MPB'].map((category) => (
            <Link
              key={category}
              to={`/cifras?categoria=${category}`}
              className="px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm sm:text-base"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home

