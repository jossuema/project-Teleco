import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { tecnicoSchema } from "@/lib/validations"

export async function GET() {
  try {
    const tecnicos = await prisma.tecnico.findMany({
      include: {
        movimientos: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    })

    return NextResponse.json(tecnicos)
  } catch (error) {
    console.error('Error fetching tecnicos:', error)
    return NextResponse.json(
      { error: 'Error al obtener técnicos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo técnico
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = tecnicoSchema.parse(body)
    const tecnico = await prisma.tecnico.create({
      data: validatedData,
    })
    return NextResponse.json(tecnico, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating tecnico:', error)
    return NextResponse.json(
      { error: 'Error al crear técnico' },
      { status: 500 }
    )
  }
}