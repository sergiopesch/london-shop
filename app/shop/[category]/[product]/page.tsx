import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Heart, Share2 } from "lucide-react"
import { getProduct } from "@/lib/products"

export default function ProductPage({ params }: { params: { category: string; product: string } }) {
  const { category, product } = params

  // Get product data
  const productInfo = getProduct(category, product)

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

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
            <span className="mx-2">/</span>
            <Link href={`/shop/${category}`} className="hover:text-white transition-colors capitalize">
              {productInfo.category}
            </Link>
          </nav>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={productInfo.imageSrc || "/placeholder.svg?height=600&width=600"}
                alt={productInfo.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{productInfo.name}</h1>
              <p className="text-2xl font-bold text-red-500 mb-4">£{productInfo.price.toFixed(2)}</p>
              <p className="text-gray-300 mb-6">{productInfo.description}</p>

              {/* Color Selection */}
              {productInfo.colors && productInfo.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-2">Color</h3>
                  <div className="flex space-x-2">
                    {productInfo.colors.map((color) => (
                      <button
                        key={color}
                        className="border border-gray-700 rounded-md px-4 py-2 text-gray-300 hover:border-red-600 hover:text-white transition-colors"
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {productInfo.sizes && productInfo.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {productInfo.sizes.map((size) => (
                      <button
                        key={size}
                        className="border border-gray-700 rounded-md px-4 py-2 text-gray-300 hover:border-red-600 hover:text-white transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-colors flex-1">
                  Add to Cart
                </button>
                <button className="border border-gray-700 hover:border-red-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Wishlist
                </button>
                <button className="border border-gray-700 hover:border-red-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

