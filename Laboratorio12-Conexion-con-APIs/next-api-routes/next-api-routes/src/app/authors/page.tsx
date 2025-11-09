"use client";
import { useEffect, useMemo, useState } from "react";
import SummaryCards from "@/components/SummaryCards";
import CreateAuthorForm from "@/components/CreateAuthorForm";
import AuthorsList from "@/components/AuthorsList";
import { Toaster, toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [nationality, setNationality] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Author books toggle state (for AuthorsList)
  const [openBooksAuthorId, setOpenBooksAuthorId] = useState<string | null>(null);
  const [authorBooks, setAuthorBooks] = useState<Record<string, any[]>>({});
  const [booksLoading, setBooksLoading] = useState<Record<string, boolean>>({});
  const [booksError, setBooksError] = useState<Record<string, string | null>>({});

  // Edit/Delete dialogs
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editNationality, setEditNationality] = useState("");
  const [editBirthYear, setEditBirthYear] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<any | null>(null);

  const totalAuthors = authors.length;
  const totalBooks = useMemo(() => authors.reduce((sum, a: any) => sum + (a?._count?.books || 0), 0), [authors]);

  function handleCreateChange(field: string, value: string) {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else if (field === "bio") setBio(value);
    else if (field === "nationality") setNationality(value);
    else if (field === "birthDate") setBirthDate(value);
  }

  async function loadAuthors() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/authors", { cache: "no-store" });
      if (!res.ok) throw new Error("No se encontraron autores");
      const data = await res.json();
      setAuthors(data);
    } catch (e: any) {
      setError(e.message || "Error desconocido");
      toast.error(e.message || "Error no se encontraron autores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  async function createAuthor(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, bio, nationality, birthDate }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo crear el autor");
      }
      setName("");
      setEmail("");
      setBio("");
      setNationality("");
      setBirthDate("");
      await loadAuthors();
      toast.success("Autor creado");
    } catch (e: any) {
      setError(e.message || "Error desconocido");
      toast.error(e.message || "Error al crear autor");
    }
  }

  function openEditAuthor(a: any) {
    setSelectedAuthor(a);
    setEditName(a.name ?? "");
    setEditEmail(a.email ?? "");
    setEditBio(a.bio ?? "");
    setEditNationality(a.nationality ?? "");
    setEditBirthYear(a.birthYear ?? "");
    setEditOpen(true);
  }

  async function saveEditAuthor(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAuthor) return;
    const body: any = {
      name: editName,
      email: editEmail,
      bio: editBio,
      nationality: editNationality,
      birthDate: editBirthYear,
    };
    try {
      const res = await fetch(`/api/authors/${selectedAuthor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo actualizar el autor");
      }
      setEditOpen(false);
      setSelectedAuthor(null);
      await loadAuthors();
    } catch (e: any) {
      setError(e.message || "Error desconocido");
      toast.error(e.message || "Error al actualizar autor");
    }
  }

  function requestDeleteAuthor(a: any) {
    setAuthorToDelete(a);
    setConfirmOpen(true);
  }

  async function confirmDeleteAuthor() {
    if (!authorToDelete) return;
    try {
      const res = await fetch(`/api/authors/${authorToDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se pudo eliminar el autor");
      }
      await loadAuthors();
      toast.success("Autor eliminado");
      setConfirmOpen(false);
      setAuthorToDelete(null);
    } catch (e: any) {
      setError(e.message || "Error desconocido");
      toast.error(e.message || "Error al eliminar autor");
    }
  }

  async function toggleBooks(a: any) {
    const id = a.id as string;
    if (openBooksAuthorId === id) {
      setOpenBooksAuthorId(null);
      return;
    }
    setOpenBooksAuthorId(id);
    if (authorBooks[id]) return;
    setBooksLoading((s) => ({ ...s, [id]: true }));
    setBooksError((s) => ({ ...s, [id]: null }));
    try {
      const res = await fetch(`/api/authors/${id}/books`, { cache: "no-store" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "No se encontraron libros");
      }
      const data = await res.json();
      setAuthorBooks((m) => ({ ...m, [id]: data?.books || [] }));
      toast.success("Libros cargados");
    } catch (e: any) {
      setBooksError((s) => ({ ...s, [id]: e.message || "Error" }));
      toast.error(e.message || "No se encontraron libros");
    } finally {
      setBooksLoading((s) => ({ ...s, [id]: false }));
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold mb-6">Autores</h1>

      {/* Estadísticas generales */}
      <div className="mb-6">
        <SummaryCards totalAuthors={totalAuthors} totalBooks={totalBooks} />
      </div>

      {/* Crear autor */}
      <CreateAuthorForm
        name={name}
        email={email}
        bio={bio}
        nationality={nationality}
        birthDate={birthDate}
        loading={loading}
        error={error}
        onChange={handleCreateChange}
        onSubmit={createAuthor}
      />

      {/* Listado de autores con acciones y ver libros */}
      <AuthorsList
        authors={authors}
        loading={loading}
        onRefresh={loadAuthors}
        onEdit={openEditAuthor}
        onDelete={requestDeleteAuthor}
        onToggleBooks={toggleBooks}
        openBooksAuthorId={openBooksAuthorId}
        authorBooks={authorBooks}
        booksLoading={booksLoading}
        booksError={booksError}
      />

      <Toaster richColors position="top-right" />

      {/* Edit author dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar autor</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <form onSubmit={saveEditAuthor} className="space-y-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="edit-bio">Bio</Label>
              <Input id="edit-bio" value={editBio} onChange={(e) => setEditBio(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="edit-nationality">Nacionalidad</Label>
              <Input id="edit-nationality" value={editNationality} onChange={(e) => setEditNationality(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="edit-birth">Año de nacimiento (yyyy)</Label>
              <Input id="edit-birth" value={editBirthYear} onChange={(e) => setEditBirthYear(e.target.value)} />
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

      {/* Confirm delete */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar autor</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminará el autor
              {authorToDelete ? ` "${authorToDelete.name}"` : ""} y sus datos relacionados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeleteAuthor}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
