export function assertAdminBuildConfiguration(env = process.env) {
  const problems = []
  const password = env.ADMIN_PASSWORD
  const secret = env.ADMIN_SESSION_SECRET

  if (typeof password !== "string" || !password.trim()) {
    problems.push("ADMIN_PASSWORD must be configured")
  }
  if (typeof secret !== "string" || secret.length < 32 || !secret.trim()) {
    problems.push("ADMIN_SESSION_SECRET must contain at least 32 characters")
  }
  if (password && secret && password === secret) {
    problems.push("ADMIN_SESSION_SECRET must be independent of ADMIN_PASSWORD")
  }
  if (problems.length) {
    throw new Error(
      `Production build refused: ${problems.join("; ")}. Configure server-only credentials before building. No credential values are logged.`,
    )
  }
}

