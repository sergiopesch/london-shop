"use client"

import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { LoadingImage } from "@/components/loading-image"
import { ProductCard } from "@/components/product-card"
import { notFound } from "next/navigation"
import { getProductsByCategory } from "@/lib/products"
import { PageTransition } from "@/components/page-transition"
import { BackToTop } from "@/components/back-to-top"
import { Coffee, Palette, Gift } from "lucide-react"

export default function MugsPage() {
  // Get products for this category
  const products = getProductsByCategory("mugs")

  if (products.length === 0) {
    notFound()
  }

  return (
    <PageTransition>
      <ResponsiveNav />
      <div className="relative min-h-screen">
        {/* Full-page background image */}
        <div className="fixed inset-0 z-0">
          <LoadingImage
            src="/mugs-background.png"
            alt="Hyde Park Serpentine lake with swans at sunset"
            fill
            priority
            className="object-cover brightness-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 pt-28 px-4 md:px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">London Mugs</h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Premium ceramic mugs featuring iconic London-inspired designs
              </p>
            </div>

            {/* Breadcrumbs */}
            <nav
              className="flex items-center text-sm text-white/70 mb-8 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/shop" className="hover:text-white transition-colors">
                Shop
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Mugs</span>
            </nav>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="backdrop-blur-sm bg-black/20 rounded-xl p-6 shadow-lg animate-fade-in"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    imageSrc={product.imageSrc}
                    href={`/shop/mugs/${product.slug}`}
                  />
                </div>
              ))}
            </div>

            {/* Mug Description - Simplified */}
            <div
              className="mt-16 backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">About Our Mugs</h2>
              <p className="text-gray-200 mb-8">
                Our London-inspired mugs are perfect for enjoying your favorite beverage. Made from high-quality
                ceramic, they feature our signature designs that celebrate London's iconic visual heritage.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/20 p-6 rounded-lg group hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Coffee className="text-red-500 w-8 h-8" />
                  </div>
                  <h3 className="text-white font-bold mb-2 text-center">Premium Quality</h3>
                  <p className="text-gray-300 text-sm text-center">
                    High-quality ceramic that's dishwasher and microwave safe
                  </p>
                </div>

                <div className="bg-black/20 p-6 rounded-lg group hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Palette className="text-red-500 w-8 h-8" />
                  </div>
                  <h3 className="text-white font-bold mb-2 text-center">Iconic Designs</h3>
                  <p className="text-gray-300 text-sm text-center">
                    Choose between our signature wave or Underground-inspired roundel
                  </p>
                </div>

                <div className="bg-black/20 p-6 rounded-lg group hover:bg-black/30 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Gift className="text-red-500 w-8 h-8" />
                  </div>
                  <h3 className="text-white font-bold mb-2 text-center">Perfect Gift</h3>
                  <p className="text-gray-300 text-sm text-center">Ideal souvenir or gift for London enthusiasts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
      <SiteFooter />
    </PageTransition>
  )
}

