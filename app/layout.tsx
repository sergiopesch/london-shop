import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { CartProvider } from "@/context/cart-context"
import { Cart } from "@/components/cart"
import { Toaster } from "@/components/ui/toaster"
import { ReactQueryProvider } from "@/lib/react-query"
import { AuthProvider } from "@/contexts/auth-context"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ff0000",
}

export const metadata: Metadata = {
  title: "London Shop - Unique London-themed Merchandise",
  description: "Find unique London-themed merchandise including hoodies, t-shirts, memory cards, and mugs.",
  metadataBase: new URL("https://londonshop.ai"),
  openGraph: {
    title: "London Shop - Unique London-themed Merchandise",
    description: "Find unique London-themed merchandise including hoodies, t-shirts, memory cards, and mugs.",
    url: "https://londonshop.ai",
    siteName: "London Shop",
    locale: "en_GB",
    type: "website",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="bg-gray-900 text-white overflow-x-hidden">
        <ReactQueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Cart />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}