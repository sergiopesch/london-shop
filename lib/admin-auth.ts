"use server"

import { cookies } from "next/headers"

// Cookie name for admin session
import { ADMIN_COOKIE, adminAuthConfigured, verifyAdminSession } from "./admin-session"

// Check if admin is authenticated (server-side)
export async function checkAdminSession(): Promise<boolean> {
  if (!adminAuthConfigured()) return false
  const cookieStore = await cookies()
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)
}

// Clear admin session cookie (server action)
export async function clearAdminSession(): Promise<void> {
  if (!adminAuthConfigured()) return
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}

