"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { ReportData, Sanction } from "@/lib/firebase-utils"
import { useLanguage } from "@/contexts/language-context"
import jsPDF from "jspdf"

interface ReportDetailModalProps {
  report: ReportData
  sanction?: Sanction | null // Menerima prop sanksi (opsional)
  onClose: () => void
}

export default function ReportDetailModal({ report, sanction, onClose }: ReportDetailModalProps) {
  const { t } = useLanguage()

  // --- Logic Status Tindak Lanjut ---
  const getStatusInfo = () => {
    if (!sanction) {
        return {
            label: "Belum Ditindaklanjuti",
            color: "bg-gray-100 text-gray-600 border-gray-200",
            icon: <AlertTriangle className="w-4 h-4 mr-2" />,
            desc: "Laporan ini belum mendapatkan tindakan atau sanksi dari pimpinan."
        };
    }

    const now = new Date();
    const endDate = sanction.endDate.toDate();

    if (now > endDate) {
        return {
            label: "Selesai Ditindaklanjuti",
            color: "bg-green-100 text-green-700 border-green-200",
            icon: <CheckCircle className="w-4 h-4 mr-2" />,
            desc: `Kasus ini telah selesai ditangani. Sanksi ${sanction.sanctionType} telah berakhir pada ${endDate.toLocaleDateString("id-ID")}.`,
            detail: sanction.description
        };
    } else {
        return {
            label: "Sedang Ditindaklanjuti",
            color: "bg-blue-100 text-blue-700 border-blue-200",
            icon: <Clock className="w-4 h-4 mr-2" />,
            desc: `Kasus ini sedang dalam masa penindakan. Sanksi: ${sanction.sanctionType} selama ${sanction.duration} hari.`,
            detail: `Berakhir pada: ${endDate.toLocaleDateString("id-ID")}`
        };
    }
  }

  const status = getStatusInfo();

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPosition = 30

    // Title
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("LAPORAN PELANGGARAN", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 10

    doc.setFontSize(12)
    doc.text("PT ELNUSA TBK", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 20

    // Report Code
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Kode Laporan: ${report.reportCode}`, margin, yPosition)
    yPosition += 10

    doc.text(
      `Tanggal Laporan: ${report.createdAt?.toDate().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      margin,
      yPosition,
    )
    yPosition += 20

    // Report Details
    doc.setFont("helvetica", "bold")
    doc.text("DETAIL PELANGGARAN", margin, yPosition)
    yPosition += 10

    doc.setFont("helvetica", "normal")
    doc.text(`Jenis Pelanggaran: ${report.violationType}`, margin, yPosition)
    yPosition += 8

    if (report.customViolationType) {
      doc.text(`Keterangan Lainnya: ${report.customViolationType}`, margin, yPosition)
      yPosition += 8
    }

    doc.text(`Tempat Kejadian: ${report.place}`, margin, yPosition)
    yPosition += 8

    doc.text(`Waktu Kejadian: ${report.time}`, margin, yPosition)
    yPosition += 15

    // Violator Info
    doc.setFont("helvetica", "bold")
    doc.text("INFORMASI PELANGGAR", margin, yPosition)
    yPosition += 10

    doc.setFont("helvetica", "normal")
    doc.text(`Nama: ${report.violatorInfo.name || "Tidak disebutkan"}`, margin, yPosition)
    yPosition += 8

    doc.text(`Jabatan: ${report.violatorInfo.position || "Tidak disebutkan"}`, margin, yPosition)
    yPosition += 8

    doc.text(`Departemen: ${report.violatorInfo.department || "Tidak disebutkan"}`, margin, yPosition)
    yPosition += 8

    doc.text(`Lokasi: ${report.violatorInfo.location || "Tidak disebutkan"}`, margin, yPosition)
    yPosition += 15

    // Description
    doc.setFont("helvetica", "bold")
    doc.text("KETERANGAN DETAIL", margin, yPosition)
    yPosition += 10

    doc.setFont("helvetica", "normal")
    const splitDescription = doc.splitTextToSize(report.description, pageWidth - 2 * margin)
    doc.text(splitDescription, margin, yPosition)
    yPosition += splitDescription.length * 5 + 15

    // Status Section in PDF
    doc.setFont("helvetica", "bold")
    doc.text("STATUS TINDAK LANJUT", margin, yPosition)
    yPosition += 10
    doc.setFont("helvetica", "normal")
    doc.text(`Status: ${status.label}`, margin, yPosition)
    yPosition += 8
    if(sanction) {
        doc.text(`Keterangan: ${status.desc}`, margin, yPosition)
        yPosition += 8
        if(status.detail) {
             doc.text(`Detail: ${status.detail}`, margin, yPosition)
             yPosition += 8
        }
    }
    yPosition += 10

    // Reporter Info (if available)
    if (report.includePersonalInfo && report.personalInfo) {
      doc.setFont("helvetica", "bold")
      doc.text("INFORMASI PELAPOR", margin, yPosition)
      yPosition += 10

      doc.setFont("helvetica", "normal")
      doc.text(`Nama: ${report.personalInfo.name}`, margin, yPosition)
      yPosition += 8

      doc.text(`Email: ${report.personalInfo.email}`, margin, yPosition)
      yPosition += 8

      doc.text(`Telepon: ${report.personalInfo.phone}`, margin, yPosition)
    }

    // Attachments section to PDF
    if (report.attachments && report.attachments.length > 0) {
      doc.setFont("helvetica", "bold")
      doc.text("LAMPIRAN", margin, yPosition)
      yPosition += 10

      doc.setFont("helvetica", "normal")
      report.attachments.forEach((attachment, index) => {
        doc.text(`${index + 1}. ${attachment.name} (${attachment.type})`, margin, yPosition)
        yPosition += 8
      })
      yPosition += 10
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 20
    doc.setFontSize(8)
    doc.text("Dokumen ini bersifat rahasia dan hanya untuk keperluan internal PT Elnusa Tbk", pageWidth / 2, footerY, {
      align: "center",
    })

    doc.save(`Laporan_${report.reportCode}.pdf`)
  }

  // Function to download individual attachment
  const downloadAttachment = (attachment: any) => {
    const link = document.createElement("a")
    link.href = `data:${attachment.type};base64,${attachment.data}`
    link.download = attachment.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("modal.reportDetail")} - {report.reportCode}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={downloadPDF} size="sm" className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{t("modal.downloadPDF")}</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Header */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <Badge className="text-sm px-3 py-1">{report.violationType}</Badge>
              <span className="text-sm text-gray-600 font-mono">{report.reportCode}</span>
            </div>
            <p className="text-sm text-gray-600">
              <strong>{t("admin.reportDate")}:</strong>{" "}
              {report.createdAt?.toDate().toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        
        {/* --- REVISI: BAGIAN STATUS TINDAK LANJUT --- */}
        <div>
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Calibri, sans-serif" }}>
              Status Tindak Lanjut
            </h3>
            <div className={`p-4 rounded-lg border ${status.color}`}>
                <div className="flex items-center mb-2">
                    {status.icon}
                    <span className="font-bold text-base uppercase">{status.label}</span>
                </div>
                <p className="text-sm">{status.desc}</p>
                {status.detail && (
                    <p className="text-sm mt-1 font-medium">{status.detail}</p>
                )}
            </div>
        </div>
        {/* ------------------------------------------- */}

          {/* Violation Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("modal.violationDetails")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>{t("modal.violationType")}:</strong>
                </p>
                <p className="text-sm">{report.violationType}</p>
                {report.customViolationType && (
                  <>
                    <p className="text-sm text-gray-600 mb-1 mt-2">
                      <strong>{t("modal.otherDetails")}:</strong>
                    </p>
                    <p className="text-sm">{report.customViolationType}</p>
                  </>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>{t("modal.incidentPlace")}:</strong>
                </p>
                <p className="text-sm">{report.place}</p>
                <p className="text-sm text-gray-600 mb-1 mt-2">
                  <strong>{t("modal.incidentTime")}:</strong>
                </p>
                <p className="text-sm">{report.time}</p>
              </div>
            </div>
          </div>

          {/* Violator Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("modal.violatorInfo")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>{t("modal.name")}:</strong>
                </p>
                <p className="text-sm">{report.violatorInfo.name || t("modal.notMentioned")}</p>
                <p className="text-sm text-gray-600 mb-1 mt-2">
                  <strong>{t("modal.position")}:</strong>
                </p>
                <p className="text-sm">{report.violatorInfo.position || t("modal.notMentioned")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>{t("modal.department")}:</strong>
                </p>
                <p className="text-sm">{report.violatorInfo.department || t("modal.notMentioned")}</p>
                <p className="text-sm text-gray-600 mb-1 mt-2">
                  <strong>{t("admin.location")}:</strong>
                </p>
                <p className="text-sm">{report.violatorInfo.location || t("modal.notMentioned")}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Calibri, sans-serif" }}>
              {t("modal.detailDescription")}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{report.description}</p>
            </div>
          </div>

          {/* Reporter Information */}
          {report.includePersonalInfo && report.personalInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Calibri, sans-serif" }}>
                {t("modal.reporterInfo")}
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>{t("modal.name")}:</strong>
                    </p>
                    <p className="text-sm">{report.personalInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>{t("reportForm.email")}:</strong>
                    </p>
                    <p className="text-sm">{report.personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>{t("reportForm.phone")}:</strong>
                    </p>
                    <p className="text-sm">{report.personalInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information */}
          {report.allowContact && report.contactInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Calibri, sans-serif" }}>
                {t("modal.contactInfo")}
              </h3>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>{t("reportForm.email")}:</strong>
                    </p>
                    <p className="text-sm">{report.contactInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>{t("reportForm.phone")}:</strong>
                    </p>
                    <p className="text-sm">{report.contactInfo.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attachments Section */}
          {report.attachments && report.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: "Calibri, sans-serif" }}>
                Lampiran Dokumen
              </h3>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {report.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                          <span className="text-xs font-semibold text-red-600">PDF</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.type}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => downloadAttachment(attachment)}
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span className="text-xs">Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}