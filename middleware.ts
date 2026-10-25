import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAdminRouteExempt } from "@/lib/admin-config"
import { ADMIN_COOKIE, ADMIN_UNAVAILABLE_MESSAGE, adminAuthConfigured, verifyAdminSession } from "@/lib/admin-session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminPage = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin")

  // Disabled administration must stop before login exemptions or page rendering.
  if ((isAdminPage || isAdminApi) && !adminAuthConfigured()) {
    const headers = { "Cache-Control": "no-store" }
    if (isAdminApi) {
      return NextResponse.json({ success: false, message: ADMIN_UNAVAILABLE_MESSAGE }, { status: 503, headers })
    }
    return new NextResponse(
      `<!doctype html><html lang="en"><head><title>Administration unavailable</title></head><body><main><p>${ADMIN_UNAVAILABLE_MESSAGE}</p><a href="/">Return to London Shop</a></main></body></html>`,
      { status: 503, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } },
    )
  }
  if (isAdminApi) return NextResponse.next()

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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

