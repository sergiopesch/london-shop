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

  const { ref: heroRef, isIntersecting: isHeroVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "0px",
  })

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
    }, 300)
  }, [router])

  return (
    <PageTransition>
      <ResponsiveNav />
      <main className="bg-black text-white">
        <section ref={heroRef} className="relative isolate overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 z-0">
            <LoadingImage
              src="/hero-background.jpg"
              alt="Royal Albert Hall in London"
              fill
              priority
              className="object-cover brightness-[0.45]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-[#040b18]" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-6xl flex-col items-center justify-center px-4 pb-20 pt-28 text-center sm:px-6 md:min-h-[88vh] lg:px-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHeroVisible ? 1 : 0.2, y: isHeroVisible ? 0 : 20 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-red-400/90"
            >
              Londonshop
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHeroVisible ? 1 : 0.2, y: isHeroVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Find distinctive London-themed merch without the tourist-shop noise.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHeroVisible ? 1 : 0.2, y: isHeroVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg md:text-xl"
            >
              Hoodies, t-shirts, memory games and mugs shaped by London iconography, with cleaner design and a sharper storefront rhythm.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHeroVisible ? 1 : 0.2, y: isHeroVisible ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="mt-10"
            >
              <button
                onClick={handleTakeTour}
                className={`rounded-full bg-red-600 px-8 py-3 text-base font-semibold tracking-[0.08em] text-white transition-all hover:bg-red-700 sm:px-10 sm:py-4 sm:text-lg ${
                  isNavigating ? "scale-95 opacity-80" : ""
                }`}
                disabled={isNavigating}
              >
                TAKE A TOUR
              </button>
            </motion.div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-[#040b18] via-[#071225] to-black px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-3 text-center md:mb-14">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400/80">Collections</p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start with the essentials</h2>
              <p className="mx-auto max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                Four core categories, kept simple so the visual identity stays coherent from page to page.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {products.map((product, index) => (
                <Link key={product.id} href={product.href} className="group">
                  <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12 + index * 0.08 }}
                    className="h-full rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-white/20 group-hover:bg-white/[0.07] sm:p-5"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/30">
                      <LoadingImage
                        src={product.imageSrc || "/placeholder.svg?height=400&width=400"}
                        alt={`London ${product.name}`}
                        fill
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/10" />
                    </div>
                    <div className="pt-4 text-center sm:pt-5">
                      <h3 className="text-lg font-semibold text-white sm:text-xl">{product.name}</h3>
                    </div>
                  </motion.article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  )
}
