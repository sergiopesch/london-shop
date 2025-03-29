"use client"

import { useCart } from "@/context/cart-context"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useCallback, memo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckoutModal } from "./checkout-modal"

const CartItem = memo(function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: any
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="py-4 border-b border-gray-800 last:border-0"
    >
      {/* Cart Items - improved for mobile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Product Image - smaller on mobile */}
        <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-800">
          <Image
            src={item.imageSrc || "/placeholder.svg"}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Product Details - improved text size for mobile */}
        <div className="flex-1">
          <h3 className="text-xs sm:text-sm font-medium text-white">
            <Link href={`/shop/${item.categorySlug}/${item.slug}`} className="hover:text-red-500 transition-colors">
              {item.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-400">
            {item.color} / {item.size}
          </p>
          <div className="mt-2 flex items-center">
            <p className="text-xs sm:text-sm font-medium text-white">£{item.price.toFixed(2)}</p>
            <span className="mx-1 sm:mx-2 text-gray-500">×</span>

            {/* Quantity Controls - smaller on mobile */}
            <div className="flex items-center border border-gray-700 rounded-md">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                className="p-1 text-gray-400 hover:text-white"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              <span className="w-6 sm:w-8 text-center text-xs sm:text-sm text-white">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="p-1 text-gray-400 hover:text-white"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>

            {/* Item Total */}
            <p className="ml-auto text-xs sm:text-sm font-medium text-white">
              £{(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </motion.li>
  )
})

export function Cart() {
  const { items, removeItem, updateQuantity, cartTotal, isCartOpen, setIsCartOpen, cartCount } = useCart()
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)

  // Close cart when pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false)
      }
    }

    if (isCartOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent scrolling when cart is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isCartOpen, setIsCartOpen])

  const handleRemoveItem = useCallback(
    (id: string, color: string, size: string) => {
      removeItem(id, color, size)
    },
    [removeItem],
  )

  const handleUpdateQuantity = useCallback(
    (id: string, color: string, size: string, quantity: number) => {
      updateQuantity(id, color, size, quantity)
    },
    [updateQuantity],
  )

  const handleCheckout = useCallback(() => {
    // Immediately open the checkout modal and close the cart
    setIsCartOpen(false)
    // Use requestAnimationFrame to ensure the cart closing animation doesn't conflict
    // with opening the checkout modal
    requestAnimationFrame(() => {
      setIsCheckoutModalOpen(true)
    })
  }, [setIsCartOpen])

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-black/80 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full flex-col">
                {/* Cart Header */}
                <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Your Cart
                    {cartCount > 0 && (
                      <span className="ml-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white">{cartCount}</span>
                    )}
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Cart Items */}
                {items.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center p-6">
                    <ShoppingBag className="h-16 w-16 text-gray-600 mb-4" />
                    <p className="text-lg text-gray-400 mb-6">Your cart is empty</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-6">
                    <motion.ul layout className="divide-y divide-gray-800">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <CartItem
                            key={`${item.id}-${item.color}-${item.size}`}
                            item={item}
                            onRemove={() => handleRemoveItem(item.id, item.color, item.size)}
                            onUpdateQuantity={(quantity) =>
                              handleUpdateQuantity(item.id, item.color, item.size, quantity)
                            }
                          />
                        ))}
                      </AnimatePresence>
                    </motion.ul>
                  </div>
                )}

                {/* Cart Footer */}
                {items.length > 0 && (
                  <div className="border-t border-gray-800 p-6">
                    <div className="flex justify-between text-base font-medium text-white mb-4">
                      <p>Subtotal</p>
                      <p>£{cartTotal.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-400 mb-6">Shipping and taxes calculated at checkout.</p>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
                    >
                      Checkout
                    </button>
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CheckoutModal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} />
    </>
  )
}

