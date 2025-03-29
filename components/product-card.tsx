import { memo } from "react"
import { LoadingImage } from "./loading-image"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  price?: number
  imageSrc: string
  href: string
  category?: string
}

export const ProductCard = memo(function ProductCard({ id, name, price, imageSrc, href, category }: ProductCardProps) {
  return (
    <Link key={id} href={href} className="group">
      <div className="flex flex-col">
        <div className="relative aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3 group-hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-black/20">
          <LoadingImage
            src={imageSrc || "/placeholder.svg?height=400&width=400"}
            alt={name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-opacity"></div>
        </div>
        <h3 className="text-white font-medium text-center text-sm sm:text-base">{name}</h3>
        {category && <p className="text-gray-400 text-xs sm:text-sm text-center">{category}</p>}
        {price !== undefined && <p className="text-red-500 text-center text-sm sm:text-base">£{price.toFixed(2)}</p>}
      </div>
    </Link>
  )
})

