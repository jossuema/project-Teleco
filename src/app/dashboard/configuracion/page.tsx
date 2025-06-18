import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Users, Settings, Shield } from "lucide-react"

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-2 text-gray-600">Configuración del sistema y administración</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Base de Datos
            </CardTitle>
            <CardDescription>
              Gestiona la conexión y sincronización con PostgreSQL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              Sincronizar Esquema
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Usuarios
            </CardTitle>
            <CardDescription>
              Administra usuarios y roles del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              Gestionar Usuarios
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Sistema
            </CardTitle>
            <CardDescription>
              Configuraciones generales del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              Configurar Sistema
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Configuraciones de seguridad y autenticación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              Configurar Seguridad
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}