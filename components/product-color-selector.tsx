"use client"

import { memo } from "react"

interface ProductColorSelectorProps {
  colors: string[]
  selectedColor: string
  onChange: (color: string) => void
}

export const ProductColorSelector = memo(function ProductColorSelector({
  colors,
  selectedColor,
  onChange,
}: ProductColorSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-white font-medium mb-2">Color</h3>
      <div className="flex space-x-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`border rounded-md px-4 py-2 transition-colors ${
              selectedColor === color
                ? "border-red-600 text-white bg-black/40"
                : "border-gray-700 text-gray-300 hover:border-gray-500"
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  )
})

