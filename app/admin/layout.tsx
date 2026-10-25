import type React from "react"
import ClientAuthCheck from "@/components/client-auth-check"
import { ADMIN_UNAVAILABLE_MESSAGE, adminAuthConfigured } from "@/lib/admin-session"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!adminAuthConfigured()) return <main><p>{ADMIN_UNAVAILABLE_MESSAGE}</p></main>
  return <ClientAuthCheck>{children}</ClientAuthCheck>
}

