"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: "error" | "warning" | "success" | "info"
}

export function NotificationModal({ isOpen, onClose, title, message, type }: NotificationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-50 border-red-200 text-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "success":
        return "bg-green-50 border-green-200 text-green-800"
      default:
        return "bg-blue-50 border-blue-200 text-blue-800"
    }
  }

  const getIconColor = () => {
    switch (type) {
      case "error":
        return "text-red-500"
      case "warning":
        return "text-yellow-500"
      case "success":
        return "text-green-500"
      default:
        return "text-blue-500"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className={`relative max-w-md w-full mx-4 p-4 rounded-lg border-2 shadow-lg ${getTypeStyles()}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500 ${getIconColor()}`}
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
