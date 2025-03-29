import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"

export default function PrivacyPage() {
  return (
    <>
      <ResponsiveNav />
      <main className="bg-gray-900 pt-20 px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white my-6">Privacy Policy</h1>

          <div className="space-y-6 text-gray-300">
            <p>
              At londonshop.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, and
              protect your personal information.
            </p>

            <h2 className="text-xl font-bold text-white mt-6">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, make a purchase, or
              contact customer service.
            </p>

            <h2 className="text-xl font-bold text-white mt-6">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, process transactions,
              and communicate with you.
            </p>

            <p className="text-gray-400 mt-8 italic">Last updated: March 2024</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

