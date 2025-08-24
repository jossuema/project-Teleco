'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

export default function DashboardCharts({ equiposPorEstado, movimientosPorTipo }: {
    equiposPorEstado: { estado: string, cantidad: number }[],
    movimientosPorTipo: { tipo: string, cantidad: number }[]
}) {
    return (
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
                        <BarChart data={equiposPorEstado}>
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
                                data={movimientosPorTipo}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ tipo, percent }) => `${tipo} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="cantidad"
                            >
                                {movimientosPorTipo.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}