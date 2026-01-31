import { NextResponse } from "next/server"
import { getAllFeedback, saveFeedback, saveCustomer } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, note, cartItems } = body

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Save customer (or get existing)
    await saveCustomer({
      email,
      first_name: firstName,
      last_name: lastName,
    })

    // Save feedback
    const feedback = await saveFeedback({
      email,
      first_name: firstName,
      last_name: lastName,
      note: note || "",
      cart_items: cartItems || [],
    })

    return NextResponse.json({
      success: true,
      data: feedback,
    })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save feedback" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get feedback from Supabase
    const feedback = await getAllFeedback()

    return NextResponse.json({
      success: true,
      data: feedback,
    })
  } catch (error) {
    console.error("Error retrieving feedback:", error)

    // Return mock data as fallback
    const mockFeedback = [
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        note: "Great products! I love the London Underground hoodie.",
        created_at: new Date().toISOString(),
        cart_items: [
          { id: "hoodie-2", name: "London Underground Hoodie", price: 59.99, quantity: 1, color: "White", size: "M" },
        ],
      },
      {
        id: "2",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        note: "The memory game is perfect for my kids. They love it!",
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        cart_items: [
          {
            id: "memory-1",
            name: "London Iconic Places Memory Game",
            price: 19.99,
            quantity: 1,
            color: "Multicolor",
            size: "One Size",
          },
        ],
      },
      {
        id: "3",
        first_name: "Michael",
        last_name: "Johnson",
        email: "michael.johnson@example.com",
        note: "I bought the mug as a souvenir. Great quality!",
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        cart_items: [
          { id: "mug-1", name: "London Signature Mug", price: 14.99, quantity: 2, color: "White", size: "Standard" },
        ],
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockFeedback,
      error: "Failed to retrieve feedback from database, using mock data",
    })
  }
}

