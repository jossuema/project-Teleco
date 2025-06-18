import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

async function getDashboardStats() {
  const [
    totalClientes,
    totalContratos,
    totalEquipos,
    totalTecnicos,
    equiposPorEstado,
    movimientosPorTipo,
  ] = await Promise.all([
    prisma.cliente.count(),
    prisma.contrato.count(),
    prisma.equipo.count(),
    prisma.tecnico.count(),
    prisma.equipo.groupBy({
      by: ['estado'],
      _count: {
        estado: true,
      },
      where: {
        estado: {
          not: null,
        },
      },
    }),
    prisma.movimientoEquipo.groupBy({
      by: ['tipo_movimiento'],
      _count: {
        tipo_movimiento: true,
      },
      where: {
        tipo_movimiento: {
          not: null,
        },
      },
    }),
  ])

  return {
    totalClientes,
    totalContratos,
    totalEquipos,
    totalTecnicos,
    equiposPorEstado: equiposPorEstado.map(item => ({
      estado: item.estado || 'Sin estado',
      cantidad: item._count.estado,
    })),
    movimientosPorTipo: movimientosPorTipo.map(item => ({
      tipo: item.tipo_movimiento || 'Sin tipo',
      cantidad: item._count.tipo_movimiento,
    })),
  }
}

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Resumen general del sistema de gestión
        </p>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contratos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContratos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEquipos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Técnicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTecnicos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Equipos por Estado</CardTitle>
            <CardDescription>
              Distribución de equipos según su estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.equiposPorEstado}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="estado" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimientos por Tipo</CardTitle>
            <CardDescription>
              Distribución de movimientos de equipos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.movimientosPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({tipo, percent}) => `${tipo} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {stats.movimientosPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}