"use client"
import { Movie, MovieDetail } from "../interface/movieInterface"

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

export default MovieDetailView
