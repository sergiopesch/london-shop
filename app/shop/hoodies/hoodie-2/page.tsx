"use client"

import { useState, useCallback, useMemo } from "react"
import { useCart } from "@/context/cart-context"
import { getProduct } from "@/lib/products"
import { notFound } from "next/navigation"
import { ProductDetailLayout } from "@/components/product/product-detail-layout"
import { ProductImage } from "@/components/product/product-image"
import { ProductInfo } from "@/components/product/product-info"
import { ProductBreadcrumbs } from "@/components/product/product-breadcrumbs"

export default function UndergroundHoodiePage() {
  // Get product data
  const productInfo = useMemo(() => getProduct("hoodies", "hoodie-2"), [])

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  const [selectedColor, setSelectedColor] = useState("White")
  const [selectedSize, setSelectedSize] = useState("M")
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Define color images mapping - Underground hoodie only in white
  const colorImages = useMemo(
    () => ({
      White: "/products/underground-hoodie.png",
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
      "Iconic London Underground inspired roundel design",
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
        colors={["White"]} // Underground hoodie only in white
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        sizes={["S", "M", "L", "XL"]}
        selectedSize={selectedSize}
        onSizeChange={handleSizeChange}
        features={features}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        productType="hoodie"
        logoType="underground"
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

  // Memoize design inspiration
  const designInspiration = useMemo(
    () => (
      <div
        className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">About</h2>
        <p className="text-gray-200 mb-4">
          Our Underground hoodie features a modern interpretation of London's most iconic symbol, instantly recognizable
          worldwide.
        </p>
        <p className="text-gray-200">
          The clean design and premium materials make this hoodie both a fashion statement and a comfortable everyday
          essential.
        </p>
      </div>
    ),
    [],
  )

  return (
    <ProductDetailLayout
      backgroundImage="/hoodies-background.jpg"
      breadcrumbs={breadcrumbs}
      productImage={productImage}
      productInfo={productInfoComponent}
      additionalInfo={designInspiration}
    />
  )
}

