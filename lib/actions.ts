"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAdminPassword } from "./admin-credentials"
import { ADMIN_COOKIE, COOKIE_OPTIONS, ADMIN_UNAVAILABLE_MESSAGE, adminAuthConfigured, createAdminSession } from "./admin-session"

export async function loginAdmin(formData: FormData) {
  if (!adminAuthConfigured()) return { success: false, message: ADMIN_UNAVAILABLE_MESSAGE }
  try {
    const password = formData.get("password")

    if (!password || typeof password !== "string") {
      return { success: false, message: "Password is required" }
    }

    if (!(await verifyAdminPassword(password))) {
      return { success: false, message: "Invalid password" }
    }

    try {
      const cookieStore = await cookies()
      cookieStore.set(ADMIN_COOKIE, await createAdminSession(), COOKIE_OPTIONS)
    } catch (cookieError) {
      console.error("Error setting cookie:", cookieError)
      return {
        success: false,
        message: "Failed to set authentication cookie. Please try again.",
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function logoutAdmin() {
  if (!adminAuthConfigured()) return
  try {
    const cookieStore = await cookies()
    cookieStore.delete(ADMIN_COOKIE)
  } catch (error) {
    console.error("Logout error:", error)
  }

  try {
    redirect("/admin/login")
  } catch (error) {
    console.error("Redirect error:", error)
    throw new Error("Failed to redirect after logout. Please navigate to /admin/login manually.")
  }
}
