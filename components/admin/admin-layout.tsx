"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminHeader from "./admin-header"
import AdminSidebar from "./admin-sidebar"
import { LondonLogo } from "../london-logo"

interface AdminLayoutProps {
  children: ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle errors that might occur in children
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Unhandled error:", event.error)
      setError("An unexpected error occurred. Please try refreshing the page.")

      // Prevent the default error handling
      event.preventDefault()
    }

    // Add global error handler
    window.addEventListener("error", handleError)

    // Add unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason)
      setError("An unexpected error occurred with a background task. Please try refreshing the page.")

      // Prevent the default error handling
      event.preventDefault()
    })

    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", (event) => {
        console.error("Unhandled promise rejection:", event.reason)
      })
    }
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => router.push("/admin/login")}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            <LondonLogo className="h-8 md:h-10" />
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}

