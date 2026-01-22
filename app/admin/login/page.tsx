"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LondonLogo } from "@/components/london-logo"
import { setAdminAuth, checkAdminAuth } from "@/lib/client-auth"

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    if (checkAdminAuth()) {
      router.push("/admin")
    }
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const password = formData.get("password") as string

      // Simple password check
      if (password === "london-shop-admin") {
        console.log("Password verified, setting auth")
        setAdminAuth()

        // Redirect to admin dashboard
        console.log("Login successful, redirecting to admin dashboard")
        router.push("/admin")
      } else {
        console.error("Login failed: Invalid password")
        setError("Invalid password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-8">
          <LondonLogo className="h-12" />
        </div>

        <div className="bg-black border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Access</h1>
            <p className="text-center text-gray-400 mb-6">Sign in to access the admin console</p>

            {error && (
              <div className="mb-6 p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-md">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Admin Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  placeholder="Enter admin password"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Default: london-shop-admin</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-gray-800/50 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              London Shop Admin Portal &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            Return to London Shop
          </Link>
        </div>
      </div>
    </div>
  )
}

