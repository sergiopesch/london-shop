import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import vm from "node:vm"
import { webcrypto } from "node:crypto"
import ts from "typescript"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const jar = new Map()
let dataReads = 0
let cookieWrites = 0
let now = Date.now()
class Clock extends Date { static now() { return now } }
const env = {
  NODE_ENV: "production",
  ADMIN_PASSWORD: "synthetic-test-password",
  ADMIN_SESSION_SECRET: "synthetic-test-session-secret-at-least-32-characters",
}
class MockResponse extends Response {
  cookies = { set: (name, value, options) => { cookieWrites++; this.cookie = { name, value, options } } }
  static json(body, options) { return new MockResponse(JSON.stringify(body), options) }
  static next() { return new MockResponse(null, { status: 200 }) }
  static redirect(url) { return new MockResponse(null, { status: 307, headers: { Location: String(url) } }) }
}
const context = vm.createContext({
  process: { env }, crypto: webcrypto, TextEncoder, Uint8Array, Date: Clock,
  console, Response, URL, FormData,
})
const navigation = []
context.window = {}
context.fetch = async (url, options = {}) => {
  if (url === "/api/admin/check") return check.GET()
  if (url === "/api/admin/login") {
    const result = await login.POST(new Request("https://shop.invalid/api/admin/login", options))
    if (result.cookie) jar.set(result.cookie.name, result.cookie.value)
    return result
  }
  throw new Error(`Unexpected fetch ${url}`)
}
context.FormData = class extends FormData {
  constructor(target) {
    super()
    if (target?.password) this.set("password", target.password)
  }
}
const cache = new Map()
async function load(filename) {
  if (cache.has(filename)) return cache.get(filename)
  const source = await readFile(filename, "utf8")
  const output = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
  }).outputText
  const sourceModule = new vm.SourceTextModule(output, { context, identifier: filename })
  cache.set(filename, sourceModule)
  await sourceModule.link(async (specifier, parent) => {
    let exports
    if (specifier === "next/server") exports = { NextResponse: MockResponse }
    if (specifier === "next/headers") exports = { cookies: async () => ({
      get: (name) => jar.has(name) ? { value: jar.get(name) } : undefined,
      set: (name, value) => { cookieWrites++; jar.set(name, value) }, delete: (name) => { cookieWrites++; jar.delete(name) },
    }) }
    if (specifier === "next/navigation") exports = {
      redirect: (url) => { throw new Error(`redirect:${url}`) },
      useRouter: () => ({ push: (url) => navigation.push(url), refresh: () => {} }),
    }
    if (specifier === "react") exports = { useState: (value) => [value, () => {}], useEffect: () => {} }
    if (specifier === "react/jsx-runtime") exports = {
      jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }), Fragment: Symbol("fragment"),
    }
    if (specifier === "next/link") exports = { default: () => null }
    if (specifier === "@/components/london-logo") exports = { LondonLogo: () => null }
    if (specifier === "@/lib/db" || specifier === "@/lib/supabase") {
      const read = async () => { dataReads++; return [] }
      exports = { db: { getAllFeedback: read }, getAllCustomers: read, getAllFeedback: read, saveFeedback: async () => ({}), saveCustomer: async () => ({}) }
    }
    if (exports) return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [name, value] of Object.entries(exports)) this.setExport(name, value)
    }, { context })
    const target = specifier.startsWith("@/") ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(parent.identifier), specifier)
    return load(`${target}.ts`)
  })
  return sourceModule
}
async function namespace(relative) {
  const sourceModule = await load(path.join(root, relative))
  if (sourceModule.status !== "evaluated") await sourceModule.evaluate()
  return sourceModule.namespace
}
const session = await namespace("lib/admin-session.ts")
const login = await namespace("app/api/admin/login/route.ts")
const check = await namespace("app/api/admin/check/route.ts")
const feedback = await namespace("app/api/feedback/route.ts")
const customers = await namespace("app/api/customers/route.ts")
const middleware = await namespace("middleware.ts")
const actions = await namespace("lib/actions.ts")
const auth = await namespace("lib/auth.ts")
const request = (password) => new Request("https://shop.invalid/api/admin/login", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
})
const middlewareRequest = () => ({ nextUrl: { pathname: "/admin" }, url: "https://shop.invalid/admin", cookies: {
  get: (name) => jar.has(name) ? { value: jar.get(name) } : undefined,
} })

