"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, Shield, Lock, Eye, EyeOff, Building2, UserCheck } from "lucide-react"

export default function AdminLogin() {
  const { toast } = useToast()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (formData.email === "adminelnusa@elnusa.com" && formData.password === "adminadmin") {
        // Store admin session in localStorage
        localStorage.setItem("adminLoggedIn", "true")
        localStorage.setItem("adminEmail", formData.email)

        toast({
          title: "Login Berhasil",
          description: "Selamat datang di dashboard admin",
        })

        // Trigger a page refresh or state update to show dashboard
        window.location.reload()
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: "Email atau password salah. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <Lock className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Calibri, sans-serif" }}>
            Admin Portal
          </h1>
          <p className="text-blue-200 text-lg">Elnusa Whistleblower System</p>
          <div className="flex items-center justify-center space-x-2 mt-3 text-blue-300">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">Secure Access Dashboard</span>
          </div>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-lg bg-white/10 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 text-white p-8 backdrop-blur-sm">
            <CardTitle className="text-center flex items-center justify-center space-x-3 text-xl">
              <UserCheck className="w-6 h-6" />
              <span>{t("admin.login")}</span>
            </CardTitle>
            <p className="text-center text-blue-100 text-sm mt-2">Masuk dengan kredensial administrator</p>
          </CardHeader>

          <CardContent className="p-8 bg-white/95 backdrop-blur-sm">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  {t("admin.email")}
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="adminelnusa@elnusa.com"
                    required
                    className="h-12 pl-4 pr-4 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  {t("admin.password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Masukkan password admin"
                    required
                    className="h-12 pl-4 pr-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t("admin.processing")}
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    {t("admin.loginButton")}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center space-x-2 text-blue-800">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Akses Terlindungi</span>
              </div>
              <p className="text-xs text-blue-600 text-center mt-2 leading-relaxed">
                Dashboard ini hanya dapat diakses oleh administrator yang berwenang. Semua aktivitas login dicatat untuk
                keamanan sistem.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-2 text-blue-200 mb-2">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">PT Elnusa Tbk</span>
          </div>
          <p className="text-xs text-blue-300">© 2024 All rights reserved • Whistleblower System v2.0</p>
        </div>
      </div>
    </div>
  )
}
