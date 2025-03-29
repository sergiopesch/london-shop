"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global admin error:", error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-4">Critical Error</h1>
          <p className="text-gray-300 mb-6">
            A critical error has occurred in the admin panel. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

