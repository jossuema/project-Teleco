"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clienteSchema, type Cliente } from "@/lib/validations"

interface ClienteWithContratos extends Cliente {
  id_cedula: string
  contratos: any[]
}

const columns = [
  { key: "id_cedula", header: "Cédula" },
  { key: "nombre", header: "Nombre" },
  { key: "apellido", header: "Apellido" },
  { key: "direccion", header: "Dirección" },
  {
    key: "contratos",
    header: "Contratos",
    render: (cliente: ClienteWithContratos) => cliente.contratos?.length || 0,
  },
]

async function fetchClientes(): Promise<ClienteWithContratos[]> {
  const response = await fetch("/api/clientes")
  if (!response.ok) throw new Error("Error al cargar clientes")
  return response.json()
}

async function createCliente(data: Cliente) {
  const response = await fetch("/api/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al crear cliente")
  return response.json()
}

async function updateCliente({ id, data }: { id: string; data: Cliente }) {
  const response = await fetch(`/api/clientes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Error al actualizar cliente")
  return response.json()
}

async function deleteCliente(id: string) {
  const response = await fetch(`/api/clientes/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Error al eliminar cliente")
  return response.json()
}

export default function ClientesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<ClienteWithContratos | null>(null)
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Cliente>({
    resolver: zodResolver(clienteSchema),
  })

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: fetchClientes,
  })

  const createMutation = useMutation({
    mutationFn: createCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      setIsDialogOpen(false)
      reset()
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      setIsDialogOpen(false)
      setEditingCliente(null)
      reset()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
    },
  })

  const handleCreate = () => {
    setEditingCliente(null)
    reset()
    setIsDialogOpen(true)
  }

  const handleEdit = (cliente: ClienteWithContratos) => {
    setEditingCliente(cliente)
    reset(cliente)
    setIsDialogOpen(true)
  }

  const handleDelete = (cliente: ClienteWithContratos) => {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      deleteMutation.mutate(cliente.id_cedula)
    }
  }

  const onSubmit = (data: Cliente) => {
    if (editingCliente) {
      updateMutation.mutate({ id: editingCliente.id_cedula, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="mt-2 text-gray-600">Gestiona la información de los clientes</p>
      </div>

      <DataTable
        title="Lista de Clientes"
        data={clientes}
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
              {editingCliente ? "Editar Cliente" : "Crear Nuevo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {editingCliente
                ? "Modifica la información del cliente"
                : "Completa los datos del nuevo cliente"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id_cedula">Cédula</Label>
              <Input
                id="id_cedula"
                {...register("id_cedula")}
                disabled={!!editingCliente}
              />
              {errors.id_cedula && (
                <p className="text-sm text-red-500">{errors.id_cedula.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" {...register("nombre")} />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" {...register("apellido")} />
              {errors.apellido && (
                <p className="text-sm text-red-500">{errors.apellido.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" {...register("direccion")} />
              {errors.direccion && (
                <p className="text-sm text-red-500">{errors.direccion.message}</p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingCliente ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}