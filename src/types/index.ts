import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    role?: string
  }

  interface JWT {
    role?: string
  }
}

export interface DashboardStats {
  totalClientes: number
  totalContratos: number
  totalEquipos: number
  totalTecnicos: number
  equiposPorEstado: {
    estado: string
    cantidad: number
  }[]
  movimientosPorTipo: {
    tipo: string
    cantidad: number
  }[]
}