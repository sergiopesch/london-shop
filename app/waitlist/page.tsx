import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"

export default function WaitlistPage() {
  return (
    <>
      <ResponsiveNav />
      <main className="bg-gray-900 pt-20 px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="relative h-40">
              <Image src="/hero-background.jpg" alt="London skyline" fill className="object-cover brightness-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-3xl font-bold text-white">Join Our Waitlist</h1>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-6 text-center">
                Be the first to know when our exclusive London-themed merchandise becomes available.
              </p>

              <form className="max-w-md mx-auto">
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-white mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                  Join Waitlist
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

