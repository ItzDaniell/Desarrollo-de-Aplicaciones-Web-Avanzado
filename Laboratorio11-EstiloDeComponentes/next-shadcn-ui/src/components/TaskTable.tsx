"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Checkbox } from "./ui/checkbox"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"

import { useEffect, useMemo, useState } from "react"
import { getTasks, deleteTask, getSettings, getProjects, getMembers, type Task as DataTask } from "../lib/data"
import { TaskForm } from "./TaskForm"

type TaskRow = {
  id: string
  description: string
  project?: string
  status?: string
  priority?: string
  assignee?: string
  dueDate?: string
}

const statusVariant = (status: string) => {
  switch (status) {
    case "Completado":
      return "default"
    case "En progreso":
      return "secondary"
    case "Pendiente":
      return "outline"
    default:
      return "outline"
  }
}

const priorityVariant = (priority: string) => {
  switch (priority) {
    case "Urgente":
      return "destructive"
    case "Alta":
      return "default"
    case "Media":
      return "secondary"
    case "Baja":
      return "outline"
    default:
      return "outline"
  }
}

export function TasksTable() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(() => getSettings().itemsPerPage || 5)
  const [rows, setRows] = useState<TaskRow[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    const load = () => {
      const t = getTasks()
  const projects = getProjects()
  const members = getMembers()
      // map minimal fields and resolve project name
      setRows(
        t.map((r: DataTask) => ({
          id: r.id,
          description: r.description,
          project: projects.find((p) => p.id === r.projectId)?.name || "-",
          status: r.status || "Pendiente",
          priority: r.priority || "Media",
          assignee: members.find((m) => m.userId === r.userId)?.name || r.userId || "-",
          dueDate: r.dateline || "-",
        }))
      )
    }

    load()

    const onChange = () => load()
    window.addEventListener("app-data-changed", onChange)
    return () => window.removeEventListener("app-data-changed", onChange)
  }, [])

  const total = rows.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const display = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize])

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteId) return
    deleteTask(deleteId)
    window.dispatchEvent(new CustomEvent("app-data-changed"))
    setConfirmOpen(false)
    setDeleteId(null)
  }

  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center justify-end mb-4">
        <TaskForm onSaved={() => window.dispatchEvent(new CustomEvent('app-data-changed'))} />
      </div>
      <div className="overflow-x-auto">
      <Table>
        <TableCaption>Lista de todas las tareas del proyecto</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox />
            </TableHead>
            <TableHead>Tarea</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>Fecha límite</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {display.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-sm text-muted-foreground">No hay nada por ahora</TableCell>
            </TableRow>
          ) : (
            display.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium">{task.description}</TableCell>
              <TableCell>{task.project}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(task.status || "")}>{task.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={priorityVariant(task.priority || "")}>{task.priority}</Badge>
              </TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell className="text-right">
                <TaskForm taskId={task.id} onSaved={() => window.dispatchEvent(new CustomEvent('app-data-changed'))} />
                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(task.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))
          )}
        </TableBody>
  </Table>
  </div>

      {/* Confirm dialog for deleting task */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar tarea</DialogTitle>
            <div className="text-sm text-muted-foreground">¿Estás seguro que deseas eliminar esta tarea?</div>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between p-2">
        <div className="text-sm text-muted-foreground">Mostrando {display.length} de {total}</div>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Anterior
          </Button>
          <span className="text-sm">{page} / {pages}</span>
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(pages, p + 1))}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
