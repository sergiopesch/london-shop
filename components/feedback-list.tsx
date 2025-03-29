"use client"

import { useState } from "react"
import type { Feedback } from "@/lib/supabase"

export default function FeedbackList({ initialFeedback }: { initialFeedback: Feedback[] }) {
  const [feedback] = useState<Feedback[]>(initialFeedback)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  const filteredFeedback = feedback.filter(
    (item) =>
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search feedback..."
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredFeedback.length > 0 ? (
                filteredFeedback.map((item) => (
                  <li
                    key={item.id}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedFeedback?.id === item.id ? "bg-blue-50" : ""}`}
                    onClick={() => setSelectedFeedback(item)}
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">
                              {item.first_name.charAt(0)}
                              {item.last_name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.first_name} {item.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{item.email}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</div>
                      </div>
                      {item.note && <div className="mt-2 text-sm text-gray-700 line-clamp-2">{item.note}</div>}
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No feedback found matching your search.</li>
              )}
            </ul>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{filteredFeedback.length}</span> of{" "}
                <span className="font-medium">{feedback.length}</span> feedback entries
              </span>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          {selectedFeedback ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Feedback Details</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Submitted on {new Date(selectedFeedback.created_at).toLocaleString()}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedFeedback.first_name} {selectedFeedback.last_name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Email address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{selectedFeedback.email}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Feedback note</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedFeedback.note || "No feedback note provided."}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Cart items</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {selectedFeedback.cart_items && selectedFeedback.cart_items.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {selectedFeedback.cart_items.map((item: any, index: number) => (
                            <li key={index} className="py-2">
                              <div className="flex items-center">
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity} | Price: £{item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No cart items available.</p>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
              <p className="text-gray-500">Select a feedback entry to view details</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

