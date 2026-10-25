"use server"

import { cookies } from "next/headers"

// Cookie name for admin session
import { ADMIN_COOKIE, verifyAdminSession } from "./admin-session"

// Check if admin is authenticated (server-side)
export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)
}

// Clear admin session cookie (server action)
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
}

