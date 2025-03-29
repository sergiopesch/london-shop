import Link from "next/link"
import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"

export default function CategoryNotFound() {
  return (
    <>
      <ResponsiveNav />
      <main className="bg-gray-900 pt-20 px-4 md:px-8 pb-12 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-white mb-4">Category Not Found</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            The product category you are looking for might have been removed or is temporarily unavailable.
          </p>
          <Link
            href="/shop"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors inline-block"
          >
            Browse All Categories
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

