"use client"

import Link from "next/link"
import { LondonLogo } from "../london-logo"
import { Bell, User } from "lucide-react"
import { useState } from "react"
import AdminLogoutButton from "../admin-logout-button"

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <header className="bg-black border-b border-gray-800 py-3 px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin" className="flex items-center">
            <LondonLogo className="h-8" />
            <span className="ml-3 text-xl font-bold hidden md:inline-block">Admin</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="ml-2 hidden md:inline-block">Admin</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <Link
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
                <div className="px-4 py-2">
                  <AdminLogoutButton />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

