"use client"

import Cookies from "js-cookie"
import { ADMIN_COOKIE } from "./admin-config"

const COOKIE_NAME = "london-shop-admin-auth"

export function setAdminCookie() {
  Cookies.set(COOKIE_NAME, "true", { expires: 1, sameSite: "strict" })
  return true
}

export function clearAdminCookie() {
  Cookies.remove(COOKIE_NAME)
  return true
}

export function checkAdminCookie(): boolean {
  return Cookies.get(COOKIE_NAME) === "true"
}

export async function validateAdminPassword(password: string): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
      credentials: "include",
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()

    if (data.success) {
      Cookies.set(ADMIN_COOKIE, "authenticated", { expires: 1, sameSite: "strict" })
      return true
    }

    return false
  } catch (error) {
    console.error("Client admin password validation failed:", error)
    return false
  }
}
