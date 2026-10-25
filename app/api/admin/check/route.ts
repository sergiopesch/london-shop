import { ADMIN_UNAVAILABLE_MESSAGE, adminAuthConfigured } from "@/lib/admin-session"
import { NextResponse } from "next/server"
import { checkAdminSession } from "@/lib/admin-auth"

export async function GET() {
  if (!adminAuthConfigured()) {
    return NextResponse.json({ success: false, message: ADMIN_UNAVAILABLE_MESSAGE }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    })
  }
  const authenticated = await checkAdminSession()
  return NextResponse.json({ authenticated }, {
    status: authenticated ? 200 : 401,
    headers: { "Cache-Control": "no-store" },
  })
}
