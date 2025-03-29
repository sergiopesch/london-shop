// This is a simple in-memory database for demonstration purposes
// In a real application, you would use a proper database like MongoDB, PostgreSQL, etc.

export interface FeedbackEntry {
  id: string
  email: string
  firstName: string
  lastName: string
  note: string
  cartItems: any[]
  createdAt: Date
}

class InMemoryDatabase {
  private feedbackEntries: FeedbackEntry[] = []

  async saveFeedback(data: Omit<FeedbackEntry, "id" | "createdAt">): Promise<FeedbackEntry> {
    const id = Math.random().toString(36).substring(2, 15)
    const entry: FeedbackEntry = {
      ...data,
      id,
      createdAt: new Date(),
    }

    this.feedbackEntries.push(entry)
    console.log("Feedback saved:", entry)

    return entry
  }

  async getAllFeedback(): Promise<FeedbackEntry[]> {
    return [...this.feedbackEntries]
  }
}

// Export a singleton instance
export const db = new InMemoryDatabase()

