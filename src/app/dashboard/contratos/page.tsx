"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table"
import { Contrato, contratoSchema } from "@/lib/validations"
import { useEffect } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const columns = [
  { key: "id_contrato", header: "ID Contrato" },
  { key: "numero_servicio", header: "Número Servicio" },
  {
    key: "cliente",
    header: "Cliente",
    render: (contrato: any) => 
      `${contrato.cliente?.nombre} ${contrato.cliente?.apellido}`,
  },
  { key: "ced_cliente", header: "Cédula Cliente" },
]

async function fetchContratos() {
  const response = await fetch("/api/contratos")
  if (!response.ok) throw new Error("Error al cargar contratos")
  return response.json()
}

async function createContrato(data: Contrato) {
  const response = await fetch("/api/contratos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al crear contrato")
  return response.json()
}

async function updateContrato({ id, data }: { id: string; data: Contrato }) {
  const response = await fetch(`/api/contratos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al actualizar contrato")
  return response.json()
}

async function deleteContrato(id: string) {
  const response = await fetch(`/api/contratos/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Error al eliminar contrato")
  return id
}

export default function ContratosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContrato, setEditingContrato] = useState<Contrato | null>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [isLoadingClientes, setIsLoadingClientes] = useState(false)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Contrato>({
    resolver: zodResolver(contratoSchema),
  })
  // Obtener clientes para el combo box
  useEffect(() => {
    async function fetchClientes() {
      setIsLoadingClientes(true)
      try {
        const res = await fetch("/api/clientes")
        if (!res.ok) throw new Error("Error al cargar clientes")
        const data = await res.json()
        setClientes(data)
      } catch (e) {
        setClientes([])
      } finally {
        setIsLoadingClientes(false)
      }
    }
    if (isDialogOpen) fetchClientes()
  }, [isDialogOpen])

  const { data: contratos = [], isLoading } = useQuery({
    queryKey: ["contratos"],
    queryFn: fetchContratos,
  })

  const createMutation = useMutation({
    mutationFn: createContrato,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] })
      setIsDialogOpen(false)
      reset()
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateContrato,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] })
      setIsDialogOpen(false)
      reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContrato,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] })
    },
  })

  const handleCreate = () => {
    setEditingContrato(null)
    reset()
    setIsDialogOpen(true)
  }

  const handleEdit = (contrato: Contrato) => {
    setEditingContrato(contrato)
    reset(contrato)
    setIsDialogOpen(true)
    setValue("ced_cliente", contrato.ced_cliente)
  }

  const handleDelete = (contrato: Contrato) => {
    if (confirm(`¿Estás seguro de eliminar el contrato ${contrato.id_contrato}?`)) {
      deleteMutation.mutate(contrato.id_contrato)
    }
  }

  const onSubmit = (data: Contrato) => {
    if (editingContrato) {
      updateMutation.mutate({ id: editingContrato.id_contrato, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
        <p className="mt-2 text-gray-600">Gestiona los contratos de servicios</p>
      </div>

      <DataTable
        title="Lista de Contratos"
        data={contratos}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingContrato ? "Editar Contrato" : "Crear Contrato"}
            </DialogTitle>
            <DialogDescription>
              {editingContrato ? "Actualiza los detalles del contrato." : "Crea un nuevo contrato de servicio."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id_contrato">ID Contrato</Label>
              <Input
                id="id_contrato"
                {...register("id_contrato")}
                disabled={!!editingContrato}
              />
              {errors.id_contrato && (
                <p className="text-red-500 text-sm">{errors.id_contrato.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_servicio">Número de Servicio</Label>
              <Input id="numero_servicio" {...register("numero_servicio")} />
              {errors.numero_servicio && (
                <p className="text-red-500 text-sm">{errors.numero_servicio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ced_cliente">Cliente</Label>
              <select
                id="ced_cliente"
                {...register("ced_cliente")}
                disabled={isLoadingClientes}
                className="w-full border rounded px-2 py-1"
                defaultValue={editingContrato?.ced_cliente || ""}
              >
                <option value="" disabled>
                  {isLoadingClientes ? "Cargando clientes..." : "Seleccione un cliente"}
                </option>
                {clientes.map((cliente) => (
                  <option key={cliente.id_cedula} value={cliente.id_cedula}>
                    {cliente.id_cedula} - {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </select>
              {errors.ced_cliente && (
                <p className="text-red-500 text-sm">{errors.ced_cliente.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingContrato ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}