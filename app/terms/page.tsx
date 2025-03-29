import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"

export default function TermsPage() {
  return (
    <>
      <ResponsiveNav />
      <main className="bg-gray-900 pt-20 px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white my-6">Terms & Conditions</h1>

          <div className="space-y-6 text-gray-300">
            <p>Please read these terms and conditions carefully before using the londonshop.ai website.</p>

            <h2 className="text-xl font-bold text-white mt-6">1. Introduction</h2>
            <p>
              By using our website, you confirm that you accept these terms and conditions and that you agree to comply
              with them.
            </p>

            <h2 className="text-xl font-bold text-white mt-6">2. Products</h2>
            <p>
              All products displayed on our website are subject to availability. We reserve the right to discontinue any
              product at any time.
            </p>

            <h2 className="text-xl font-bold text-white mt-6">3. Pricing and Payment</h2>
            <p>
              All prices are shown in GBP and include VAT where applicable. We reserve the right to change prices at any
              time without notice.
            </p>

            <p className="text-gray-400 mt-8 italic">Last updated: March 2024</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

