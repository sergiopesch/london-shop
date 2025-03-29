import Link from "next/link"

interface LondonLogoProps {
  className?: string
  href?: string
}

export function LondonLogo({ className = "", href = "/" }: LondonLogoProps) {
  // Using responsive classes to scale the logo based on screen size
  const logoContent = (
    <img
      src="/london-logo-wave.png"
      alt="London Shop Logo"
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

