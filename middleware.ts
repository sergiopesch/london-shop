import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE, isAdminRouteExempt } from "@/lib/admin-config"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isAdminRouteExempt(pathname)) {
    return NextResponse.next()
  }

  const isAuthenticated = request.cookies.get(ADMIN_COOKIE)?.value === "authenticated"

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

