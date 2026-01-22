"use client"

import type React from "react"

import { useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [isGeneralSubmitting, setIsGeneralSubmitting] = useState(false)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [generalSuccess, setGeneralSuccess] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  const router = useRouter()

  // Handle general settings form submission
  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGeneralSubmitting(true)
    setGeneralError(null)
    setGeneralSuccess(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success
      setGeneralSuccess("Settings updated successfully")

      // Refresh the page to show updated settings
      router.refresh()
    } catch (error) {
      console.error("Error updating settings:", error)
      setGeneralError("Failed to update settings. Please try again.")
    } finally {
      setIsGeneralSubmitting(false)
    }
  }

  // Handle password form submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPasswordSubmitting(true)
    setPasswordError(null)
    setPasswordSuccess(null)

    try {
      // Get form data
      const formData = new FormData(e.target as HTMLFormElement)
      const currentPassword = formData.get("current-password") as string
      const newPassword = formData.get("new-password") as string
      const confirmPassword = formData.get("confirm-password") as string

      // Validate passwords
      if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("All fields are required")
      }

      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success
      setPasswordSuccess("Password updated successfully")
      // Clear form
      ;(e.target as HTMLFormElement).reset()
    } catch (error) {
      console.error("Error updating password:", error)
      setPasswordError(error instanceof Error ? error.message : "Failed to update password. Please try again.")
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  return (
    <AdminLayout title="Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">General Settings</h2>
          </div>
          <div className="p-6">
            {generalError && (
              <div className="mb-6 p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-md">{generalError}</div>
            )}

            {generalSuccess && (
              <div className="mb-6 p-3 bg-green-900/50 border border-green-800 text-green-200 rounded-md">
                {generalSuccess}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleGeneralSubmit}>
              <div>
                <label htmlFor="site-name" className="block text-sm font-medium text-gray-300 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  id="site-name"
                  name="site-name"
                  defaultValue="London Shop"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <div>
                <label htmlFor="site-description" className="block text-sm font-medium text-gray-300 mb-1">
                  Site Description
                </label>
                <textarea
                  id="site-description"
                  name="site-description"
                  rows={3}
                  defaultValue="Find unique London-themed merchandise including hoodies, t-shirts, memory cards, and mugs."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                />
              </div>

              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  defaultValue="GBP"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                >
                  <option value="GBP">British Pound (£)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneralSubmitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
              >
                {isGeneralSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">Admin Account</h2>
          </div>
          <div className="p-6">
            {passwordError && (
              <div className="mb-6 p-3 bg-red-900/50 border border-red-800 text-red-200 rounded-md">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-6 p-3 bg-green-900/50 border border-green-800 text-green-200 rounded-md">
                {passwordSuccess}
              </div>
            )}

            <form className="space-y-6" onSubmit={handlePasswordSubmit}>
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="current-password"
                  name="current-password"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="new-password"
                  name="new-password"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isPasswordSubmitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 flex items-center"
              >
                {isPasswordSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

