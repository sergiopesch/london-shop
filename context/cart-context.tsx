"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

export type CartItem = {
  id: string
  name: string
  price: number
  imageSrc: string
  quantity: number
  color: string
  size: string
  slug: string
  categorySlug: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string, color: string, size: string) => void
  updateQuantity: (id: string, color: string, size: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "london-shop-cart"

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Calculate cart count and total - memoized to prevent unnecessary recalculations
  const cartCount = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items])

  const cartTotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items])

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        setItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error)
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error("Failed to save cart to localStorage", error)
      }
    }
  }, [items, isInitialized])

  // Add item to cart - removed toast notification
  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      // Check if item already exists with same id, color and size
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.color === newItem.color && item.size === newItem.size,
      )

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, { ...newItem, quantity: 1 }]
      }
    })
  }, [])

  // Remove item from cart - removed toast notification
  const removeItem = useCallback((id: string, color: string, size: string) => {
    setItems((prevItems) => prevItems.filter((item) => !(item.id === id && item.color === color && item.size === size)))
  }, [])

  // Update item quantity
  const updateQuantity = useCallback(
    (id: string, color: string, size: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(id, color, size)
        return
      }

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id && item.color === color && item.size === size ? { ...item, quantity } : item,
        ),
      )
    },
    [removeItem],
  )

  // Clear cart - removed toast notification
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal, isCartOpen, setIsCartOpen],
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

