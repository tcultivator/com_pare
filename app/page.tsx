"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navbar from "./components/navbar/NavBar"
export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  if (!session) {
    return null // or loading screen
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center">
         
        </div>
      </div>
    </div>
  )
}