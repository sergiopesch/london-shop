"use client"

import { useState, useEffect, memo } from "react"
import Image from "next/image"
import { Loader } from "@/components/ui/loader"

interface LoadingImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
  sizes?: string
  quality?: number
}

export const LoadingImage = memo(function LoadingImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  objectFit = "cover",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
}: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [imgSrc, setImgSrc] = useState(src)

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true)
    setError(false)
    setImgSrc(src)
  }, [src])

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setError(true)
    setIsLoading(false)

    // Retry loading the image up to 2 times with exponential backoff
    if (retryCount < 2) {
      const timeout = setTimeout(() => {
        setIsLoading(true)
        setError(false)
        setRetryCount((prev) => prev + 1)
        // Force image reload by adding a cache-busting parameter
        setImgSrc(`${src}${src.includes("?") ? "&" : "?"}retry=${retryCount + 1}`)
      }, 1000 * Math.pow(2, retryCount))

      return () => clearTimeout(timeout)
    }
  }

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""} overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-[2px]">
          <Loader className="w-6 h-6 text-red-600" />
        </div>
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/30 text-white text-center p-4">
          <div>
            <p className="text-sm">Failed to load image</p>
            <button
              onClick={() => {
                setIsLoading(true)
                setError(false)
                setRetryCount(0)
                setImgSrc(`${src}${src.includes("?") ? "&" : "?"}reload=${Date.now()}`)
              }}
              className="mt-2 text-xs text-red-500 hover:text-red-400 underline"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          priority={priority}
          sizes={fill ? sizes : undefined}
          quality={quality}
          style={{ objectFit }}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  )
})

