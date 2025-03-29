"use client"

import { LoadingImage } from "@/components/loading-image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import { PageTransition } from "@/components/page-transition"
import { useState, useCallback } from "react"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"
import { motion } from "framer-motion"

export default function Home() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  // Use intersection observer for hero section
  const { ref: heroRef, isIntersecting: isHeroVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px",
  })

  // Product data with corrected links and plural names
  const products = [
    {
      id: "hoodie",
      name: "Hoodies",
      imageSrc: "/products/white-hoodie.png",
      href: "/shop/hoodies",
    },
    {
      id: "tshirt",
      name: "T-Shirts",
      imageSrc: "/products/white-tshirt.png",
      href: "/shop/t-shirts",
    },
    {
      id: "memory",
      name: "Memory Games",
      imageSrc: "/products/memory-games-iconic.png",
      href: "/shop/memory-games",
    },
    {
      id: "mug",
      name: "Mugs",
      imageSrc: "/products/white-mug.png",
      href: "/shop/mugs",
    },
  ]

  const handleTakeTour = useCallback(() => {
    setIsNavigating(true)
    setTimeout(() => {
      router.push("/shop")
    }, 300) // Match transition duration
  }, [router])

  return (
    <PageTransition>
      <ResponsiveNav />
      <div className="relative min-h-screen">
        {/* Full-page background image */}
        <div className="fixed inset-0 z-0">
          <LoadingImage
            src="/hero-background.jpg"
            alt="Royal Albert Hall in London"
            fill
            priority
            className="object-cover brightness-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10">
          {/* Hero Section - improved for mobile */}
          <section
            ref={heroRef}
            className="min-h-screen flex flex-col items-center justify-center text-white text-center px-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHeroVisible ? 1 : 0,
                y: isHeroVisible ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl mb-4 sm:mb-6 mt-16"
            >
              Find unique London-themed merch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHeroVisible ? 1 : 0,
                y: isHeroVisible ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8"
            >
              Personalized hoodies, T-Shirts, memory cards & mugs
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHeroVisible ? 1 : 0,
                y: isHeroVisible ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onClick={handleTakeTour}
              className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-10 rounded-full text-base sm:text-lg transition-all ${isNavigating ? "scale-95 opacity-80" : ""}`}
              disabled={isNavigating}
            >
              TAKE A TOUR
            </motion.button>
          </section>

          {/* Products Section - improved grid for mobile */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 p-4 sm:p-6 md:p-12 max-w-6xl mx-auto mb-16">
            {products.map((product, index) => (
              <Link key={product.id} href={product.href} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex flex-col"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3 group-hover:shadow-lg transition-all duration-300 shadow-xl">
                    <LoadingImage
                      src={product.imageSrc || "/placeholder.svg?height=400&width=400"}
                      alt={`London ${product.name}`}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-opacity"></div>
                  </div>
                  <h3 className="text-white text-sm sm:text-base md:text-xl font-medium text-center">{product.name}</h3>
                </motion.div>
              </Link>
            ))}
          </section>
        </div>
      </div>
      <SiteFooter />
    </PageTransition>
  )
}

