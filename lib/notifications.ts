import { toast } from "@/hooks/use-toast"

export interface NotificationOptions {
  title: string
  description?: string
  duration?: number
  variant?: "default" | "destructive"
}

export class NotificationService {
  // Form validation notifications
  static showRequiredFieldError(fieldName: string) {
    toast({
      title: "⚠️ Field Wajib Kosong",
      description: `${fieldName} harus diisi untuk melanjutkan.`,
      variant: "destructive",
      duration: 4000,
    })
  }

  static showInvalidFormatError(fieldName: string, expectedFormat: string) {
    toast({
      title: "❌ Format Tidak Valid",
      description: `${fieldName} harus dalam format ${expectedFormat}.`,
      variant: "destructive",
      duration: 4000,
    })
  }

  static showMultipleFieldsError(fields: string[]) {
    const fieldList = fields.join(", ")
    toast({
      title: "⚠️ Beberapa Field Kosong",
      description: `Mohon lengkapi: ${fieldList}`,
      variant: "destructive",
      duration: 5000,
    })
  }

  // Success notifications
  static showSuccess(title: string, description?: string) {
    toast({
      title: `✅ ${title}`,
      description,
      variant: "default",
      duration: 3000,
    })
  }

  // Error notifications
  static showError(title: string, description?: string) {
    toast({
      title: `❌ ${title}`,
      description,
      variant: "destructive",
      duration: 4000,
    })
  }

  // Warning notifications
  static showWarning(title: string, description?: string) {
    toast({
      title: `⚠️ ${title}`,
      description,
      variant: "default",
      duration: 4000,
    })
  }

  // Custom notification
  static show(options: NotificationOptions) {
    toast({
      title: options.title,
      description: options.description,
      variant: options.variant || "default",
      duration: options.duration || 3000,
    })
  }

  // Specific form validation messages
  static validateAndNotify = {
    name: (value: string, fieldName = "Nama") => {
      if (!value.trim()) {
        NotificationService.showRequiredFieldError(fieldName)
        return false
      }
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        NotificationService.showInvalidFormatError(fieldName, "huruf saja (tanpa angka atau simbol)")
        return false
      }
      return true
    },

    email: (value: string, fieldName = "Email") => {
      if (!value.trim()) {
        NotificationService.showRequiredFieldError(fieldName)
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        NotificationService.showInvalidFormatError(fieldName, "email yang valid (contoh: nama@domain.com)")
        return false
      }
      return true
    },

    phone: (value: string, fieldName = "Nomor Telepon") => {
      if (!value.trim()) {
        NotificationService.showRequiredFieldError(fieldName)
        return false
      }
      if (!/^[0-9+\-\s()]+$/.test(value)) {
        NotificationService.showInvalidFormatError(fieldName, "angka saja")
        return false
      }
      return true
    },

    nip: (value: string, fieldName = "NIP") => {
      if (!value.trim()) {
        NotificationService.showRequiredFieldError(fieldName)
        return false
      }
      if (!/^[0-9]+$/.test(value)) {
        NotificationService.showInvalidFormatError(fieldName, "angka saja")
        return false
      }
      return true
    },

    required: (value: string, fieldName: string) => {
      if (!value.trim()) {
        NotificationService.showRequiredFieldError(fieldName)
        return false
      }
      return true
    },

    minLength: (value: string, minLength: number, fieldName: string) => {
      if (value.length < minLength) {
        NotificationService.showError("Input Terlalu Pendek", `${fieldName} minimal ${minLength} karakter.`)
        return false
      }
      return true
    },

    maxLength: (value: string, maxLength: number, fieldName: string) => {
      if (value.length > maxLength) {
        NotificationService.showError("Input Terlalu Panjang", `${fieldName} maksimal ${maxLength} karakter.`)
        return false
      }
      return true
    },
  }
}

// Export default untuk kemudahan penggunaan
export default NotificationService
