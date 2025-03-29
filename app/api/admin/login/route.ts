import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    console.log("[SERVER]  Login attempt with password:", password)

    // Verify password
    if (password !== "london-shop-admin") {
      console.log("[SERVER]  Invalid password")
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }

    console.log("[SERVER]  Password verified, setting cookie")

    // Create a response with success message
    const response = NextResponse.json({ success: true })

    // Set the cookie directly on the response object
    response.cookies.set("london-shop-admin-session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "lax",
    })

    console.log("[SERVER]  Cookie set, returning success response")

    // Return the response with the cookie
    return response
  } catch (error) {
    console.error("[SERVER]  Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}

