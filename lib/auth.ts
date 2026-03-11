"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ADMIN_COOKIE, COOKIE_OPTIONS } from "./admin-config"
import { verifyAdminPassword } from "./admin-credentials"

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
  redirect("/admin/login")
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated"
  } catch (error) {
    console.error("Authentication check error:", error)
    return false
  }
}

export async function protectAdminRoute() {
  try {
    const isAuthenticated = await isAdminAuthenticated()
    if (!isAuthenticated) {
      redirect("/admin/login")
    }
  } catch (error) {
    console.error("Error in protectAdminRoute:", error)
    redirect("/admin/login")
  }
}
