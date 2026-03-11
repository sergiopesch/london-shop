import { NextResponse } from "next/server"
import { ADMIN_COOKIE, COOKIE_OPTIONS } from "@/lib/admin-config"
import { verifyAdminPassword } from "@/lib/admin-credentials"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (typeof password !== "string" || !verifyAdminPassword(password)) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(ADMIN_COOKIE, "authenticated", COOKIE_OPTIONS)
    return response
  } catch (error) {
    console.error("[SERVER] Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}
