"use client"

import { useState, useCallback, useMemo, Suspense, use } from "react"
import { notFound } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { getProduct } from "@/lib/products"
import { ProductDetailLayout } from "@/components/product/product-detail-layout"
import { ProductImage } from "@/components/product/product-image"
import { ProductInfo } from "@/components/product/product-info"
import { ProductBreadcrumbs } from "@/components/product/product-breadcrumbs"
import { Loader } from "@/components/ui/loader"

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader className="w-10 h-10 text-red-600" />
  </div>
)

const categoryMeta: Record<
  string,
  {
    displayName: string
    backgroundImage: string
    productType: "hoodie" | "tshirt" | "mug" | "memory-game"
    sizeFallback: string[]
    defaultSize: string
    defaultColor: string
    singleColorLabel?: string
    features: (isUnderground: boolean) => string[]
    additionalInfoTitle: string
    additionalInfoBody: (isUnderground: boolean) => string[]
  }
> = {
  hoodies: {
    displayName: "Hoodies",
    backgroundImage: "/hoodies-background.jpg",
    productType: "hoodie",
    sizeFallback: ["S", "M", "L", "XL"],
    defaultSize: "M",
    defaultColor: "White",
    features: (isUnderground) => [
      "80% cotton, 20% polyester blend",
      isUnderground ? "London Underground inspired roundel design" : "Screen printed London Shop logo",
      "Kangaroo pocket",
      "Ribbed cuffs and hem",
      "Drawstring hood",
      "Machine washable",
    ],
    additionalInfoTitle: "About",
    additionalInfoBody: (isUnderground) => [
      isUnderground
        ? "Our Underground hoodie features the iconic roundel design inspired by the London Underground, a symbol recognized worldwide."
        : "Our signature hoodie combines style and comfort with a minimalist design that showcases the distinctive London Shop logo.",
      "Made from premium materials and designed to last, this hoodie is perfect for London's unpredictable weather.",
    ],
  },
  "t-shirts": {
    displayName: "T-Shirts",
    backgroundImage: "/tshirts-background.png",
    productType: "tshirt",
    sizeFallback: ["S", "M", "L", "XL"],
    defaultSize: "M",
    defaultColor: "White",
    features: (isUnderground) => [
      "100% organic cotton",
      isUnderground ? "London Underground inspired roundel design" : "Screen printed London Shop logo",
      "Ribbed crew neck",
      "Reinforced shoulder seams",
      "Pre-shrunk fabric",
      "Machine washable",
    ],
    additionalInfoTitle: "Size Guide",
    additionalInfoBody: () => [
      "S: Chest 36-38in, Length 28in",
      "M: Chest 39-41in, Length 29in",
      "L: Chest 42-44in, Length 30in",
      "XL: Chest 45-47in, Length 31in",
    ],
  },
  mugs: {
    displayName: "Mugs",
    backgroundImage: "/mugs-background.png",
    productType: "mug",
    sizeFallback: ["Standard", "Large"],
    defaultSize: "Standard",
    defaultColor: "White",
    features: () => [
      "High-quality ceramic",
      "Dishwasher safe",
      "Microwave safe",
      "11oz capacity (Standard) / 15oz capacity (Large)",
      "Comfortable handle",
      "Durable print that won't fade",
    ],
    additionalInfoTitle: "Product Information",
    additionalInfoBody: () => [
      "Standard: Height 9.5cm, Diameter 8cm",
      "Large: Height 11cm, Diameter 8.5cm",
      "Dishwasher safe, though hand washing helps preserve the print for longer.",
      "Microwave safe, but avoid prolonged heating to keep the design crisp.",
    ],
  },
  "memory-games": {
    displayName: "Memory Games",
    backgroundImage: "/memory-games-background.png",
    productType: "memory-game",
    sizeFallback: ["One Size"],
    defaultSize: "One Size",
    defaultColor: "Multicolor",
    singleColorLabel: "Multicolor",
    features: (isUnderground) => [
      isUnderground ? "24 pairs of London Underground themed cards" : "30 pairs of beautifully designed cards",
      isUnderground ? "Iconic London Underground stations and symbols" : "Iconic London landmarks and symbols",
      "Durable card stock with smooth finish",
      "Comes in a sturdy storage box",
      "Perfect for ages 6 and up",
      "2-4 players",
    ],
    additionalInfoTitle: "How to Play",
    additionalInfoBody: () => [
      "Shuffle all cards and place them face down in a grid.",
      "Players take turns flipping two cards to find a match.",
      "A matching pair stays with the player, who takes another turn.",
      "If the cards do not match, turn them back over and play passes on.",
      "The player with the most pairs at the end wins.",
    ],
  },
}

