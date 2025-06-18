"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Monitor,
  UserCheck,
  ArrowUpDown,
  Settings,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users },
  { name: "Contratos", href: "/dashboard/contratos", icon: FileText },
  { name: "Equipos", href: "/dashboard/equipos", icon: Monitor },
  { name: "Técnicos", href: "/dashboard/tecnicos", icon: UserCheck },
  { name: "Movimientos", href: "/dashboard/movimientos", icon: ArrowUpDown },
  { name: "Configuración", href: "/dashboard/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-gray-900 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <Link href="/dashboard" className="text-white flex items-center space-x-2 px-4">
        <Monitor className="w-8 h-8" />
        <span className="text-2xl font-extrabold">Panel Admin</span>
      </Link>

      <nav className="mt-10">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200",
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                )}
              >
                <item.icon className="w-6 h-6" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}