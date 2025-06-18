import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { clienteSchema } from "@/lib/validations"
import { z } from "zod"

// GET - Obtener cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id_cedula: params.id },
      include: {
        contratos: {
          include: {
            equipos: true,
          },
        },
      },
    })

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error fetching cliente:', error)
    return NextResponse.json(
      { error: 'Error al obtener cliente' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = clienteSchema.parse(body)

    const cliente = await prisma.cliente.update({
      where: { id_cedula: params.id },
      data: validatedData,
    })

    return NextResponse.json(cliente)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating cliente:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cliente.delete({
      where: { id_cedula: params.id },
    })

    return NextResponse.json({ message: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error('Error deleting cliente:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cliente' },
      { status: 500 }
    )
  }
}