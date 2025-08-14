"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { addReport } from "@/lib/firebase-utils"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import {
  Loader2,
  Send,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  FileText,
  User,
  Phone,
  AlertTriangle,
} from "lucide-react"

interface FormData {
  includePersonalInfo: boolean
  personalInfo: {
    name: string
    email: string
    phone: string
  }
  allowContact: boolean
  contactInfo: {
    email: string
    phone: string
  }
  violatorInfo: {
    name: string
    position: string
    department: string
    location: string
  }
  violationType: string
  customViolationType: string
  place: string
  time: string
  description: string
}

const violationTypes = [
  "Korupsi",
  "Penyuapan",
  "Pencucian Uang",
  "Pelanggaran Etika",
  "Diskriminasi",
  "Keselamatan Kerja",
  "Lainnya",
]

export default function ReportForm() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [reportCode, setReportCode] = useState("")
  const formSectionRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<FormData>({
    includePersonalInfo: false,
    personalInfo: { name: "", email: "", phone: "" },
    allowContact: false,
    contactInfo: { email: "", phone: "" },
    violatorInfo: { name: "", position: "", department: "", location: "" },
    violationType: "",
    customViolationType: "",
    place: "",
    time: "",
    description: "",
  })

  useEffect(() => {
    if (formSectionRef.current && currentStep > 1) {
      formSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [currentStep])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const reportData: any = {
        includePersonalInfo: formData.includePersonalInfo,
        allowContact: formData.allowContact,
        violatorInfo: formData.violatorInfo,
        violationType: formData.violationType,
        place: formData.place,
        time: formData.time,
        description: formData.description,
      }

      // Only include personalInfo if user chose to include it
      if (formData.includePersonalInfo) {
        reportData.personalInfo = formData.personalInfo
      }

      // Only include contactInfo if user allows contact and didn't provide personal info
      if (formData.allowContact && !formData.includePersonalInfo) {
        reportData.contactInfo = formData.contactInfo
      }

      // Only include customViolationType if violation type is "Lainnya"
      if (formData.violationType === "Lainnya") {
        reportData.customViolationType = formData.customViolationType
      }

      const result = await addReport(reportData)

      setReportCode(result)
      setIsSubmitted(true)

      toast({
        title: "✅ Laporan Berhasil Dikirim!",
        description: `Kode laporan Anda: ${result}. Simpan kode ini untuk referensi.`,
      })
    } catch (error) {
      toast({
        title: "❌ Gagal Mengirim Laporan",
        description: "Terjadi kesalahan saat mengirim laporan. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      includePersonalInfo: false,
      personalInfo: { name: "", email: "", phone: "" },
      allowContact: false,
      contactInfo: { email: "", phone: "" },
      violatorInfo: { name: "", position: "", department: "", location: "" },
      violationType: "",
      customViolationType: "",
      place: "",
      time: "",
      description: "",
    })
    setCurrentStep(1)
    setIsSubmitted(false)
    setReportCode("")
  }

  const nextStep = () => {
    if (currentStep === 1 && formData.includePersonalInfo) {
      // Skip step 2 (contact permission) if personal info is provided
      setCurrentStep(3)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep === 3 && formData.includePersonalInfo) {
      // Go back to step 1 if we skipped step 2
      setCurrentStep(1)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
                <CheckCircle className="w-20 h-20 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Calibri, sans-serif" }}>
                  Laporan Berhasil Dikirim!
                </h2>
                <p className="text-green-100">Terima kasih atas keberanian Anda melaporkan pelanggaran</p>
              </div>

              <div className="p-8 text-center space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Kode Laporan Anda</h3>
                  <div className="text-2xl font-mono font-bold text-blue-600 bg-white p-4 rounded-lg border-2 border-blue-200">
                    {reportCode}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Simpan kode ini untuk referensi dan follow-up laporan Anda
                  </p>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Laporan Anda telah diterima dan akan diproses dengan kerahasiaan penuh</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span>Tim investigasi akan menindaklanjuti laporan dalam 3-5 hari kerja</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone className="w-5 h-5 text-purple-500" />
                    <span>Jika diperlukan, kami akan menghubungi Anda melalui kontak yang disediakan</span>
                  </div>
                </div>

                <Button
                  onClick={resetForm}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3"
                >
                  Buat Laporan Baru
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl border-0 overflow-hidden" ref={formSectionRef}>
          <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8">
            <CardTitle className="text-3xl text-center font-bold" style={{ fontFamily: "Calibri, sans-serif" }}>
              🛡️ Form Pelaporan Aman
            </CardTitle>
            <p className="text-center text-blue-100 mt-2">
              Laporkan pelanggaran dengan aman dan terjamin kerahasiaannya
            </p>

            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((step) => {
                  const isSkipped = step === 2 && formData.includePersonalInfo
                  const displayStep = isSkipped ? null : step

                  if (isSkipped) return null

                  return (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          step < currentStep
                            ? "bg-green-400 text-white"
                            : step === currentStep
                              ? "bg-white text-blue-600 ring-4 ring-blue-200"
                              : "bg-blue-300 text-blue-600"
                        }`}
                      >
                        {step < currentStep ? "✓" : step > 2 && formData.includePersonalInfo ? step - 1 : step}
                      </div>
                      {step < 5 && !isSkipped && (
                        <div
                          className={`w-8 h-1 mx-1 transition-colors duration-300 ${
                            step < currentStep ? "bg-green-400" : "bg-blue-300"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <User className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Calibri, sans-serif" }}>
                    Informasi Pribadi
                  </h3>
                  <p className="text-gray-600">Apakah Anda bersedia menyertakan identitas dalam laporan?</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <RadioGroup
                    value={formData.includePersonalInfo.toString()}
                    onValueChange={(value) => setFormData({ ...formData, includePersonalInfo: value === "true" })}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="true" id="yes-personal" className="peer sr-only" />
                      <Label
                        htmlFor="yes-personal"
                        className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all"
                      >
                        <Shield className="w-8 h-8 text-blue-500 mb-2" />
                        <span className="font-semibold">Ya, sertakan identitas</span>
                        <span className="text-sm text-gray-500 text-center mt-1">Membantu proses investigasi</span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="false" id="no-personal" className="peer sr-only" />
                      <Label
                        htmlFor="no-personal"
                        className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-50 transition-all"
                      >
                        <AlertTriangle className="w-8 h-8 text-green-500 mb-2" />
                        <span className="font-semibold">Tidak, tetap anonim</span>
                        <span className="text-sm text-gray-500 text-center mt-1">
                          Identitas sepenuhnya dirahasiakan
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.includePersonalInfo && (
                    <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-4">📝 Informasi Identitas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Nama Lengkap
                          </Label>
                          <Input
                            id="name"
                            value={formData.personalInfo.name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personalInfo: { ...formData.personalInfo, name: e.target.value },
                              })
                            }
                            placeholder="Masukkan nama lengkap"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="personal-email" className="text-sm font-medium text-gray-700">
                            Email
                          </Label>
                          <Input
                            id="personal-email"
                            type="email"
                            value={formData.personalInfo.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                personalInfo: { ...formData.personalInfo, email: e.target.value },
                              })
                            }
                            placeholder="nama@email.com"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="personal-phone" className="text-sm font-medium text-gray-700">
                          Nomor Telepon
                        </Label>
                        <Input
                          id="personal-phone"
                          value={formData.personalInfo.phone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              personalInfo: { ...formData.personalInfo, phone: e.target.value },
                            })
                          }
                          placeholder="08xxxxxxxxxx"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Contact Permission - Only show if personal info is NOT provided */}
            {currentStep === 2 && !formData.includePersonalInfo && (
              <div className="space-y-8">
                <div className="text-center">
                  <Phone className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Calibri, sans-serif" }}>
                    Izin Kontak
                  </h3>
                  <p className="text-gray-600">Bolehkah kami menghubungi Anda jika diperlukan klarifikasi?</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <RadioGroup
                    value={formData.allowContact.toString()}
                    onValueChange={(value) => setFormData({ ...formData, allowContact: value === "true" })}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="relative">
                      <RadioGroupItem value="true" id="yes-contact" className="peer sr-only" />
                      <Label
                        htmlFor="yes-contact"
                        className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-50 transition-all"
                      >
                        <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                        <span className="font-semibold">Ya, boleh dihubungi</span>
                        <span className="text-sm text-gray-500 text-center mt-1">
                          Untuk klarifikasi jika diperlukan
                        </span>
                      </Label>
                    </div>
                    <div className="relative">
                      <RadioGroupItem value="false" id="no-contact" className="peer sr-only" />
                      <Label
                        htmlFor="no-contact"
                        className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-red-50 peer-checked:border-red-500 peer-checked:bg-red-50 transition-all"
                      >
                        <Shield className="w-8 h-8 text-red-500 mb-2" />
                        <span className="font-semibold">Tidak, jangan hubungi</span>
                        <span className="text-sm text-gray-500 text-center mt-1">Proses tanpa kontak langsung</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.allowContact && (
                    <div className="space-y-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-4">📞 Informasi Kontak</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                            Email Kontak
                          </Label>
                          <Input
                            id="contact-email"
                            type="email"
                            value={formData.contactInfo.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactInfo: { ...formData.contactInfo, email: e.target.value },
                              })
                            }
                            placeholder="email@domain.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact-phone" className="text-sm font-medium text-gray-700">
                            Nomor WhatsApp
                          </Label>
                          <Input
                            id="contact-phone"
                            value={formData.contactInfo.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contactInfo: { ...formData.contactInfo, phone: e.target.value },
                              })
                            }
                            placeholder="08xxxxxxxxxx"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={prevStep} className="px-6 py-3 bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Violator Information */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <AlertTriangle className="w-16 h-16 mx-auto text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Calibri, sans-serif" }}>
                    Informasi Pelanggar
                  </h3>
                  <p className="text-gray-600">Berikan informasi tentang pihak yang melakukan pelanggaran</p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="violator-name" className="text-sm font-medium text-gray-700">
                        Nama Pelanggar <span className="text-gray-400">(jika diketahui)</span>
                      </Label>
                      <Input
                        id="violator-name"
                        value={formData.violatorInfo.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            violatorInfo: { ...formData.violatorInfo, name: e.target.value },
                          })
                        }
                        placeholder="Nama lengkap pelanggar"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="violator-position" className="text-sm font-medium text-gray-700">
                        Jabatan <span className="text-gray-400">(jika diketahui)</span>
                      </Label>
                      <Input
                        id="violator-position"
                        value={formData.violatorInfo.position}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            violatorInfo: { ...formData.violatorInfo, position: e.target.value },
                          })
                        }
                        placeholder="Jabatan dalam perusahaan"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="violator-department" className="text-sm font-medium text-gray-700">
                        Departemen/Divisi
                      </Label>
                      <Input
                        id="violator-department"
                        value={formData.violatorInfo.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            violatorInfo: { ...formData.violatorInfo, department: e.target.value },
                          })
                        }
                        placeholder="Departemen atau divisi"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="violator-location" className="text-sm font-medium text-gray-700">
                        Lokasi Kantor
                      </Label>
                      <Input
                        id="violator-location"
                        value={formData.violatorInfo.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            violatorInfo: { ...formData.violatorInfo, location: e.target.value },
                          })
                        }
                        placeholder="Lokasi atau cabang kantor"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={prevStep} className="px-6 py-3 bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Violation Details */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Calibri, sans-serif" }}>
                    Detail Pelanggaran
                  </h3>
                  <p className="text-gray-600">Jelaskan secara detail pelanggaran yang terjadi</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="violation-type" className="text-sm font-medium text-gray-700">
                      Jenis Pelanggaran
                    </Label>
                    <Select
                      value={formData.violationType}
                      onValueChange={(value) => setFormData({ ...formData, violationType: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih jenis pelanggaran" />
                      </SelectTrigger>
                      <SelectContent>
                        {violationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.violationType === "Lainnya" && (
                    <div className="space-y-2">
                      <Label htmlFor="custom-violation" className="text-sm font-medium text-gray-700">
                        Jelaskan Jenis Pelanggaran Lainnya
                      </Label>
                      <Input
                        id="custom-violation"
                        value={formData.customViolationType}
                        onChange={(e) => setFormData({ ...formData, customViolationType: e.target.value })}
                        placeholder="Sebutkan jenis pelanggaran yang dimaksud"
                        className="h-12"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="place" className="text-sm font-medium text-gray-700">
                        Tempat Kejadian
                      </Label>
                      <Input
                        id="place"
                        value={formData.place}
                        onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                        placeholder="Lokasi terjadinya pelanggaran"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                        Waktu Kejadian
                      </Label>
                      <Input
                        id="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        placeholder="Tanggal dan waktu kejadian"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Keterangan Detail
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Jelaskan secara detail kronologi pelanggaran yang terjadi, siapa saja yang terlibat, dampak yang ditimbulkan, dan bukti-bukti yang ada..."
                      rows={8}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={prevStep} className="px-6 py-3 bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Calibri, sans-serif" }}>
                    Konfirmasi Laporan
                  </h3>
                  <p className="text-gray-600">Periksa kembali informasi yang akan dikirim</p>
                </div>

                <div className="max-w-3xl mx-auto">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Jenis Pelanggaran</span>
                          <p className="text-lg font-semibold text-gray-800">
                            {formData.violationType}
                            {formData.violationType === "Lainnya" && formData.customViolationType && (
                              <span className="text-base font-normal"> - {formData.customViolationType}</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Tempat Kejadian</span>
                          <p className="text-lg font-semibold text-gray-800">{formData.place}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Waktu Kejadian</span>
                          <p className="text-lg font-semibold text-gray-800">{formData.time}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {formData.includePersonalInfo && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Pelapor</span>
                            <p className="text-lg font-semibold text-gray-800">{formData.personalInfo.name}</p>
                          </div>
                        )}
                        {formData.violatorInfo.name && (
                          <div>
                            <span className="text-sm font-medium text-gray-500">Pelanggar</span>
                            <p className="text-lg font-semibold text-gray-800">{formData.violatorInfo.name}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-gray-500">Status Identitas</span>
                          <p className="text-lg font-semibold text-gray-800">
                            {formData.includePersonalInfo ? "Dengan Identitas" : "Anonim"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">Keterangan</span>
                      <p className="text-gray-800 mt-1 leading-relaxed">{formData.description}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-6 bg-yellow-50 rounded-xl border border-yellow-200 mt-6">
                    <Checkbox id="confirm" className="mt-1" />
                    <Label htmlFor="confirm" className="text-sm leading-relaxed">
                      Saya menyatakan bahwa informasi yang saya berikan adalah benar dan dapat dipertanggungjawabkan.
                      Saya memahami bahwa laporan palsu dapat dikenakan sanksi sesuai peraturan yang berlaku.
                    </Label>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button variant="outline" onClick={prevStep} className="px-6 py-3 bg-transparent">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Mengirim Laporan...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Laporan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
