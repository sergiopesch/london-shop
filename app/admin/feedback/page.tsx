"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/admin-layout"
import FeedbackList from "@/components/admin/feedback-list"

export default function FeedbackAdmin() {
  const [feedback, setFeedback] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/feedback")

        if (!response.ok) {
          throw new Error(`Failed to fetch feedback: ${response.statusText}`)
        }

        const data = await response.json()
        setFeedback(data.data || [])
      } catch (err) {
        console.error("Error fetching feedback:", err)
        setError("Failed to load feedback data. Please try again later.")
        setFeedback([]) // Use empty array as fallback
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  if (isLoading) {
    return (
      <AdminLayout title="Customer Feedback">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Customer Feedback">
      {error && <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg">{error}</div>}
      <FeedbackList initialFeedback={feedback} />
    </AdminLayout>
  )
}

