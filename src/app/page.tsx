import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth()

  if (session && session.user.role === "admin") {
    redirect("/dashboard")
  } else {
    redirect("/auth/signin")
  }
}