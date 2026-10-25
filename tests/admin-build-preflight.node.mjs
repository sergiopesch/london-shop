import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { test } from "node:test"
import { assertAdminBuildConfiguration } from "../scripts/admin-build-preflight.mjs"

const root = fileURLToPath(new URL("../", import.meta.url))
const configured = {
  ADMIN_PASSWORD: "preflight-test-password-not-for-deployment",
  ADMIN_SESSION_SECRET: "preflight-test-session-key-not-for-deployment",
}

function loadConfig(phase, vars = {}) {
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", `
    import config from "./next.config.mjs"
    await config(${JSON.stringify(phase)})
    console.log("configuration-loaded")
  `], {
    cwd: root,
    encoding: "utf8",
    env: { PATH: process.env.PATH, ...vars },
  })
  assert.ifError(result.error)
  return { status: result.status, output: result.stdout + result.stderr }
}

test("production configuration refuses missing administrator credentials", () => {
  const result = loadConfig("phase-production-build")
  assert.notEqual(result.status, 0)
  assert.match(result.output, /ADMIN_PASSWORD must be configured/)
  assert.match(result.output, /ADMIN_SESSION_SECRET must contain at least 32 characters/)
})

test("CI and provider flags cannot bypass production configuration validation", () => {
  for (const VERCEL_ENV of [undefined, "preview", "development", "production"]) {
    const result = loadConfig("phase-production-build", { CI: "1", VERCEL_ENV })
    assert.notEqual(result.status, 0)
    assert.match(result.output, /Production build refused/)
  }
})

test("production configuration accepts explicitly configured independent credentials", () => {
  const result = loadConfig("phase-production-build", configured)
  assert.equal(result.status, 0, result.output)
  assert.match(result.output, /configuration-loaded/)
})

test("development configuration remains usable without administrator credentials", () => {
  const result = loadConfig("phase-development-server")
  assert.equal(result.status, 0, result.output)
})

test("short session keys fail without disclosing the provided credential values", () => {
  const vars = { ...configured, ADMIN_SESSION_SECRET: "short-test-key" }
  const result = loadConfig("phase-production-build", vars)
  assert.notEqual(result.status, 0)
  assert.match(result.output, /ADMIN_SESSION_SECRET must contain at least 32 characters/)
  assert.ok(!result.output.includes(vars.ADMIN_PASSWORD))
  assert.ok(!result.output.includes(vars.ADMIN_SESSION_SECRET))
})

test("missing password fails without disclosing a configured session key", () => {
  const result = loadConfig("phase-production-build", { ADMIN_SESSION_SECRET: configured.ADMIN_SESSION_SECRET })
  assert.notEqual(result.status, 0)
  assert.match(result.output, /ADMIN_PASSWORD must be configured/)
  assert.ok(!result.output.includes(configured.ADMIN_SESSION_SECRET))
})

test("equal password and session key fail without disclosing either value", () => {
  const result = loadConfig("phase-production-build", {
    ADMIN_PASSWORD: configured.ADMIN_SESSION_SECRET,
    ADMIN_SESSION_SECRET: configured.ADMIN_SESSION_SECRET,
  })
  assert.notEqual(result.status, 0)
  assert.match(result.output, /must be independent/)
  assert.ok(!result.output.includes(configured.ADMIN_SESSION_SECRET))
})

test("blank credentials and a 31-character key are rejected; 32 characters are accepted", () => {
  assert.throws(() => assertAdminBuildConfiguration({ ADMIN_PASSWORD: " ", ADMIN_SESSION_SECRET: " ".repeat(32) }))
  assert.throws(() => assertAdminBuildConfiguration({ ...configured, ADMIN_SESSION_SECRET: "x".repeat(31) }))
  assert.doesNotThrow(() => assertAdminBuildConfiguration({ ...configured, ADMIN_SESSION_SECRET: "x".repeat(32) }))
})

