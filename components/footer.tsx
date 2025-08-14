"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("footer.aboutUs")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.corporateProfile")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.vision")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.certification")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Product & Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("footer.products")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.oilGas")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.industrial")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.digital")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Commitment */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("footer.commitment")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.companyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.whistleblowing")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.management")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.hsse")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Investor */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("footer.investor")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.pressRelease")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.sustainability")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.information")}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-white text-sm">
                  {t("footer.admin")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="/images/elnusa-logo.png"
              alt="Elnusa Logo"
              width={120}
              height={40}
              className="h-8 w-auto filter brightness-0 invert"
            />
          </div>
          <p className="text-sm text-gray-400">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}
