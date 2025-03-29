"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import AdminLogoutButton from "./admin-logout-button"

export default function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex">
            <Link href="/admin" className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">London Shop Admin</h1>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/admin"
              className={`${pathname === "/admin" ? "text-gray-900" : "text-gray-500"} hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/customers"
              className={`${pathname === "/admin/customers" ? "text-gray-900" : "text-gray-500"} hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium`}
            >
              Customers
            </Link>
            <Link
              href="/admin/feedback"
              className={`${pathname === "/admin/feedback" ? "text-gray-900" : "text-gray-500"} hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium`}
            >
              Feedback
            </Link>
          </nav>
          <div>
            <AdminLogoutButton />
          </div>
        </div>
      </div>
    </header>
  )
}

