import Image from "next/image"
import Link from "next/link"
import { memo } from "react"

interface CategoryCardProps {
  title: string
  slug: string
  imageSrc: string
  animationDelay?: string
}

export const CategoryCard = memo(function CategoryCard({
  title,
  slug,
  imageSrc,
  animationDelay = "0s",
}: CategoryCardProps) {
  return (
    <Link href={`/shop/${slug}`} className="group animate-fade-in block" style={{ animationDelay }}>
      <div className="relative rounded-lg overflow-hidden shadow-lg backdrop-blur-sm bg-black/20 h-64">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-full max-h-40 flex items-center justify-center">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={title}
              width={200}
              height={200}
              className="object-contain max-h-full max-w-full w-auto h-auto group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
            <h3 className="text-white text-xl font-bold text-center">{title}</h3>
          </div>
        </div>
      </div>
    </Link>
  )
})

