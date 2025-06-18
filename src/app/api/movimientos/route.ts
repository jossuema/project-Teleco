import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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