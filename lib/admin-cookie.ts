"use client"

export async function validateAdminPassword(password: string): Promise<boolean> {
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "same-origin",
    })
    return response.ok && (await response.json()).success === true
  } catch {
    return false
  }
}
