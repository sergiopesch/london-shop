import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getProductsByCategory, getCategories } from "@/lib/products"

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category

  // Get all categories
  const categories = getCategories()
  const categoryExists = categories.some((cat) => cat.slug === category)

  // Check if the category exists
  if (!categoryExists) {
    notFound()
  }

  // Get products for this category
  const products = getProductsByCategory(category)
  const categoryTitle = products[0]?.category || category.replace("-", " ")

  return (
    <>
      <ResponsiveNav />
      <main className="bg-gray-900 pt-20 px-4 md:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-gray-400 my-4">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-white transition-colors">
              Shop
            </Link>
          </nav>

          <h1 className="text-3xl font-bold text-white mb-6">{categoryTitle}</h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/shop/${category}/${product.slug}`} className="group">
                <div className="flex flex-col">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-all duration-300">
                    <Image
                      src={product.imageSrc || "/placeholder.svg?height=400&width=400"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-white font-medium text-center">{product.name}</h3>
                  <p className="text-red-500 text-center">£{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

