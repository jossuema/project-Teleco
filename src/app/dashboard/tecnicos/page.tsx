"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const columns = [
  { key: "id_tecnico", header: "ID" },
  { key: "nombre", header: "Nombre" },
  { key: "apellido", header: "Apellido" },
  {
    key: "movimientos",
    header: "Movimientos",
    render: (tecnico: any) => tecnico.movimientos?.length || 0,
  },
]

// API calls
async function createTecnico(data: { nombre: string; apellido: string }) {
  const response = await fetch("/api/tecnicos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al crear técnico")
  return response.json()
}

async function updateTecnico(id: number, data: { nombre: string; apellido: string }) {
  const response = await fetch(`/api/tecnicos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al actualizar técnico")
  return response.json()
}

async function deleteTecnico(id: number) {
  const response = await fetch(`/api/tecnicos/${id}`, {
    method: "DELETE" })
  if (!response.ok) throw new Error("Error al eliminar técnico")
  return id
}

async function fetchTecnicos() {
  const response = await fetch("/api/tecnicos")
  if (!response.ok) throw new Error("Error al cargar técnicos")
  return response.json()
}

export default function TecnicosPage() {
  const queryClient = useQueryClient()
  const { data: tecnicos = [], isLoading } = useQuery({
    queryKey: ["tecnicos"],
    queryFn: fetchTecnicos,
  })

  // Estado para el diálogo y edición
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTecnico, setEditingTecnico] = useState<any>(null)
  const [form, setForm] = useState({ nombre: "", apellido: "" })

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createTecnico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tecnicos"] })
      setIsDialogOpen(false)
      setForm({ nombre: "", apellido: "" })
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { nombre: string; apellido: string } }) => updateTecnico(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tecnicos"] })
      setIsDialogOpen(false)
      setEditingTecnico(null)
      setForm({ nombre: "", apellido: "" })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteTecnico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tecnicos"] })
    },
  })

  // Handlers
  const handleCreate = () => {
    setEditingTecnico(null)
    setForm({ nombre: "", apellido: "" })
    setIsDialogOpen(true)
  }
  const handleEdit = (tecnico: any) => {
    setEditingTecnico(tecnico)
    setForm({ nombre: tecnico.nombre, apellido: tecnico.apellido })
    setIsDialogOpen(true)
  }
  const handleDelete = (tecnico: any) => {
    if (confirm(`¿Estás seguro de eliminar el técnico ${tecnico.nombre} ${tecnico.apellido}?`)) {
      deleteMutation.mutate(tecnico.id_tecnico)
    }
  }
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.apellido) return
    if (editingTecnico) {
      updateMutation.mutate({ id: editingTecnico.id_tecnico, data: form })
    } else {
      createMutation.mutate(form)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Técnicos</h1>
        <p className="mt-2 text-gray-600">Gestiona el personal técnico</p>
      </div>
      <Button onClick={handleCreate} className="mb-4">Crear Técnico</Button>
      <DataTable
        title="Lista de Técnicos"
        data={tecnicos}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editingTecnico ? "Editar Técnico" : "Crear Técnico"}</DialogTitle>
            <DialogDescription>
              {editingTecnico ? "Actualiza los datos del técnico." : "Agrega un nuevo técnico."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingTecnico ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}