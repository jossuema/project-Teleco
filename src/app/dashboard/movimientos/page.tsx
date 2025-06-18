"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table"

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

async function fetchMovimientos() {
  const response = await fetch("/api/movimientos")
  if (!response.ok) throw new Error("Error al cargar movimientos")
  return response.json()
}

export default function MovimientosPage() {
  const { data: movimientos = [], isLoading } = useQuery({
    queryKey: ["movimientos"],
    queryFn: fetchMovimientos,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Movimientos</h1>
        <p className="mt-2 text-gray-600">Historial de movimientos de equipos</p>
      </div>

      <DataTable
        title="Lista de Movimientos"
        data={movimientos}
        columns={columns}
        isLoading={isLoading}
      />
    </div>
  )
}