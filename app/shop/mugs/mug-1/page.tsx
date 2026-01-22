"use client"

import { useState, useCallback, useMemo } from "react"
import { useCart } from "@/context/cart-context"
import { getProduct } from "@/lib/products"
import { notFound } from "next/navigation"
import { ProductDetailLayout } from "@/components/product/product-detail-layout"
import { ProductImage } from "@/components/product/product-image"
import { ProductInfo } from "@/components/product/product-info"
import { ProductBreadcrumbs } from "@/components/product/product-breadcrumbs"

export default function MugProductPage() {
  // Get product data
  const productInfo = useMemo(() => getProduct("mugs", "mug-1"), [])

  // Check if the product exists
  if (!productInfo) {
    notFound()
  }

  const [selectedColor, setSelectedColor] = useState("White")
  const [selectedSize, setSelectedSize] = useState("Standard")
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Define color images mapping - Signature mug in white and black
  const colorImages: Record<string, string> = useMemo(
    () => ({
      White: "/products/white-mug.png",
      Black: "/products/black-mug.png", // Updated to use the new black mug image
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
        colors={["White", "Black"]} // Signature mug in white and black
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
        sizes={["Standard", "Large"]}
        selectedSize={selectedSize}
        onSizeChange={handleSizeChange}
        features={features}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        productType="mug"
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

  // Memoize product information
  const productInformation = useMemo(
    () => (
      <div className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">About</h2>
        <p className="text-gray-200 mb-4">
          Our signature mug combines minimalist design with functionality, featuring the distinctive London Shop logo.
        </p>
        <p className="text-gray-200">
          Perfect for your morning coffee or afternoon tea, this mug brings a touch of London style to your daily
          routine.
        </p>
      </div>
    ),
    [],
  )

  return (
    <ProductDetailLayout
      backgroundImage="/mugs-background.png"
      breadcrumbs={breadcrumbs}
      productImage={productImage}
      productInfo={productInfoComponent}
      additionalInfo={productInformation}
    />
  )
}

