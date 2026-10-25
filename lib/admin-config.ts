export { ADMIN_COOKIE, COOKIE_OPTIONS } from "./admin-session"

export function isAdminRouteExempt(pathname: string): boolean {
  return pathname === "/admin/login"
}
