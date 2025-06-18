"use client"

import { useQuery } from "@tanstack/react-query"
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

async function fetchEquipos() {
  const response = await fetch("/api/equipos")
  if (!response.ok) throw new Error("Error al cargar equipos")
  return response.json()
}

export default function EquiposPage() {
  const { data: equipos = [], isLoading } = useQuery({
    queryKey: ["equipos"],
    queryFn: fetchEquipos,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Equipos</h1>
        <p className="mt-2 text-gray-600">Gestiona el inventario de equipos</p>
      </div>

      <DataTable
        title="Lista de Equipos"
        data={equipos}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  )
}