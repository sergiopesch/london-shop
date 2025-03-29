import { NextResponse } from "next/server"
import { getAllCustomers } from "@/lib/supabase"

export async function GET() {
  try {
    // Get customers from Supabase
    const customers = await getAllCustomers()

    return NextResponse.json({
      success: true,
      data: customers,
    })
  } catch (error) {
    console.error("Error retrieving customers:", error)

    // Return mock data as fallback
    const mockCustomers = [
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "3",
        first_name: "Michael",
        last_name: "Johnson",
        email: "michael.johnson@example.com",
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockCustomers,
      error: "Failed to retrieve customers from database, using mock data",
    })
  }
}

