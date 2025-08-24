import { equipoSchema } from "@/lib/validations"
import { z } from "zod"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// PUT - Actualizar equipo por serie
export async function PUT(request: NextRequest, { params }: { params: { serie: string } }) {
  try {
    const body = await request.json()
    const validatedData = equipoSchema.parse(body)
    const equipo = await prisma.equipo.update({
      where: { serie: params.serie },
      data: validatedData,
      include: {
        contrato: {
          include: { cliente: true },
        },
        fecha_adquisicion: {
          include: { forma_adquisicion: true },
        },
      },
    })
    return NextResponse.json(equipo)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }
    console.error("Error actualizando equipo:", error)
    return NextResponse.json({ error: "Error al actualizar equipo" }, { status: 500 })
  }
}

// DELETE - Eliminar equipo por serie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { serie: string } }
) {
  try {
    await prisma.equipo.delete({
      where: { serie: params.serie },
    })
    return NextResponse.json({ message: "Equipo eliminado correctamente" })
  } catch (error) {
    console.error("Error deleting equipo:", error)
    return NextResponse.json(
      { error: "Error al eliminar equipo" },
      { status: 500 }
    )
  }
}
