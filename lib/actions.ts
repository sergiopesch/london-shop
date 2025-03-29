"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyAdminPassword } from "./auth"

// Cookie name for admin session
const ADMIN_COOKIE = "london-shop-admin-session"

// Cookie options
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
  sameSite: "strict" as const,
}

// Set admin session cookie (server action)
export async function loginAdmin(formData: FormData) {
  try {
    const password = formData.get("password")

    // Check if password exists and is a string
    if (!password || typeof password !== "string") {
      return { success: false, message: "Password is required" }
    }

    if (!verifyAdminPassword(password)) {
      return { success: false, message: "Invalid password" }
    }

    // Set the admin session cookie
    try {
      cookies().set(ADMIN_COOKIE, "authenticated", COOKIE_OPTIONS)
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

// Clear admin session cookie (server action)
export async function logoutAdmin() {
  try {
    cookies().delete(ADMIN_COOKIE)
  } catch (error) {
    console.error("Logout error:", error)
    // Even if there's an error, we still want to redirect to login
  }

  // Use a try/catch block to handle any redirect errors
  try {
    redirect("/admin/login")
  } catch (error) {
    console.error("Redirect error:", error)
    // If redirect fails, throw a more specific error
    throw new Error("Failed to redirect after logout. Please navigate to /admin/login manually.")
  }
}

