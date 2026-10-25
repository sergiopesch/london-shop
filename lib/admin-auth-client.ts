"use client"

// Simple client-side check for admin authentication
export async function isAdminLoggedIn(): Promise<boolean> {
  if (typeof window === "undefined") return false
  try {
    const response = await fetch("/api/admin/check", { cache: "no-store", credentials: "same-origin" })
    return response.ok && (await response.json()).authenticated === true
  } catch {
    return false
  }
}

// Logout function for client-side use
export async function logoutAdmin(): Promise<void> {
  try {
    await fetch("/api/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  } catch (error) {
    console.error("Logout error:", error)
    // Still try to redirect even if the API call fails
    window.location.href = "/admin/login"
  }
}