assert.equal(await session.verifyAdminSession("authenticated"), false)
jar.set(session.ADMIN_COOKIE, "authenticated")
assert.equal((await check.GET()).status, 401)
assert.equal((await feedback.GET()).status, 401)
assert.equal((await customers.GET()).status, 401)
assert.equal((await middleware.middleware(middlewareRequest())).status, 307)
assert.equal(dataReads, 0)
assert.equal((await login.POST(request("incorrect"))).status, 401)
assert.equal((await login.POST(request(123))).status, 401)

const response = await login.POST(request(env.ADMIN_PASSWORD))
assert.equal(response.status, 200)
assert.equal(response.cookie.options.httpOnly, true)
assert.equal(response.cookie.options.secure, true)
assert.equal(response.cookie.options.sameSite, "strict")
assert.equal(response.headers.get("Cache-Control"), "no-store")
const token = response.cookie.value
const debug = await namespace("app/api/admin/cookie-debug/route.ts")
jar.set(session.ADMIN_COOKIE, token)
const debugResponse = await debug.GET()
assert.equal(debugResponse.status, 200)
assert.equal((await debugResponse.json()).authenticated, true)
jar.clear()
jar.set(session.ADMIN_COOKIE, token)
assert.equal(await session.verifyAdminSession(token), true)
assert.equal((await check.GET()).status, 200)
assert.equal((await feedback.GET()).status, 200)
assert.equal((await customers.GET()).status, 200)
assert.equal((await middleware.middleware(middlewareRequest())).status, 200)
assert.equal(await auth.isAdminAuthenticated(), true)
assert.ok(dataReads >= 1)

const tampered = token.slice(0, -1) + (token.endsWith("0") ? "1" : "0")
assert.equal(await session.verifyAdminSession(tampered), false)
assert.equal(await session.verifyAdminSession(`${token}.extra`), false)
const secret = env.ADMIN_SESSION_SECRET
env.ADMIN_SESSION_SECRET = "another-independent-test-secret-longer-than-32"
assert.equal(await session.verifyAdminSession(token), false)
env.ADMIN_SESSION_SECRET = secret
now += (session.SESSION_MAX_AGE + 1) * 1000
assert.equal(await session.verifyAdminSession(token), false)
jar.set(session.ADMIN_COOKIE, token)
assert.equal((await feedback.GET()).status, 401)
now -= (session.SESSION_MAX_AGE + 1) * 1000

const form = new FormData()
form.set("password", env.ADMIN_PASSWORD)
assert.equal((await actions.loginAdmin(form)).success, true)
assert.equal(await session.verifyAdminSession(jar.get(session.ADMIN_COOKIE)), true)
assert.equal((await auth.loginAdmin(form)).success, true)
assert.equal(await session.verifyAdminSession(jar.get(session.ADMIN_COOKIE)), true)
// Exercise the real primary login page's form handler through its API client.
const page = await namespace("app/admin/login/page.tsx")
const tree = page.default()
function findForm(node) {
  if (!node || typeof node !== "object") return undefined
  if (node.type === "form") return node
  const children = node.props?.children
  for (const child of Array.isArray(children) ? children : [children]) {
    const match = findForm(child)
    if (match) return match
  }
}
jar.clear()
const loginForm = findForm(tree)
assert.ok(loginForm, "primary login form exists")
await loginForm.props.onSubmit({ preventDefault() {}, target: { password: env.ADMIN_PASSWORD } })
assert.equal(await session.verifyAdminSession(jar.get(session.ADMIN_COOKIE)), true)
assert.ok(navigation.includes("/admin"))
const authenticatedJar = jar.get(session.ADMIN_COOKIE)
const validConfiguration = { ADMIN_PASSWORD: env.ADMIN_PASSWORD, ADMIN_SESSION_SECRET: env.ADMIN_SESSION_SECRET }
const logout = await namespace("app/api/admin/logout/route.ts")
const adminAuth = await namespace("lib/admin-auth.ts")
const disabledConfigurations = [
  {},
  { ADMIN_SESSION_SECRET: validConfiguration.ADMIN_SESSION_SECRET },
  { ADMIN_PASSWORD: validConfiguration.ADMIN_PASSWORD },
  { ...validConfiguration, ADMIN_PASSWORD: "   " },
  { ...validConfiguration, ADMIN_SESSION_SECRET: " ".repeat(32) },
  { ...validConfiguration, ADMIN_SESSION_SECRET: "x".repeat(31) },
  { ADMIN_PASSWORD: validConfiguration.ADMIN_SESSION_SECRET, ADMIN_SESSION_SECRET: validConfiguration.ADMIN_SESSION_SECRET },
]
const protectedPaths = ["/admin", "/admin/login", "/admin/settings", "/admin/customers", "/admin/feedback",
  "/admin/simple-login", "/admin/direct-login", "/admin/cookie-debug", "/admin/cookie-test",
  "/admin%2fsettings", "/admin%2Fsettings",
  "/api/admin/login", "/api/admin/check", "/api/admin/logout", "/api/admin/cookie-debug"]
