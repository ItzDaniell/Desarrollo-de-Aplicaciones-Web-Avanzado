"use client"
import { Movie } from "../interface/movieInterface";


const MovieCard = ({ movie, onClick }: { movie: Movie; onClick?: () => void }) => {
  return (
    <div
      className="rounded-xl overflow-hidden border border-foreground/10 bg-background/90 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.();
      }}
    >
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/330px-Placeholder_view_vector.svg.png"}
        alt={movie.Title}
        className="w-full h-80 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">
          {movie.Title}
        </h2>
        <p className="text-sm text-foreground/70">{movie.Year}</p>
        <p className="text-xs mt-1 inline-flex items-center rounded px-2 py-0.5 border border-foreground/15 text-foreground/80 uppercase tracking-wide">
          {movie.Type}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
