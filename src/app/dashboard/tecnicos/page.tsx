"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table"

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

async function fetchTecnicos() {
  const response = await fetch("/api/tecnicos")
  if (!response.ok) throw new Error("Error al cargar técnicos")
  return response.json()
}

export default function TecnicosPage() {
  const { data: tecnicos = [], isLoading } = useQuery({
    queryKey: ["tecnicos"],
    queryFn: fetchTecnicos,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Técnicos</h1>
        <p className="mt-2 text-gray-600">Gestiona el personal técnico</p>
      </div>

      <DataTable
        title="Lista de Técnicos"
        data={tecnicos}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  )
}