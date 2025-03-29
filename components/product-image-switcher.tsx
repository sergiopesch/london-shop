"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"

interface ProductImageSwitcherProps {
  colorImages: Record<string, string>
  selectedColor: string
  alt: string
  isAdding?: boolean
  className?: string
}

export function ProductImageSwitcher({
  colorImages,
  selectedColor,
  alt,
  isAdding = false,
  className = "",
}: ProductImageSwitcherProps) {
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({})
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Current image source based on selected color
  const currentSrc = useMemo(
    () => colorImages[selectedColor] || Object.values(colorImages)[0],
    [colorImages, selectedColor],
  )

  // Preload all color variant images
  useEffect(() => {
    const preloadImages = async () => {
      // Create an array of promises for each image to load
      const loadPromises = Object.keys(colorImages).map((color) => {
        const src = colorImages[color]
        return new Promise<void>((resolve) => {
          if (typeof window !== "undefined") {
            const img = new window.Image()
            img.src = src
            img.onload = () => {
              setImagesLoaded((prev) => ({ ...prev, [color]: true }))
              resolve()
            }
            img.onerror = () => {
              resolve()
            }
          } else {
            // Handle server-side rendering case
            resolve()
          }
        })
      })

      await Promise.all(loadPromises)
    }

    preloadImages()
  }, [colorImages])

  // Handle smooth transition between images
  useEffect(() => {
    if (imagesLoaded[selectedColor]) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [selectedColor, imagesLoaded])

  return (
    <div
      className={`relative aspect-square rounded-lg overflow-hidden backdrop-blur-sm bg-black/20 p-4 shadow-lg ${className}`}
    >
      <div className="relative w-full h-full">
        <Image
          src={currentSrc || "/placeholder.svg"}
          alt={`${alt} in ${selectedColor}`}
          fill
          className={`object-contain transition-all duration-300 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"} ${isAdding ? "scale-110" : ""}`}
          priority={true}
        />
      </div>

      {isAdding && (
        <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center animate-pulse">
          <div className="bg-white/90 text-red-600 font-bold py-2 px-4 rounded-full animate-bounce">Added to Cart!</div>
        </div>
      )}
    </div>
  )
}

