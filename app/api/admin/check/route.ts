import { NextResponse } from "next/server"
import { checkAdminSession } from "@/lib/admin-auth"

export async function GET() {
  const authenticated = await checkAdminSession()
  return NextResponse.json({ authenticated }, {
    status: authenticated ? 200 : 401,
    headers: { "Cache-Control": "no-store" },
  })
}
