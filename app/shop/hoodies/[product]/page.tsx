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

export default function HoodieProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)
  
  // Get product data
  const productInfo = useMemo(() => getProduct("hoodies", product), [product])

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  // Determine available colors based on product
  const isUnderground = product === "hoodie-2" || productInfo.name.toLowerCase().includes("underground")
  const availableColors = useMemo(() => productInfo.colors || ["White"], [productInfo.colors])
  
  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [selectedSize, setSelectedSize] = useState("M")
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Define color images mapping based on product type
  const colorImages = useMemo((): Record<string, string> => {
    if (isUnderground) {
      return {
        White: "/products/underground-hoodie.png",
      } as Record<string, string>
    }
    return {
      White: "/products/white-hoodie.png",
      Black: "/products/black-hoodie.png",
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
          { name: "Hoodies", href: "/shop/hoodies" },
          { name: productInfo.name, href: `/shop/hoodies/${productInfo.slug}`, isCurrent: true },
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
      "80% cotton, 20% polyester blend",
      isUnderground ? "London Underground inspired roundel design" : "Screen printed London Shop logo",
      "Kangaroo pocket",
      "Ribbed cuffs and hem",
      "Drawstring hood",
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
        productType="hoodie"
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

  // Memoize care instructions
  const careInstructions = useMemo(
    () => (
      <div
        className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">About</h2>
        <p className="text-gray-200 mb-4">
          {isUnderground
            ? "Our Underground hoodie features the iconic roundel design inspired by the London Underground, a symbol recognized worldwide."
            : "Our signature hoodie combines style and comfort with a minimalist design that showcases the distinctive London Shop logo."}
        </p>
        <p className="text-gray-200">
          Made from premium materials and designed to last, this hoodie is perfect for London's unpredictable weather.
        </p>
      </div>
    ),
    [isUnderground],
  )

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductDetailLayout
        backgroundImage="/hoodies-background.jpg"
        breadcrumbs={breadcrumbs}
        productImage={productImage}
        productInfo={productInfoComponent}
        additionalInfo={careInstructions}
      />
    </Suspense>
  )
}
