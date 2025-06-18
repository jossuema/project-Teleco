import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const contratos = await prisma.contrato.findMany({
      include: {
        cliente: true,
        equipos: true,
      },
      orderBy: {
        id_contrato: 'asc',
      },
    })

    return NextResponse.json(contratos)
  } catch (error) {
    console.error('Error fetching contratos:', error)
    return NextResponse.json(
      { error: 'Error al obtener contratos' },
      { status: 500 }
    )
  }
}