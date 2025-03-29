"use server"

import { cookies } from "next/headers"

// Cookie name for admin session
const ADMIN_COOKIE = "london-shop-admin-session"

// Check if admin is authenticated (server-side)
export function checkAdminSession(): boolean {
  const cookieStore = cookies()
  return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated"
}

// Clear admin session cookie (server action)
export function clearAdminSession() {
  cookies().delete(ADMIN_COOKIE)
}

