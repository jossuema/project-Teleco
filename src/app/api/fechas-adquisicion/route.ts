// POST - Crear nueva fecha de adquisición
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validación básica
    if (!body.mes || !body.anio || !body.id_forma_adq) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }
    const nuevaFecha = await prisma.fechaAdquisicion.create({
      data: {
        mes: Number(body.mes),
        anio: Number(body.anio),
        id_forma_adq: Number(body.id_forma_adq),
      },
      include: {
        forma_adquisicion: true,
      },
    })
    return NextResponse.json(nuevaFecha, { status: 201 })
  } catch (error) {
    console.error("Error creando fecha de adquisición:", error)
    return NextResponse.json(
      { error: "Error al crear fecha de adquisición" },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Obtener todas las fechas de adquisición
export async function GET(request: NextRequest) {
  try {
    const fechas = await prisma.fechaAdquisicion.findMany({
      include: {
        forma_adquisicion: true,
      },
      orderBy: [
        { anio: "desc" },
        { mes: "desc" }
      ],
    })
    return NextResponse.json(fechas)
  } catch (error) {
    console.error("Error fetching fechas de adquisición:", error)
    return NextResponse.json(
      { error: "Error al obtener fechas de adquisición" },
      { status: 500 }
    )
  }
}
