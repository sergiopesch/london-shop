# Admin authentication setup

Set a unique `ADMIN_PASSWORD` and an independent random `ADMIN_SESSION_SECRET` of at least 32 characters in the server environment. Generate a session secret with `openssl rand -hex 32`. Keep both values out of source control and browser environment variables.

Admin login is disabled until both values are configured. Login creates an HttpOnly, SameSite=Strict cookie; production cookies also require HTTPS. Sessions expire after 24 hours and every protected server/API check verifies the signature and expiry.

Every Next production build now refuses missing or blank credentials, a session secret shorter than 32 characters, or a password reused as the session secret. Validation runs in Next configuration, so it also covers a provider invoking `next build` directly. Errors name the missing configuration without logging its values. A failed source build cannot replace the existing Vercel production deployment.

Configure these server-only values separately for Production and Preview before deploying. This also applies to local production builds; `next dev` remains available without them. CI build fixtures are scoped to that job and must never be used for a deployment. Provider flags and `CI=1` do not bypass validation. Do not promote a CI-fixture build or use a prebuilt deployment as a substitute for a source build with the destination configuration. Runtime environment changes still require the existing authentication checks.

This patch invalidates old admin cookies. Administrators must log in again. Rotate `ADMIN_SESSION_SECRET` to invalidate every outstanding session. Restart or redeploy after changing server configuration. Customer feedback submission remains public; reading customer and feedback lists requires an admin session.

Run `node --experimental-vm-modules tests/admin-auth.node.mjs` for synthetic login, primary form submission, session forgery/expiry, middleware, server-action, and private API regression checks. Run `node --test tests/admin-build-preflight.node.mjs` for production/development phase, missing configuration, minimum key length, independent-key and error-redaction controls. Run `pnpm build` with destination server credentials and the repository tests before deployment.
