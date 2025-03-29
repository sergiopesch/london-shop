"use client"

import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { LoadingImage } from "@/components/loading-image"
import { getCategories } from "@/lib/products"
import { PageTransition } from "@/components/page-transition"
import { BackToTop } from "@/components/back-to-top"

export default function ShopPage() {
  // Get all categories
  const categories = getCategories()

  // Map category slugs to image paths - updated to use the new product images
  const getCategoryImage = (slug: string) => {
    if (slug === "memory-games") return "/products/memory-card.png"
    if (slug === "hoodies") return "/products/white-hoodie.png"
    if (slug === "t-shirts") return "/products/white-tshirt.png"
    if (slug === "mugs") return "/products/white-mug.png"
    return "/placeholder.svg?height=400&width=400"
  }

  return (
    <PageTransition>
      <ResponsiveNav />
      <div className="relative min-h-screen">
        {/* Full-page background image */}
        <div className="fixed inset-0 z-0">
          <LoadingImage
            src="/shop-background-bigben.png"
            alt="Big Ben and Houses of Parliament at sunset"
            fill
            priority
            className="object-cover brightness-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 pt-28 px-4 md:px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section - improved for mobile */}
            <div className="text-center mb-12 sm:mb-16 mt-4 sm:mt-8 animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
                Shop London
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-200">
                Discover our collection of London-inspired merchandise
              </p>
            </div>

            {/* Categories Section - styled like the home page */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto mb-16">
              {categories.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/shop/${category.slug}`}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="flex flex-col">
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3 group-hover:shadow-lg transition-all duration-300 shadow-xl">
                      <LoadingImage
                        src={getCategoryImage(category.slug) || "/placeholder.svg?height=400&width=400"}
                        alt={category.title}
                        fill
                        className="object-contain p-8 group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-opacity"></div>
                    </div>
                    <h3 className="text-white text-sm sm:text-base md:text-xl font-medium text-center">
                      {category.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </section>
          </div>
        </div>
      </div>
      <BackToTop />
      <SiteFooter />
    </PageTransition>
  )
}

