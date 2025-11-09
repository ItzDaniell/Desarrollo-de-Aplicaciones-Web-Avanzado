"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Toaster, toast } from "sonner";

export default function AuthorDetailPage() {
  const params = useParams<{ id: string }>();
  const authorId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [author, setAuthor] = useState<any | null>(null);
  const [stats, setStats] = useState<any | null>(null);

  // Edit author dialog
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthYear, setBirthYear] = useState("");

  // Add book dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [genre, setGenre] = useState("");
  const [pages, setPages] = useState("");

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [aRes, sRes] = await Promise.all([
        fetch(`/api/authors/${authorId}`, { cache: "no-store" }),
        fetch(`/api/authors/${authorId}/stats`, { cache: "no-store" }),
      ]);
      if (!aRes.ok) throw new Error("No se pudo cargar el autor");
      if (!sRes.ok) throw new Error("No se pudieron cargar estadísticas");
      const aJson = await aRes.json();
      const sJson = await sRes.json();
      setAuthor(aJson);
      setStats(sJson);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authorId) loadAll();
  }, [authorId]);

  function openEdit() {
    if (!author) return;
    setName(author.name ?? "");
    setEmail(author.email ?? "");
    setBio(author.bio ?? "");
    setNationality(author.nationality ?? "");
    setBirthYear(author.birthYear ?? "");
    setEditOpen(true);
  }

  async function submitEdit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/authors/${authorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, bio, nationality, birthDate: birthYear }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo actualizar el autor");
      }
      toast.success("Autor actualizado");
      setEditOpen(false);
      await loadAll();
    } catch (e: any) {
      toast.error(e.message || "Error al actualizar autor");
    }
  }

  function openCreateBook() {
    setTitle("");
    setDescription("");
    setIsbn("");
    setPublishedYear("");
    setGenre("");
    setPages("");
    setCreateOpen(true);
  }

  async function submitCreateBook(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          isbn,
          publishedYear,
          genre,
          pages,
          authorId,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo crear el libro");
      }
      toast.success("Libro creado");
      setCreateOpen(false);
      await loadAll();
    } catch (e: any) {
      toast.error(e.message || "Error al crear libro");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="flex items-center justify-center py-16"><Spinner className="size-6" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Autor</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold mb-2">{author?.name}</h1>
      <p className="text-zinc-600 mb-4">{author?.email}</p>

      <div className="flex gap-2 mb-4">
        <Button onClick={openEdit}>Editar autor</Button>
        <Button variant="secondary" onClick={openCreateBook}>Agregar libro</Button>
      </div>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground flex flex-wrap gap-3">
          {author?.bio && <span>Bio: {author.bio}</span>}
          {author?.nationality && <span>Nacionalidad: {author.nationality}</span>}
          {author?.birthYear && <span>Año de nacimiento: {author.birthYear}</span>}
          <span>Libros: {author?._count?.books ?? 0}</span>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground flex flex-wrap gap-3">
          {stats ? (
            <>
              <span>Total de libros: {stats.totalBooks}</span>
              {stats.firstBook && <span>Primer libro: {stats.firstBook.title} ({stats.firstBook.year})</span>}
              {stats.latestBook && <span>Último libro: {stats.latestBook.title} ({stats.latestBook.year})</span>}
              <span>Páginas promedio: {stats.averagePages}</span>
              {stats.genres?.length > 0 && <span>Géneros: {stats.genres.join(', ')}</span>}
              {stats.longestBook && <span>Más largo: {stats.longestBook.title} ({stats.longestBook.pages} págs)</span>}
              {stats.shortestBook && <span>Más corto: {stats.shortestBook.title} ({stats.shortestBook.pages} págs)</span>}
            </>
          ) : (
            <span>No hay estadísticas.</span>
          )}
        </CardContent>
      </Card>

      <h2 className="text-xl font-medium mb-2">Libros</h2>
      <div className="h-px bg-border mb-3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {author?.books?.map((b: any) => (
          <Card key={b.id} className="p-4">
            <div className="text-base font-medium mb-1">{b.title}</div>
            <div className="text-sm text-muted-foreground mb-2">{b.publishedYear ?? ''}</div>
            <div className="text-sm">{b.description || 'Sin descripción'}</div>
          </Card>
        ))}
      </div>

      <Toaster richColors position="top-right" />

      {/* Edit author dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar autor</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form onSubmit={submitEdit} className="grid gap-3">
            <div className="flex flex-col gap-1">
              <Label>Nombre</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Bio</Label>
              <Input value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label>Nacionalidad</Label>
                <Input value={nationality} onChange={(e) => setNationality(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Año de nacimiento</Label>
                <Input value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create book dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo libro</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form onSubmit={submitCreateBook} className="grid gap-3">
            <div className="flex flex-col gap-1">
              <Label>Título</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
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
                <Input value={genre} onChange={(e) => setGenre(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Páginas</Label>
                <Input value={pages} onChange={(e) => setPages(e.target.value)} />
              </div>
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Crear</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
