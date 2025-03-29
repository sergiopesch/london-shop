"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    // Skip initial animation on first render
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true
      return
    }

    // Reset scroll position when route changes
    window.scrollTo(0, 0)
    setDisplayChildren(children)
  }, [pathname, children])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  )
}

