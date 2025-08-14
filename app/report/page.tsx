"use client"

import { LanguageProvider } from "@/contexts/language-context"
import Header from "@/components/header"
import ReportInfo from "@/components/report-info"
import ReportForm from "@/components/report-form"
import ReportFAQ from "@/components/report-faq"
import ReportContact from "@/components/report-contact"
import Footer from "@/components/footer"

export default function ReportPage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <ReportInfo />
          <ReportForm />
          <ReportFAQ />
          <ReportContact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
