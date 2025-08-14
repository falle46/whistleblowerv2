"use client"

import { LanguageProvider } from "@/contexts/language-context"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import InfoSection from "@/components/info-section"
import InfoCards from "@/components/info-cards"
import ReportableItems from "@/components/reportable-items"
import ReportSection from "@/components/report-section"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <LanguageProvider>
      <div className="relative">
        <Header />
        <main className="relative">
          <HeroSection />
          <div id="main-content">
            <InfoSection />
            <InfoCards />
            <ReportableItems />
            <ReportSection />
          </div>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
