import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { z } from "zod"

const prisma = new PrismaClient()

const signInSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const { username, password } = signInSchema.parse(credentials)

          const user = await prisma.usuarios.findUnique({
            where: { username }
          })

          if (!user) {
            return null
          }

          const isValidPassword = await bcrypt.compare(password, user.password)

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id_usuario.toString(),
            name: user.username,
            email: user.username,
            role: user.rol,
          }
        } catch (error) {
          console.error("Error during authentication:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token.role && session.user) {
        (session.user as { [key: string]: any }).role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
})