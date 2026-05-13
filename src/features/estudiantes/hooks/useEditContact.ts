import { useState } from 'react'
import type { EditContactFormData } from '../types/profile.types'

interface UseEditContactProps {
  initialData: EditContactFormData
}

export const useEditContact = ({ initialData }: UseEditContactProps) => {
  const [formData, setFormData] = useState<EditContactFormData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof EditContactFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (onSave: (data: EditContactFormData) => void) => {
    try {
      setIsLoading(true)
      setError(null)

      // Validaciones básicas
      if (!formData.phone.trim()) {
        setError('El teléfono es requerido')
        return
      }
      if (!formData.email.trim()) {
        setError('El email es requerido')
        return
      }
      if (!formData.email.includes('@')) {
        setError('Email inválido')
        return
      }

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 500))

      onSave(formData)
    } catch {
      setError('Error al guardar los cambios')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(initialData)
    setError(null)
  }

  return {
    formData,
    isLoading,
    error,
    handleInputChange,
    handleSubmit,
    resetForm,
  }
}
