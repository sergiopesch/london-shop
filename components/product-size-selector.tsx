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
    <div className="mb-6">
      <h3 className="text-white font-medium mb-2">Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`border rounded-md px-4 py-2 transition-colors ${
              selectedSize === size
                ? "border-red-600 text-white bg-black/40"
                : "border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
})

