"use client"

import { memo } from "react"

interface ProductSizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onChange: (size: string) => void
}

export const ProductSizeSelector = memo(function ProductSizeSelector({
  sizes,
  selectedSize,
  onChange,
}: ProductSizeSelectorProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <h3 className="text-white font-medium text-sm sm:text-base">Size</h3>
        <button className="text-red-500 text-xs sm:text-sm hover:underline focus:outline-none focus:underline">
          Size Guide
        </button>
      </div>
      <div className="flex flex-wrap gap-1 sm:gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`min-w-[2.5rem] sm:min-w-[3rem] py-1 sm:py-2 px-2 sm:px-3 transition-all duration-200 ${
              selectedSize === size
                ? "bg-red-600 text-white border border-red-600 shadow-md"
                : "border border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-black/20"
            } rounded-md text-sm sm:text-base`}
            aria-label={`Select size ${size}`}
            aria-pressed={selectedSize === size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
})

