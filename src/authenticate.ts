"use server"

import { signIn } from "@/auth"

export async function authenticate(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", {
      redirect: false,
      username: formData.get("username"),
      password: formData.get("password"),
    })
    return { error: null }
  } catch (error) {
    return { error: "Usuario o contraseña incorrectos" }
  }
}
