import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get("london-shop-admin-session")

  if (!adminCookie || adminCookie.value !== "authenticated") {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}

