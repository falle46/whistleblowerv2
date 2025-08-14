"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"

export default function Header() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/images/elnusa-logo.png" alt="Elnusa Logo" width={120} height={40} className="h-10 w-auto" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              {t("nav.about")}
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              {t("nav.products")}
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              {t("nav.commitment")}
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              {t("nav.investor")}
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              {t("nav.news")}
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              {t("nav.complaint")}
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              {t("nav.contact")}
            </Link>
            <Link href="#" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
              {t("nav.career")}
            </Link>
          </nav>

          {/* Language Switcher */}
          <div className="flex items-center space-x-2">
            <Button
              variant={language === "id" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("id")}
              className="text-xs"
            >
              ID
            </Button>
            <span className="text-gray-300">|</span>
            <Button
              variant={language === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => setLanguage("en")}
              className="text-xs"
            >
              EN
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
