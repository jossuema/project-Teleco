import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { tecnicoSchema } from "@/lib/validations"

// PUT - Actualizar técnico
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = tecnicoSchema.parse(body)
    const tecnico = await prisma.tecnico.update({
      where: { id_tecnico: Number(params.id) },
      data: validatedData,
    })
    return NextResponse.json(tecnico)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error actualizando técnico:", error)
    return NextResponse.json(
      { error: "Error al actualizar técnico" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar técnico
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.tecnico.delete({
      where: { id_tecnico: Number(params.id) },
    })
    return NextResponse.json({ message: "Técnico eliminado correctamente" })
  } catch (error) {
    console.error("Error eliminando técnico:", error)
    return NextResponse.json(
      { error: "Error al eliminar técnico" },
      { status: 500 }
    )
  }
}
