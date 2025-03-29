"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip check for login page
    if (pathname === "/admin/login" || pathname === "/admin/direct-login" || pathname === "/admin/cookie-test") {
      setIsChecking(false)
      return
    }

    async function checkAuth() {
      try {
        const response = await fetch("/api/admin/check", {
          credentials: "include",
        })

        if (!response.ok) {
          console.log("Auth check failed, redirecting to login")
          router.push("/admin/login")
          return
        }

        setIsChecking(false)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isChecking && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return <>{children}</>
}

