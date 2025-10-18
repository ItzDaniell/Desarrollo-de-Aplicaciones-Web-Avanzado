import axios from "axios";
import SearchBarClient from "./SearchBarClient";

const MoviesPage = async () => {
  async function getMovies() {
    const response = await axios.get(
      "http://www.omdbapi.com/?s=batman&apikey=17481097"
    );

    return response.data.Search;
  }
  const movies = await getMovies();

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Películas</h1>
          <p className="text-sm text-foreground/70 mt-1">Resultados desde OMDb API</p>
        </div>
      </div>
      <SearchBarClient initialMovies={movies} />
    </section>
  );
};

export default MoviesPage;
