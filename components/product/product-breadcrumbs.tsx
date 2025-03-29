"use client"

import { memo } from "react"
import Link from "next/link"

interface ProductBreadcrumbsProps {
  paths: Array<{
    name: string
    href: string
    isCurrent?: boolean
  }>
}

export const ProductBreadcrumbs = memo(function ProductBreadcrumbs({ paths }: ProductBreadcrumbsProps) {
  return (
    <nav className="flex items-center text-sm text-white/70 my-4 animate-fade-in">
      {paths.map((path, index) => (
        <span key={path.href}>
          {index > 0 && <span className="mx-2">/</span>}
          {path.isCurrent ? (
            <span className="text-white">{path.name}</span>
          ) : (
            <Link href={path.href} className="hover:text-white transition-colors">
              {path.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
})

