"use client"

import { memo } from "react"
import { Heart, Share2 } from "lucide-react"
import { ProductColorSelector } from "./product-color-selector"
import { ProductSizeSelector } from "./product-size-selector"

interface ProductInfoProps {
  name: string
  price: number
  description: string
  colors: string[]
  selectedColor: string
  onColorChange: (color: string) => void
  sizes: string[]
  selectedSize: string
  onSizeChange: (size: string) => void
  features: string[]
  isAdding: boolean
  onAddToCart: () => void
  productType: "hoodie" | "tshirt" | "mug" | "memory-game"
  logoType?: "signature" | "underground"
  showView3D?: boolean
}

export const ProductInfo = memo(function ProductInfo({
  name,
  price,
  description,
  colors,
  selectedColor,
  onColorChange,
  sizes,
  selectedSize,
  onSizeChange,
  features,
  isAdding,
  onAddToCart,
  productType,
  logoType,
}: ProductInfoProps) {
  return (
    <div className="backdrop-blur-sm bg-black/30 rounded-xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/10 animate-fade-in">
      <div className="mb-3 sm:mb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{name}</h1>
        <p className="text-xl sm:text-2xl font-bold text-red-500">£{price.toFixed(2)}</p>
      </div>

      <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6">{description}</p>

      {/* Color Selection */}
      {colors.length > 1 && (
        <ProductColorSelector colors={colors} selectedColor={selectedColor} onChange={onColorChange} />
      )}

      {/* Size Selection */}
      {sizes.length > 1 && <ProductSizeSelector sizes={sizes} selectedSize={selectedSize} onChange={onSizeChange} />}

      {/* Features */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-white font-medium mb-1 sm:mb-2">Features</h3>
        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm sm:text-base">
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      {/* Action Buttons - improved for mobile */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={onAddToCart}
          disabled={isAdding}
          className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-md transition-colors flex-1 relative overflow-hidden ${
            isAdding ? "opacity-80" : ""
          }`}
        >
          <span className={`transition-transform duration-500 ${isAdding ? "translate-y-10" : ""}`}>Add to Cart</span>
          {isAdding && (
            <span className="absolute inset-0 flex items-center justify-center animate-fade-in">Adding...</span>
          )}
        </button>
        <button className="border border-gray-700 hover:border-red-600 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-md transition-colors flex items-center justify-center">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">Wishlist</span>
        </button>
        <button className="border border-gray-700 hover:border-red-600 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-md transition-colors flex items-center justify-center">
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">Share</span>
        </button>
      </div>
    </div>
  )
})

