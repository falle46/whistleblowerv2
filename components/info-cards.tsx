"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Book, CheckCircle, Users, FileText, Shield, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const cardData = [
  {
    id: 1,
    icon: Book,
    titleKey: "card.regulation",
    content: "Informasi lengkap mengenai regulasi dan sistem pelaporan pelanggaran yang berlaku di PT Elnusa Tbk.",
  },
  {
    id: 2,
    icon: CheckCircle,
    titleKey: "card.mechanism",
    content: "Panduan lengkap mekanisme penyampaian laporan pelanggaran melalui berbagai saluran yang tersedia.",
  },
  {
    id: 3,
    icon: Users,
    titleKey: "card.management",
    content: "Proses pengelolaan dan tindak lanjut laporan pelanggaran yang diterima oleh tim khusus.",
  },
  {
    id: 4,
    icon: FileText,
    titleKey: "card.handling",
    content: "Prosedur penanganan laporan mulai dari verifikasi hingga penyelesaian kasus pelanggaran.",
  },
  {
    id: 5,
    icon: Shield,
    titleKey: "card.protection",
    content: "Jaminan perlindungan identitas dan keamanan bagi pelapor sesuai dengan ketentuan yang berlaku.",
  },
  {
    id: 6,
    icon: AlertTriangle,
    titleKey: "card.sanctions",
    content: "Informasi mengenai sanksi yang akan diberikan kepada pelaku pelanggaran sesuai tingkat kesalahan.",
  },
]

export default function InfoCards() {
  const { t } = useLanguage()
  const [selectedCard, setSelectedCard] = useState<(typeof cardData)[0] | null>(null)

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card) => {
            const IconComponent = card.icon
            return (
              <Card
                key={card.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-blue-50 border-blue-200"
                onClick={() => setSelectedCard(card)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <IconComponent className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 leading-tight">{t(card.titleKey)}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Modal Dialog */}
        <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-blue-600" style={{ fontFamily: "Calibri, sans-serif" }}>
                {selectedCard && t(selectedCard.titleKey)}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700 leading-relaxed">{selectedCard?.content}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
