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
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] flex items-center justify-center">
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        {/* Capa oscura */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Contenido del Hero */}
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Explora las mejores películas
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            Descubre información detallada de tus películas favoritas, directo desde la API de OMDb.
          </p>
          <a
            href="#movies"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full transition-transform duration-300 hover:scale-105"
          >
            Ver catálogo
          </a>
        </div>
      </div>

      {/* Sección de contenido */}
      <div id="movies" className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Películas disponibles
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Resultados obtenidos desde OMDb API
            </p>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <SearchBarClient initialMovies={movies} />
      </div>
    </section>
  );
};

export default MoviesPage;
