"use client"
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import MovieList from './components/MovieList'
import { Movie, MovieDetail } from './interface/movieInterface'
import Modal from './components/Modal'
import MovieDetailView from './components/MovieDetailView'
import useDebounce from './hooks/useDebounce'

const API_KEY = 'f1def80d'

type Props = {
  initialMovies: Movie[]
}

const SearchBar = ({ initialMovies }: Props) => {
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('')
  const [results, setResults] = useState<Movie[]>(initialMovies || [])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Movie | null>(null)
  const [detail, setDetail] = useState<MovieDetail | null>(null)
  const [open, setOpen] = useState(false)

  const debouncedQuery = useDebounce(query, 400)
  const debouncedYear = useDebounce(year, 400)

  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery && !debouncedYear) {
        setResults(initialMovies || [])
        return
      }
      setLoading(true)
      const url = new URL('https://www.omdbapi.com/')
      url.searchParams.set('apikey', API_KEY)
      if (debouncedQuery) url.searchParams.set('s', debouncedQuery)
      if (debouncedYear) url.searchParams.set('y', debouncedYear)
      try {
        const res = await axios.get(url.toString())
        const data = res.data
        if (data.Response === 'True' && Array.isArray(data.Search)) {
          setResults(data.Search)
        } else {
          setResults([])
        }
      } finally {
        setLoading(false)
      }
    }
    search()
  }, [debouncedQuery, debouncedYear, initialMovies])

  const openModal = async (movie: Movie) => {
    setSelected(movie)
    setOpen(true)

    try {
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
      const res = await axios.get(url)
      const data = res.data
      if (data && data.Response !== 'False') {
        setDetail({
          Title: data.Title,
          Year: data.Year,
          Genre: data.Genre,
          Plot: data.Plot,
          Poster: data.Poster,
          Runtime: data.Runtime,
          Director: data.Director,
          Actors: data.Actors,
          imdbRating: data.imdbRating,
        })
      } else {
        setDetail(null)
      }
    } catch (e) {
      setDetail(null)
    }
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título (ej: marvel, batman)"
            className="sm:col-span-4 w-full h-11 rounded-md border border-foreground/20 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Año (opcional)"
            inputMode="numeric"
            className="sm:col-span-2 w-full h-11 rounded-md border border-foreground/20 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {loading ? (
          <div className="py-16 text-center text-foreground/70">Buscando…</div>
        ) : (
          <MovieList movies={results} onSelect={openModal} />
        )}
      </div>

      {open && (
        <Modal onClose={() => { setOpen(false); setDetail(null); }}>
          <MovieDetailView movie={selected} detail={detail} />
        </Modal>
      )}
    </div>
  )
}
export default SearchBar