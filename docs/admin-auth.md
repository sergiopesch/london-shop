# Admin authentication setup

Set a unique `ADMIN_PASSWORD` and an independent random `ADMIN_SESSION_SECRET` of at least 32 characters in the server environment. Generate a session secret with `openssl rand -hex 32`. Keep both values out of source control and browser environment variables.

Admin login is disabled until both values are configured. Login creates an HttpOnly, SameSite=Strict cookie; production cookies also require HTTPS. Sessions expire after 24 hours and every protected server/API check verifies the signature and expiry.

This patch invalidates old admin cookies. Administrators must log in again. Rotate `ADMIN_SESSION_SECRET` to invalidate every outstanding session. Restart or redeploy after changing server configuration. Customer feedback submission remains public; reading customer and feedback lists requires an admin session.

Run `node --experimental-vm-modules tests/admin-auth.node.mjs` for synthetic login, primary form submission, session forgery/expiry, middleware, server-action, and private API regression checks. Run `pnpm build` and the repository tests before deployment.
