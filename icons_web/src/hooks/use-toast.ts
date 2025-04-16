"use client"

import { useState, useEffect } from "react"

type ToastType = "default" | "success" | "error" | "warning" | "info" | "destructive"

interface ToastOptions {
  title: string
  description?: string
  duration?: number
  variant?: ToastType
}

interface Toast {
  id: string
  title: string
  description?: string
  duration: number
  variant: ToastType
  visible: boolean
}

// Global store for toasts
let toasts: Toast[] = []
let listeners: Array<(toasts: Toast[]) => void> = []

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]))
}

export const toast = (options: ToastOptions) => {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast: Toast = {
    id,
    title: options.title,
    description: options.description,
    duration: options.duration || 5000,
    variant: options.variant || "default",
    visible: true,
  }

  toasts = [...toasts, newToast]
  notifyListeners()

  // Auto-dismiss after duration
  setTimeout(() => {
    dismissToast(id)
  }, newToast.duration)

  return id
}

export const dismissToast = (id: string) => {
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts[index].visible = false
    notifyListeners()

    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id)
      notifyListeners()
    }, 300)
  }
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const handleToastsChange = (updatedToasts: Toast[]) => {
      setCurrentToasts(updatedToasts)
    }

    listeners.push(handleToastsChange)
    setCurrentToasts([...toasts])

    return () => {
      listeners = listeners.filter((l) => l !== handleToastsChange)
    }
  }, [])

  return {
    toasts: currentToasts,
    toast,
    dismiss: dismissToast,
  }
}
