"use client"


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { DataTable } from "@/components/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const columns = [
  { key: "id_movimiento", header: "ID" },
  { key: "tipo_movimiento", header: "Tipo" },
  { key: "contrato_anterior", header: "Contrato Anterior" },
  { key: "contrato_actual", header: "Contrato Actual" },
  {
    key: "tecnico",
    header: "Técnico",
    render: (movimiento: any) => 
      movimiento.tecnico ? 
        `${movimiento.tecnico.nombre} ${movimiento.tecnico.apellido}` :
        "Sin asignar",
  },
  { key: "observacion", header: "Observación" },
]

// API calls
async function createMovimiento(data: any) {
  const response = await fetch("/api/movimientos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al crear movimiento")
  return response.json()
}

async function updateMovimiento(id: number, data: any) {
  const response = await fetch(`/api/movimientos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al actualizar movimiento")
  return response.json()
}

async function deleteMovimiento(id: number) {
  const response = await fetch(`/api/movimientos/${id}`, {
    method: "DELETE" })
  if (!response.ok) throw new Error("Error al eliminar movimiento")
  return id
}

async function fetchContratos() {
  const response = await fetch("/api/contratos")
  if (!response.ok) throw new Error("Error al cargar contratos")
  return response.json()
}

async function fetchTecnicos() {
  const response = await fetch("/api/tecnicos")
  if (!response.ok) throw new Error("Error al cargar técnicos")
  return response.json()
}


async function fetchMovimientos() {
  const response = await fetch("/api/movimientos")
  if (!response.ok) throw new Error("Error al cargar movimientos")
  return response.json()
}

export default function MovimientosPage() {
  const queryClient = useQueryClient()
  const { data: movimientos = [], isLoading } = useQuery({
    queryKey: ["movimientos"],
    queryFn: fetchMovimientos,
  })

  // Estado para combos y edición
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMovimiento, setEditingMovimiento] = useState<any>(null)
  const [form, setForm] = useState({
    contrato_anterior: "",
    contrato_actual: "",
    tipo_movimiento: "",
    observacion: "",
    id_tecnico: ""
  })
  const [contratos, setContratos] = useState<any[]>([])
  const [tecnicos, setTecnicos] = useState<any[]>([])
  const [tipos, setTipos] = useState<string[]>([])
  const [nuevoTipo, setNuevoTipo] = useState("")

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] })
      setIsDialogOpen(false)
      setForm({ contrato_anterior: "", contrato_actual: "", tipo_movimiento: "", observacion: "", id_tecnico: "" })
      setNuevoTipo("")
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateMovimiento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] })
      setIsDialogOpen(false)
      setEditingMovimiento(null)
      setForm({ contrato_anterior: "", contrato_actual: "", tipo_movimiento: "", observacion: "", id_tecnico: "" })
      setNuevoTipo("")
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteMovimiento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movimientos"] })
    },
  })

  // Obtener combos al abrir el diálogo
  useEffect(() => {
    async function fetchAll() {
      const [contratosData, tecnicosData] = await Promise.all([
        fetchContratos(),
        fetchTecnicos(),
      ])
      setContratos(contratosData)
      setTecnicos(tecnicosData)
    }
    if (isDialogOpen) fetchAll()
  }, [isDialogOpen])

  // Obtener tipos únicos de movimientos
  useEffect(() => {
    const tiposUnicos = Array.from(new Set([
      ...movimientos.map((m: any) => m.tipo_movimiento).filter(Boolean),
      "instalacion",
      "cambio"
    ]))
    setTipos(tiposUnicos)
  }, [movimientos])

  // Handlers
  const handleCreate = () => {
    setEditingMovimiento(null)
    setForm({ contrato_anterior: "", contrato_actual: "", tipo_movimiento: "", observacion: "", id_tecnico: "" })
    setIsDialogOpen(true)
    setNuevoTipo("")
  }
  const handleEdit = (movimiento: any) => {
    setEditingMovimiento(movimiento)
    setForm({
      contrato_anterior: movimiento.contrato_anterior || "",
      contrato_actual: movimiento.contrato_actual || "",
      tipo_movimiento: movimiento.tipo_movimiento || "",
      observacion: movimiento.observacion || "",
      id_tecnico: movimiento.id_tecnico || ""
    })
    setIsDialogOpen(true)
    setNuevoTipo("")
  }
  const handleDelete = (movimiento: any) => {
    if (confirm(`¿Estás seguro de eliminar el movimiento ${movimiento.id_movimiento}?`)) {
      deleteMutation.mutate(movimiento.id_movimiento)
    }
  }
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      id_tecnico: form.id_tecnico ? Number(form.id_tecnico) : null,
      tipo_movimiento: form.tipo_movimiento || nuevoTipo || ""
    }
    if (editingMovimiento) {
      updateMutation.mutate({ id: editingMovimiento.id_movimiento, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Movimientos</h1>
        <p className="mt-2 text-gray-600">Historial de movimientos de equipos</p>
      </div>
      <Button onClick={handleCreate} className="mb-4">Nuevo Movimiento</Button>
      <DataTable
        title="Lista de Movimientos"
        data={movimientos}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingMovimiento ? "Editar Movimiento" : "Nuevo Movimiento"}</DialogTitle>
            <DialogDescription>
              {editingMovimiento ? "Actualiza los datos del movimiento." : "Agrega un nuevo movimiento."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contrato_anterior">Contrato Anterior</Label>
              <select
                id="contrato_anterior"
                value={form.contrato_anterior}
                onChange={e => setForm(f => ({ ...f, contrato_anterior: e.target.value }))}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Sin contrato anterior</option>
                {contratos.map((c: any) => (
                  <option key={c.id_contrato} value={c.id_contrato}>
                    {c.id_contrato} - {c.cliente?.nombre} {c.cliente?.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contrato_actual">Contrato Actual</Label>
              <select
                id="contrato_actual"
                value={form.contrato_actual}
                onChange={e => setForm(f => ({ ...f, contrato_actual: e.target.value }))}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Sin contrato actual</option>
                {contratos.map((c: any) => (
                  <option key={c.id_contrato} value={c.id_contrato}>
                    {c.id_contrato} - {c.cliente?.nombre} {c.cliente?.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_tecnico">Técnico</Label>
              <select
                id="id_tecnico"
                value={form.id_tecnico}
                onChange={e => setForm(f => ({ ...f, id_tecnico: e.target.value }))}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Sin técnico</option>
                {tecnicos.map((t: any) => (
                  <option key={t.id_tecnico} value={t.id_tecnico}>
                    {t.nombre} {t.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo_movimiento">Tipo de Movimiento</Label>
              <select
                id="tipo_movimiento"
                value={form.tipo_movimiento}
                onChange={e => setForm(f => ({ ...f, tipo_movimiento: e.target.value }))}
                className="w-full border rounded px-2 py-1"
              >
                {tipos.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Agregar nuevo tipo"
                  value={nuevoTipo}
                  onChange={e => setNuevoTipo(e.target.value)}
                  className="w-full"
                />
                <Button type="button" onClick={() => {
                  if (nuevoTipo && !tipos.includes(nuevoTipo)) setTipos([...tipos, nuevoTipo])
                  setForm(f => ({ ...f, tipo_movimiento: nuevoTipo }))
                }}>Agregar</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacion">Observación</Label>
              <Input
                id="observacion"
                value={form.observacion}
                onChange={e => setForm(f => ({ ...f, observacion: e.target.value }))}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingMovimiento ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}