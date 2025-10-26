"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="p-8 max-w-3xl mx-auto text-center text-white">
      <h2 className="text-2xl font-semibold mb-2">Ocurrió un error al cargar el personaje</h2>
      <p className="text-zinc-300 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 rounded bg-white text-gray-900 hover:bg-zinc-200"
      >
        Reintentar
      </button>
    </div>
  );
}
