"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Timestamp } from "firebase/firestore"
import {
  getEmployees,
  approveEmployee,
  deleteEmployee,
  addSanction,
  getSanctions,
  type Employee,
  type Sanction,
  type ReportData,
} from "@/lib/firebase-utils"
import {
  Crown,
  CheckCircle,
  Clock,
  Gavel,
  Users,
  AlertTriangle,
  Calendar,
  Award,
  Loader2,
  UserCheck,
  Ban,
  X,
} from "lucide-react"

interface LeadershipFeaturesProps {
  reports: ReportData[]
  onReportUpdate: () => void
}

const sanctionTypes = [
  "Teguran Lisan",
  "Teguran Tertulis",
  "Skorsing",
  "Pemotongan Gaji",
  "Demosi Jabatan",
  "Pemutusan Hubungan Kerja",
]

export default function LeadershipFeatures({ reports, onReportUpdate }: LeadershipFeaturesProps) {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [sanctions, setSanctions] = useState<Sanction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [isSanctionDialogOpen, setIsSanctionDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // State for reject confirmation dialog
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isRejecting, setIsRejecting] = useState(false)

  const [sanctionForm, setSanctionForm] = useState({
    sanctionType: "",
    duration: "",
    description: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [employeesData, sanctionsData] = await Promise.all([getEmployees(), getSanctions()])
      setEmployees(employeesData)
      setSanctions(sanctionsData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveEmployee = async (employeeId: string) => {
    try {
      await approveEmployee(employeeId, "pimpinan@elnusa.com")
      toast({
        title: "Berhasil",
        description: "Pegawai berhasil disetujui",
      })
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyetujui pegawai",
        variant: "destructive",
      })
    }
  }

  const handleOpenRejectDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsRejectDialogOpen(true)
  }

  const handleCloseRejectDialog = () => {
    setIsRejectDialogOpen(false)
    setSelectedEmployee(null)
  }

  const handleRejectEmployee = async () => {
    if (!selectedEmployee?.id) return

    setIsRejecting(true)
    try {
      await deleteEmployee(selectedEmployee.id)
      toast({
        title: "Berhasil",
        description: `Pegawai ${selectedEmployee.name} berhasil ditolak dan dihapus dari sistem`,
      })
      handleCloseRejectDialog()
      loadData()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menolak pegawai",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(false)
    }
  }

  const handleOpenSanctionDialog = (report: ReportData) => {
    console.log("[v0] Opening sanction dialog for report:", report.reportCode)
    setSelectedReport(report)
    setSanctionForm({ sanctionType: "", duration: "", description: "" })
    setIsSanctionDialogOpen(true)
  }

  const handleCloseSanctionDialog = () => {
    console.log("[v0] Closing sanction dialog")
    setIsSanctionDialogOpen(false)
    setSelectedReport(null)
    setSanctionForm({ sanctionType: "", duration: "", description: "" })
  }

  const handleCreateSanction = async () => {
    console.log("[v0] Creating sanction with form data:", sanctionForm)
    console.log("[v0] Selected report:", selectedReport)

    if (!selectedReport || !sanctionForm.sanctionType || !sanctionForm.duration) {
      console.log("[v0] Validation failed - missing required fields")
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    if (!selectedReport.violatorInfo.nip) {
      console.log("[v0] Validation failed - missing violator NIP")
      toast({
        title: "Error",
        description: "Data NIP pelanggar tidak tersedia",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(startDate.getDate() + Number.parseInt(sanctionForm.duration))

      console.log("[v0] Attempting to add sanction...")

      await addSanction({
        reportId: selectedReport.id!,
        reportCode: selectedReport.reportCode,
        employeeNip: selectedReport.violatorInfo.nip,
        employeeName: selectedReport.violatorInfo.name,
        violationType: selectedReport.violationType,
        sanctionType: sanctionForm.sanctionType,
        duration: Number.parseInt(sanctionForm.duration),
        description: sanctionForm.description,
        approvedBy: "pimpinan@elnusa.com",
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
      })

      console.log("[v0] Sanction added successfully")

      toast({
        title: "Berhasil",
        description: "Sanksi berhasil diberikan",
      })

      handleCloseSanctionDialog()
      await loadData()
      onReportUpdate()
    } catch (error) {
      console.error("[v0] Error creating sanction:", error)
      toast({
        title: "Error",
        description: "Gagal memberikan sanksi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const pendingEmployees = employees.filter((emp) => !emp.isApproved)
  const reportsWithViolators = reports.filter((report) => report.violatorInfo.nip)
  const activeSanctions = sanctions.filter((sanction) => sanction.isActive)
  const expiredSanctions = sanctions.filter((sanction) => sanction.isExpired)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Leadership Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-700">Fitur Pimpinan</p>
                <p className="text-2xl font-bold text-purple-900">Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pegawai Menunggu</p>
                <p className="text-2xl font-bold text-gray-900">{pendingEmployees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Gavel className="w-8 h-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sanksi Aktif</p>
                <p className="text-2xl font-bold text-gray-900">{activeSanctions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sanksi Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{expiredSanctions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Employee Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{ fontFamily: "Calibri, sans-serif" }}>
            <UserCheck className="w-5 h-5" />
            <span>Persetujuan Pegawai Baru ({pendingEmployees.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada pegawai yang menunggu persetujuan</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEmployees.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Menunggu Persetujuan</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <p>
                          <strong>NIP:</strong> {employee.nip}
                        </p>
                        <p>
                          <strong>Divisi:</strong> {employee.division}
                        </p>
                        <p>
                          <strong>Tanggal Lahir:</strong> {new Date(employee.birthDate).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleOpenRejectDialog(employee)}
                        variant="destructive"
                        className="flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Tolak</span>
                      </Button>
                      <Button
                        onClick={() => handleApproveEmployee(employee.id!)}
                        className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Setujui</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Employee Confirmation Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Konfirmasi Penolakan</span>
            </DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 mb-2">
                  <strong>Apakah Anda yakin ingin menolak pegawai berikut?</strong>
                </p>
                <div className="space-y-1 text-sm">
                  <p><strong>Nama:</strong> {selectedEmployee.name}</p>
                  <p><strong>NIP:</strong> {selectedEmployee.nip}</p>
                  <p><strong>Divisi:</strong> {selectedEmployee.division}</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Perhatian:</strong> Data pegawai akan dihapus permanen dari sistem dan tidak dapat dikembalikan.
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handleCloseRejectDialog}
                  disabled={isRejecting}
                >
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectEmployee}
                  disabled={isRejecting}
                  className="flex items-center space-x-2"
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menolak...</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      <span>Ya, Tolak</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Sanctions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{ fontFamily: "Calibri, sans-serif" }}>
            <Gavel className="w-5 h-5" />
            <span>Pemberian Sanksi Pelanggaran</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportsWithViolators.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada laporan dengan data pelanggar yang lengkap</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reportsWithViolators.slice(0, 5).map((report) => {
                const existingSanction = sanctions.find((s) => s.reportId === report.id)
                return (
                  <div key={report.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className="bg-red-100 text-red-800">{report.violationType}</Badge>
                          <Badge variant="outline" className="font-mono text-xs">
                            {report.reportCode}
                          </Badge>
                          {existingSanction && (
                            <Badge
                              className={
                                existingSanction.isActive
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {existingSanction.isActive ? "Sanksi Aktif" : "Sanksi Selesai"}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>
                            <strong>Pelanggar:</strong> {report.violatorInfo.name}
                          </p>
                          <p>
                            <strong>NIP:</strong> {report.violatorInfo.nip}
                          </p>
                          <p>
                            <strong>Lokasi:</strong> {report.place}
                          </p>
                          <p>
                            <strong>Waktu:</strong> {report.time}
                          </p>
                        </div>
                      </div>
                      {!existingSanction && (
                        <Button
                          onClick={() => handleOpenSanctionDialog(report)}
                          className="bg-red-600 hover:bg-red-700 flex items-center space-x-2"
                        >
                          <Gavel className="w-4 h-4" />
                          <span>Beri Sanksi</span>
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sanction Dialog */}
      <Dialog open={isSanctionDialogOpen} onOpenChange={setIsSanctionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pemberian Sanksi</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Pelanggar:</strong> {selectedReport.violatorInfo.name}
                </p>
                <p className="text-sm">
                  <strong>NIP:</strong> {selectedReport.violatorInfo.nip}
                </p>
                <p className="text-sm">
                  <strong>Pelanggaran:</strong> {selectedReport.violationType}
                </p>
              </div>

              <div>
                <Label>Jenis Sanksi</Label>
                <Select
                  value={sanctionForm.sanctionType}
                  onValueChange={(value) => setSanctionForm({ ...sanctionForm, sanctionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis sanksi" />
                  </SelectTrigger>
                  <SelectContent>
                    {sanctionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Durasi (hari)</Label>
                <Input
                  type="number"
                  value={sanctionForm.duration}
                  onChange={(e) => setSanctionForm({ ...sanctionForm, duration: e.target.value })}
                  placeholder="Masukkan durasi dalam hari"
                  min="1"
                  max="365"
                />
              </div>

              <div>
                <Label>Keterangan</Label>
                <Textarea
                  value={sanctionForm.description}
                  onChange={(e) => setSanctionForm({ ...sanctionForm, description: e.target.value })}
                  placeholder="Keterangan tambahan tentang sanksi"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCloseSanctionDialog} disabled={isSubmitting}>
                  Batal
                </Button>
                <Button
                  onClick={handleCreateSanction}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting || !sanctionForm.sanctionType || !sanctionForm.duration}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Memproses...
                    </>
                  ) : (
                    "Berikan Sanksi"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Active Sanctions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{ fontFamily: "Calibri, sans-serif" }}>
            <Ban className="w-5 h-5" />
            <span>Sanksi Aktif ({activeSanctions.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSanctions.length === 0 ? (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada sanksi yang sedang aktif</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSanctions.map((sanction) => (
                <div key={sanction.id} className="border rounded-lg p-4 bg-red-50 border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{sanction.employeeName}</h3>
                        <Badge className="bg-red-100 text-red-800">{sanction.sanctionType}</Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {sanction.reportCode}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <p>
                          <strong>NIP:</strong> {sanction.employeeNip}
                        </p>
                        <p>
                          <strong>Pelanggaran:</strong> {sanction.violationType}
                        </p>
                        <p>
                          <strong>Durasi:</strong> {sanction.duration} hari
                        </p>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <strong>Mulai:</strong> {sanction.startDate.toDate().toLocaleDateString("id-ID")}
                        </p>
                        <p>
                          <strong>Berakhir:</strong> {sanction.endDate.toDate().toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      {sanction.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Keterangan:</strong> {sanction.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-medium text-red-600">
                        {Math.ceil((sanction.endDate.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24))} hari
                        lagi
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}