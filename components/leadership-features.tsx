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
  Search,
  FileText, // Import Icon baru
} from "lucide-react"

// Import Modal Detail Laporan
import ReportDetailModal from "@/components/report-detail-modal"

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
  "Investigasi Lanjut",
]

export default function LeadershipFeatures({ reports, onReportUpdate }: LeadershipFeaturesProps) {
  const { toast } = useToast()
  
  // Data Master
  const [employees, setEmployees] = useState<Employee[]>([])
  const [sanctions, setSanctions] = useState<Sanction[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal States
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [isSanctionDialogOpen, setIsSanctionDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // NEW: Detail Modal State inside Sanction
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  
  // Reject Dialog States
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [selectedEmployeeForReject, setSelectedEmployeeForReject] = useState<Employee | null>(null)
  const [isRejecting, setIsRejecting] = useState(false)

  // Sanction Form Logic States
  const [sanctionForm, setSanctionForm] = useState({
    sanctionType: "",
    description: "",
    startDate: "",
    endDate: "",
  })
  
  // Search & Target Logic
  const [searchQuery, setSearchQuery] = useState("")
  const [targetEmployee, setTargetEmployee] = useState<Employee | null>(null)
  const [isUnknownViolator, setIsUnknownViolator] = useState(false)

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

  // Logic Filter Pencarian Pegawai
  const filteredEmployeesForSearch = employees.filter(emp => 
    (emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.nip.includes(searchQuery)) &&
    emp.isApproved 
  );

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
    setSelectedEmployeeForReject(employee)
    setIsRejectDialogOpen(true)
  }

  const handleCloseRejectDialog = () => {
    setIsRejectDialogOpen(false)
    setSelectedEmployeeForReject(null)
  }

  const handleRejectEmployee = async () => {
    if (!selectedEmployeeForReject?.id) return

    setIsRejecting(true)
    try {
      await deleteEmployee(selectedEmployeeForReject.id)
      toast({
        title: "Berhasil",
        description: `Pegawai ${selectedEmployeeForReject.name} berhasil ditolak dan dihapus dari sistem`,
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
    setSelectedReport(report)
    
    // Reset Form
    setSanctionForm({ sanctionType: "", description: "", startDate: "", endDate: "" })
    setSearchQuery("")
    setIsUnknownViolator(false)

    // Auto-match pegawai berdasarkan NIP
    if (report.violatorInfo.nip) {
        const found = employees.find(e => e.nip === report.violatorInfo.nip);
        if (found) {
            setTargetEmployee(found);
        } else {
            setTargetEmployee(null);
        }
    } else {
        setTargetEmployee(null);
    }

    setIsSanctionDialogOpen(true)
  }

  const handleCloseSanctionDialog = () => {
    setIsSanctionDialogOpen(false)
    setSelectedReport(null)
    setSanctionForm({ sanctionType: "", description: "", startDate: "", endDate: "" })
    setTargetEmployee(null)
  }

  const handleCreateSanction = async () => {
    if (!selectedReport) return;

    if (!isUnknownViolator && !targetEmployee) {
        toast({ title: "Error", description: "Harap pilih pegawai atau centang 'Pelaku Tidak Diketahui'", variant: "destructive" });
        return;
    }

    if (!sanctionForm.sanctionType || !sanctionForm.startDate || !sanctionForm.endDate) {
      toast({ title: "Error", description: "Mohon lengkapi jenis sanksi dan tanggal", variant: "destructive" });
      return
    }

    setIsSubmitting(true)

    try {
      const start = new Date(sanctionForm.startDate);
      const end = new Date(sanctionForm.endDate);

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      let finalNip = "";
      let finalName = "";

      if (isUnknownViolator) {
          finalNip = "UNKNOWN";
          finalName = "Tidak Diketahui / Non-Pegawai";
      } else if (targetEmployee) {
          finalNip = targetEmployee.nip;
          finalName = targetEmployee.name;
      }

      await addSanction({
        reportId: selectedReport.id!,
        reportCode: selectedReport.reportCode,
        employeeNip: finalNip,
        employeeName: finalName,
        violationType: selectedReport.violationType,
        sanctionType: sanctionForm.sanctionType,
        duration: durationDays,
        description: sanctionForm.description,
        approvedBy: "pimpinan@elnusa.com",
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
      })

      toast({
        title: "Berhasil",
        description: isUnknownViolator ? "Status kasus diubah menjadi Diselidiki" : "Sanksi berhasil diberikan",
      })

      handleCloseSanctionDialog()
      await loadData()
      onReportUpdate()
    } catch (error) {
      console.error("[v0] Error creating sanction:", error)
      toast({
        title: "Error",
        description: "Gagal memproses aksi",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const pendingEmployees = employees.filter((emp) => !emp.isApproved)
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
                        <p><strong>NIP:</strong> {employee.nip}</p>
                        <p><strong>Divisi:</strong> {employee.division}</p>
                        <p><strong>Lahir:</strong> {new Date(employee.birthDate).toLocaleDateString("id-ID")}</p>
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

      {/* Reject Confirmation Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Konfirmasi Penolakan</span>
            </DialogTitle>
          </DialogHeader>
          {selectedEmployeeForReject && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 mb-2">
                  <strong>Apakah Anda yakin ingin menolak pegawai berikut?</strong>
                </p>
                <div className="space-y-1 text-sm">
                  <p><strong>Nama:</strong> {selectedEmployeeForReject.name}</p>
                  <p><strong>NIP:</strong> {selectedEmployeeForReject.nip}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCloseRejectDialog} disabled={isRejecting}>Batal</Button>
                <Button variant="destructive" onClick={handleRejectEmployee} disabled={isRejecting}>
                  {isRejecting ? "Menolak..." : "Ya, Tolak"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Sanctions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2" style={{ fontFamily: "Calibri, sans-serif" }}>
            <Gavel className="w-5 h-5" />
            <span>Tindakan & Sanksi Laporan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada laporan masuk</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.slice(0, 5).map((report) => {
                const existingSanction = sanctions.find((s) => s.reportId === report.id)
                return (
                  <div key={report.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className="bg-red-100 text-red-800">{report.violationType}</Badge>
                          <Badge variant="outline" className="font-mono text-xs">{report.reportCode}</Badge>
                          {existingSanction && (
                            <Badge className={existingSanction.isActive ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"}>
                              {existingSanction.isActive ? "Sanksi Aktif" : "Sanksi Selesai"}
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <p><strong>Terlapor (Awal):</strong> {report.violatorInfo.name || "Tidak diketahui"}</p>
                          <p><strong>Lokasi:</strong> {report.place}</p>
                        </div>
                      </div>
                      {!existingSanction && (
                        <Button
                          onClick={() => handleOpenSanctionDialog(report)}
                          className="bg-red-600 hover:bg-red-700 flex items-center space-x-2"
                        >
                          <Gavel className="w-4 h-4" />
                          <span>Beri Aksi</span>
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
        <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Beri Aksi / Sanksi</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              
              {/* --- INFO LAPORAN RINGKAS & TOMBOL DETAIL --- */}
              <div className="bg-gray-50 p-3 rounded-md border relative">
                <div className="pr-24"> {/* Padding kanan agar text tidak tertutup tombol */}
                    <p className="text-sm"><strong>Laporan:</strong> {selectedReport.reportCode}</p>
                    <p className="text-sm"><strong>Pelanggaran:</strong> {selectedReport.violationType}</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedReport.description.substring(0, 60)}...</p>
                </div>
                {/* Tombol Lihat Detail */}
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute top-3 right-3 h-8 text-xs bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => setIsDetailModalOpen(true)}
                >
                    <FileText className="w-3 h-3 mr-1" />
                    Lihat Detail
                </Button>
              </div>

              {/* 1. Bagian Target Pelanggar */}
              <div className="border-t pt-2">
                <Label className="mb-2 block font-bold">Target Pelanggar</Label>
                
                {/* Checkbox Unknown */}
                <div className="flex items-center mb-3">
                    <input 
                        type="checkbox"
                        id="unknownCheck"
                        checked={isUnknownViolator}
                        onChange={(e) => {
                            setIsUnknownViolator(e.target.checked);
                            if(e.target.checked) {
                                setTargetEmployee(null);
                                setSearchQuery("");
                            }
                        }}
                        className="mr-2 h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor="unknownCheck" className="text-sm text-gray-700 cursor-pointer select-none">
                        Pelaku Tidak Diketahui / Non-Pegawai
                    </label>
                </div>

                {/* Search Input */}
                {!isUnknownViolator && (
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Cari Pegawai (Nama / NIP)..." 
                                value={targetEmployee ? targetEmployee.name : searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setTargetEmployee(null);
                                }}
                                className="pl-8"
                            />
                            {targetEmployee && (
                                <button 
                                    onClick={() => {
                                        setTargetEmployee(null);
                                        setSearchQuery("");
                                    }}
                                    className="absolute right-2 top-2.5 hover:text-red-500"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Dropdown Result List */}
                        {searchQuery && !targetEmployee && (
                            <div className="absolute w-full z-10 bg-white border rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
                                {filteredEmployeesForSearch.length > 0 ? (
                                    filteredEmployeesForSearch.map(emp => (
                                        <div 
                                            key={emp.id}
                                            className="p-2 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                                            onClick={() => {
                                                setTargetEmployee(emp);
                                                setSearchQuery("");
                                            }}
                                        >
                                            <p className="font-semibold text-sm">{emp.name}</p>
                                            <p className="text-xs text-gray-500">{emp.nip} - {emp.division}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 text-sm text-gray-500 text-center">
                                        Pegawai tidak ditemukan
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {targetEmployee && (
                             <div className="mt-2 text-xs text-green-700 flex items-center bg-green-50 p-1 rounded">
                                <CheckCircle className="w-3 h-3 mr-1"/>
                                Terpilih: {targetEmployee.name} ({targetEmployee.nip})
                             </div>
                        )}
                    </div>
                )}
              </div>

              {/* 2. Jenis Sanksi */}
              <div>
                <Label>Jenis Aksi / Sanksi</Label>
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

              {/* 3. Date Picker (Start & End) */}
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tanggal Mulai</Label>
                    <Input
                        type="date"
                        value={sanctionForm.startDate}
                        onChange={(e) => setSanctionForm({ ...sanctionForm, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Tanggal Selesai</Label>
                    <Input
                        type="date"
                        value={sanctionForm.endDate}
                        onChange={(e) => setSanctionForm({ ...sanctionForm, endDate: e.target.value })}
                    />
                  </div>
              </div>

              {/* 4. Keterangan */}
              <div>
                <Label>Keterangan Tambahan</Label>
                <Textarea
                  value={sanctionForm.description}
                  onChange={(e) => setSanctionForm({ ...sanctionForm, description: e.target.value })}
                  placeholder="Detail alasan sanksi..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" onClick={handleCloseSanctionDialog} disabled={isSubmitting}>
                  Batal
                </Button>
                <Button
                  onClick={handleCreateSanction}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isSubmitting || !sanctionForm.sanctionType || (!targetEmployee && !isUnknownViolator)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Memproses...
                    </>
                  ) : (
                    "Konfirmasi Sanksi"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* --- Detail Modal (Rendered on top if open) --- */}
      {isDetailModalOpen && selectedReport && (
        <ReportDetailModal 
            report={selectedReport} 
            onClose={() => setIsDetailModalOpen(false)} 
        />
      )}

      {/* Active Sanctions List */}
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
                        <p><strong>NIP:</strong> {sanction.employeeNip}</p>
                        <p><strong>Pelanggaran:</strong> {sanction.violationType}</p>
                        <p><strong>Durasi:</strong> {sanction.duration} hari</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Periode:</strong> {sanction.startDate.toDate().toLocaleDateString("id-ID")} s/d {sanction.endDate.toDate().toLocaleDateString("id-ID")}</p>
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
                        {Math.ceil((sanction.endDate.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24))} hari lagi
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