"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import CustomersList from "@/components/admin/customers-list"

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/customers")

        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.statusText}`)
        }

        const data = await response.json()
        setCustomers(data.data || [])
      } catch (err) {
        console.error("Error fetching customers:", err)
        setError("Failed to load customers data. Please try again later.")
        setCustomers([]) // Use empty array as fallback
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  if (isLoading) {
    return (
      <AdminLayout title="Customers">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Customers">
      {error && <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg">{error}</div>}
      <CustomersList initialCustomers={customers} />
    </AdminLayout>
  )
}

