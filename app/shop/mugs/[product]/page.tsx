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

export default function MugProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)
  
  // Get product data
  const productInfo = useMemo(() => getProduct("mugs", product), [product])

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  // Determine available colors based on product
  const isUnderground = product === "mug-2" || productInfo.name.toLowerCase().includes("underground")
  const availableColors = useMemo(() => productInfo.colors || ["White"], [productInfo.colors])
  
  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [selectedSize, setSelectedSize] = useState("Standard")
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Define color images mapping based on product type
  const colorImages = useMemo((): Record<string, string> => {
    if (isUnderground) {
      return {
        White: "/products/underground-mug.png",
      } as Record<string, string>
    }
    return {
      White: "/products/white-mug.png",
      Black: "/products/black-mug.png",
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
          { name: "Mugs", href: "/shop/mugs" },
          { name: productInfo.name, href: `/shop/mugs/${productInfo.slug}`, isCurrent: true },
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
      "High-quality ceramic",
      "Dishwasher safe",
      "Microwave safe",
      "11oz capacity (Standard) / 15oz capacity (Large)",
      "Comfortable handle",
      "Durable print that won't fade",
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
        colors={availableColors}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        sizes={productInfo.sizes || ["Standard", "Large"]}
        selectedSize={selectedSize}
        onSizeChange={handleSizeChange}
        features={features}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        productType="mug"
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

  // Memoize product information
  const productInformation = useMemo(
    () => (
      <div
        className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">Product Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium text-white mb-2">Dimensions</h3>
            <p className="text-gray-200">
              Standard: Height 9.5cm, Diameter 8cm
              <br />
              Large: Height 11cm, Diameter 8.5cm
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium text-white mb-2">Care Instructions</h3>
            <p className="text-gray-200">
              Dishwasher safe, but hand washing is recommended for longevity of the print.
              <br />
              Microwave safe, but avoid prolonged heating to preserve the design.
            </p>
          </div>
        </div>
      </div>
    ),
    [],
  )

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductDetailLayout
        backgroundImage="/mugs-background.png"
        breadcrumbs={breadcrumbs}
        productImage={productImage}
        productInfo={productInfoComponent}
        additionalInfo={productInformation}
      />
    </Suspense>
  )
}
