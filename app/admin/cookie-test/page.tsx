"use client"

import { useEffect, useState } from "react"

export default function CookieTestPage() {
  const [cookies, setCookies] = useState<string>("Loading cookies...")

  useEffect(() => {
    setCookies(document.cookie)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Cookie Test Page</h1>
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Current Cookies:</h2>
        <pre className="bg-black p-4 rounded overflow-auto">{cookies || "No cookies found"}</pre>
      </div>
      <p className="mt-4">Note: HttpOnly cookies won't be visible here, but this helps debug other cookies.</p>
    </div>
  )
}

