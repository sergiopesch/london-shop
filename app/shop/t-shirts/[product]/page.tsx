import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Heart, Share2 } from "lucide-react"
import { getProduct } from "@/lib/products"

export default function TShirtProductPage({ params }: { params: { product: string } }) {
  const product = params.product

  // Get product data
  const productInfo = getProduct("t-shirts", product)

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  return (
    <>
      <ResponsiveNav />
      <div className="relative min-h-screen">
        {/* Full-page background image */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/tshirts-background.png"
            alt="Richmond Park at sunset with view of Thames"
            fill
            priority
            className="object-cover brightness-[0.5]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 pt-28 px-4 md:px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-white/70 my-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/shop" className="hover:text-white transition-colors">
                Shop
              </Link>
              <span className="mx-2">/</span>
              <Link href="/shop/t-shirts" className="hover:text-white transition-colors">
                T-Shirts
              </Link>
            </nav>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Product Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden backdrop-blur-sm bg-white/5 p-4 shadow-lg">
                <Image
                  src={productInfo.imageSrc || "/placeholder.svg"}
                  alt={productInfo.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{productInfo.name}</h1>
                <p className="text-2xl font-bold text-red-500 mb-4">£{productInfo.price.toFixed(2)}</p>
                <p className="text-gray-200 mb-6">{productInfo.description}</p>

                {/* Color Selection */}
                {productInfo.colors && productInfo.colors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-medium mb-2">Color</h3>
                    <div className="flex space-x-2">
                      {productInfo.colors.map((color) => (
                        <button
                          key={color}
                          className={`border border-gray-700 rounded-md px-4 py-2 text-gray-300 hover:border-red-600 hover:text-white transition-colors ${color === "Cream" ? "bg-[#f5f5dc] text-gray-800" : ""}`}
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

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-white font-medium mb-2">Features</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    <li>100% organic cotton</li>
                    <li>Screen printed London Underground logo</li>
                    <li>Ribbed crew neck</li>
                    <li>Reinforced shoulder seams</li>
                    <li>Pre-shrunk fabric</li>
                    <li>Machine washable</li>
                  </ul>
                </div>

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

            {/* Size Guide */}
            <div className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12">
              <h2 className="text-2xl font-bold text-white mb-4">Size Guide</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-black/30">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Size
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Chest (inches)
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Length (inches)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4">S</td>
                      <td className="px-6 py-4">36-38</td>
                      <td className="px-6 py-4">28</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4">M</td>
                      <td className="px-6 py-4">39-41</td>
                      <td className="px-6 py-4">29</td>
                    </tr>
                    <tr className="border-b border-gray-700/30">
                      <td className="px-6 py-4">L</td>
                      <td className="px-6 py-4">42-44</td>
                      <td className="px-6 py-4">30</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4">XL</td>
                      <td className="px-6 py-4">45-47</td>
                      <td className="px-6 py-4">31</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}

