"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function ReportSection() {
  const { t } = useLanguage()

  return (
    <section id="report-section" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {t("report.title")}{" "}
          <Link href="/report" className="text-blue-600 hover:text-blue-800 font-semibold underline">
            {t("report.link")}
          </Link>
          {t("report.question")}
        </p>

        <Link
          href="/report"
          className="inline-block hover:scale-105 transition-transform duration-300"
          aria-label="Create Report"
        >
          <Image src="/images/whistle-icon.png" alt="WBS Whistle Icon" width={120} height={120} className="mx-auto" />
        </Link>
      </div>
    </section>
  )
}
