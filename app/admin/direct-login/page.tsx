"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DirectLoginPage() {
  const [status, setStatus] = useState<string>("Initializing...")
  const router = useRouter()

  useEffect(() => {
    async function login() {
      try {
        setStatus("Attempting login...")

        const response = await fetch("/api/admin/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: "london-shop-admin" }),
          credentials: "include",
        })

        const data = await response.json()

        if (response.ok && data.success) {
          setStatus("Login successful! Redirecting...")
          setTimeout(() => {
            router.push("/admin")
          }, 1000)
        } else {
          setStatus(`Login failed: ${data.message || "Unknown error"}`)
        }
      } catch (error) {
        setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    login()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Direct Login</h1>
        <div className="animate-pulse text-xl">{status}</div>
      </div>
    </div>
  )
}

