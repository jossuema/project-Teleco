"use client"
import { auth, signIn } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFormState } from "react-dom"
import { useRef } from "react"
import { authenticate } from "@/authenticate"
import SignInForm from "./form"

export default async function SignInPage() {
  const session = await auth()

  if (session?.user?.role === "admin") {
    redirect("/dashboard")
  }

  return <SignInForm />
}