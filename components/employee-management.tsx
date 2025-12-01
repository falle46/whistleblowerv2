"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, type Employee } from "@/lib/firebase-utils"
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Building,
  Award as IdCard,
  CheckCircle,
  Clock,
  Loader2,
  Eye,
} from "lucide-react"

const divisions = [
  "Human Resources",
  "Finance & Accounting",
  "Operations",
  "Engineering",
  "Marketing",
  "IT & Technology",
  "Legal & Compliance",
  "Business Development",
  "Quality Assurance",
  "Procurement",
]

// Menambahkan interface props untuk menerima userRole
interface EmployeeManagementProps {
  userRole?: "admin" | "pimpinan" | string;
}

export default function EmployeeManagement({ userRole = "admin" }: EmployeeManagementProps) {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDivision, setSelectedDivision] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    nip: "",
    birthDate: "",
    division: "",
  })

  // Cek apakah user adalah pimpinan (untuk mempersingkat logic di return)
  const isPimpinan = userRole === "pimpinan";

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    filterEmployees()
  }, [employees, searchTerm, selectedDivision, statusFilter])

  const loadEmployees = async () => {
    try {
      const employeesData = await getEmployees()
      setEmployees(employeesData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pegawai",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterEmployees = () => {
    let filtered = [...employees]

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.division.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDivision !== "all") {
      filtered = filtered.filter((employee) => employee.division === selectedDivision)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((employee) =>
        statusFilter === "approved" ? employee.isApproved : !employee.isApproved,
      )
    }

    setFilteredEmployees(filtered)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      nip: "",
      birthDate: "",
      division: "",
    })
    setEditingEmployee(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.nip || !formData.birthDate || !formData.division) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id!, formData)
        toast({
          title: "Berhasil",
          description: "Data pegawai berhasil diperbarui",
        })
      } else {
        await addEmployee(formData)
        toast({
          title: "Berhasil",
          description: "Pegawai baru berhasil ditambahkan",
        })
      }

      resetForm()
      setIsAddDialogOpen(false)
      await loadEmployees()
    } catch (error) {
      console.error("[v0] Error saving employee:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan data pegawai",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee)
    setFormData({
      name: employee.name,
      nip: employee.nip,
      birthDate: employee.birthDate,
      division: employee.division,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (employeeId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pegawai ini?")) return

    try {
      await deleteEmployee(employeeId)
      toast({
        title: "Berhasil",
        description: "Pegawai berhasil dihapus",
      })
      loadEmployees()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pegawai",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pegawai</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Disetujui</p>
                <p className="text-2xl font-bold text-gray-900">{employees.filter((e) => e.isApproved).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menunggu Persetujuan</p>
                <p className="text-2xl font-bold text-gray-900">{employees.filter((e) => !e.isApproved).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2" style={{ fontFamily: "Calibri, sans-serif" }}>
              <Users className="w-5 h-5" />
              <span>Manajemen Pegawai</span>
            </CardTitle>

            {/* REVISI: Tombol Tambah hanya muncul jika BUKAN pimpinan */}
            {!isPimpinan && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Pegawai</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingEmployee ? "Edit Pegawai" : "Tambah Pegawai Baru"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nip">NIP</Label>
                      <Input
                        id="nip"
                        value={formData.nip}
                        onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                        placeholder="Nomor Induk Pegawai"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Tanggal Lahir</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="division">Divisi</Label>
                      <Select
                        value={formData.division}
                        onValueChange={(value) => setFormData({ ...formData, division: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih divisi" />
                        </SelectTrigger>
                        <SelectContent>
                          {divisions.map((division) => (
                            <SelectItem key={division} value={division}>
                              {division}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading || !formData.name || !formData.nip || !formData.birthDate || !formData.division}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            {editingEmployee ? "Memperbarui..." : "Menambahkan..."}
                          </>
                        ) : editingEmployee ? (
                          "Perbarui"
                        ) : (
                          "Tambah"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari nama, NIP, divisi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Divisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Divisi</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division} value={division}>
                    {division}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="pending">Menunggu Persetujuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employee List */}
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {employees.length === 0 ? "Belum ada data pegawai" : "Tidak ada pegawai yang sesuai dengan filter"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{employee.name}</h3>
                        {employee.isApproved ? (
                          <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Disetujui</span>
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Menunggu Persetujuan</span>
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <IdCard className="w-4 h-4" />
                          <span>NIP: {employee.nip}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Lahir: {new Date(employee.birthDate).toLocaleDateString("id-ID")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4" />
                          <span>{employee.division}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Ditambahkan:{" "}
                        {employee.createdAt?.toDate().toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    
                    {/* REVISI: Tombol Aksi - Disembunyikan untuk Pimpinan */}
                    <div className="flex space-x-2">
                      {!isPimpinan ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(employee)}
                            className="flex items-center space-x-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(employee.id!)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Hapus</span>
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center text-gray-400 bg-gray-50 px-3 py-1 rounded-full text-xs border">
                           <Eye className="w-3 h-3 mr-1"/>
                           View Only
                        </div>
                      )}
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