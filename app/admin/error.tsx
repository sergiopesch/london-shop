"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-gray-300 mb-6">{error.message || "An unexpected error occurred in the admin panel."}</p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

