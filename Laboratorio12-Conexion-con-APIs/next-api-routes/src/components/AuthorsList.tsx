import * as Collapsible from "@radix-ui/react-collapsible";
import { Pencil2Icon, TrashIcon, ChevronDownIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthorsList({
  authors,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  onToggleBooks,
  openBooksAuthorId,
  authorBooks,
  booksLoading,
  booksError,
}: {
  authors: any[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (a: any) => void;
  onDelete: (a: any) => void;
  onToggleBooks: (a: any) => void;
  openBooksAuthorId: string | null;
  authorBooks: Record<string, any[]>;
  booksLoading: Record<string, boolean>;
  booksError: Record<string, string | null>;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-medium">Autores</h2>
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <ReloadIcon /> {loading ? "Actualizando..." : "Refrescar"}
        </Button>
      </div>
      <div className="rounded-lg border divide-y">
        {authors.map((a: any) => (
          <div key={a.id} className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-zinc-600">{a.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link href={`/authors/${a.id}`}>Ver estadísticas</Link>
                </Button>
                <Button variant="secondary" onClick={() => onEdit(a)}>
                  <Pencil2Icon /> Editar
                </Button>
                <Button variant="destructive" onClick={() => onDelete(a)}>
                  <TrashIcon /> Eliminar
                </Button>
                <Button variant="outline" onClick={() => onToggleBooks(a)}>
                  <ChevronDownIcon className={openBooksAuthorId === a.id ? "rotate-180 transition-transform" : "transition-transform"} />
                  {openBooksAuthorId === a.id ? "Ocultar libros" : "Ver libros"}
                </Button>
              </div>
            </div>
            <div className="text-sm text-zinc-600">Libros: {a?._count?.books ?? 0}</div>
            <Collapsible.Root open={openBooksAuthorId === a.id}>
              <Collapsible.Content className="mt-2 rounded border bg-zinc-50">
                {booksLoading[a.id] && (
                  <div className="p-3 text-sm">Cargando libros...</div>
                )}
                {booksError[a.id] && (
                  <div className="p-3 text-sm text-red-600">{booksError[a.id]}</div>
                )}
                {!booksLoading[a.id] && !booksError[a.id] && (
                  <ul className="p-3 space-y-2">
                    {(authorBooks[a.id] || []).length === 0 && (
                      <li className="text-sm">Sin libros</li>
                    )}
                    {(authorBooks[a.id] || []).map((b: any) => (
                      <li key={b.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{b.title}</div>
                          <div className="text-sm text-zinc-600">{b.publishedYear ?? ""}</div>
                        </div>
                        <div className="text-sm text-zinc-700">{b.genre ?? ""}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        ))}
        {authors.length === 0 && !loading && (
          <div className="p-6 text-sm text-zinc-600">No hay autores. Crea el primero en la pestaña Crear.</div>
        )}
      </div>
    </section>
  );
}
