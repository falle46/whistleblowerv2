"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, DollarSign, Shield, Users, Briefcase, HardHat, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const reportableItems = [
  {
    icon: AlertCircle,
    titleKey: "reportable.corruption",
    descKey: "reportable.corruption.desc",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: DollarSign,
    titleKey: "reportable.bribery",
    descKey: "reportable.bribery.desc",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: Shield,
    titleKey: "reportable.money_laundering",
    descKey: "reportable.money_laundering.desc",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Users,
    titleKey: "reportable.ethics",
    descKey: "reportable.ethics.desc",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Briefcase,
    titleKey: "reportable.discrimination",
    descKey: "reportable.discrimination.desc",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: HardHat,
    titleKey: "reportable.safety",
    descKey: "reportable.safety.desc",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: AlertTriangle,
    titleKey: "reportable.others",
    descKey: "reportable.others.desc",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
]

export default function ReportableItems() {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
          style={{ fontFamily: "Calibri, sans-serif" }}
        >
          {t("reportable.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reportableItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Card
                key={index}
                className={`${item.bgColor} border-none hover:shadow-md transition-shadow duration-300`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                    <CardTitle className={`text-lg ${item.color}`} style={{ fontFamily: "Calibri, sans-serif" }}>
                      {t(item.titleKey)}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">{t(item.descKey)}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
