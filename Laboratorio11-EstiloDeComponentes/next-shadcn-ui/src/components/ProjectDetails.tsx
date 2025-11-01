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
import { Button } from "./ui/button"
import { getProjectById, getMembers, getTasks, type Project, type Member, type Task } from "../lib/data"

export function ProjectDetails({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [project, setProject] = useState<Project | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!open) return
    const p = getProjectById(projectId)
    setProject(p)
    const allMembers = getMembers()
    setMembers(allMembers.filter((m: Member) => (p?.members || []).includes(m.userId)))
    const allTasks = getTasks()
    setTasks(allTasks.filter((t: Task) => t.projectId === projectId))
  }, [open, projectId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          Ver detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{project?.name || "Detalle de Proyecto"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Descripción</h3>
            <p className="text-sm text-muted-foreground">{project?.description || "-"}</p>
          </div>

          <div>
            <h3 className="font-medium">Miembros</h3>
            {members.length ? (
              <ul className="space-y-1">
                {members.map((m: Member) => (
                  <li key={m.userId} className="text-sm">
                    {m.name} — <span className="text-xs text-muted-foreground">{m.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay miembros asignados</p>
            )}
          </div>

          <div>
            <h3 className="font-medium">Tareas</h3>
            {tasks.length ? (
              <ul className="space-y-1">
                {tasks.map((t: Task) => (
                  <li key={t.id} className="text-sm">
                    {t.description} — <span className="text-xs text-muted-foreground">{t.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No hay tareas para este proyecto</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}