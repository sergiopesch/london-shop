import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// This is a catch-all route handler for /admin
export function GET(request: NextRequest) {
  // Check if admin is authenticated
  const cookieStore = cookies()
  const isAuthenticated = cookieStore.get("london-shop-admin-session")?.value === "authenticated"

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !request.nextUrl.pathname.includes("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Continue to the requested page
  return NextResponse.next()
}