assert.ok(Array.from(middleware.config.matcher).includes("/api/admin/:path*"), "admin APIs are covered before route handlers")
for (const invalid of disabledConfigurations) {
  delete env.ADMIN_PASSWORD
  delete env.ADMIN_SESSION_SECRET
  Object.assign(env, invalid)
  jar.set(session.ADMIN_COOKIE, authenticatedJar)
  const readsBefore = dataReads
  const writesBefore = cookieWrites
  assert.equal(session.adminAuthConfigured(), false)
  assert.equal(await session.verifyAdminSession(authenticatedJar), false, "old signed token rejected after invalid configuration")
  assert.equal(await session.verifyAdminPassword(invalid.ADMIN_PASSWORD || validConfiguration.ADMIN_PASSWORD), false)
  await assert.rejects(session.createAdminSession(), /not configured/)
  assert.equal(await auth.isAdminAuthenticated(), false)
  assert.equal((await login.POST(request(invalid.ADMIN_PASSWORD || validConfiguration.ADMIN_PASSWORD))).status, 503)
  for (const handler of [check, feedback, customers, logout]) {
    const response = await (handler.GET || handler.POST)()
    assert.equal(response.status, 503)
    assert.equal(response.headers.get("Cache-Control"), "no-store")
    assert.equal(response.cookie, undefined)
    assert.equal((await response.json()).message, session.ADMIN_UNAVAILABLE_MESSAGE)
  }
  for (const pathname of protectedPaths) {
    const request = middlewareRequest()
    request.nextUrl.pathname = pathname
    request.url = `https://shop.invalid${pathname}`
    const unavailable = await middleware.middleware(request)
    assert.equal(unavailable.status, 503, `${pathname} remains disabled`)
    assert.equal(unavailable.headers.get("Cache-Control"), "no-store")
    assert.equal(unavailable.cookie, undefined)
    const body = await unavailable.text()
    assert.ok(body.includes(session.ADMIN_UNAVAILABLE_MESSAGE))
    assert.ok(!body.includes("ADMIN_PASSWORD") && !body.includes("ADMIN_SESSION_SECRET"))
  }
  assert.equal((await actions.loginAdmin(form)).success, false)
  assert.equal((await auth.loginAdmin(form)).success, false)
  await actions.logoutAdmin()
  await auth.logoutAdmin()
  await adminAuth.clearAdminSession()
  assert.equal(dataReads, readsBefore, "disabled requests do not read private data")
  assert.equal(cookieWrites, writesBefore, "disabled APIs/actions do not issue or mutate cookies")
}
Object.assign(env, validConfiguration)
assert.equal(session.adminAuthConfigured(), true)
assert.equal(await session.verifyAdminSession(authenticatedJar), true, "unchanged valid configuration preserves issued sessions")
assert.equal((await login.POST(request(env.ADMIN_PASSWORD))).status, 200)
console.log("Admin auth regression checks passed: legitimate login, signed-session forgery/expiry/rotation, seven invalid configuration states, old-token rejection, all admin page/API aliases, private reads and cookie-free disabled server actions")
