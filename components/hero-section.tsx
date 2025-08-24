"use client"

import { useLanguage } from "@/contexts/language-context"

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
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
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          style={{
            fontFamily: "Calibri, sans-serif",
            textShadow: "2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
          }}
        >
          {t("hero.title")}
        </h1>

        <nav className="flex items-center justify-center space-x-2 text-sm text-white text-opacity-90">
          <span className="hover:text-white cursor-pointer transition-colors">Beranda</span>
          <span className="text-white text-opacity-60">{">"}</span>
          <span className="hover:text-white cursor-pointer transition-colors">Komitmen Kami</span>
          <span className="text-white text-opacity-60">{">"}</span>
          <span className="hover:text-white cursor-pointer transition-colors">Tata Kelola Perusahaan</span>
          <span className="text-white text-opacity-60">{">"}</span>
          <span className="text-yellow-300 font-medium">Mekanisme Pengaduan</span>
        </nav>
      </div>
    </section>
  )
}
