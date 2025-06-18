import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { equipoSchema } from "@/lib/validations"
import { z } from "zod"

// GET - Obtener todos los equipos
export async function GET() {
  try {
    const equipos = await prisma.equipo.findMany({
      include: {
        contrato: {
          include: {
            cliente: true,
          },
        },
        fecha_adquisicion: {
          include: {
            forma_adquisicion: true,
          },
        },
      },
      orderBy: {
        serie: 'asc',
      },
    })

    return NextResponse.json(equipos)
  } catch (error) {
    console.error('Error fetching equipos:', error)
    return NextResponse.json(
      { error: 'Error al obtener equipos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo equipo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = equipoSchema.parse(body)

    const equipo = await prisma.equipo.create({
      data: validatedData,
      include: {
        contrato: {
          include: {
            cliente: true,
          },
        },
        fecha_adquisicion: {
          include: {
            forma_adquisicion: true,
          },
        },
      },
    })

    return NextResponse.json(equipo, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating equipo:', error)
    return NextResponse.json(
      { error: 'Error al crear equipo' },
      { status: 500 }
    )
  }
}