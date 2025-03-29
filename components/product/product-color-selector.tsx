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
  // Map color names to actual color values for visual representation
  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      White: "#ffffff",
      Black: "#222222",
      Cream: "#f5f5dc",
      Beige: "#d2ccc4",
      Multicolor: "linear-gradient(to right, #ff0000, #0033a0, #ffffff)",
    }
    return colorMap[colorName] || "#cccccc"
  }

  return (
    <div className="mb-4 sm:mb-6">
      <h3 className="text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">Color</h3>
      <div className="flex space-x-2 sm:space-x-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`group flex flex-col items-center transition-all ${
              selectedColor === color ? "scale-110" : "hover:scale-105"
            }`}
            aria-label={`Select ${color} color`}
            aria-pressed={selectedColor === color}
          >
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                selectedColor === color ? "border-red-600 shadow-lg" : "border-gray-600 hover:border-gray-400"
              }`}
              style={{
                background: getColorValue(color),
                boxShadow: selectedColor === color ? "0 0 0 2px rgba(255,0,0,0.3)" : "none",
              }}
            />
            <span
              className={`mt-1 text-xs transition-colors ${
                selectedColor === color ? "text-white" : "text-gray-400 group-hover:text-gray-300"
              }`}
            >
              {color}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
})

