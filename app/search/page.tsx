import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"
import { searchProducts } from "@/lib/products"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ""
  const results = query ? searchProducts(query) : []

  return (
    <>
      <ResponsiveNav />
      <main className="bg-gray-900 pt-20 px-4 md:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white my-6">{query ? `Search results for "${query}"` : "Search"}</h1>

          {query && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-6">No products found matching your search.</p>
              <Link
                href="/shop"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors inline-block"
              >
                Browse All Products
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <>
              <p className="text-gray-400 mb-6">
                Found {results.length} product{results.length !== 1 ? "s" : ""}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {results.map((product) => (
                  <Link key={product.id} href={`/shop/${product.categorySlug}/${product.slug}`} className="group">
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
                      <p className="text-gray-400 text-sm text-center">{product.category}</p>
                      <p className="text-red-500 text-center">£{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!query && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Use the search icon in the navigation bar to search for products.</p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

