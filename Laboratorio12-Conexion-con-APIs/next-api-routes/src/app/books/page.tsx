"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";

// Helpers
const SORT_FIELDS = [
  { value: "createdAt", label: "Fecha de creación" },
  { value: "title", label: "Título" },
  { value: "publishedYear", label: "Año" },
] as const;

export default function BooksPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [genres, setGenres] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<string>("all");
  const [authorId, setAuthorId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"title" | "publishedYear" | "createdAt">("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Create/Edit dialogs state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [deleting, setDeleting] = useState<any | null>(null);

  // Create/Edit form fields
  const [title, setTitle] = useState("");
  const [formAuthorId, setFormAuthorId] = useState("");
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [formGenre, setFormGenre] = useState("");
  const [pages, setPages] = useState("");

  // Derived
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Load authors for selects
  async function loadAuthors() {
    try {
      const res = await fetch("/api/authors", { cache: "no-store" });
      if (!res.ok) throw new Error("No se encontraron autores");
      const json = await res.json();
      setAuthors(json);
    } catch (e: any) {
      toast.error(e.message || "No se encontraron autores");
    }
  }

  // Fetch books using search API
  async function loadBooks() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const selectedGenre = genre !== "all" ? genre : "";
      const selectedAuthorId = authorId !== "all" ? authorId : "";
      if (search.trim()) params.set("search", search.trim());
      if (selectedGenre) params.set("genre", selectedGenre);
      params.set("page", String(page));
      params.set("limit", String(limit));
      params.set("sortBy", sortBy);
      params.set("order", order);

      // Prefer the search endpoint for combined features; but if authorId filter is needed, we fallback to /api/books with authorId
      if (selectedAuthorId && !search && !selectedGenre) {
        const res = await fetch(`/api/books?authorId=${selectedAuthorId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("No se encontraron libros");
        const list = await res.json();
        setData(list);
        setTotal(list.length);
        setTotalPages(1);
        // Build genres from list as a fallback
        const gset = new Set<string>();
        for (const b of list) if (b.genre) gset.add(b.genre);
        setGenres(Array.from(gset).sort());
      } else {
        const res = await fetch(`/api/books/search?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("No se encontraron libros");
        const json = await res.json();
        setData(json.data || []);
        setTotal(json.pagination?.total || 0);
        setTotalPages(json.pagination?.totalPages || 1);
        // Build genres from current results so dropdown has options
        const gset = new Set<string>();
        for (const b of json.data || []) if (b.genre) gset.add(b.genre);
        setGenres(Array.from(gset).sort());
      }
    } catch (e: any) {
      toast.error(e.message || "No se encontraron libros");
    } finally {
      setLoading(false);
    }
  }

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      loadBooks();
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, genre, authorId, sortBy, order, limit]);

  useEffect(() => {
    loadAuthors();
  }, []);

  useEffect(() => {
    loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function resetForm() {
    setTitle("");
    setFormAuthorId("");
    setDescription("");
    setIsbn("");
    setPublishedYear("");
    setFormGenre("");
    setPages("");
  }

  function openCreate() {
    resetForm();
    setCreateOpen(true);
  }

  function openEdit(b: any) {
    setEditing(b);
    setTitle(b.title ?? "");
    setFormAuthorId(b.authorId ?? "");
    setDescription(b.description ?? "");
    setIsbn(b.isbn ?? "");
    setPublishedYear(b.publishedYear ?? "");
    setFormGenre(b.genre ?? "");
    setPages(b.pages ?? "");
    setEditOpen(true);
  }

  function openDelete(b: any) {
    setDeleting(b);
    setDeleteOpen(true);
  }

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          isbn,
          publishedYear,
          genre: formGenre,
          pages,
          authorId: formAuthorId,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo crear el libro");
      }
      toast.success("Libro creado");
      setCreateOpen(false);
      resetForm();
      loadBooks();
    } catch (e: any) {
      toast.error(e.message || "Error al crear libro");
    }
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    try {
      const res = await fetch(`/api/books/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          isbn,
          publishedYear,
          genre: formGenre,
          pages,
          authorId: formAuthorId || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo actualizar el libro");
      }
      toast.success("Libro actualizado");
      setEditOpen(false);
      setEditing(null);
      resetForm();
      loadBooks();
    } catch (e: any) {
      toast.error(e.message || "Error al actualizar libro");
    }
  }

  async function submitDelete() {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/books/${deleting.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo eliminar el libro");
      }
      toast.success("Libro eliminado");
      setDeleteOpen(false);
      setDeleting(null);
      loadBooks();
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar libro");
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Libros</h1>

      {/* Controls */}
      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-64">
              <div className="text-sm text-muted-foreground mb-1">Buscar</div>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Título o palabras clave" />
            </div>
            <div className="min-w-40">
              <div className="text-sm text-muted-foreground mb-1">Género</div>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {genres.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-56">
              <div className="text-sm text-muted-foreground mb-1">Autor</div>
              <Select value={authorId} onValueChange={setAuthorId}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {authors.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-56">
              <div className="text-sm text-muted-foreground mb-1">Ordenar por</div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SORT_FIELDS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-40">
              <div className="text-sm text-muted-foreground mb-1">Orden</div>
              <Select value={order} onValueChange={(v) => setOrder(v as any)}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Asc</SelectItem>
                  <SelectItem value="desc">Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-32">
              <div className="text-sm text-muted-foreground mb-1">Límite</div>
              <Select value={String(limit)} onValueChange={(v) => setLimit(parseInt(v))}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full sm:w-auto md:ml-auto" onClick={openCreate}>Nuevo libro</Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm">Resultados: {total}</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={!canPrev || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
          <div className="text-sm">Página {page} / {totalPages}</div>
          <Button variant="outline" disabled={!canNext || loading} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
        </div>
      </div>

      <div className="h-px bg-border mb-4" />

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Spinner className="size-6" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((b: any) => (
            <Card key={b.id}>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{b.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openEdit(b)}>Editar</Button>
                    <Button variant="destructive" onClick={() => openDelete(b)}>Eliminar</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-2">{b.author?.name || ""}</div>
                <div className="text-sm">{b.description || "Sin descripción"}</div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                  {b.genre && <span>Género: {b.genre}</span>}
                  {b.publishedYear && <span>Año: {b.publishedYear}</span>}
                  {b.pages && <span>Páginas: {b.pages}</span>}
                  {b.isbn && <span>ISBN: {b.isbn}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Toaster richColors position="top-right" />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo libro</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form onSubmit={submitCreate} className="grid gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="title">Título</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Autor</Label>
              <Select value={formAuthorId} onValueChange={setFormAuthorId}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona autor" /></SelectTrigger>
                <SelectContent>
                  {authors.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Descripción</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label>ISBN</Label>
                <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Año</Label>
                <Input value={publishedYear} onChange={(e) => setPublishedYear(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label>Género</Label>
                <Input value={formGenre} onChange={(e) => setFormGenre(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Páginas</Label>
                <Input value={pages} onChange={(e) => setPages(e.target.value)} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Crear</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar libro</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form onSubmit={submitEdit} className="grid gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="title2">Título</Label>
              <Input id="title2" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Autor</Label>
              <Select value={formAuthorId} onValueChange={setFormAuthorId}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Selecciona autor" /></SelectTrigger>
                <SelectContent>
                  {authors.map((a: any) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label>Descripción</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label>ISBN</Label>
                <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Año</Label>
                <Input value={publishedYear} onChange={(e) => setPublishedYear(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label>Género</Label>
                <Input value={formGenre} onChange={(e) => setFormGenre(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Páginas</Label>
                <Input value={pages} onChange={(e) => setPages(e.target.value)} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar libro</DialogTitle>
            <DialogDescription>¿Seguro que deseas eliminar "{deleting?.title}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={submitDelete}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
