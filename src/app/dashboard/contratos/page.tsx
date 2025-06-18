"use client"

import { useQuery } from "@tanstack/react-query"
import { DataTable } from "@/components/data-table"

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

export default function ContratosPage() {
  const { data: contratos = [], isLoading } = useQuery({
    queryKey: ["contratos"],
    queryFn: fetchContratos,
  })

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
        isLoading={isLoading}
      />
    </div>
  )
}