"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const faqData = [
  {
    question: "Mengapa saya harus melaporkan perbuatan yang tidak benar?",
    answer:
      "Melaporkan pelanggaran adalah tanggung jawab moral untuk menjaga integritas perusahaan dan melindungi kepentingan bersama. Laporan Anda membantu mencegah kerugian yang lebih besar.",
  },
  {
    question: "Dapatkah saya memilih untuk tidak memberitahukan identitas diri saya sebagai pelapor?",
    answer:
      "Ya, sistem kami mendukung pelaporan anonim. Anda dapat memilih untuk tidak menyertakan identitas pribadi dalam laporan Anda.",
  },
  {
    question: "Bagaimana jika yang saya mencurigai adanya pelanggaran namun tidak pasti kebenarannya?",
    answer:
      "Anda tetap dapat melaporkan kecurigaan tersebut. Tim investigasi akan melakukan verifikasi dan penelitian lebih lanjut untuk memastikan kebenaran laporan.",
  },
  {
    question: "Setelah saya menyampaikan laporan, apakah saya akan terlibat?",
    answer:
      "Keterlibatan Anda tergantung pada pilihan yang Anda buat saat pelaporan. Jika Anda memilih untuk dapat dihubungi, tim mungkin akan menghubungi untuk klarifikasi tambahan.",
  },
  {
    question: "Setelah membuat pelaporan, dalam jangka waktu berapa lama tim WBS akan menindaklanjuti?",
    answer:
      "Tim WBS akan menindaklanjuti laporan dalam waktu maksimal 7 hari kerja setelah laporan diterima. Proses investigasi lengkap dapat memakan waktu 14-30 hari tergantung kompleksitas kasus.",
  },
  {
    question: "Apakah saya akan mendapatkan sanksi jika laporan yang saya sampaikan benar terjadi?",
    answer:
      "Tidak, pelapor yang melaporkan dengan itikad baik akan mendapatkan perlindungan penuh sesuai dengan kebijakan perusahaan dan peraturan yang berlaku.",
  },
]

export default function ReportFAQ() {
  const { t } = useLanguage()
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]))
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
          style={{ fontFamily: "Calibri, sans-serif" }}
        >
          {t("faq.title")}
        </h2>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card key={index} className="shadow-md">
              <Collapsible open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-left text-base font-medium text-gray-800 pr-4">
                        Q: {faq.question}
                      </CardTitle>
                      {openItems.includes(index) ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
