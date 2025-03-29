"use client"

import { useEffect, useState } from "react"
import { checkAdminSession, clearAdminSession } from "@/lib/admin-auth"
import { useRouter } from "next/navigation"
import AdminHeader from "@/components/admin-header"

export default function AdminTest() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check admin status
    const adminStatus = checkAdminSession()
    setIsAdmin(adminStatus)
  }, [])

  const handleLogout = () => {
    clearAdminSession()
    router.push("/admin/login")
  }

  const handleCheckStatus = () => {
    const status = checkAdminSession()
    setIsAdmin(status)
    alert(`Admin status: ${status ? "Logged in" : "Not logged in"}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Authentication Test</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Authentication Status</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Current admin status: {isAdmin === null ? "Checking..." : isAdmin ? "Logged in" : "Not logged in"}
                </p>
              </div>
              <div className="mt-5 space-x-4">
                <button
                  onClick={handleCheckStatus}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Check Status
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

