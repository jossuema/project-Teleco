import { signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

interface HeaderProps {
  user: {
    name?: string | null
    role?: string
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Panel de Administración
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {user.name} ({user.role})
            </span>
          </div>

          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}