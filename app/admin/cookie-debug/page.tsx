"use client"

import { useEffect, useState } from "react"

export default function CookieDebugPage() {
  const [serverCookie, setServerCookie] = useState<string>("Checking...")

  useEffect(() => {
    async function checkCookie() {
      try {
        const response = await fetch("/api/admin/cookie-debug", {
          credentials: "include",
        })
        const data = await response.json()
        setServerCookie(JSON.stringify(data, null, 2))
      } catch (error) {
        setServerCookie(`Error: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    checkCookie()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Cookie Debug Page</h1>

      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl mb-2">Server-Side Cookie Check:</h2>
        <pre className="bg-black p-4 rounded overflow-auto">{serverCookie}</pre>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Client-Side Cookies (Non-HttpOnly):</h2>
        <pre className="bg-black p-4 rounded overflow-auto">{document.cookie || "No cookies found"}</pre>
      </div>

      <div className="mt-6 flex space-x-4">
        <a href="/admin/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Go to Login
        </a>
        <a href="/admin" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}

