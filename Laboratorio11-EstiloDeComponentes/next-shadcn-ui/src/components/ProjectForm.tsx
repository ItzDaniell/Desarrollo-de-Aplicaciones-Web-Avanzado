"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Checkbox } from "./ui/checkbox"

export function ProjectForm() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priority: "",
  })
  const [members, setMembers] = useState<{ userId: string; name: string }[]>([])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  useEffect(() => {
    // load members from localStorage via helper so we can reuse it
    const loadMembers = () => {
      try {
        const raw = globalThis?.localStorage?.getItem("app_members_v1")
        if (raw) {
          const parsed = JSON.parse(raw) as any[]
          setMembers(parsed.map((m) => ({ userId: m.userId, name: m.name })))
        } else {
          setMembers([])
        }
      } catch (e) {
        setMembers([])
      }
    }

    loadMembers()

    const onDataChanged = () => loadMembers()
    window.addEventListener("app-data-changed", onDataChanged)
    return () => window.removeEventListener("app-data-changed", onDataChanged)
  }, [])

  // reload members when opening the dialog in case they changed since mount
  useEffect(() => {
    if (!open) return
    try {
      const raw = globalThis?.localStorage?.getItem("app_members_v1")
      if (raw) {
        const parsed = JSON.parse(raw) as any[]
        setMembers(parsed.map((m) => ({ userId: m.userId, name: m.name })))
      }
    } catch (e) {
      setMembers([])
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // create project in localStorage
    import("../lib/data").then(({ createProject }) => {
      createProject({ ...formData, members: selectedMembers })
      // notify others that data changed
      window.dispatchEvent(new CustomEvent("app-data-changed"))
      // Limpiar y cerrar
      setFormData({ name: "", description: "", category: "", priority: "" })
      setSelectedMembers([])
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Nuevo Proyecto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa la información del proyecto. Click en guardar cuando termines.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2 mb-3">
              <Label htmlFor="name">
                Nombre del Proyecto <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Mi Proyecto Increíble"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2 mb-3">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                placeholder="Breve descripción del proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2 mb-3">
              <Label htmlFor="category">
                Categoría <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Desarrollo Web</SelectItem>
                  <SelectItem value="mobile">Desarrollo Mobile</SelectItem>
                  <SelectItem value="design">Diseño</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 mb-3">
              <Label htmlFor="priority">
                Prioridad <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 mb-3">
              <Label htmlFor="members">Miembros del equipo</Label>
              {/* chips de miembros seleccionados */}
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedMembers.length ? (
                  selectedMembers.map((id) => {
                    const m = members.find((mm) => mm.userId === id)
                    return (
                      <span key={id} className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-muted text-sm">
                        <span>{m?.name || id}</span>
                        <button type="button" className="text-xs text-red-500" onClick={() => setSelectedMembers((s) => s.filter((x) => x !== id))}>✕</button>
                      </span>
                    )
                  })
                ) : null}
              </div>

              <div className="flex flex-col gap-2 max-h-40 overflow-auto border p-2 rounded">
                {members.length ? (
                  members.map((m) => (
                    <label key={m.userId} className="flex items-center gap-2">
                      <Checkbox checked={selectedMembers.includes(m.userId)} onCheckedChange={(v) => {
                        const isChecked = v === true
                        if (isChecked) setSelectedMembers((s) => Array.from(new Set([...s, m.userId])))
                        else setSelectedMembers((s) => s.filter((id) => id !== m.userId))
                      }} />
                      <span className="text-sm">{m.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No hay miembros</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Proyecto</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
