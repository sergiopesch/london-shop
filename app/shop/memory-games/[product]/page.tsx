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

export default function MemoryGameProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = use(params)
  
  // Get product data
  const productInfo = useMemo(() => getProduct("memory-games", product), [product])

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  // Memory games have fixed options
  const isUnderground = product === "memory-2" || productInfo.name.toLowerCase().includes("underground")
  
  const [selectedColor] = useState("Multicolor")
  const [selectedSize] = useState("One Size")
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Define color images mapping based on product type
  const colorImages = useMemo((): Record<string, string> => {
    if (isUnderground) {
      return {
        Multicolor: "/products/memory-underground.png",
      } as Record<string, string>
    }
    return {
      Multicolor: "/products/memory-games-iconic.png",
    } as Record<string, string>
  }, [isUnderground])

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
          { name: "Memory Games", href: "/shop/memory-games" },
          { name: productInfo.name, href: `/shop/memory-games/${productInfo.slug}`, isCurrent: true },
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
      isUnderground ? "24 pairs of London Underground themed cards" : "30 pairs of beautifully designed cards",
      isUnderground ? "Iconic London Underground stations and symbols" : "Iconic London landmarks and symbols",
      "Durable card stock with smooth finish",
      "Comes in a sturdy storage box",
      "Perfect for ages 6 and up",
      "2-4 players",
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
        colors={["Multicolor"]}
        selectedColor={selectedColor}
        onColorChange={() => {}}
        sizes={["One Size"]}
        selectedSize={selectedSize}
        onSizeChange={() => {}}
        features={features}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        productType="memory-game"
      />
    ),
    [
      productInfo.name,
      productInfo.price,
      productInfo.description,
      selectedColor,
      selectedSize,
      features,
      isAdding,
      handleAddToCart,
    ],
  )

  // Memoize how to play section
  const howToPlay = useMemo(
    () => (
      <div
        className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">How to Play</h2>
        <div className="text-gray-200 space-y-4">
          <p>1. Shuffle all cards and place them face down in a grid pattern.</p>
          <p>2. Players take turns flipping over two cards at a time, trying to find matching pairs.</p>
          <p>3. If the cards match, the player keeps them and takes another turn.</p>
          <p>4. If they don't match, the cards are turned face down again and it's the next player's turn.</p>
          <p>5. The game ends when all pairs have been found. The player with the most pairs wins!</p>
        </div>
      </div>
    ),
    [],
  )

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductDetailLayout
        backgroundImage="/memory-games-background.png"
        breadcrumbs={breadcrumbs}
        productImage={productImage}
        productInfo={productInfoComponent}
        additionalInfo={howToPlay}
      />
    </Suspense>
  )
}
