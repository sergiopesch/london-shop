import { NextResponse } from "next/server"

export async function POST() {
  // Create a response
  const response = NextResponse.json({ success: true })

  // Clear the admin session cookie
  response.cookies.set("london-shop-admin-session", "", {
    httpOnly: true,
    expires: new Date(0), // Set expiration to the past to delete the cookie
    path: "/",
    sameSite: "lax",
  })

  return response
}

