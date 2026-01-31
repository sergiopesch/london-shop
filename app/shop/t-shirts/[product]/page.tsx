"use client"

import { useState, useCallback, useMemo, Suspense } from "react"
import { useCart } from "@/context/cart-context"
import { getProduct } from "@/lib/products"
import { notFound } from "next/navigation"
import { ProductDetailLayout } from "@/components/product/product-detail-layout"
import { ProductImage } from "@/components/product/product-image"
import { ProductInfo } from "@/components/product/product-info"
import { ProductBreadcrumbs } from "@/components/product/product-breadcrumbs"
import { Loader } from "@/components/ui/loader"
import { use } from "react"

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader className="w-10 h-10 text-red-600" />
  </div>
)

export default function TShirtProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)
  
  // Get product data
  const productInfo = useMemo(() => getProduct("t-shirts", product), [product])

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  // Determine available colors based on product
  const isUnderground = product === "tshirt-2" || productInfo.name.toLowerCase().includes("underground")
  const availableColors = useMemo(() => productInfo.colors || ["White"], [productInfo.colors])
  
  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [selectedSize, setSelectedSize] = useState("M")
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Define color images mapping based on product type
  const colorImages = useMemo((): Record<string, string> => {
    if (isUnderground) {
      return {
        White: "/products/underground-tshirt.png",
      } as Record<string, string>
    }
    return {
      White: "/products/white-tshirt.png",
      Black: "/products/black-tshirt.png",
    } as Record<string, string>
  }, [isUnderground])

  // Use useCallback for event handlers to prevent unnecessary re-renders
  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color)
  }, [])

  const handleSizeChange = useCallback((size: string) => {
    setSelectedSize(size)
  }, [])

  const handleAddToCart = useCallback(() => {
    if (isAdding) return

    setIsAdding(true)

    // Add item to cart
    addItem({
      id: productInfo.id,
      name: productInfo.name,
      price: productInfo.price,
      imageSrc: colorImages[selectedColor] || productInfo.imageSrc,
      color: selectedColor,
      size: selectedSize,
      slug: productInfo.slug,
      categorySlug: productInfo.categorySlug,
    })

    // Reset adding state after animation
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }, [addItem, colorImages, isAdding, productInfo, selectedColor, selectedSize])

  // Memoize breadcrumbs to prevent re-renders
  const breadcrumbs = useMemo(
    () => (
      <ProductBreadcrumbs
        paths={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          { name: "T-Shirts", href: "/shop/t-shirts" },
          { name: productInfo.name, href: `/shop/t-shirts/${productInfo.slug}`, isCurrent: true },
        ]}
      />
    ),
    [productInfo.name, productInfo.slug],
  )

  // Memoize product image to prevent re-renders
  const productImage = useMemo(
    () => (
      <ProductImage
        colorImages={colorImages}
        selectedColor={selectedColor}
        alt={productInfo.name}
        isAdding={isAdding}
      />
    ),
    [colorImages, selectedColor, productInfo.name, isAdding],
  )

  // Memoize product features
  const features = useMemo(
    () => [
      "100% organic cotton",
      isUnderground ? "London Underground inspired roundel design" : "Screen printed London Shop logo",
      "Ribbed crew neck",
      "Reinforced shoulder seams",
      "Pre-shrunk fabric",
      "Machine washable",
    ],
    [isUnderground],
  )

  // Memoize product info to prevent re-renders
  const productInfoComponent = useMemo(
    () => (
      <ProductInfo
        name={productInfo.name}
        price={productInfo.price}
        description={productInfo.description}
        colors={availableColors}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        sizes={productInfo.sizes || ["S", "M", "L", "XL"]}
        selectedSize={selectedSize}
        onSizeChange={handleSizeChange}
        features={features}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        productType="tshirt"
        logoType={isUnderground ? "underground" : "signature"}
      />
    ),
    [
      productInfo.name,
      productInfo.price,
      productInfo.description,
      productInfo.sizes,
      availableColors,
      selectedColor,
      selectedSize,
      handleColorChange,
      handleSizeChange,
      features,
      isAdding,
      handleAddToCart,
      isUnderground,
    ],
  )

  // Memoize size guide
  const sizeGuide = useMemo(
    () => (
      <div
        className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Size Guide</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-black/30">
              <tr>
                <th scope="col" className="px-6 py-3">Size</th>
                <th scope="col" className="px-6 py-3">Chest (inches)</th>
                <th scope="col" className="px-6 py-3">Length (inches)</th>
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
    ),
    [],
  )

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductDetailLayout
        backgroundImage="/tshirts-background.png"
        breadcrumbs={breadcrumbs}
        productImage={productImage}
        productInfo={productInfoComponent}
        additionalInfo={sizeGuide}
      />
    </Suspense>
  )
}
