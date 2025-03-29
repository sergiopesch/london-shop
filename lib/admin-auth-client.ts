"use client"

// Simple client-side check for admin authentication
export function isAdminLoggedIn(): boolean {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return false
  }

  // Check for the presence of the admin cookie
  return document.cookie.includes("london-shop-admin-session=authenticated")
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

