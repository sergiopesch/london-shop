import Link from "next/link"
import Image from "next/image"

interface LondonLogoProps {
  className?: string
  href?: string
}

export function LondonLogo({ className = "", href = "/" }: LondonLogoProps) {
  // Using responsive classes to scale the logo based on screen size
  const logoContent = (
    <Image
      src="/london-logo-wave.png"
      alt="London Shop Logo"
      width={180}
      height={40}
      className={`h-7 sm:h-8 md:h-10 w-auto object-contain ${className}`}
      style={{
        maxWidth: "min(180px, 100%)",
        maxHeight: "40px",
      }}
    />
  )

  // If href is provided, wrap in a Link
  if (href) {
    return (
      <Link href={href} className="focus:outline-none">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

