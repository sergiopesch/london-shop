import Link from "next/link"
import { LondonLogo } from "./london-logo"

export function SiteFooter() {
  return (
    <footer className="bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <div className="mb-4">
          {/* The LondonLogo component now handles responsive sizing */}
          <LondonLogo />
        </div>

        <p className="text-gray-300 text-sm mb-4">Designed and printed in Great Britain</p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
            Home
          </Link>
          <Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">
            Shop
          </Link>
          <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
            About
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
            Contact
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
            Privacy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
            Terms
          </Link>
          <Link href="/admin" className="text-gray-400 hover:text-white transition-colors text-sm">
            Admin
          </Link>
        </div>

        <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} londonshop.ai</p>
      </div>
    </footer>
  )
}

