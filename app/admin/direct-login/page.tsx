"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DirectLoginPage() {
  const [status, setStatus] = useState<string>("Initializing...")
  const router = useRouter()

  useEffect(() => {
    setStatus("Direct login is disabled. Use /admin/login with ADMIN_PASSWORD from .env.local.")
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Direct Login Disabled</h1>
        <div className="text-lg">{status}</div>
        <button
          type="button"
          onClick={() => router.push("/admin/login")}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Go to Admin Login
        </button>
      </div>
    </div>
  )
}
