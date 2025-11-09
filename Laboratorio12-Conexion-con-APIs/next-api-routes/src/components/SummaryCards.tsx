export default function SummaryCards({ totalAuthors, totalBooks }: { totalAuthors: number; totalBooks: number }) {
  return (
    <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-lg border p-4">
        <div className="text-sm text-zinc-600">Autores</div>
        <div className="text-3xl font-bold">{totalAuthors}</div>
      </div>
      <div className="rounded-lg border p-4">
        <div className="text-sm text-zinc-600">Libros totales</div>
        <div className="text-3xl font-bold">{totalBooks}</div>
      </div>
    </section>
  );
}
