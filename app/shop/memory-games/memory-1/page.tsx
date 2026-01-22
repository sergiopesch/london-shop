"use client"

import { useState, useCallback, useMemo } from "react"
import { useCart } from "@/context/cart-context"
import { getProduct } from "@/lib/products"
import { notFound } from "next/navigation"
import { ProductDetailLayout } from "@/components/product/product-detail-layout"
import { ProductImage } from "@/components/product/product-image"
import { ProductInfo } from "@/components/product/product-info"
import { ProductBreadcrumbs } from "@/components/product/product-breadcrumbs"
import { PageTransition } from "@/components/page-transition"

export default function MemoryGameProductPage() {
  // Get product data
  const productInfo = useMemo(() => getProduct("memory-games", "memory-1"), [])

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  const [selectedSize, setSelectedSize] = useState("One Size")
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Define images
  const colorImages: Record<string, string> = useMemo(
    () => ({
      Multicolor: "/products/memory-games-iconic.png",
    }),
    [],
  )

  // Use useCallback for event handlers to prevent unnecessary re-renders
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
      imageSrc: colorImages["Multicolor"],
      color: "Multicolor",
      size: selectedSize,
      slug: productInfo.slug,
      categorySlug: productInfo.categorySlug,
    })

    // Reset adding state after animation
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }, [addItem, colorImages, isAdding, productInfo, selectedSize])

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
      <ProductImage colorImages={colorImages} selectedColor="Multicolor" alt={productInfo.name} isAdding={isAdding} />
    ),
    [colorImages, productInfo.name, isAdding],
  )

  // Memoize product features
  const features = useMemo(
    () => [
      "30 pairs of beautifully illustrated cards",
      "Features iconic London landmarks and monuments",
      "Cream-colored box with signature London Shop branding",
      "Durable card stock with smooth finish",
      "Perfect for ages 6 and up",
      "2-4 players",
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
        colors={["Multicolor"]}
        selectedColor="Multicolor"
        onColorChange={() => {}}
        sizes={["One Size"]}
        selectedSize={selectedSize}
        onSizeChange={handleSizeChange}
        features={features}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        productType="memory-game"
        logoType="signature"
      />
    ),
    [
      productInfo.name,
      productInfo.price,
      productInfo.description,
      selectedSize,
      handleSizeChange,
      features,
      isAdding,
      handleAddToCart,
    ],
  )

  // Memoize how to play section
  const howToPlay = useMemo(
    () => (
      <div className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">About the Game</h2>
        <p className="text-gray-200 mb-6">
          Our London Iconic Places Memory Game features beautifully illustrated cards depicting famous London landmarks
          such as Buckingham Palace, Victoria Memorial, and historic buildings. The game comes in an elegant
          cream-colored box with our signature London Shop branding.
        </p>

        <h3 className="text-xl font-bold text-white mb-3">How to Play</h3>
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
    <PageTransition>
      <ProductDetailLayout
        backgroundImage="/memory-games-background.png"
        breadcrumbs={breadcrumbs}
        productImage={productImage}
        productInfo={productInfoComponent}
        additionalInfo={howToPlay}
      />
    </PageTransition>
  )
}

