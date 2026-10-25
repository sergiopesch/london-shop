import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { randomBytes } from "node:crypto"
import { once } from "node:events"
import { mkdtemp, rm, readFile } from "node:fs/promises"
import { createServer } from "node:net"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// Run in an exclusive disposable checkout. No existing credentials are inherited.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const temporaryHome = await mkdtemp(join(tmpdir(), "london-admin-availability-"))
const env = {
  PATH: process.env.PATH, HOME: temporaryHome, NODE_ENV: "production", CI: "1",
  NEXT_TELEMETRY_DISABLED: "1", CIRCLE_NODE_TOTAL: "2", RAYON_NUM_THREADS: "2", TOKIO_WORKER_THREADS: "2",
}
const next = join(root, "node_modules/next/dist/bin/next")
const configured = { ADMIN_PASSWORD: randomBytes(24).toString("hex"), ADMIN_SESSION_SECRET: randomBytes(32).toString("hex") }
const message = "Administration is unavailable. Contact the site owner."
let server

async function build() {
  const child = spawn(process.execPath, [next, "build"], { cwd: root, env, stdio: "inherit" })
  const [code] = await once(child, "exit")
  assert.equal(code, 0, "normal production source build succeeds with administration disabled")
}
async function stop() {
  if (!server) return
  const child = server
  server = undefined
  if (child.exitCode !== null) return
  child.kill("SIGTERM")
  await once(child, "exit")
}
async function start(configuration) {
  const probe = createServer()
  await new Promise((resolve) => probe.listen(0, "127.0.0.1", resolve))
  const port = probe.address().port
  await new Promise((resolve) => probe.close(resolve))
  const origin = `http://127.0.0.1:${port}`
  server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { cwd: root, env: { ...env, ...configuration }, stdio: ["ignore", "inherit", "inherit"] })
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(server.exitCode, null, "production server remains running")
    try { await fetch(origin); return origin } catch { await new Promise((resolve) => setTimeout(resolve, 100)) }
  }
  throw new Error("production server did not become ready")
}
async function request(origin, path, options = {}) {
  const result = await fetch(`${origin}${path}`, { redirect: "manual", ...options })
  return { result, body: await result.text() }
}
function assertNoSession(result) { assert.equal(result.headers.get("set-cookie"), null) }

try {
  await build()
  // This build had no admin secrets. Runtime-only valid configuration must still work.
  let origin = await start(configured)
  const loginPage = await request(origin, "/admin/login")
  assert.equal(loginPage.result.status, 200)
  assert.ok(!loginPage.body.includes(message), "configured login page is not the disabled response")
  assert.equal((await request(origin, "/admin")).result.status, 307)
  for (const path of ["/api/customers", "/api/feedback", "/api/admin/check"]) {
    assert.equal((await request(origin, path)).result.status, 401, `configured private path ${path} requires a session`)
  }
  const rejected = await request(origin, "/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: "incorrect" }) })
  assert.equal(rejected.result.status, 401)
  assertNoSession(rejected.result)
  const login = await request(origin, "/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: configured.ADMIN_PASSWORD }) })
  assert.equal(login.result.status, 200)
  const setCookie = login.result.headers.get("set-cookie")
  assert.match(setCookie, /HttpOnly/i)
  assert.match(setCookie, /SameSite=Strict/i)
  assert.match(setCookie, /Secure/i)
  const cookie = setCookie.split(";")[0]
  assert.equal((await request(origin, "/api/admin/check", { headers: { cookie } })).result.status, 200)
  assert.equal((await request(origin, "/admin", { headers: { cookie } })).result.status, 200)
  for (const path of ["/api/customers", "/api/feedback"]) {
    assert.equal((await request(origin, path, { headers: { cookie } })).result.status, 200)
  }
  await stop()

  const disabled = [
    {}, { ADMIN_PASSWORD: configured.ADMIN_PASSWORD }, { ADMIN_SESSION_SECRET: configured.ADMIN_SESSION_SECRET },
    { ...configured, ADMIN_PASSWORD: "   " }, { ...configured, ADMIN_SESSION_SECRET: " ".repeat(32) },
    { ...configured, ADMIN_SESSION_SECRET: "x".repeat(31) },
    { ADMIN_PASSWORD: configured.ADMIN_SESSION_SECRET, ADMIN_SESSION_SECRET: configured.ADMIN_SESSION_SECRET },
  ]
  const adminPaths = ["/admin", "/admin/login", "/admin/settings", "/admin/customers", "/admin/feedback",
    "/admin/simple-login", "/admin/direct-login", "/admin/cookie-debug", "/admin/cookie-test",
    "/admin%2fsettings", "/admin%2Fsettings"]
  const privateApis = ["/api/admin/check", "/api/admin/cookie-debug", "/api/customers", "/api/feedback"]
  for (const configuration of disabled) {
    origin = await start(configuration)
    for (const path of ["/", "/shop", "/shop/hoodies"]) {
      const publicPage = await request(origin, path)
      assert.equal(publicPage.result.status, 200, `public store remains available: ${path}`)
      assertNoSession(publicPage.result)
    }
    for (const path of adminPaths) {
      for (const headers of [{}, { cookie }, { cookie: "london-shop-admin-session=authenticated" }, { cookie, RSC: "1" }]) {
        const unavailable = await request(origin, path, { headers })
        assert.equal(unavailable.result.status, 503, `disabled admin HTML/RSC ${path}`)
        assert.equal(unavailable.result.headers.get("Cache-Control"), "no-store")
        assert.ok(unavailable.body.includes(message))
        assert.ok(!unavailable.body.includes("ADMIN_PASSWORD") && !unavailable.body.includes("ADMIN_SESSION_SECRET"))
        assert.ok(!unavailable.body.includes("Recent Customers") && !unavailable.body.includes("Recent Feedback"))
        assertNoSession(unavailable.result)
      }
    }
    for (const path of privateApis) {
      const unavailable = await request(origin, path, { headers: { cookie } })
      assert.equal(unavailable.result.status, 503, `disabled private API ${path}`)
      assert.equal(unavailable.result.headers.get("Cache-Control"), "no-store")
      assert.ok(unavailable.body.includes(message))
      assert.ok(!unavailable.body.includes('"data"'))
      assertNoSession(unavailable.result)
    }
    for (const path of ["/api/admin/login", "/api/admin/logout"]) {
      const unavailable = await request(origin, path, { method: "POST", headers: { cookie, "Content-Type": "application/json" }, body: JSON.stringify({ password: configuration.ADMIN_PASSWORD || configured.ADMIN_PASSWORD }) })
      assert.equal(unavailable.result.status, 503, `disabled admin mutation ${path}`)
      assert.equal(unavailable.result.headers.get("Cache-Control"), "no-store")
      assertNoSession(unavailable.result)
    }
    // Public feedback validation still runs instead of being disabled with admin.
    assert.equal((await request(origin, "/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })).result.status, 400)
    await stop()
  }
  const manifest = JSON.parse(await readFile(join(root, ".next/prerender-manifest.json"), "utf8"))
  assert.ok(!Object.keys(manifest.routes).some((path) => path === "/admin" || path.startsWith("/admin/")), "admin pages are evaluated dynamically, not frozen into build output")
  console.log("PASS: credential-free production build, configured runtime-only login/private reads, seven invalid config states, public store available, all admin HTML/RSC/API aliases disabled503, no session cookies, old-token rejection, public feedback validation")
} finally {
  await stop()
  await rm(temporaryHome, { recursive: true, force: true })
}
