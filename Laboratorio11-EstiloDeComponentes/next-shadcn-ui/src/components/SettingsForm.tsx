"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { getSettings, setSettings } from "../lib/data"

export function SettingsForm() {
  const [form, setForm] = useState({ appName: "", itemsPerPage: 5, enableNotifications: true })

  useEffect(() => {
    setForm(getSettings() as any)
  }, [])

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    setSettings({ ...form })
    window.dispatchEvent(new CustomEvent('app-data-changed'))
    alert('Configuración guardada')
  }

  return (
    <form onSubmit={save} className="space-y-3 max-w-lg">
      <div className="grid gap-2 mt-3 mb-3">
        <Label>Nombre de la App</Label>
        <Input value={form.appName || ""} onChange={(e) => setForm({ ...form, appName: e.target.value })} />
      </div>
      <div className="grid gap-2 mb-3">
        <Label>Items por página</Label>
        <Input value={String(form.itemsPerPage)} onChange={(e) => setForm({ ...form, itemsPerPage: Number(e.target.value) || 5 })} />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="outline" onClick={() => { setForm(getSettings() as any) }}>Restaurar</Button>
      </div>
    </form>
  )
}
