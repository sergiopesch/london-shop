"use client"

import { memo, type ReactNode } from "react"
import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import { BackToTop } from "@/components/back-to-top"
import Image from "next/image"

interface ProductDetailLayoutProps {
  backgroundImage: string
  breadcrumbs: ReactNode
  productImage: ReactNode
  productInfo: ReactNode
  additionalInfo?: ReactNode
}

// Memoized background component to prevent re-renders
const Background = memo(function Background({ src }: { src: string }) {
  return (
    <div className="fixed inset-0 z-0">
      <Image src={src || "/placeholder.svg"} alt="Background" fill priority className="object-cover brightness-[0.5]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
    </div>
  )
})

// Main layout component
export const ProductDetailLayout = memo(function ProductDetailLayout({
  backgroundImage,
  breadcrumbs,
  productImage,
  productInfo,
  additionalInfo,
}: ProductDetailLayoutProps) {
  return (
    <>
      <ResponsiveNav />
      <div className="relative min-h-screen">
        {/* Background */}
        <Background src={backgroundImage} />

        {/* Content overlay */}
        <div className="relative z-10 pt-20 sm:pt-28 px-3 sm:px-4 md:px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            {breadcrumbs}

            {/* Product Details - improved grid for mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              {/* Product Image */}
              {productImage}

              {/* Product Info */}
              {productInfo}
            </div>

            {/* Additional Information */}
            {additionalInfo}
          </div>
        </div>
      </div>
      <BackToTop />
      <SiteFooter />
    </>
  )
})

