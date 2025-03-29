"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

// Admin credentials - in production, use environment variables
const ADMIN_PASSWORD = "london-shop-admin"

// Cookie name for admin session
const ADMIN_COOKIE = "london-shop-admin-session"

// Cookie options with improved security
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
  sameSite: "strict" as const,
}

// Password validation schema
const passwordSchema = z.string().min(1, "Password is required")

// Verify admin password with improved validation
export function verifyAdminPassword(password: string): boolean {
  try {
    const validatedPassword = passwordSchema.parse(password)
    return validatedPassword === ADMIN_PASSWORD
  } catch (error) {
    console.error("Password validation error:", error)
    return false
  }
}

// Set admin session cookie (server action) with improved error handling
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
  redirect("/admin/login")
}

// Check if admin is authenticated (server-side) with improved error handling
export function isAdminAuthenticated(): boolean {
  try {
    const cookieStore = cookies()
    return cookieStore.get(ADMIN_COOKIE)?.value === "authenticated"
  } catch (error) {
    console.error("Authentication check error:", error)
    return false
  }
}

// Protect admin routes (server-side)
export function protectAdminRoute() {
  try {
    if (!isAdminAuthenticated()) {
      redirect("/admin/login")
    }
  } catch (error) {
    console.error("Error in protectAdminRoute:", error)
    // If there's an error, redirect to login as a fallback
    redirect("/admin/login")
  }
}

