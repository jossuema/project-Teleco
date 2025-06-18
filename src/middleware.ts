import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "admin"

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = nextUrl.pathname.startsWith("/auth/signin")
  const isApiRoute = nextUrl.pathname.startsWith("/api")
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")

  // Permitir rutas de autenticación de NextAuth
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Rutas API protegidas
  if (isApiRoute && !isApiAuthRoute) {
    if (!isLoggedIn || !isAdmin) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { status: 401, headers: { "content-type": "application/json" } }
      )
    }
    return NextResponse.next()
  }

  // Rutas del dashboard protegidas
  if (isDashboardRoute) {
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl))
    }
    return NextResponse.next()
  }

  // Redirigir usuarios autenticados del login al dashboard
  if (isPublicRoute && isLoggedIn && isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Redirigir usuarios no autenticados al login
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}