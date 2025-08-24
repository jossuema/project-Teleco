"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { equipoSchema, type Equipo } from "@/lib/validations"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useRef } from "react"
// Crear fecha de adquisición
async function createFechaAdquisicion(data: { mes: number; anio: number; id_forma_adq: number }) {
  const response = await fetch("/api/fechas-adquisicion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al crear fecha de adquisición")
  return response.json()
}
// Obtener formas de adquisición para el combobox
async function fetchFormasAdquisicion() {
  const res = await fetch("/api/forma-adquisicion")
  if (!res.ok) throw new Error("Error al cargar formas de adquisición")
  return res.json()
}
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// Crear equipo
async function createEquipo(data: Equipo) {
  const response = await fetch("/api/equipos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al crear equipo")
  return response.json()
}
import { DataTable } from "@/components/data-table"

const columns = [
  { key: "serie", header: "Serie" },
  { key: "modelo", header: "Modelo" },
  { key: "estado", header: "Estado" },
  { key: "tipo", header: "Tipo" },
  {
    key: "contrato",
    header: "Cliente",
    render: (equipo: any) => equipo.contrato?.cliente?.nombre || "Sin asignar",
  },
]
// Eliminar equipo
async function deleteEquipo(serie: string) {
  const response = await fetch(`/api/equipos/${serie}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Error al eliminar equipo")
  return serie
}

async function fetchEquipos() {
  const response = await fetch("/api/equipos")
  if (!response.ok) throw new Error("Error al cargar equipos")
  return response.json()
}

export default function EquiposPage() {
  const queryClient = useQueryClient()
  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ["equipos"],
    queryFn: fetchEquipos,
  })

  // Estado para el diálogo de creación
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFechaDialogOpen, setIsFechaDialogOpen] = useState(false)
  const [formas, setFormas] = useState<any[]>([])
  // Estado para el form de nueva fecha
  const [fechaForm, setFechaForm] = useState({ mes: '', anio: '', id_forma_adq: '' })
  const [isLoadingFormas, setIsLoadingFormas] = useState(false)
  // Obtener formas de adquisición cuando se abre el form de fecha
  useEffect(() => {
    async function getFormas() {
      setIsLoadingFormas(true)
      try {
        const data = await fetchFormasAdquisicion()
        setFormas(data)
      } catch {
        setFormas([])
      } finally {
        setIsLoadingFormas(false)
      }
    }
    if (isFechaDialogOpen) getFormas()
  }, [isFechaDialogOpen])
  // Handler para crear nueva fecha
  const handleCreateFecha = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fechaForm.mes || !fechaForm.anio || !fechaForm.id_forma_adq) return
    try {
      await createFechaAdquisicion({
        mes: Number(fechaForm.mes),
        anio: Number(fechaForm.anio),
        id_forma_adq: Number(fechaForm.id_forma_adq),
      })
      setIsFechaDialogOpen(false)
      setFechaForm({ mes: '', anio: '', id_forma_adq: '' })
      // Refrescar fechas
      const res = await fetch("/api/fechas-adquisicion")
      setFechas(await res.json())
    } catch { }
  }
  const [fechas, setFechas] = useState<any[]>([])
  const [contratos, setContratos] = useState<any[]>([])
  const [isLoadingFechas, setIsLoadingFechas] = useState(false)
  const [isLoadingContratos, setIsLoadingContratos] = useState(false)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Equipo>({
    resolver: zodResolver(equipoSchema),
  })

  // Mutación para crear equipo
  const createMutation = useMutation({
    mutationFn: createEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipos"] })
      setIsDialogOpen(false)
      reset()
    },
  })

  // Obtener fechas de adquisición
  useEffect(() => {
    async function fetchFechas() {
      setIsLoadingFechas(true)
      try {
        const res = await fetch("/api/fechas-adquisicion")
        if (!res.ok) throw new Error("Error al cargar fechas")
        const data = await res.json()
        setFechas(data)
      } catch (e) {
        setFechas([])
      } finally {
        setIsLoadingFechas(false)
      }
    }
    if (isDialogOpen) fetchFechas()
  }, [isDialogOpen])

  // Obtener contratos
  useEffect(() => {
    async function fetchContratos() {
      setIsLoadingContratos(true)
      try {
        const res = await fetch("/api/contratos")
        if (!res.ok) throw new Error("Error al cargar contratos")
        const data = await res.json()
        setContratos(data)
      } catch (e) {
        setContratos([])
      } finally {
        setIsLoadingContratos(false)
      }
    }
    if (isDialogOpen) fetchContratos()
  }, [isDialogOpen])

  // Handler para eliminar
  const deleteMutation = useMutation({
    mutationFn: deleteEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipos"] })
    },
  })

  // Handler para eliminar
  const handleDelete = (equipo: any) => {
    if (confirm(`¿Estás seguro de eliminar el equipo con serie ${equipo.serie}?`)) {
      deleteMutation.mutate(equipo.serie)
    }
  }

  // Estado para edición
  const [editingEquipo, setEditingEquipo] = useState<Equipo | null>(null)

  // Handler para abrir el diálogo de creación
  const handleCreate = () => {
    setEditingEquipo(null)
    reset({
      serie: "",
      modelo: "",
      estado: undefined,
      tipo: undefined,
      f_adquisicion: undefined,
      ubicacion: ""
    })
    setIsDialogOpen(true)
  }

  // Handler para abrir el diálogo de edición
  const handleEdit = (equipo: any) => {
    setEditingEquipo(equipo)
    reset({
      ...equipo,
      f_adquisicion: equipo.f_adquisicion ?? equipo.fecha_adquisicion?.id_fecha ?? "",
      ubicacion: equipo.ubicacion ?? equipo.contrato?.id_contrato ?? "",
    })
    setIsDialogOpen(true)
  }

  // Mutación para actualizar equipo
  const updateMutation = useMutation({
    mutationFn: async ({ serie, data }: { serie: string; data: Equipo }) => {
      const response = await fetch(`/api/equipos/${serie}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Error al actualizar equipo")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipos"] })
      setIsDialogOpen(false)
      reset()
      setEditingEquipo(null)
    },
  })

  const onSubmit = (data: Equipo) => {
    const payload = {
      ...data,
      f_adquisicion:
        typeof data.f_adquisicion === "string"
          ? data.f_adquisicion === ""
            ? null
            : Number(data.f_adquisicion)
          : data.f_adquisicion,
      ubicacion: data.ubicacion ? String(data.ubicacion) : undefined,
    }
    if (editingEquipo) {
      updateMutation.mutate({ serie: editingEquipo.serie, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
        <p className="mt-2 text-gray-600">Gestiona el inventario de equipos</p>
      </div>

      <Button onClick={handleCreate} className="mb-4">Crear Equipo</Button>

      <DataTable
        title="Lista de Equipos"
        data={equipos}
        columns={columns}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingEquipo ? "Editar Equipo" : "Crear Equipo"}</DialogTitle>
            <DialogDescription>
              {editingEquipo ? "Actualiza los datos del equipo." : "Agrega un nuevo equipo al inventario."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={e => {
              const formData = new FormData(e.currentTarget as HTMLFormElement)
              const rawFecha = formData.get('f_adquisicion')
              setValue('f_adquisicion', rawFecha === "" ? null : Number(rawFecha))
              handleSubmit(onSubmit)(e)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="serie">Serie</Label>
              <Input id="serie" {...register("serie")} />
              {errors.serie && <p className="text-red-500 text-sm">{errors.serie.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" {...register("modelo")} />
              {errors.modelo && <p className="text-red-500 text-sm">{errors.modelo.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select id="estado" {...register("estado")} className="w-full border rounded px-2 py-1">
                <option value="">Seleccione estado</option>
                <option value="Nuevo">Nuevo</option>
                <option value="Buen">Buen</option>
                <option value="Mal">Mal</option>
              </select>
              {errors.estado && <p className="text-red-500 text-sm">{errors.estado.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <select id="tipo" {...register("tipo")} className="w-full border rounded px-2 py-1">
                <option value="">Seleccione tipo</option>
                <option value="ONU">ONU</option>
                <option value="ONT">ONT</option>
                <option value="R_compl">R_compl</option>
              </select>
              {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="f_adquisicion">Fecha de Adquisición</Label>
              <div className="flex gap-2 items-center">
                <select id="f_adquisicion" {...register("f_adquisicion")} className="w-full border rounded px-2 py-1">
                  <option value="">{isLoadingFechas ? "Cargando..." : "Seleccione fecha"}</option>
                  {fechas.map((fecha: any) => (
                    <option key={fecha.id_fecha} value={fecha.id_fecha}>
                      {fecha.mes}/{fecha.anio} - {fecha.forma_adquisicion?.forma || ""}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsFechaDialogOpen(true)}>
                  + Nueva
                </Button>
              </div>
              {errors.f_adquisicion && <p className="text-red-500 text-sm">{errors.f_adquisicion.message}</p>}
            </div>
            {/* Dialog para crear nueva fecha de adquisición */}
            <Dialog open={isFechaDialogOpen} onOpenChange={setIsFechaDialogOpen}>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Nueva Fecha de Adquisición</DialogTitle>
                  <DialogDescription>Agrega una nueva fecha de adquisición.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateFecha} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mes">Mes</Label>
                    <input
                      id="mes"
                      type="number"
                      min={1}
                      max={12}
                      value={fechaForm.mes}
                      onChange={e => setFechaForm(f => ({ ...f, mes: e.target.value }))}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anio">Año</Label>
                    <input
                      id="anio"
                      type="number"
                      min={1900}
                      max={new Date().getFullYear() + 10}
                      value={fechaForm.anio}
                      onChange={e => setFechaForm(f => ({ ...f, anio: e.target.value }))}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="id_forma_adq">Forma de Adquisición</Label>
                    <select
                      id="id_forma_adq"
                      value={fechaForm.id_forma_adq}
                      onChange={e => setFechaForm(f => ({ ...f, id_forma_adq: e.target.value }))}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="">{isLoadingFormas ? "Cargando..." : "Seleccione forma"}</option>
                      {formas.map((forma: any) => (
                        <option key={forma.id_forma_adq} value={forma.id_forma_adq}>
                          {forma.forma}
                        </option>
                      ))}
                    </select>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsFechaDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="space-y-2">
              <Label htmlFor="ubicacion">Contrato</Label>
              <select id="ubicacion" {...register("ubicacion")} className="w-full border rounded px-2 py-1">
                <option value="">{isLoadingContratos ? "Cargando..." : "Seleccione contrato"}</option>
                {contratos.map((contrato: any) => (
                  <option key={contrato.id_contrato} value={contrato.id_contrato}>
                    {contrato.id_contrato} - {contrato.cliente?.nombre} {contrato.cliente?.apellido}
                  </option>
                ))}
              </select>
              {errors.ubicacion && <p className="text-red-500 text-sm">{errors.ubicacion.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingEquipo ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}