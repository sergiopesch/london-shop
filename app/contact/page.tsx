import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <ResponsiveNav />
      <main className="bg-gray-900 pt-20 px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white my-6">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Mail className="text-red-600 mt-1 mr-4" size={20} />
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <p className="text-gray-400">hello@londonshop.ai</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="text-red-600 mt-1 mr-4" size={20} />
                  <div>
                    <h3 className="text-white font-medium">Phone</h3>
                    <p className="text-gray-400">+44 20 1234 5678</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="text-red-600 mt-1 mr-4" size={20} />
                  <div>
                    <h3 className="text-white font-medium">Address</h3>
                    <p className="text-gray-400">
                      71-75 Shelton Street
                      <br />
                      Covent Garden
                      <br />
                      London, WC2H 9JQ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Send Message
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

