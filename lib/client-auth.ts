"use client"

// Simple client-side authentication system
const AUTH_KEY = "london-shop-admin-auth"

export function setAdminAuth() {
  localStorage.setItem(AUTH_KEY, "true")
  return true
}

export function clearAdminAuth() {
  localStorage.removeItem(AUTH_KEY)
  return true
}

export function checkAdminAuth(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true"
}

