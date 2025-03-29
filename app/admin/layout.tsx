import type React from "react"
import ClientAuthCheck from "@/components/client-auth-check"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientAuthCheck>{children}</ClientAuthCheck>
}

