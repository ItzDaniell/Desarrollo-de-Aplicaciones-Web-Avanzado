"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Calendar } from "./ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { getProjects, getMembers, createTask, updateTask, getTaskById } from "../lib/data"

type Props = {
  taskId?: string | null
  onSaved?: () => void
  // optional custom trigger (node) not supported in this simple implementation
}

export function TaskForm({ taskId, onSaved }: Props) {
  const [open, setOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [form, setForm] = useState({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" })
  const calendarRef = React.useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setProjects(getProjects())
    setMembers(getMembers())
  }, [])

  useEffect(() => {
    if (!open) return
    if (taskId) {
      const t = getTaskById(taskId)
      if (t) setForm({ description: t.description || "", projectId: t.projectId || "", status: t.status || "Pendiente", priority: t.priority || "Media", userId: t.userId || "", dateline: t.dateline || "" })
    } else {
      setForm({ description: "", projectId: "", status: "Pendiente", priority: "Media", userId: "", dateline: "" })
    }
  }, [open, taskId])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!calendarOpen) return
      if (!calendarRef.current) return
      const target = e.target as Node
      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setCalendarOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [calendarOpen])

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (taskId) {
      updateTask(taskId, form)
    } else {
      createTask(form)
    }
    window.dispatchEvent(new CustomEvent('app-data-changed'))
    setOpen(false)
    onSaved?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{taskId ? 'Editar' : 'Nueva Tarea'}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{taskId ? 'Editar Tarea' : 'Crear Tarea'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid gap-2 mt-3 mb-3">
            <Label>Descripción</Label>
            <Input value={form.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid gap-2 mt-3 mb-3">
            <Label>Proyecto</Label>
            <Select value={form.projectId} onValueChange={(v: string) => setForm({ ...form, projectId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona proyecto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 mt-3 mb-3">
            <Label>Asignado a</Label>
            <Select value={form.userId} onValueChange={(v: string) => setForm({ ...form, userId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona miembro" />
              </SelectTrigger>
              <SelectContent>
                {members.map(m => <SelectItem key={m.userId} value={m.userId}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 mt-3 mb-3">
            <Label>Fecha límite</Label>
            <div className="relative" ref={calendarRef}>
              <div className="flex items-center gap-2">
                <Input readOnly value={form.dateline || ""} placeholder="Selecciona una fecha" onClick={() => setCalendarOpen((s) => !s)} />
                <Button size="sm" type="button" variant="ghost" onClick={() => setCalendarOpen((s) => !s)} aria-label="Abrir calendario">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
              {calendarOpen && (
                <div className="absolute z-50 bottom-full mb-2 bg-popover p-2 rounded-md shadow-lg border">
                  <Calendar
                    mode="single"
                    selected={form.dateline ? new Date(form.dateline) : undefined}
                    onSelect={(date) => {
                      if (!date) {
                        setForm({ ...form, dateline: "" })
                        return
                      }
                      const d = date instanceof Date ? date : Array.isArray(date) ? date[0] : undefined
                      if (!d) return setForm({ ...form, dateline: "" })
                      setForm({ ...form, dateline: d.toISOString().slice(0, 10) })
                      setCalendarOpen(false)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit">Guardar</Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          </div>
        </form>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  )
}
