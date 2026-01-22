"use client"

import type React from "react"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import Link from "next/link"
import { Users, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react"

// Types for data
interface Customer {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  created_at?: string
}

interface Feedback {
  id: string
  first_name?: string
  last_name?: string
  note?: string
  created_at?: string
}

// Mock data for when API calls fail
const fallbackCustomers: Customer[] = []
const fallbackFeedback: Feedback[] = []

export default function AdminDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch customers data
        const customersResponse = await fetch("/api/customers")
        if (!customersResponse.ok) {
          throw new Error(`Failed to fetch customers: ${customersResponse.statusText}`)
        }
        const customersData = await customersResponse.json()

        // Fetch feedback data
        const feedbackResponse = await fetch("/api/feedback")
        if (!feedbackResponse.ok) {
          throw new Error(`Failed to fetch feedback: ${feedbackResponse.statusText}`)
        }
        const feedbackData = await feedbackResponse.json()

        // Set data
        setCustomers(customersData.data || [])
        setFeedback(feedbackData.data || [])
      } catch (err) {
        console.error("Error fetching admin data:", err)
        setError("Failed to load dashboard data. Using fallback data.")
        // Use fallback data
        setCustomers(fallbackCustomers)
        setFeedback(fallbackFeedback)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate counts
  const customerCount = customers.length
  const feedbackCount = feedback.length

  // Get recent items
  const recentCustomers = customers.slice(0, 5)
  const recentFeedback = feedback.slice(0, 5)

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Dashboard">
      {error && <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg">{error}</div>}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Customers"
          value={customerCount}
          icon={<Users className="h-6 w-6" />}
          href="/admin/customers"
          color="bg-gradient-to-br from-blue-600 to-blue-800"
        />

        <StatsCard
          title="Total Feedback"
          value={feedbackCount}
          icon={<MessageSquare className="h-6 w-6" />}
          href="/admin/feedback"
          color="bg-gradient-to-br from-red-600 to-red-800"
        />

        <StatsCard
          title="Products"
          value={8}
          icon={<ShoppingBag className="h-6 w-6" />}
          href="/shop"
          color="bg-gradient-to-br from-green-600 to-green-800"
        />

        <StatsCard
          title="Conversion Rate"
          value="12.5%"
          icon={<TrendingUp className="h-6 w-6" />}
          href="#"
          color="bg-gradient-to-br from-purple-600 to-purple-800"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Customers</h2>
            <Link href="/admin/customers" className="text-sm text-red-500 hover:text-red-400">
              View All
            </Link>
          </div>
          <div className="p-6">
            {recentCustomers.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {recentCustomers.map((customer: Customer) => (
                  <li key={customer.id} className="py-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-300 font-medium">
                        {customer.first_name?.charAt(0) || "?"}
                        {customer.last_name?.charAt(0) || "?"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-white">
                        {customer.first_name || "Unknown"} {customer.last_name || "User"}
                      </p>
                      <p className="text-xs text-gray-400">{customer.email || "No email"}</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "Unknown date"}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-4">No customers yet</p>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Feedback</h2>
            <Link href="/admin/feedback" className="text-sm text-red-500 hover:text-red-400">
              View All
            </Link>
          </div>
          <div className="p-6">
            {recentFeedback.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {recentFeedback.map((item: Feedback) => (
                  <li key={item.id} className="py-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-300 font-medium">
                          {item.first_name?.charAt(0) || "?"}
                          {item.last_name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">
                            {item.first_name || "Unknown"} {item.last_name || "User"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Unknown date"}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {item.note || "No feedback note provided."}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-center py-4">No feedback yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Manage Customers"
              description="View and manage customer information"
              href="/admin/customers"
              icon={<Users className="h-5 w-5" />}
            />
            <QuickActionCard
              title="Review Feedback"
              description="View customer feedback and suggestions"
              href="/admin/feedback"
              icon={<MessageSquare className="h-5 w-5" />}
            />
            <QuickActionCard
              title="Visit Store"
              description="Go to the main store website"
              href="/"
              icon={<ShoppingBag className="h-5 w-5" />}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function StatsCard({
  title,
  value,
  icon,
  href,
  color,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
  href: string
  color: string
}) {
  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${color}`}>
      <div className="p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-white/10 mr-4">{icon}</div>
          <div>
            <p className="text-sm font-medium text-white/80">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        </div>
      </div>
      <div className="bg-black/20 px-6 py-3">
        <Link href={href} className="text-xs font-medium text-white/80 hover:text-white flex items-center">
          View Details
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <Link href={href} className="block">
      <div className="border border-gray-700 rounded-lg p-6 bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center mb-3">
          <div className="p-2 rounded-md bg-red-600/20 text-red-500 mr-3">{icon}</div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </Link>
  )
}

