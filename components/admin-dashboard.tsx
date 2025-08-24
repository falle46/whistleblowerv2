"use client"

import { useState, useEffect } from "react"
import { getReports, markReportAsRead, type ReportData } from "@/lib/firebase-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import {
  LogOut,
  Eye,
  FileText,
  Clock,
  CheckCircle,
  Loader2,
  Search,
  Filter,
  Calendar,
  X,
  Users,
  Crown,
} from "lucide-react"
import ReportDetailModal from "@/components/report-detail-modal"
import EmployeeManagement from "@/components/employee-management"
import LeadershipFeatures from "@/components/leadership-features"

const violationTypes = [
  "Korupsi",
  "Penyuapan",
  "Pencucian Uang",
  "Pelanggaran Etika",
  "Diskriminasi",
  "Keselamatan Kerja",
  "Lainnya",
]

export default function AdminDashboard() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [reports, setReports] = useState<ReportData[]>([])
  const [filteredReports, setFilteredReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedViolationType, setSelectedViolationType] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const userRole = typeof window !== "undefined" ? localStorage.getItem("adminRole") : null
  const isLeadership = userRole === "leadership"

  useEffect(() => {
    loadReports()
  }, [])

  useEffect(() => {
    filterReports()
  }, [reports, searchTerm, selectedViolationType, dateFrom, dateTo, statusFilter])

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

  const filterReports = () => {
    let filtered = [...reports]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.reportCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.violatorInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.violatorInfo.nip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.place.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Violation type filter
    if (selectedViolationType !== "all") {
      filtered = filtered.filter((report) => report.violationType === selectedViolationType)
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      filtered = filtered.filter((report) => {
        const reportDate = report.createdAt?.toDate()
        return reportDate && reportDate >= fromDate
      })
    }

    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter((report) => {
        const reportDate = report.createdAt?.toDate()
        return reportDate && reportDate <= toDate
      })
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => (statusFilter === "read" ? report.isRead : !report.isRead))
    }

    setFilteredReports(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedViolationType("all")
    setDateFrom("")
    setDateTo("")
    setStatusFilter("all")
  }

  const handleLogout = async () => {
    try {
      localStorage.removeItem("adminLoggedIn")
      localStorage.removeItem("adminEmail")
      localStorage.removeItem("adminRole")
      window.location.reload()
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari sistem",
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
              {isLeadership ? (
                <Crown className="w-8 h-8 text-purple-600 mr-3" />
              ) : (
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
              )}
              <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: "Calibri, sans-serif" }}>
                {isLeadership ? "Dashboard Pimpinan" : "Admin Dashboard"} - Sistem Whistleblower
              </h1>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className={`grid w-full ${isLeadership ? "grid-cols-3" : "grid-cols-2"}`}>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Laporan Pelanggaran</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Manajemen Pegawai</span>
            </TabsTrigger>
            {isLeadership && (
              <TabsTrigger value="leadership" className="flex items-center space-x-2">
                <Crown className="w-4 h-4" />
                <span>Fitur Pimpinan</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Laporan</p>
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
                      <p className="text-sm font-medium text-gray-600">Sudah Dibaca</p>
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
                      <p className="text-sm font-medium text-gray-600">Belum Dibaca</p>
                      <p className="text-2xl font-bold text-gray-900">{reports.filter((r) => !r.isRead).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Filter className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Hasil Filter</p>
                      <p className="text-2xl font-bold text-gray-900">{filteredReports.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" style={{ fontFamily: "Calibri, sans-serif" }}>
                  <Filter className="w-5 h-5" />
                  <span>Filter & Pencarian Laporan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari kode, nama, NIP, lokasi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Violation Type Filter */}
                  <Select value={selectedViolationType} onValueChange={setSelectedViolationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Jenis Pelanggaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      {violationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Date From */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      placeholder="Dari Tanggal"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Date To */}
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      placeholder="Sampai Tanggal"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status Baca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="read">Sudah Dibaca</SelectItem>
                      <SelectItem value="unread">Belum Dibaca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <X className="w-4 h-4" />
                    <span>Hapus Filter</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <Card>
              <CardHeader>
                <CardTitle style={{ fontFamily: "Calibri, sans-serif" }}>
                  Daftar Laporan ({filteredReports.length} dari {reports.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {reports.length === 0 ? "Belum ada laporan" : "Tidak ada laporan yang sesuai dengan filter"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${
                          !report.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Badge className={getViolationTypeColor(report.violationType)}>
                                {report.violationType}
                              </Badge>
                              <Badge variant="outline" className="font-mono text-xs">
                                {report.reportCode}
                              </Badge>
                              {report.isRead ? (
                                <Badge variant="secondary" className="flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Sudah Dibaca</span>
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>Belum Dibaca</span>
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <p>
                                <strong>Lokasi:</strong> {report.place}
                              </p>
                              <p>
                                <strong>Waktu:</strong> {report.time}
                              </p>
                              {report.violatorInfo.name && (
                                <p>
                                  <strong>Pelanggar:</strong> {report.violatorInfo.name}
                                </p>
                              )}
                              {report.violatorInfo.nip && (
                                <p>
                                  <strong>NIP:</strong> {report.violatorInfo.nip}
                                </p>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Tanggal Laporan:</strong>{" "}
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
                              <span>Lihat</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManagement />
          </TabsContent>

          {isLeadership && (
            <TabsContent value="leadership">
              <LeadershipFeatures reports={reports} onReportUpdate={loadReports} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Report Detail Modal */}
      {selectedReport && <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  )
}
