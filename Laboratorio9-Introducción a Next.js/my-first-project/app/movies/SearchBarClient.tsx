"use client"
import { useEffect, useMemo, useState } from 'react'
import MovieList from './components/MovieList'
import { Movie, MovieDetail } from './interface/movieInterface'

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
        const res = await fetch(url.toString())
        const data = await res.json()
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
    // fetch details by id
    try {
      const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`
      const res = await fetch(url)
      const data = await res.json()
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
        <p className="mt-2 text-xs text-foreground/60">
          General: https://www.omdbapi.com/?apikey={API_KEY}&s=marvel — Por título y año: &t=suits&y=2012 — Por ID: &i=tt3784006
        </p>
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

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-xl border border-foreground/15 bg-background p-4 shadow-2xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="inline-flex h-8 items-center rounded px-2 text-sm border border-foreground/20 hover:bg-foreground/5">Cerrar</button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

function MovieDetailView({ movie, detail }: { movie: Movie | null; detail: MovieDetail | null }) {
  if (!movie) return null
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
        alt={movie.Title}
        className="w-full sm:w-48 h-64 object-cover rounded-md border border-foreground/10"
      />
      <div className="flex-1">
        <h3 className="text-xl font-bold">{movie.Title} <span className="text-foreground/70 font-normal">({movie.Year})</span></h3>
        {detail ? (
          <div className="mt-2 space-y-2 text-sm">
            {detail.Genre && <p><strong>Género:</strong> {detail.Genre}</p>}
            {detail.Runtime && <p><strong>Duración:</strong> {detail.Runtime}</p>}
            {detail.Director && <p><strong>Director:</strong> {detail.Director}</p>}
            {detail.Actors && <p><strong>Actores:</strong> {detail.Actors}</p>}
            {detail.imdbRating && <p><strong>IMDb:</strong> {detail.imdbRating}</p>}
            {detail.Plot && <p className="text-foreground/80">{detail.Plot}</p>}
          </div>
        ) : (
          <p className="mt-2 text-sm text-foreground/70">Cargando detalles…</p>
        )}
      </div>
    </div>
  )
}

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

export default SearchBar