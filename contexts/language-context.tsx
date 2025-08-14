"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "id" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  id: {
    // Header
    "nav.about": "Tentang Kami",
    "nav.products": "Produk & Jasa",
    "nav.commitment": "Komitmen Kami",
    "nav.investor": "Investor",
    "nav.news": "ELSANews",
    "nav.complaint": "Pengaduan",
    "nav.contact": "Kontak Kami",
    "nav.career": "Karir",

    // Hero Section
    "hero.commitment": "Komitmen Kami",
    "hero.title": "Mekanisme Pengaduan",

    // Main Content
    "main.title": "Mekanisme Pengaduan",
    "main.subtitle": "Mekanisme Pengaduan Terintegrasi",
    "main.description1":
      "PT Elnusa Tbk telah mengembangkan dan menerapkan Sistem Manajemen Anti Penyuapan (Anti Bribery Management System) ISO 37001:2016. Sejalan dengan komitmen tersebut dan sebagai upaya pencegahan tindak korupsi, dikembangkan Whistleblowing System (WBS).",
    "main.description2":
      "Whistleblowing System (WBS) dalam rangka mencegah terjadinya tindak kecurangan dengan melaporkan kejadian perilaku pelanggaran serta mendorong budaya kejujuran dan keterbukaan upaya bermanfaat untuk pengembangan sistem pelaporan pelanggaran yang terkendali dengan baik, yang dapat menjadi fondasi bagi Perseroan untuk merancang evaluasi dan tindak lanjut yang diperlukan. WBS juga menjadi bagian dari mekanisme deteksi dini (early warning system) atas kemungkinan terjadinya masalah akibat sebuah pelanggaran. Bagi pelapor, WBS memberikan jaminan perlindungan dan kerahasiaan identitas.",
    "main.reportButton": "Buat Laporan",

    // Cards
    "card.regulation": "REGULASI DAN SISTEM PELAPORAN PELANGGARAN ELNUSA",
    "card.mechanism": "MEKANISME PENYAMPAIAN PELAPORAN",
    "card.management": "PENGELOLAAN PELAPORAN PELANGGARAN",
    "card.handling": "PENANGANAN PELAPORAN",
    "card.protection": "PERLINDUNGAN PELAPOR",
    "card.sanctions": "SANKSI ATAS PELANGGARAN",

    // Reportable Items Section
    "reportable.title": "Apa Saja Hal yang Dapat Dilaporkan?",
    "reportable.corruption": "Korupsi",
    "reportable.corruption.desc": "Tindakan menyalahgunakan wewenang untuk keuntungan pribadi atau kelompok.",
    "reportable.bribery": "Penyuapan",
    "reportable.bribery.desc": "Pemberian atau penerimaan sesuatu untuk mempengaruhi keputusan bisnis.",
    "reportable.money_laundering": "Pencucian Uang",
    "reportable.money_laundering.desc": "Proses menyembunyikan asal-usul uang hasil kejahatan.",
    "reportable.ethics": "Pelanggaran Etika",
    "reportable.ethics.desc": "Perilaku yang melanggar kode etik dan nilai-nilai perusahaan.",
    "reportable.discrimination": "Diskriminasi",
    "reportable.discrimination.desc":
      "Perlakuan tidak adil berdasarkan ras, gender, agama, atau karakteristik lainnya.",
    "reportable.safety": "Keselamatan Kerja",
    "reportable.safety.desc": "Pelanggaran protokol keselamatan yang membahayakan karyawan.",
    "reportable.others": "Apapun yang Merugikan Perusahaan",
    "reportable.others.desc": "Tindakan lain yang dapat merugikan reputasi atau operasional perusahaan.",

    // Report Section
    "report.title":
      "Jika terdapat indikasi pelanggaran pidana, akan dilanjutkan sesuai dengan ketentuan hukum yang berlaku. Ingin membuat",
    "report.link": "Laporan",
    "report.question": "? Klik logo WBS di bawah ini.",

    // Report Form
    "reportForm.title": "Form Pelaporan",
    "reportForm.personalInfo": "Informasi Pribadi",
    "reportForm.personalInfoQuestion": "Apakah Anda bersedia menyertakan informasi diri?",
    "reportForm.yes": "Ya, saya bersedia",
    "reportForm.no": "Tidak, saya ingin anonim",
    "reportForm.fullName": "Nama Lengkap",
    "reportForm.email": "Email",
    "reportForm.phone": "Nomor Telepon",
    "reportForm.contactPermission": "Izin Kontak",
    "reportForm.contactQuestion": "Apakah kami dapat menghubungi Anda?",
    "reportForm.yesContact": "Ya, boleh dihubungi",
    "reportForm.noContact": "Tidak, jangan hubungi saya",
    "reportForm.contactEmail": "Email untuk Dihubungi",
    "reportForm.contactPhone": "Nomor HP/WhatsApp",
    "reportForm.violatorInfo": "Informasi Pelanggar",
    "reportForm.violatorName": "Nama Pelanggar (jika diketahui)",
    "reportForm.violatorPosition": "Jabatan (jika diketahui)",
    "reportForm.violatorDepartment": "Departemen/Divisi",
    "reportForm.violatorLocation": "Lokasi Kantor",
    "reportForm.violationDetails": "Detail Pelanggaran",
    "reportForm.violationType": "Indikasi Pelanggaran",
    "reportForm.customViolation": "Sebutkan Jenis Pelanggaran",
    "reportForm.place": "Tempat Kejadian",
    "reportForm.time": "Waktu Kejadian",
    "reportForm.description": "Keterangan Detail",
    "reportForm.confirmation": "Konfirmasi Laporan",
    "reportForm.confirmText":
      "Saya menyatakan bahwa informasi yang saya berikan adalah benar dan dapat dipertanggungjawabkan.",
    "reportForm.back": "Kembali",
    "reportForm.continue": "Lanjutkan",
    "reportForm.submit": "Kirim Laporan",
    "reportForm.submitting": "Mengirim...",
    "reportForm.success": "Laporan Berhasil Dikirim",
    "reportForm.successDesc": "Terima kasih atas laporan Anda. Tim kami akan menindaklanjuti laporan ini.",
    "reportForm.error": "Gagal Mengirim Laporan",
    "reportForm.errorDesc": "Terjadi kesalahan. Silakan coba lagi.",

    // Report Info
    "reportInfo.title": "INDEPENDENT WHISTLEBLOWER SYSTEM CENTER",
    "reportInfo.question":
      "Apakah anda MENGETAHUI, MELIHAT atau MENCURIGAI sesuatu yang tidak benar terjadi di lingkungan kerja ELNUSA ??",
    "reportInfo.security": "Keamanan Terjamin",
    "reportInfo.securityDesc": "Data Anda dilindungi dengan enkripsi tingkat tinggi",
    "reportInfo.anonymous": "Identitas Anonim",
    "reportInfo.anonymousDesc": "Anda dapat melaporkan tanpa mengungkap identitas",
    "reportInfo.protection": "Perlindungan Pelapor",
    "reportInfo.protectionDesc": "Jaminan perlindungan sesuai ketentuan hukum",

    // Admin Dashboard
    "admin.title": "Admin Dashboard - Whistleblower System",
    "admin.login": "Login Administrator",
    "admin.email": "Email Administrator",
    "admin.password": "Password",
    "admin.loginButton": "Login",
    "admin.processing": "Memproses...",
    "admin.loginSuccess": "Login Berhasil",
    "admin.loginSuccessDesc": "Selamat datang di Admin Dashboard",
    "admin.loginError": "Login Gagal",
    "admin.loginErrorDesc": "Email atau password salah. Silakan coba lagi.",
    "admin.logout": "Logout",
    "admin.logoutSuccess": "Logout Berhasil",
    "admin.logoutSuccessDesc": "Anda telah keluar dari sistem",
    "admin.totalReports": "Total Laporan",
    "admin.readReports": "Sudah Dibaca",
    "admin.unreadReports": "Belum Dibaca",
    "admin.reportsList": "Daftar Laporan",
    "admin.noReports": "Belum ada laporan yang masuk",
    "admin.read": "Sudah Dibaca",
    "admin.unread": "Belum Dibaca",
    "admin.view": "Lihat",
    "admin.reportDate": "Tanggal Laporan",
    "admin.location": "Lokasi",
    "admin.time": "Waktu",

    // Report Detail Modal
    "modal.reportDetail": "Detail Laporan",
    "modal.downloadPDF": "Download PDF",
    "modal.violationDetails": "Detail Pelanggaran",
    "modal.violationType": "Jenis Pelanggaran",
    "modal.otherDetails": "Keterangan Lainnya",
    "modal.incidentPlace": "Tempat Kejadian",
    "modal.incidentTime": "Waktu Kejadian",
    "modal.violatorInfo": "Informasi Pelanggar",
    "modal.name": "Nama",
    "modal.position": "Jabatan",
    "modal.department": "Departemen",
    "modal.detailDescription": "Keterangan Detail",
    "modal.reporterInfo": "Informasi Pelapor",
    "modal.contactInfo": "Informasi Kontak",
    "modal.notMentioned": "Tidak disebutkan",

    // Footer
    "footer.quickLinks": "Quick Links",
    "footer.aboutUs": "About Us",
    "footer.corporateProfile": "Corporate Profile",
    "footer.vision": "Vision, Mission & Value",
    "footer.certification": "Certification",
    "footer.products": "Product & Services",
    "footer.oilGas": "Oil & Gas",
    "footer.industrial": "Industrial",
    "footer.digital": "Digital",
    "footer.commitment": "Our Commitment",
    "footer.companyPolicy": "Company Policy",
    "footer.whistleblowing": "Whistleblowing System",
    "footer.management": "Management System",
    "footer.hsse": "HSSE",
    "footer.investor": "Investor",
    "footer.pressRelease": "Press Release",
    "footer.sustainability": "Sustainability Report",
    "footer.information": "Information Disclosure",
    "footer.admin": "Admin",
    "footer.copyright": "Copyright © PT Elnusa Tbk. All rights reserved.",

    // FAQ
    "faq.title": "Frequently Asked Questions (FAQs)",
    "faq.contactMedia": "Media Pelaporan Lainnya",
    "faq.emailTitle": "Email",
    "faq.emailDesc": "Kirim laporan melalui email",
    "faq.phoneTitle": "Telepon",
    "faq.phoneDesc": "Hubungi hotline kami",
    "faq.wbsTitle": "WBS Center",
    "faq.wbsDesc": "Akses portal online",
    "faq.securityGuarantee": "Jaminan Keamanan",
    "faq.securityText":
      "Semua laporan yang masuk akan ditangani dengan kerahasiaan tinggi dan sesuai dengan prosedur yang telah ditetapkan. Identitas pelapor akan dilindungi sesuai dengan ketentuan hukum yang berlaku.",
  },
  en: {
    // Header
    "nav.about": "About Us",
    "nav.products": "Products & Services",
    "nav.commitment": "Our Commitment",
    "nav.investor": "Investor",
    "nav.news": "ELSANews",
    "nav.complaint": "Complaints",
    "nav.contact": "Contact Us",
    "nav.career": "Career",

    // Hero Section
    "hero.commitment": "Our Commitment",
    "hero.title": "Whistleblower System",

    // Main Content
    "main.title": "Complaint Mechanism",
    "main.subtitle": "Integrated Complaint Mechanism",
    "main.description1":
      "PT Elnusa Tbk has developed and implemented the Anti-Bribery Management System ISO 37001:2016. In line with this commitment and as an effort to prevent corruption, the Whistleblowing System (WBS) was developed.",
    "main.description2":
      "The Whistleblowing System (WBS) aims to prevent fraud by reporting violations and encouraging a culture of honesty and openness. This effort is beneficial for developing a well-controlled violation reporting system, which can serve as a foundation for the Company to design evaluations and necessary follow-ups. WBS also serves as part of an early warning system for potential problems arising from violations. For reporters, WBS provides guarantees of protection and confidentiality of identity.",
    "main.reportButton": "Create Report",

    // Cards
    "card.regulation": "ELNUSA VIOLATION REPORTING REGULATIONS AND SYSTEMS",
    "card.mechanism": "REPORTING SUBMISSION MECHANISM",
    "card.management": "VIOLATION REPORTING MANAGEMENT",
    "card.handling": "REPORT HANDLING",
    "card.protection": "REPORTER PROTECTION",
    "card.sanctions": "VIOLATION SANCTIONS",

    // Reportable Items Section
    "reportable.title": "What Can Be Reported?",
    "reportable.corruption": "Corruption",
    "reportable.corruption.desc": "Actions that abuse authority for personal or group benefit.",
    "reportable.bribery": "Bribery",
    "reportable.bribery.desc": "Giving or receiving something to influence business decisions.",
    "reportable.money_laundering": "Money Laundering",
    "reportable.money_laundering.desc": "Process of hiding the origin of money from criminal activities.",
    "reportable.ethics": "Ethics Violation",
    "reportable.ethics.desc": "Behavior that violates the code of ethics and company values.",
    "reportable.discrimination": "Discrimination",
    "reportable.discrimination.desc": "Unfair treatment based on race, gender, religion, or other characteristics.",
    "reportable.safety": "Work Safety",
    "reportable.safety.desc": "Safety protocol violations that endanger employees.",
    "reportable.others": "Anything Harmful to the Company",
    "reportable.others.desc": "Other actions that may harm the company's reputation or operations.",

    // Report Section
    "report.title":
      "If there are indications of criminal violations, they will be continued in accordance with applicable legal provisions. Want to create a",
    "report.link": "Report",
    "report.question": "? Click the WBS logo below.",

    // Report Form
    "reportForm.title": "Report Form",
    "reportForm.personalInfo": "Personal Information",
    "reportForm.personalInfoQuestion": "Are you willing to include your personal information?",
    "reportForm.yes": "Yes, I am willing",
    "reportForm.no": "No, I want to remain anonymous",
    "reportForm.fullName": "Full Name",
    "reportForm.email": "Email",
    "reportForm.phone": "Phone Number",
    "reportForm.contactPermission": "Contact Permission",
    "reportForm.contactQuestion": "Can we contact you?",
    "reportForm.yesContact": "Yes, you may contact me",
    "reportForm.noContact": "No, do not contact me",
    "reportForm.contactEmail": "Contact Email",
    "reportForm.contactPhone": "Mobile/WhatsApp Number",
    "reportForm.violatorInfo": "Violator Information",
    "reportForm.violatorName": "Violator Name (if known)",
    "reportForm.violatorPosition": "Position (if known)",
    "reportForm.violatorDepartment": "Department/Division",
    "reportForm.violatorLocation": "Office Location",
    "reportForm.violationDetails": "Violation Details",
    "reportForm.violationType": "Violation Type",
    "reportForm.customViolation": "Specify Violation Type",
    "reportForm.place": "Incident Location",
    "reportForm.time": "Incident Time",
    "reportForm.description": "Detailed Description",
    "reportForm.confirmation": "Report Confirmation",
    "reportForm.confirmText": "I declare that the information I have provided is true and can be accounted for.",
    "reportForm.back": "Back",
    "reportForm.continue": "Continue",
    "reportForm.submit": "Submit Report",
    "reportForm.submitting": "Submitting...",
    "reportForm.success": "Report Successfully Submitted",
    "reportForm.successDesc": "Thank you for your report. Our team will follow up on this report.",
    "reportForm.error": "Failed to Submit Report",
    "reportForm.errorDesc": "An error occurred. Please try again.",

    // Report Info
    "reportInfo.title": "INDEPENDENT WHISTLEBLOWER SYSTEM CENTER",
    "reportInfo.question": "Do you KNOW, SEE or SUSPECT something wrong happening in the ELNUSA work environment ??",
    "reportInfo.security": "Guaranteed Security",
    "reportInfo.securityDesc": "Your data is protected with high-level encryption",
    "reportInfo.anonymous": "Anonymous Identity",
    "reportInfo.anonymousDesc": "You can report without revealing your identity",
    "reportInfo.protection": "Reporter Protection",
    "reportInfo.protectionDesc": "Protection guarantee according to legal provisions",

    // Admin Dashboard
    "admin.title": "Admin Dashboard - Whistleblower System",
    "admin.login": "Administrator Login",
    "admin.email": "Administrator Email",
    "admin.password": "Password",
    "admin.loginButton": "Login",
    "admin.processing": "Processing...",
    "admin.loginSuccess": "Login Successful",
    "admin.loginSuccessDesc": "Welcome to Admin Dashboard",
    "admin.loginError": "Login Failed",
    "admin.loginErrorDesc": "Incorrect email or password. Please try again.",
    "admin.logout": "Logout",
    "admin.logoutSuccess": "Logout Successful",
    "admin.logoutSuccessDesc": "You have logged out of the system",
    "admin.totalReports": "Total Reports",
    "admin.readReports": "Read",
    "admin.unreadReports": "Unread",
    "admin.reportsList": "Reports List",
    "admin.noReports": "No reports received yet",
    "admin.read": "Read",
    "admin.unread": "Unread",
    "admin.view": "View",
    "admin.reportDate": "Report Date",
    "admin.location": "Location",
    "admin.time": "Time",

    // Report Detail Modal
    "modal.reportDetail": "Report Details",
    "modal.downloadPDF": "Download PDF",
    "modal.violationDetails": "Violation Details",
    "modal.violationType": "Violation Type",
    "modal.otherDetails": "Other Details",
    "modal.incidentPlace": "Incident Location",
    "modal.incidentTime": "Incident Time",
    "modal.violatorInfo": "Violator Information",
    "modal.name": "Name",
    "modal.position": "Position",
    "modal.department": "Department",
    "modal.detailDescription": "Detailed Description",
    "modal.reporterInfo": "Reporter Information",
    "modal.contactInfo": "Contact Information",
    "modal.notMentioned": "Not mentioned",

    // Footer
    "footer.quickLinks": "Quick Links",
    "footer.aboutUs": "About Us",
    "footer.corporateProfile": "Corporate Profile",
    "footer.vision": "Vision, Mission & Value",
    "footer.certification": "Certification",
    "footer.products": "Product & Services",
    "footer.oilGas": "Oil & Gas",
    "footer.industrial": "Industrial",
    "footer.digital": "Digital",
    "footer.commitment": "Our Commitment",
    "footer.companyPolicy": "Company Policy",
    "footer.whistleblowing": "Whistleblowing System",
    "footer.management": "Management System",
    "footer.hsse": "HSSE",
    "footer.investor": "Investor",
    "footer.pressRelease": "Press Release",
    "footer.sustainability": "Sustainability Report",
    "footer.information": "Information Disclosure",
    "footer.admin": "Admin",
    "footer.copyright": "Copyright © PT Elnusa Tbk. All rights reserved.",

    // FAQ
    "faq.title": "Frequently Asked Questions (FAQs)",
    "faq.contactMedia": "Other Reporting Media",
    "faq.emailTitle": "Email",
    "faq.emailDesc": "Send reports via email",
    "faq.phoneTitle": "Phone",
    "faq.phoneDesc": "Contact our hotline",
    "faq.wbsTitle": "WBS Center",
    "faq.wbsDesc": "Access online portal",
    "faq.securityGuarantee": "Security Guarantee",
    "faq.securityText":
      "All incoming reports will be handled with high confidentiality and in accordance with established procedures. Reporter identity will be protected in accordance with applicable legal provisions.",
  },
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("id")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["id"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
