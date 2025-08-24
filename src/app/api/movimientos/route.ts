import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

import { movimientoEquipoSchema } from "@/lib/validations"
import { z } from "zod"

export async function GET() {
  try {
    const movimientos = await prisma.movimientoEquipo.findMany({
      include: {
        tecnico: true,
        contrato_act: {
          include: {
            cliente: true,
          },
        },
        contrato_ant: {
          include: {
            cliente: true,
          },
        },
      },
      orderBy: {
        id_movimiento: 'desc',
      },
    })

    return NextResponse.json(movimientos)
  } catch (error) {
    console.error('Error fetching movimientos:', error)
    return NextResponse.json(
      { error: 'Error al obtener movimientos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo movimiento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = movimientoEquipoSchema.parse(body)
    // Convertir string vacío a null para claves foráneas
    const safeData = {
      ...validatedData,
      contrato_anterior: validatedData.contrato_anterior || null,
      contrato_actual: validatedData.contrato_actual || null,
      id_tecnico: validatedData.id_tecnico || null,
    }
    const movimiento = await prisma.movimientoEquipo.create({
      data: safeData,
    })
    return NextResponse.json(movimiento, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creando movimiento:', error)
    return NextResponse.json(
      { error: 'Error al crear movimiento' },
      { status: 500 }
    )
  }
}