import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// Obtener un contrato por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contrato = await prisma.contrato.findUnique({
      where: { id_contrato: params.id },
      include: {
        cliente: true,
        equipos: true,
      },
    })
    if (!contrato) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 })
    }
    return NextResponse.json(contrato)
  } catch (error) {
    console.error('Error fetching contrato:', error)
    return NextResponse.json(
      { error: 'Error al obtener contrato' },
      { status: 500 }
    )
  }
}

//Eliminar un contrato por ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const contrato = await prisma.contrato.delete({
      where: { id_contrato: params.id },
    })
    return NextResponse.json(contrato)
  } catch (error) {
    console.error('Error deleting contrato:', error)
    return NextResponse.json(
      { error: 'Error al eliminar contrato' },
      { status: 500 }
    )
  }
}

//Actualizar un contrato por ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const contrato = await prisma.contrato.update({
      where: { id_contrato: params.id },
      data: body,
    })
    return NextResponse.json(contrato)
  } catch (error) {
    console.error('Error updating contrato:', error)
    return NextResponse.json(
      { error: 'Error al actualizar contrato' },
      { status: 500 }
    )
  }
}
