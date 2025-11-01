"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { getMembers, createMember, updateMember, deleteMember, getProjects } from "../lib/data"

export function TeamManager() {
  const [members, setMembers] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", email: "", role: "", position: "", phone: "", birthdate: "", projectId: "", isActive: true })
  const [editing, setEditing] = useState<string | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    setMembers(getMembers())
    setProjects(getProjects())
    const onChange = () => {
      setMembers(getMembers())
      setProjects(getProjects())
    }
    window.addEventListener("app-data-changed", onChange)
    return () => window.removeEventListener("app-data-changed", onChange)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateMember(editing, { ...form })
    } else {
      createMember({ ...form })
    }
    setForm({ name: "", email: "", role: "", position: "", phone: "", birthdate: "", projectId: "", isActive: true })
    setEditing(null)
    window.dispatchEvent(new CustomEvent('app-data-changed'))
  }

  const startEdit = (m: any) => {
    setEditing(m.userId)
    setForm({
      name: m.name || "",
      email: m.email || "",
      role: m.role || "",
      position: m.position || "",
      phone: m.phone || "",
      birthdate: m.birthdate || "",
      projectId: m.projectId || "",
      isActive: m.isActive !== false,
    })
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid gap-2 mb-3">
              <Label>Nombre</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid gap-2 mb-3">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="grid gap-2 mb-3">
              <Label>Rol</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div className="grid gap-2 mb-3">
              <Label>Posición</Label>
              <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </div>
            <div className="grid gap-2 mb-3">
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid gap-2 mb-3">
              <Label>Fecha de nacimiento</Label>
              <Input type="date" value={form.birthdate} onChange={(e) => setForm({ ...form, birthdate: e.target.value })} />
            </div>
            <div className="grid gap-2 mb-3">
              <Label>Proyecto asignado</Label>
              <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="(ninguno)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">(ninguno)</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Checkbox checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v === true })} />
              <Label>Activo</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? "Actualizar" : "Crear"}</Button>
              {editing && (
                <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ name: "", email: "", role: "", position: "", phone: "", birthdate: "", projectId: "", isActive: true }) }}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-2">
          {members.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No hay nada por ahora</div>
          ) : (
            members.map((m) => (
              <div key={m.userId} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">{m.name} {m.isActive === false && <span className="text-xs text-red-500">(inactivo)</span>}</div>
                  <div className="text-xs text-muted-foreground">{m.role} • {m.email}</div>
                  <div className="text-xs text-muted-foreground">{m.position || "-"} • {projects.find((p) => p.id === m.projectId)?.name || "(sin proyecto)"} • {m.birthdate || "-"}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(m)}>Editar</Button>
                  <Button size="sm" variant="destructive" onClick={() => { setDeleteCandidate(m.userId); setConfirmOpen(true) }}>Eliminar</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar miembro</DialogTitle>
            <div className="text-sm text-muted-foreground">¿Seguro que quieres eliminar este miembro?</div>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => {
              if (deleteCandidate) {
                deleteMember(deleteCandidate)
                window.dispatchEvent(new CustomEvent('app-data-changed'))
              }
              setConfirmOpen(false)
              setDeleteCandidate(null)
            }}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
