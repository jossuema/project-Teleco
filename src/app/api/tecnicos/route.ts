import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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