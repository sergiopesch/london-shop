export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  categorySlug: string
  slug: string
  imageSrc: string
  sizes: string[]
  colors: string[]
}

// Update the London Underground Hoodie to only be available in white
export const allProducts: Product[] = [
  // Hoodies
  {
    id: "hoodie-1",
    name: "London Signature Hoodie",
    price: 49.99,
    description: "Premium cotton blend hoodie featuring our signature London Shop logo. Available in white or black.",
    category: "Hoodies",
    categorySlug: "hoodies",
    slug: "hoodie-1",
    imageSrc: "/products/white-hoodie.png",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black"],
  },
  {
    id: "hoodie-2",
    name: "London Underground Hoodie",
    price: 59.99,
    description: "Premium cotton blend hoodie featuring the iconic London Underground inspired roundel design.",
    category: "Hoodies",
    categorySlug: "hoodies",
    slug: "hoodie-2",
    imageSrc: "/products/underground-hoodie.png",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"], // Underground hoodie only in white
  },

  // T-Shirts
  {
    id: "tshirt-1",
    name: "London Signature T-Shirt",
    price: 29.99,
    description: "100% organic cotton t-shirt featuring our signature London Shop logo. Available in white or black.",
    category: "T-Shirts",
    categorySlug: "t-shirts",
    slug: "tshirt-1",
    imageSrc: "/products/white-tshirt.png",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black"],
  },
  {
    id: "tshirt-2",
    name: "London Underground T-Shirt",
    price: 34.99,
    description: "100% organic cotton t-shirt featuring the iconic London Underground inspired roundel design.",
    category: "T-Shirts",
    categorySlug: "t-shirts",
    slug: "tshirt-2",
    imageSrc: "/products/underground-tshirt.png",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"], // Underground t-shirt only in white
  },

  // Memory Games
  {
    id: "memory-1",
    name: "London Iconic Places Memory Game",
    price: 19.99,
    description: "Test your memory with 30 pairs of cards featuring London's most iconic landmarks and symbols.",
    category: "Memory Games",
    categorySlug: "memory-games",
    slug: "memory-1",
    imageSrc: "/products/memory-games-iconic.png",
    sizes: ["One Size"],
    colors: ["Multicolor"],
  },
  {
    id: "memory-2",
    name: "London Underground Memory Game",
    price: 24.99,
    description: "Challenge your memory with 24 pairs of cards featuring London Underground stations and symbols.",
    category: "Memory Games",
    categorySlug: "memory-games",
    slug: "memory-2",
    imageSrc: "/products/memory-underground.png",
    sizes: ["One Size"],
    colors: ["Multicolor"],
  },

  // Mugs
  {
    id: "mug-1",
    name: "London Signature Mug",
    price: 14.99,
    description: "High-quality ceramic mug featuring our signature London Shop logo. Available in white or black.",
    category: "Mugs",
    categorySlug: "mugs",
    slug: "mug-1",
    imageSrc: "/products/white-mug.png",
    sizes: ["Standard", "Large"],
    colors: ["White", "Black"],
  },
  {
    id: "mug-2",
    name: "London Underground Mug",
    price: 17.99,
    description: "High-quality ceramic mug featuring the iconic London Underground inspired roundel design.",
    category: "Mugs",
    categorySlug: "mugs",
    slug: "mug-2",
    imageSrc: "/products/underground-mug.png",
    sizes: ["Standard", "Large"],
    colors: ["White"],
  },
]

export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase()
  return allProducts.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    )
  })
}

export const getCategories = (): { title: string; slug: string }[] => {
  const categories = allProducts.map((product) => ({
    title: product.category,
    slug: product.categorySlug,
  }))

  // Remove duplicate categories
  const uniqueCategories = categories.filter(
    (category, index, self) => index === self.findIndex((c) => c.slug === category.slug),
  )

  return uniqueCategories
}

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return allProducts.filter((product) => product.categorySlug === categorySlug)
}

export const getProduct = (categorySlug: string, productSlug: string): Product | undefined => {
  return allProducts.find((product) => product.categorySlug === categorySlug && product.slug === productSlug)
}

