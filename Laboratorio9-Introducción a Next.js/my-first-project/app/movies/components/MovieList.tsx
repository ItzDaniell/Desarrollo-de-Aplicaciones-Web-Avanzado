"use client"
import { Movie } from "../interface/movieInterface";
import MovieCard from "./MovieCard";

const MovieList = ({ movies, onSelect }: { movies: Movie[]; onSelect?: (movie: Movie) => void }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {movies.map((movie, idx) => (
        <MovieCard
          key={`${(movie.imdbID || `${movie.Title}-${movie.Year}`)}-${idx}`}
          movie={movie}
          onClick={() => onSelect?.(movie)}
        />
      ))}
    </div>
  );
};

export default MovieList;
