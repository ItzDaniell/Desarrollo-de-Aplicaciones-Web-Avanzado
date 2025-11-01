"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Calendar } from "./ui/calendar"
import { Checkbox } from "./ui/checkbox"
import { getMembers, createMember, updateMember, deleteMember } from "../lib/data"
import type { Member } from "../lib/data"

interface FormData {
  name: string
  email: string
  role: string
  position: string
  phone: string
  birthdate: Date | undefined
  isActive: boolean
}

export function TeamManager() {
  const [members, setMembers] = useState<Member[]>([])
  const [form, setForm] = useState<FormData>({ 
    name: "", 
    email: "", 
    role: "", 
    position: "", 
    phone: "", 
    birthdate: undefined, 
    isActive: true 
  })
  const [editing, setEditing] = useState<string | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    setMembers(getMembers())
    const onChange = () => {
      setMembers(getMembers())
    }
    window.addEventListener("app-data-changed", onChange)
    return () => window.removeEventListener("app-data-changed", onChange)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const memberData: Omit<Member, 'userId'> = {
      ...form,
      birthdate: form.birthdate?.toISOString().split('T')[0]
    }
    
    if (editing) {
      updateMember(editing, memberData)
    } else {
      createMember(memberData)
    }
    setForm({ 
      name: "", 
      email: "", 
      role: "", 
      position: "", 
      phone: "", 
      birthdate: undefined, 
      isActive: true 
    })
    setEditing(null)
    window.dispatchEvent(new CustomEvent('app-data-changed'))
  }

  const startEdit = (m: Member) => {
    setEditing(m.userId)
    setForm({
      name: m.name,
      email: m.email || "",
      role: m.role || "",
      position: m.position || "",
      phone: m.phone || "",
      birthdate: m.birthdate ? new Date(m.birthdate) : undefined,
      isActive: m.isActive !== false
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
              <Calendar
                mode="single"
                selected={form.birthdate}
                onSelect={date => setForm({ ...form, birthdate: date })}
                className="rounded-md border"
              />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Checkbox checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v === true })} />
              <Label>Activo</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editing ? "Actualizar" : "Crear"}</Button>
              {editing && (
                <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ name: "", email: "", role: "", position: "", phone: "", birthdate: undefined, isActive: true }) }}>
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
                  <div className="text-xs text-muted-foreground">{m.position || "-"} • {m.birthdate || "-"}</div>
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
