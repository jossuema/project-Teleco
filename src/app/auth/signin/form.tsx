"use client"

import { useFormState } from "react-dom"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authenticate } from "@/authenticate"

export default function SignInForm() {
  const [state, formAction] = useFormState(authenticate, { error: null })
  const formRef = useRef(null)

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Panel de Administración
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Inicia sesión para acceder al sistema
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4" ref={formRef}>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      placeholder="Ingresa tu usuario"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Ingresa tu contraseña"
                  />
                </div>

                {state.error && (
                    <p className="text-sm text-red-500">{state.error}</p>
                )}

                <Button type="submit" className="w-full">
                  Iniciar Sesión
                </Button>
              </form>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">Credenciales de prueba:</p>
                <p>Usuario: admin</p>
                <p>Contraseña: admin123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}