"use client"

import { useState, useMemo } from "react"
import type { Feedback } from "@/lib/supabase"
import { Search, ChevronLeft, ChevronRight, Download, MessageSquare } from "lucide-react"

export default function FeedbackList({ initialFeedback }: { initialFeedback: Feedback[] }) {
  const [feedback] = useState<Feedback[]>(initialFeedback)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Filter feedback based on search term
  const filteredFeedback = useMemo(() => {
    return feedback.filter(
      (item) =>
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [feedback, searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage)
  const paginatedFeedback = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredFeedback.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredFeedback, currentPage])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Export feedback as CSV
  const exportFeedback = () => {
    const headers = ["First Name", "Last Name", "Email", "Feedback", "Date"]
    const csvData = filteredFeedback.map((item) => [
      item.first_name,
      item.last_name,
      item.email,
      item.note || "No feedback provided",
      new Date(item.created_at).toLocaleDateString(),
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "london-shop-feedback.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-1/2">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search feedback..."
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>

          <button
            onClick={exportFeedback}
            className="flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-y-auto max-h-[600px]">
            <ul className="divide-y divide-gray-700">
              {paginatedFeedback.length > 0 ? (
                paginatedFeedback.map((item) => (
                  <li
                    key={item.id}
                    className={`cursor-pointer hover:bg-gray-700/50 p-4 ${selectedFeedback?.id === item.id ? "bg-gray-700" : ""}`}
                    onClick={() => setSelectedFeedback(item)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-300 font-medium">
                          {item.first_name.charAt(0)}
                          {item.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-white">
                            {item.first_name} {item.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{item.email}</p>
                        {item.note && <p className="text-sm text-gray-300 mt-2 line-clamp-2">{item.note}</p>}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-gray-400">No feedback found matching your search.</li>
              )}
            </ul>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-900 border-t border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredFeedback.length)} of {filteredFeedback.length} items
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-red-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-1/2">
        {selectedFeedback ? (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full">
            <div className="px-6 py-4 bg-gray-900 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Feedback Details
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-300 font-medium text-lg">
                    {selectedFeedback.first_name.charAt(0)}
                    {selectedFeedback.last_name.charAt(0)}
                  </span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-white">
                    {selectedFeedback.first_name} {selectedFeedback.last_name}
                  </h4>
                  <p className="text-sm text-gray-400">{selectedFeedback.email}</p>
                </div>
                <div className="ml-auto text-sm text-gray-500">
                  {new Date(selectedFeedback.created_at).toLocaleString()}
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-400 mb-2">Feedback Note</h5>
                <div className="bg-gray-900 rounded-lg p-4 text-gray-300">
                  {selectedFeedback.note || "No feedback note provided."}
                </div>
              </div>

              {selectedFeedback.cart_items && selectedFeedback.cart_items.length > 0 ? (
                <div>
                  <h5 className="text-sm font-medium text-gray-400 mb-2">Cart Items</h5>
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {selectedFeedback.cart_items.map((item: any, index: number) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm text-white">{item.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.color}, {item.size}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{item.quantity}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                              £{item.price.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-800/50">
                          <td className="px-4 py-3 text-sm font-medium text-white">Total</td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3 text-sm font-medium text-white">
                            £
                            {selectedFeedback.cart_items
                              .reduce((total: number, item: any) => total + item.price * item.quantity, 0)
                              .toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 rounded-lg p-4 text-gray-400 text-center">No cart items available</div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center h-full flex items-center justify-center">
            <div>
              <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Select a feedback entry to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

