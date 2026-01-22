"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef, memo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { SearchBar } from "./search-bar"
import { useCart } from "@/context/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { LondonLogo } from "./london-logo"
import { useWindowSize } from "@/hooks/use-window-size"

export function ResponsiveNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const prevPathRef = useRef(pathname)
  const { cartCount, setIsCartOpen } = useCart()
  const { width } = useWindowSize()
  const isMobile = width ? width < 768 : false
  const scrollThreshold = 40

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      setIsMenuOpen(false)
      setIsSearchOpen(false)
      prevPathRef.current = pathname
    }
  }, [pathname])

  // Handle scroll effect with throttling
  useEffect(() => {
    let ticking = false
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Only update state if crossing the threshold to avoid unnecessary renders
          if (
            (currentScrollY > scrollThreshold && lastScrollY <= scrollThreshold) ||
            (currentScrollY <= scrollThreshold && lastScrollY > scrollThreshold)
          ) {
            setScrolled(currentScrollY > scrollThreshold)
          }

          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen, isSearchOpen])

  const isActive = useCallback(
    (path: string) => {
      if (path === "/" && pathname !== "/") return false
      return pathname.startsWith(path)
    },
    [pathname],
  )

  const NavLink = memo(function NavLink({ href, children, isMobile = false }: { href: string; children: React.ReactNode; isMobile?: boolean }) {
    return (
      <Link
        href={href}
        className={`text-white hover:text-opacity-80 transition-colors ${
          isActive(href) ? "font-medium" : ""
        } ${isMobile ? "text-lg py-2" : ""}`}
        onClick={isMobile ? toggleMenu : undefined}
      >
        {children}
      </Link>
    )
  })

  return (
    <>
      <motion.nav
        className="fixed left-0 right-0 z-50 will-change-transform"
        initial={{ y: 0 }}
        animate={{
          y: 0,
          backgroundColor: scrolled ? "rgba(0, 0, 0, 0.4)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          boxShadow: scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Responsive height based on screen size */}
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-18 md:h-20 grid grid-cols-3 items-center">
          {/* Left column */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            {isMobile && (
              <button
                className="text-white mr-2"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            {/* Desktop navigation links */}
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-8">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/shop">Shop</NavLink>
                <NavLink href="/about">About</NavLink>
              </div>
            )}
          </div>

          {/* Center column - logo */}
          <div className="flex justify-center">
            <LondonLogo href="/" />
          </div>

          {/* Right column */}
          <div className="flex items-center justify-end space-x-3 md:space-x-6">
            <button
              aria-label="Search"
              className="text-white hover:text-opacity-80 transition-colors"
              onClick={toggleSearch}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              aria-label="Cart"
              className="text-white hover:text-opacity-80 transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 backdrop-blur-sm bg-black/80 p-4 shadow-lg"
            >
              <div className="flex flex-col space-y-4">
                <NavLink href="/" isMobile>
                  Home
                </NavLink>
                <NavLink href="/shop" isMobile>
                  Shop
                </NavLink>
                <NavLink href="/about" isMobile>
                  About
                </NavLink>
                <NavLink href="/contact" isMobile>
                  Contact
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search overlay */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

