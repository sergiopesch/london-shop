import { NextResponse } from "next/server"
import { ADMIN_COOKIE, COOKIE_OPTIONS, ADMIN_UNAVAILABLE_MESSAGE, adminAuthConfigured, createAdminSession, verifyAdminPassword } from "@/lib/admin-session"

export async function POST(request: Request) {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ success: false, message: ADMIN_UNAVAILABLE_MESSAGE }, { status: 503, headers: { "Cache-Control": "no-store" } })
  }
  try {
    const { password } = await request.json()
    if (!(await verifyAdminPassword(password))) {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }
    const response = NextResponse.json({ success: true })
    response.headers.set("Cache-Control", "no-store")
    response.cookies.set(ADMIN_COOKIE, await createAdminSession(), COOKIE_OPTIONS)
    return response
  } catch {
    return NextResponse.json({ success: false, message: "Invalid login request" }, { status: 400 })
  }
}
