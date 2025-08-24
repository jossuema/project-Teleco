import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { movimientoEquipoSchema } from "@/lib/validations"
import { z } from "zod"

// PUT - Actualizar movimiento
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = movimientoEquipoSchema.parse(body)
    // Si los campos de contrato vienen vacíos, ponerlos como null para evitar error de clave foránea
    const safeData = {
      ...validatedData,
      contrato_anterior: validatedData.contrato_anterior || null,
      contrato_actual: validatedData.contrato_actual || null,
    }
    const movimiento = await prisma.movimientoEquipo.update({
      where: { id_movimiento: Number(context.params.id) },
      data: safeData,
    })
    return NextResponse.json(movimiento)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos inválidos", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error actualizando movimiento:", error)
    return NextResponse.json(
      { error: "Error al actualizar movimiento" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar movimiento
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.movimientoEquipo.delete({
      where: { id_movimiento: Number(params.id) },
    })
    return NextResponse.json({ message: "Movimiento eliminado correctamente" })
  } catch (error) {
    console.error("Error eliminando movimiento:", error)
    return NextResponse.json(
      { error: "Error al eliminar movimiento" },
      { status: 500 }
    )
  }
}
