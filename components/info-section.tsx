"use client"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export default function InfoSection() {
  const { t } = useLanguage()

  const scrollToReport = () => {
    const reportSection = document.getElementById("report-section")
    reportSection?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="main-content" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Report Button - Top Right */}
          <div className="absolute top-0 right-0">
            <Button
              onClick={scrollToReport}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              {t("main.reportButton")}
            </Button>
          </div>

          {/* Content */}
          <div className="max-w-4xl">
            <h2
              className="text-3xl md:text-4xl font-bold text-blue-600 mb-2"
              style={{ fontFamily: "Calibri, sans-serif" }}
            >
              {t("main.title")}
            </h2>
            <h3
              className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 border-b-4 border-blue-600 pb-2 inline-block"
              style={{ fontFamily: "Calibri, sans-serif" }}
            >
              {t("main.subtitle")}
            </h3>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-justify">{t("main.description1")}</p>
              <p className="text-justify">{t("main.description2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
