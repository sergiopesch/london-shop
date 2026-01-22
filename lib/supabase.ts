import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Initialize the Supabase client with error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Track if Supabase is available
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Create a single supabase client for the entire app (or null if not configured)
let supabaseClient: SupabaseClient | null = null

if (isSupabaseConfigured) {
  supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Export a getter that throws a helpful error if Supabase is not configured
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!supabaseClient) {
      console.warn("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
      // Return a mock that won't break the app during build
      if (prop === 'from') {
        return () => ({
          select: () => ({ data: [], error: null, order: () => ({ data: [], error: null }) }),
          insert: () => ({ select: () => ({ data: [], error: null }) }),
        })
      }
      if (prop === 'auth') {
        return {
          signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          signOut: async () => ({ error: null }),
          getSession: async () => ({ data: { session: null }, error: null }),
        }
      }
      return () => {}
    }
    return supabaseClient[prop as keyof SupabaseClient]
  },
})

// Types for our database tables
export type Feedback = {
  id: string
  email: string
  first_name: string
  last_name: string
  note: string
  cart_items: any[]
  created_at: string
}

export type Customer = {
  id: string
  email: string
  first_name: string
  last_name: string
  created_at: string
}

export type AdminUser = {
  id: string
  email: string
  created_at: string
}

// Database helper functions with better error handling and retry logic
export async function saveFeedback(data: Omit<Feedback, "id" | "created_at">, retryCount = 0) {
  try {
    const { data: feedback, error } = await supabase
      .from("feedback")
      .insert([
        {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          note: data.note,
          cart_items: data.cart_items,
        },
      ])
      .select()

    if (error) {
      console.error("Error saving feedback:", error)

      // Retry logic for network errors (up to 3 times)
      if (retryCount < 3 && (error.code === "PGRST301" || error.code === "23505")) {
        console.log(`Retrying saveFeedback (attempt ${retryCount + 1})...`)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(saveFeedback(data, retryCount + 1))
          }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
        })
      }

      // Return fallback data if we can't save to the database
      return {
        id: "anonymous-feedback",
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        note: data.note,
        cart_items: data.cart_items,
        created_at: new Date().toISOString(),
      }
    }

    return feedback?.[0]
  } catch (error) {
    console.error("Unexpected error in saveFeedback:", error)

    // Retry on network errors
    if (retryCount < 3) {
      console.log(`Retrying saveFeedback after error (attempt ${retryCount + 1})...`)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(saveFeedback(data, retryCount + 1))
        }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
      })
    }

    // Return fallback data if all retries fail
    return {
      id: "anonymous-feedback",
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      note: data.note,
      cart_items: data.cart_items,
      created_at: new Date().toISOString(),
    }
  }
}

export async function saveCustomer(data: Omit<Customer, "id" | "created_at">, retryCount = 0) {
  try {
    // First check if customer already exists
    const { data: existingCustomer, error: lookupError } = await supabase
      .from("customers")
      .select("*")
      .eq("email", data.email)
      .single()

    if (lookupError && lookupError.code !== "PGRST116") {
      console.error("Error looking up customer:", lookupError)

      // Retry logic for network errors
      if (retryCount < 3) {
        console.log(`Retrying customer lookup (attempt ${retryCount + 1})...`)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(saveCustomer(data, retryCount + 1))
          }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
        })
      }

      throw lookupError
    }

    if (existingCustomer) {
      return existingCustomer
    }

    // If not, create a new customer
    const { data: customer, error } = await supabase
      .from("customers")
      .insert([
        {
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        },
      ])
      .select()

    if (error) {
      console.error("Error saving customer:", error)

      // Retry logic for network errors
      if (retryCount < 3 && (error.code === "PGRST301" || error.code === "23505")) {
        console.log(`Retrying saveCustomer (attempt ${retryCount + 1})...`)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(saveCustomer(data, retryCount + 1))
          }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
        })
      }

      return {
        id: "anonymous",
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        created_at: new Date().toISOString(),
      }
    }

    return customer?.[0]
  } catch (error) {
    console.error("Unexpected error in saveCustomer:", error)

    // Retry on network errors
    if (retryCount < 3) {
      console.log(`Retrying saveCustomer after error (attempt ${retryCount + 1})...`)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(saveCustomer(data, retryCount + 1))
        }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
      })
    }

    return {
      id: "anonymous",
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      created_at: new Date().toISOString(),
    }
  }
}

export async function getAllFeedback(retryCount = 0) {
  try {
    const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching feedback:", error)

      // Retry logic for network errors
      if (retryCount < 3) {
        console.log(`Retrying getAllFeedback (attempt ${retryCount + 1})...`)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(getAllFeedback(retryCount + 1))
          }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
        })
      }

      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error in getAllFeedback:", error)

    // Retry on network errors
    if (retryCount < 3) {
      console.log(`Retrying getAllFeedback after error (attempt ${retryCount + 1})...`)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getAllFeedback(retryCount + 1))
        }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
      })
    }

    return []
  }
}

export async function getAllCustomers(retryCount = 0) {
  try {
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching customers:", error)

      // Retry logic for network errors
      if (retryCount < 3) {
        console.log(`Retrying getAllCustomers (attempt ${retryCount + 1})...`)
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(getAllCustomers(retryCount + 1))
          }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
        })
      }

      return []
    }

    return data || []
  } catch (error) {
    console.error("Unexpected error in getAllCustomers:", error)

    // Retry on network errors
    if (retryCount < 3) {
      console.log(`Retrying getAllCustomers after error (attempt ${retryCount + 1})...`)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getAllCustomers(retryCount + 1))
        }, 1000 * Math.pow(2, retryCount)) // Exponential backoff
      })
    }

    return []
  }
}

// Admin authentication functions
export async function signInAdmin(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in admin:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error in signInAdmin:", error)
    return { success: false, error }
  }
}

export async function signOutAdmin() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out admin:", error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error("Unexpected error in signOutAdmin:", error)
    return { success: false, error }
  }
}

export async function getAdminSession() {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting admin session:", error)
      return { success: false, error }
    }

    return { success: true, session: data.session }
  } catch (error) {
    console.error("Unexpected error in getAdminSession:", error)
    return { success: false, error }
  }
}

