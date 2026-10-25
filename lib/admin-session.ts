export const ADMIN_COOKIE = "london-shop-admin-session"
export const SESSION_MAX_AGE = 24 * 60 * 60
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_MAX_AGE,
  path: "/",
  sameSite: "strict" as const,
}

export const ADMIN_UNAVAILABLE_MESSAGE = "Administration is unavailable. Contact the site owner."

export function adminAuthConfigured(): boolean {
  const password = process.env.ADMIN_PASSWORD
  const secret = process.env.ADMIN_SESSION_SECRET
  return typeof password === "string" && Boolean(password.trim()) &&
    typeof secret === "string" && secret.length >= 32 && Boolean(secret.trim()) &&
    secret !== password
}

async function signingKey(): Promise<CryptoKey> {
  if (!adminAuthConfigured()) throw new Error("Admin authentication is not configured")
  return crypto.subtle.importKey(
    "raw", new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"],
  )
}

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export async function verifyAdminPassword(password: unknown): Promise<boolean> {
  if (!adminAuthConfigured() || typeof password !== "string" || !password) return false
  const [actual, expected] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(password)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(process.env.ADMIN_PASSWORD)),
  ])
  const actualBytes = new Uint8Array(actual)
  const expectedBytes = new Uint8Array(expected)
  let difference = 0
  for (let index = 0; index < actualBytes.length; index++) difference |= actualBytes[index] ^ expectedBytes[index]
  return difference === 0
}

export async function createAdminSession(): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  const nonce = hex(crypto.getRandomValues(new Uint8Array(16)))
  const payload = `v1.${expires}.${nonce}`
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), new TextEncoder().encode(payload))
  return `${payload}.${hex(new Uint8Array(signature))}`
}

export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  if (!token || !adminAuthConfigured()) return false
  const parts = /^v1\.([0-9]{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(token)
  if (!parts) return false
  const expires = Number(parts[1])
  const now = Math.floor(Date.now() / 1000)
  if (expires <= now || expires > now + SESSION_MAX_AGE) return false
  try {
    const signature = Uint8Array.from(parts[3].match(/../g)!, (byte) => Number.parseInt(byte, 16))
    const payload = token.slice(0, token.lastIndexOf("."))
    return await crypto.subtle.verify("HMAC", await signingKey(), signature, new TextEncoder().encode(payload))
  } catch {
    return false
  }
}
