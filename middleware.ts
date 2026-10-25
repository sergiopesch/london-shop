import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAdminRouteExempt } from "@/lib/admin-config"
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isAdminRouteExempt(pathname)) {
    return NextResponse.next()
  }

  const isAuthenticated = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)

  if (pathname.startsWith("/admin") && !isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

