import { z } from "zod"
import { getAdminPassword } from "./admin-config"

const passwordSchema = z.string().min(1, "Password is required")

export function verifyAdminPassword(password: string): boolean {
  try {
    const validatedPassword = passwordSchema.parse(password)
    return validatedPassword === getAdminPassword()
  } catch (error) {
    console.error("Password validation error:", error)
    return false
  }
}
