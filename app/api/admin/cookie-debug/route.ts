import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get("london-shop-admin-session")

  return NextResponse.json({
    adminCookie: adminCookie
      ? {
          name: adminCookie.name,
          value: adminCookie.value,
        }
      : null,
    allCookies: cookieStore.getAll().map((c: { name: string }) => c.name),
  })
}

