"use client"

import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function HeroSection() {
  const { t } = useLanguage()

  const scrollToNext = () => {
    const nextSection = document.getElementById("main-content")
    nextSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
            url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'),
            linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #1e40af 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="inline-block bg-white bg-opacity-95 backdrop-blur-md rounded-full px-8 py-4 mb-12 shadow-2xl border border-white border-opacity-20">
          <span className="text-base font-bold text-gray-900" style={{ fontFamily: "Calibri, sans-serif" }}>
            {t("hero.commitment")}
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight"
          style={{
            fontFamily: "Calibri, sans-serif",
            textShadow: "2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
          }}
        >
          {t("hero.title")}
        </h1>
      </div>

      <button
        onClick={scrollToNext}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-95 backdrop-blur-md rounded-full p-5 hover:bg-opacity-100 hover:scale-110 transition-all duration-300 shadow-2xl group border border-white border-opacity-20 z-20"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="w-7 h-7 text-gray-900 animate-bounce group-hover:animate-pulse" />
      </button>
    </section>
  )
}
