const DEFAULT_ADMIN_USERNAME = "admin"
const DEFAULT_ADMIN_PASSWORD = "london-shop-admin"

const warnedKeys = new Set<string>()

function warnOnce(key: string, message: string) {
  if (process.env.NODE_ENV === "production" && !warnedKeys.has(key)) {
    warnedKeys.add(key)
    console.warn(message)
  }
}

export function getAdminUsername(): string {
  const username = process.env.ADMIN_USERNAME?.trim()

  if (!username) {
    warnOnce(
      "admin-username-default",
      "[auth] ADMIN_USERNAME is not set. Falling back to the default admin username. Set ADMIN_USERNAME in production.",
    )
  }

  return username || DEFAULT_ADMIN_USERNAME
}

export function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("[auth] ADMIN_PASSWORD must be set in production.")
    }

    warnOnce(
      "admin-password-missing",
      "[auth] ADMIN_PASSWORD is not set. Falling back to the default development password.",
    )
  } else if (password === DEFAULT_ADMIN_PASSWORD) {
    warnOnce(
      "admin-password-default",
      "[auth] ADMIN_PASSWORD is using the default development value. Change it in production.",
    )
  }

  return password || DEFAULT_ADMIN_PASSWORD
}

export function isAdminRouteExempt(pathname: string): boolean {
  return pathname === "/admin/login"
}

export const ADMIN_COOKIE = "london-shop-admin-session"

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24,
  path: "/",
  sameSite: "strict" as const,
}
