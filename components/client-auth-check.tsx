"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { checkAdminAuth } from "@/lib/client-auth"

export default function ClientAuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip check for login page
    if (pathname === "/admin/login") {
      setIsChecking(false)
      setIsAuthorized(true)
      return
    }

    // Check if user is authenticated
    const isAuth = checkAdminAuth()

    if (!isAuth) {
      console.log("Not authenticated, redirecting to login")
      router.push("/admin/login")
    } else {
      setIsAuthorized(true)
    }

    setIsChecking(false)
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!isAuthorized && pathname !== "/admin/login") {
    return null
  }

  return <>{children}</>
}