const imageMap: Record<string, Record<string, string>> = {
  hoodies: {
    White: "/products/white-hoodie.png",
    Black: "/products/black-hoodie.png",
    underground: "/products/underground-hoodie.png",
  },
  "t-shirts": {
    White: "/products/white-tshirt.png",
    Black: "/products/black-tshirt.png",
    underground: "/products/underground-tshirt.png",
  },
  mugs: {
    White: "/products/white-mug.png",
    Black: "/products/black-mug.png",
    underground: "/products/underground-mug.png",
  },
  "memory-games": {
    Multicolor: "/products/memory-games-iconic.png",
    underground: "/products/memory-underground.png",
  },
}

export function GenericProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { category, product } = use(params)
  const productInfo = useMemo(() => getProduct(category, product), [category, product])

  if (!productInfo) {
    notFound()
  }

  const meta = categoryMeta[category]

  if (!meta) {
    notFound()
  }

  const isUnderground = productInfo.name.toLowerCase().includes("underground")
  const availableColors = productInfo.colors?.length ? productInfo.colors : [meta.defaultColor]
  const availableSizes = productInfo.sizes?.length ? productInfo.sizes : meta.sizeFallback

  const [selectedColor, setSelectedColor] = useState(availableColors[0])
  const [selectedSize, setSelectedSize] = useState(
    availableSizes.includes(meta.defaultSize) ? meta.defaultSize : availableSizes[0],
  )
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const colorImages = useMemo(() => {
    const categoryImages = imageMap[category] || {}
    if (isUnderground) {
      return {
        [availableColors[0]]: categoryImages.underground || productInfo.imageSrc,
      }
    }

    return availableColors.reduce<Record<string, string>>((acc, color) => {
      acc[color] = categoryImages[color] || productInfo.imageSrc
      return acc
    }, {})
  }, [availableColors, category, isUnderground, productInfo.imageSrc])

  const handleAddToCart = useCallback(() => {
    if (isAdding) return

    setIsAdding(true)
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

    setTimeout(() => setIsAdding(false), 1000)
  }, [addItem, colorImages, isAdding, productInfo, selectedColor, selectedSize])

  const breadcrumbs = useMemo(
    () => (
      <ProductBreadcrumbs
        paths={[
          { name: "Home", href: "/" },
          { name: "Shop", href: "/shop" },
          { name: meta.displayName, href: `/shop/${category}` },
          { name: productInfo.name, href: `/shop/${category}/${productInfo.slug}`, isCurrent: true },
        ]}
      />
    ),
    [category, meta.displayName, productInfo.name, productInfo.slug],
  )

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

  const productInfoComponent = useMemo(
    () => (
      <ProductInfo
        name={productInfo.name}
        price={productInfo.price}
        description={productInfo.description}
        colors={availableColors}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        sizes={availableSizes}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        features={meta.features(isUnderground)}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        productType={meta.productType}
        logoType={isUnderground ? "underground" : "signature"}
      />
    ),
    [
      availableColors,
      availableSizes,
      handleAddToCart,
      isAdding,
      isUnderground,
      meta,
      productInfo.description,
      productInfo.name,
      productInfo.price,
      selectedColor,
      selectedSize,
    ],
  )

  const additionalInfo = useMemo(
    () => (
      <div
        className="backdrop-blur-sm bg-black/30 rounded-xl p-8 shadow-xl border border-white/10 mb-12 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">{meta.additionalInfoTitle}</h2>
        <div className="text-gray-200 space-y-3">
          {meta.additionalInfoBody(isUnderground).map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
    ),
    [isUnderground, meta],
  )

  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductDetailLayout
        backgroundImage={meta.backgroundImage}
        breadcrumbs={breadcrumbs}
        productImage={productImage}
        productInfo={productInfoComponent}
        additionalInfo={additionalInfo}
      />
    </Suspense>
  )
}
