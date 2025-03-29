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

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader className="w-10 h-10 text-red-600" />
  </div>
)

export default function HoodieProductPage() {
  // Get product data
  const productInfo = useMemo(() => getProduct("hoodies", "hoodie-1"), [])

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  const [selectedColor, setSelectedColor] = useState("White")
  const [selectedSize, setSelectedSize] = useState("M")
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Define color images mapping
  const colorImages = useMemo(
    () => ({
      White: "/products/white-hoodie.png",
      Black: "/products/black-hoodie.png",
    }),
    [],
  )

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
      imageSrc: colorImages[selectedColor],
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
      "Screen printed London Shop logo",
      "Kangaroo pocket",
      "Ribbed cuffs and hem",
      "Drawstring hood",
      "Machine washable",
    ],
    [],
  )

  // Memoize product info to prevent re-renders
  const productInfoComponent = useMemo(
    () => (
      <ProductInfo
        name={productInfo.name}
        price={productInfo.price}
        description={productInfo.description}
        colors={["White", "Black"]}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        sizes={["S", "M", "L", "XL"]}
        selectedSize={selectedSize}
        onSizeChange={handleSizeChange}
        features={features}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        productType="hoodie"
        logoType="signature"
      />
    ),
    [
      productInfo.name,
      productInfo.price,
      productInfo.description,
      selectedColor,
      selectedSize,
      handleColorChange,
      handleSizeChange,
      features,
      isAdding,
      handleAddToCart,
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
          Our signature hoodie combines style and comfort with a minimalist design that showcases the distinctive London
          Shop logo.
        </p>
        <p className="text-gray-200">
          Made from premium materials and designed to last, this hoodie is perfect for London's unpredictable weather.
        </p>
      </div>
    ),
    [],
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

