"use client"

import { Shield, Lock, Eye } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function ReportInfo() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
            style={{ fontFamily: "Calibri, sans-serif" }}
          >
            {t("reportInfo.title")}
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-gray-700">{t("reportInfo.question")}</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-justify">
              ... yang berpotensi merugikan dan/atau membahayakan ELNUSA dari sisi finansial, lingkungan, kondisi kerja,
              reputasi organisasi, pemangku kepentingan dan lainnya.
            </p>
            <p className="text-justify">
              Sistem Whistleblowing (pengaduan) disediakan oleh Perusahaan untuk menjadi pedoman bagi Insan Elnusa serta
              pihak eksternal dalam melaporkan pengaduan terhadap hal-hal yang terkait dengan pelanggaran atau
              penyimpangan kode etik, hukum, standar prosedur, kebijakan manajemen, serta lainnya yang berpotensi dapat
              merugikan dan/atau membahayakan PT Elnusa Tbk seperti kerugian finansial, lingkungan, kondisi kerja,
              reputasi organisasi, pemangku kepentingan dan lainnya.
            </p>
            <p className="text-justify">
              Agar mempunyai sistem pengaduan yang efektif, transparan dan terpercaya, Perusahaan telah membuat
              kebijakan pengaduan yang bersumber kepada nilai-nilai inti perusahaan dan sesuai dengan prinsip dan
              praktek tata kelola perusahaan yang baik.
            </p>
            <p className="text-justify">
              Kebijakan pengaduan ini berlaku untuk seluruh Insan Elnusa baik karyawan, Anak Perusahaan, mitra kerja dan
              semua pihak yang bertindak atas nama Elnusa.
            </p>
          </div>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Lock className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">{t("reportInfo.security")}</h3>
            <p className="text-sm text-gray-600">{t("reportInfo.securityDesc")}</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Eye className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">{t("reportInfo.anonymous")}</h3>
            <p className="text-sm text-gray-600">{t("reportInfo.anonymousDesc")}</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 mb-2">{t("reportInfo.protection")}</h3>
            <p className="text-sm text-gray-600">{t("reportInfo.protectionDesc")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
