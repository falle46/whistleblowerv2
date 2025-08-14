"use client"

import { useState, useEffect } from "react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getReports, markReportAsRead, type ReportData } from "@/lib/firebase-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { LogOut, Eye, FileText, Clock, CheckCircle, Loader2 } from "lucide-react"
import ReportDetailModal from "@/components/report-detail-modal"

export default function AdminDashboard() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      const reportsData = await getReports()
      setReports(reportsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data laporan",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: t("admin.logoutSuccess"),
        description: t("admin.logoutSuccessDesc"),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal logout",
        variant: "destructive",
      })
    }
  }

  const handleViewReport = async (report: ReportData) => {
    setSelectedReport(report)
    if (!report.isRead && report.id) {
      try {
        await markReportAsRead(report.id)
        // Update local state
        setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, isRead: true } : r)))
      } catch (error) {
        console.error("Error marking report as read:", error)
      }
    }
  }

  const getViolationTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Korupsi: "bg-red-100 text-red-800",
      Penyuapan: "bg-orange-100 text-orange-800",
      "Pencucian Uang": "bg-purple-100 text-purple-800",
      "Pelanggaran Etika": "bg-blue-100 text-blue-800",
      Diskriminasi: "bg-green-100 text-green-800",
      "Keselamatan Kerja": "bg-yellow-100 text-yellow-800",
      Lainnya: "bg-gray-100 text-gray-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: "Calibri, sans-serif" }}>
                {t("admin.title")}
              </h1>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              <span>{t("admin.logout")}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t("admin.totalReports")}</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t("admin.readReports")}</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.filter((r) => r.isRead).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{t("admin.unreadReports")}</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.filter((r) => !r.isRead).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "Calibri, sans-serif" }}>{t("admin.reportsList")}</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t("admin.noReports")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                      !report.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getViolationTypeColor(report.violationType)}>{report.violationType}</Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            {report.reportCode}
                          </Badge>
                          {report.isRead ? (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>{t("admin.read")}</span>
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{t("admin.unread")}</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>{t("admin.location")}:</strong> {report.place}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>{t("admin.time")}:</strong> {report.time}
                        </p>
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
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleViewReport(report)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>{t("admin.view")}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Report Detail Modal */}
      {selectedReport && <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  )
}
