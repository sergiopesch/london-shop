"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ResponsiveNav } from "@/components/responsive-nav"
import { SiteFooter } from "@/components/site-footer"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

export default function AboutPage() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  const [activeSection, setActiveSection] = useState(0)
  const sectionRefsContainer = useRef<(HTMLDivElement | null)[]>([null, null, null, null])

  const setSectionRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    sectionRefsContainer.current[index] = el
  }, [])

  // Handle section visibility
  useEffect(() => {
    const sectionRefs = sectionRefsContainer.current
    const observers = sectionRefs.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(index)
          }
        },
        { threshold: 0.5, rootMargin: "-10% 0px" },
      )

      if (ref) {
        observer.observe(ref)
      }

      return observer
    })

    return () => {
      observers.forEach((observer, index) => {
        if (sectionRefs[index]) {
          observer.unobserve(sectionRefs[index]!)
        }
      })
    }
  }, [])

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
        "Our product range includes comfortable hoodies and t-shirts, engaging memory games, and stylish mugs - all featuring our distinctive London-inspired designs. We take pride in the quality of our merchandise, ensuring that each item meets our high standards before it reaches our customers.",
    },
  ]

  return (
    <>
      <ResponsiveNav />
      <div className="relative min-h-screen overflow-x-hidden bg-black">
        {/* Hero section with parallax effect */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          <Image
            src="/about-background-buckingham.png"
            alt="Buckingham Palace with Union Jack flags"
            fill
            priority
            className="object-cover brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>

          <motion.div className="relative z-10 text-center px-4 max-w-4xl mx-auto" style={{ opacity, y }}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              About Us
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light">
              The story behind London's most iconic merchandise
            </p>
          </motion.div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <div className="animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content sections */}
        <div className="relative z-10 bg-black py-20">
          <div className="max-w-5xl mx-auto px-4">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                ref={setSectionRef(index)}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`mb-32 ${index === 0 ? "mt-0" : "mt-32"}`}
              >
                <div className="relative">
                  {index === 0 ? (
                    <div className="mb-8">
                      <div className="inline-block relative">
                        <span className="absolute -left-4 top-0 bottom-0 w-1 bg-red-600 rounded-full"></span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight pl-4">
                          {section.title}
                        </h2>
                      </div>
                      <p className="text-xl md:text-2xl text-white/80 mt-8 leading-relaxed font-light max-w-3xl">
                        {section.content}
                      </p>
                    </div>
                  ) : (
                    <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-10 border border-white/10 shadow-xl">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl mr-5">
                          {index}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{section.title}</h2>
                      </div>
                      <p className="text-lg md:text-xl text-white/80 leading-relaxed">{section.content}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Timeline section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mt-20 mb-32"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Our Journey</h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-600/30"></div>

                {/* Timeline items */}
                <div className="space-y-20">
                  <TimelineItem
                    date="March 28, 2025"
                    title="Londonshop Founded"
                    description="We discovered the potential of AI-generated designs for London merchandise."
                    isLeft={true}
                  />

                  <TimelineItem
                    date="TBC"
                    title="First Collection Launch"
                    description="In the making - our signature and Underground-inspired designs across multiple product categories."
                    isLeft={false}
                  />

                  <TimelineItem
                    date="TBC"
                    title="Online Store Launch"
                    description="In the process - our e-commerce platform to bring London's iconic designs to customers worldwide."
                    isLeft={true}
                  />

                  <TimelineItem
                    date="TBC"
                    title="Expanding Our Range"
                    description="Looking into the future - continuously developing new designs and products to celebrate London's rich visual heritage."
                    isLeft={false}
                  />
                </div>
              </div>
            </motion.div>

            {/* Values section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mt-20 mb-32 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Values</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-16">
                At Londonshop, we are guided by our commitment to quality, design, and celebrating London's unique
                character.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ValueCard
                  title="Quality"
                  description="We use premium materials and manufacturing processes to ensure our products stand the test of time."
                  icon="shield"
                />

                <ValueCard
                  title="Design"
                  description="We blend traditional London iconography with modern aesthetics to create timeless designs."
                  icon="palette"
                />

                <ValueCard
                  title="Sustainability"
                  description="We are committed to ethical production and minimizing our environmental impact."
                  icon="leaf"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}

// Timeline Item Component
function TimelineItem({ date, title, description, isLeft }: { date: string; title: string; description: string; isLeft: boolean }) {
  return (
    <div className={`relative flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
      {/* Content */}
      <div className={`w-5/12 ${isLeft ? "text-right pr-8" : "text-left pl-8"}`}>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-white/70 mt-2">{description}</p>
        <span className="block text-red-500 font-medium mt-1">{date}</span>
      </div>

      {/* Circle */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 z-10"></div>

      {/* Empty space */}
      <div className="w-5/12"></div>
    </div>
  )
}

// Value Card Component
function ValueCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="backdrop-blur-sm bg-white/5 rounded-xl p-8 border border-white/10 shadow-xl">
      <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-6">
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
            className="text-red-500"
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
            className="text-red-500"
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
            className="text-red-500"
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
      <h3 className="text-xl font-bold text-white mb-3 text-center">{title}</h3>
      <p className="text-white/70 text-center">{description}</p>
    </div>
  )
}

