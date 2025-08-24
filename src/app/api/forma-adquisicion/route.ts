import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Obtener todas las formas de adquisición
export async function GET(request: NextRequest) {
  try {
    const formas = await prisma.formaAdquisicion.findMany({
      orderBy: { forma: "asc" },
    })
    return NextResponse.json(formas)
  } catch (error) {
    console.error("Error fetching formas de adquisición:", error)
    return NextResponse.json(
      { error: "Error al obtener formas de adquisición" },
      { status: 500 }
    )
  }
}
