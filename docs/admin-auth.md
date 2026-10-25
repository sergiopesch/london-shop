# Admin authentication setup

The public shop builds and runs without administrator credentials. Administration is disabled whenever `ADMIN_PASSWORD` is missing or blank, or `ADMIN_SESSION_SECRET` is missing, blank, shorter than 32 characters, or equal to the password. There is no default password or signing key, including in development or CI.

Disabled admin pages (including login and legacy aliases), admin API routes, and private customer/feedback reads return HTTP 503 with a generic unavailable message and `Cache-Control: no-store`. Signed-session verification rejects every token while configuration is invalid, including tokens issued before configuration changed. Admin server actions cannot issue a session or modify cookies while disabled. Public product pages and feedback submission remain available.

To enable administration, set a unique `ADMIN_PASSWORD` and an independent random `ADMIN_SESSION_SECRET` of at least 32 characters in the destination server environment. Generate a session secret with `openssl rand -hex 32`. Keep both values out of source control and browser environment variables. Configure Production and Preview separately, then restart or redeploy after changing configuration.

With valid configuration, login creates an HttpOnly, SameSite=Strict cookie; production cookies also require HTTPS. Sessions expire after 24 hours and every protected server/API check verifies the signature and expiry. Old forgeable admin cookies are invalid. Rotate `ADMIN_SESSION_SECRET` to invalidate outstanding sessions.

Run `node --experimental-vm-modules tests/admin-auth.node.mjs` for real application logic with synthetic dependencies: legitimate login, forged/expired/rotated sessions, invalid-configuration transitions, middleware, private APIs and server actions. Run `node tests/admin-availability.node.mjs` in an exclusive disposable checkout for a credential-free production build and real HTTP checks of public pages, disabled administration and configured login. The test only uses synthetic local credentials and never writes provider settings. Run the owning package checks before deployment.

Deploy a clean source build to the existing owned project. A successful public deployment with administration disabled is not proof that real administrator credentials, provider-backed features or data storage are configured.
