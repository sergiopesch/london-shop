"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAdminPassword } from "./admin-credentials"
import { ADMIN_COOKIE, COOKIE_OPTIONS } from "./admin-config"

export async function loginAdmin(formData: FormData) {
  try {
    const password = formData.get("password")

    if (!password || typeof password !== "string") {
      return { success: false, message: "Password is required" }
    }

    if (!verifyAdminPassword(password)) {
      return { success: false, message: "Invalid password" }
    }

    try {
      const cookieStore = await cookies()
      cookieStore.set(ADMIN_COOKIE, "authenticated", COOKIE_OPTIONS)
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
