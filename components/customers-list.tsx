"use client"

import { useState } from "react"
import type { Customer } from "@/lib/supabase"

export default function CustomersList({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers] = useState<Customer[]>(initialCustomers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <li key={customer.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {customer.first_name.charAt(0)}
                          {customer.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined: {new Date(customer.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No customers found matching your search.</li>
          )}
        </ul>
        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
          <span className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredCustomers.length}</span> of{" "}
            <span className="font-medium">{customers.length}</span> customers
          </span>
        </div>
      </div>
    </>
  )
}

