"use client"

import { memo, useState, useEffect } from "react"
import Image from "next/image"
import { Loader } from "@/components/ui/loader"

interface ProductImageProps {
  colorImages: Record<string, string>
  selectedColor: string
  alt: string
  isAdding: boolean
}

export const ProductImage = memo(function ProductImage(props: ProductImageProps) {
  const { colorImages, selectedColor, alt, isAdding } = props
  const [currentImage, setCurrentImage] = useState<string>("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Set initial image on mount only
  useEffect(() => {
    const initialImage = colorImages[selectedColor] || Object.values(colorImages)[0] || ""
    setCurrentImage(initialImage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle color change
  useEffect(() => {
    const newImage = colorImages[selectedColor] || Object.values(colorImages)[0] || ""

    if (newImage && newImage !== currentImage && currentImage !== "") {
      setIsTransitioning(true)

      const timer = setTimeout(() => {
        setCurrentImage(newImage)
        setIsTransitioning(false)
        setIsLoading(true)
      }, 150)

      return () => clearTimeout(timer)
    } else if (newImage && currentImage === "") {
      setCurrentImage(newImage)
    }
  }, [selectedColor, colorImages, currentImage])

  return (
    <div className="relative aspect-square rounded-lg overflow-hidden backdrop-blur-sm bg-black/20 p-4 shadow-lg animate-fade-in">
      <div className="relative w-full h-full">
        {currentImage && (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader className="w-8 h-8 text-red-600" />
              </div>
            )}
            <Image
              src={currentImage || "/placeholder.svg"}
              alt={`${alt} in ${selectedColor}`}
              fill
              className={`object-contain transition-all duration-300 ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              } ${isAdding ? "scale-110" : ""}`}
              priority={true}
              onLoad={() => setIsLoading(false)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={90}
            />
          </>
        )}
      </div>

      {isAdding && (
        <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center animate-pulse">
          <div className="bg-white/90 text-red-600 font-bold py-2 px-4 rounded-full animate-bounce">Added to Cart!</div>
        </div>
      )}
    </div>
  )
})

