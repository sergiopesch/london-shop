"use client"

import Cookies from "js-cookie"

const ADMIN_PASSWORD = "london-shop-admin"
const COOKIE_NAME = "london-shop-admin-auth"

export function setAdminCookie() {
  // Set cookie with 24 hour expiry
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

export function validateAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

