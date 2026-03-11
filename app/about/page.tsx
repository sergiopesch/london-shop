"use client"

import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

const sections = [
  {
    title: "Our Story",
    content:
      "Welcome to Londonshop, your destination for unique London-themed merchandise that celebrates the iconic symbols and landmarks of one of the world's greatest cities.",
  },
  {
    title: "Our Beginning",
    content:
      "Founded on March 28th, 2025, Londonshop was born when we began vibe coding with v0, GPT-4o and Vercel. What started as a fun experiment quickly turned into a passion project to create high-quality, personalized London merchandise that captures the essence of the city in ways never before possible.",
  },
  {
    title: "Our Mission",
    content:
      "We aim to provide tourists and locals alike with memorable, high-quality products that serve as lasting reminders of London's unique charm and character. Each product in our collection is thoughtfully designed to celebrate London's rich visual heritage.",
  },
  {
    title: "Our Products",
    content:
      "Our product range includes comfortable hoodies and t-shirts, engaging memory games, and stylish mugs — all featuring our distinctive London-inspired designs. We take pride in the quality of our merchandise, ensuring that each item meets our high standards before it reaches our customers.",
  },
]

const journeyItems = [
  {
    date: "March 28, 2025",
    title: "Londonshop Founded",
    description: "We discovered the potential of AI-generated designs for London merchandise.",
  },
  {
    date: "TBC",
    title: "First Collection Launch",
    description: "Our signature and Underground-inspired designs expanding across multiple product categories.",
  },
  {
    date: "TBC",
    title: "Online Store Launch",
    description: "Our e-commerce experience evolving to bring London's iconic designs to customers worldwide.",
  },
  {
    date: "TBC",
    title: "Expanding Our Range",
    description: "New designs and products continuing to celebrate London's rich visual heritage.",
  },
]

const values = [
  {
    title: "Quality",
    description: "We use premium materials and thoughtful production standards so each product feels made to last.",
    icon: "shield",
  },
  {
    title: "Design",
    description: "We blend recognisable London iconography with cleaner modern aesthetics to keep the work timeless.",
    icon: "palette",
  },
  {
    title: "Sustainability",
    description: "We aim for responsible production choices and a lighter footprint as the brand grows.",
    icon: "leaf",
  },
]

export default function AboutPage() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.2])
  const y = useTransform(scrollYProgress, [0, 0.18], [0, -36])

  return (
    <>
      <ResponsiveNav />
      <main className="bg-black text-white">
        <section className="relative isolate overflow-hidden border-b border-white/10">
          <div className="absolute inset-0">
            <Image
              src="/about-background-buckingham.png"
              alt="Buckingham Palace with Union Jack flags"
              fill
              priority
              className="object-cover brightness-[0.42]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-black" />
          </div>

          <motion.div
            style={{ opacity, y }}
            className="relative z-10 mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-4 pb-20 pt-28 text-center sm:px-6 md:min-h-[78vh] lg:px-8"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.35em] text-red-400/90">Londonshop</p>
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Built from London, designed to be remembered.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg md:text-xl">
              We turn the city&apos;s landmarks, symbols, and atmosphere into merchandise with a cleaner eye and a stronger sense of identity.
            </p>
          </motion.div>
        </section>

        <section className="relative z-10 bg-gradient-to-b from-black via-[#081528] to-[#030712] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-16 md:space-y-20">
            <div className="grid gap-6 md:grid-cols-2">
              {sections.map((section, index) => (
                <motion.article
                  key={section.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={`rounded-3xl border border-white/12 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8 ${
                    index === 0 ? "bg-slate-900/80 md:col-span-2" : "bg-slate-950/75"
                  }`}
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{section.title}</h2>
                  </div>
                  <p className="max-w-3xl text-base leading-7 text-white/78 sm:text-lg sm:leading-8">{section.content}</p>
                </motion.article>
              ))}
            </div>

            <motion.section
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-white/12 bg-slate-950/80 p-6 shadow-2xl shadow-black/30 sm:p-8 md:p-10"
            >
              <div className="mb-10 flex flex-col gap-3 text-center md:text-left">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400/80">Timeline</p>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Journey</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {journeyItems.map((item, index) => (
                  <div key={item.title} className="relative rounded-2xl border border-white/10 bg-slate-900/85 p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20 text-sm font-semibold text-red-300">
                      0{index + 1}
                    </div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-red-400/75">{item.date}</p>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/70">{item.description}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-white/12 bg-slate-950/82 p-6 text-center shadow-2xl shadow-black/30 sm:p-8 md:p-10"
            >
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400/80">Principles</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Our Values</h2>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
                At Londonshop, we care about quality, design clarity, and building products that feel rooted in the city rather than merely decorated by it.
              </p>

              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {values.map((value) => (
                  <ValueCard
                    key={value.title}
                    title={value.title}
                    description={value.description}
                    icon={value.icon}
                  />
                ))}
              </div>
            </motion.section>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

function ValueCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/85 p-8 text-center shadow-xl shadow-black/30">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/15">
        {icon === "shield" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-400"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        )}
        {icon === "palette" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-400"
          >
            <circle cx="13.5" cy="6.5" r="2.5"></circle>
            <circle cx="19" cy="13" r="2.5"></circle>
            <circle cx="6" cy="12" r="2.5"></circle>
            <circle cx="10" cy="20" r="2.5"></circle>
            <path d="M10.2 20.2l3-3"></path>
            <path d="M14.5 14.5l2-2"></path>
            <path d="M13.5 9l2-2"></path>
            <path d="M10.75 13.75l-3-3"></path>
          </svg>
        )}
        {icon === "leaf" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-400"
          >
            <path d="M2 22l10-10"></path>
            <path d="M16 8l-4 4"></path>
            <path d="M18 2l4 4"></path>
            <path d="M17.5 11.5L22 7"></path>
            <path d="M2 22l4-4"></path>
            <path d="M7 7l9.5 9.5"></path>
            <path d="M22 2L2 22"></path>
          </svg>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/70 sm:text-base">{description}</p>
    </div>
  )
}
