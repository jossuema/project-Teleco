import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { clienteSchema } from "@/lib/validations"
import { z } from "zod"

// GET - Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        contratos: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    })

    return NextResponse.json(clientes)
  } catch (error) {
    console.error('Error fetching clientes:', error)
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = clienteSchema.parse(body)

    const cliente = await prisma.cliente.create({
      data: validatedData,
    })

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating cliente:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}