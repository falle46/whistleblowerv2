"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ReportContact() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
          style={{ fontFamily: "Calibri, sans-serif" }}
        >
          {t("faq.contactMedia")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-lg" style={{ fontFamily: "Calibri, sans-serif" }}>
                {t("faq.emailTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{t("faq.emailDesc")}</p>
              <a href="mailto:whistleblower@elnusa.co.id" className="text-blue-600 hover:text-blue-800 font-medium">
                whistleblower@elnusa.co.id
              </a>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-lg" style={{ fontFamily: "Calibri, sans-serif" }}>
                {t("faq.phoneTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{t("faq.phoneDesc")}</p>
              <a href="tel:+622129927000" className="text-green-600 hover:text-green-800 font-medium">
                +62 21 2992 7000
              </a>
            </CardContent>
          </Card>

          <Card className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-lg" style={{ fontFamily: "Calibri, sans-serif" }}>
                {t("faq.wbsTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{t("faq.wbsDesc")}</p>
              <a
                href="https://wbs.elnusa.co.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                wbs.elnusa.co.id
              </a>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("faq.securityGuarantee")}
            </h3>
            <p className="text-gray-700 leading-relaxed">{t("faq.securityText")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
