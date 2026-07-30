import { useState } from 'react'
import {
  limitText,
  SECURITY_LIMITS,
  validateEmailField,
  validateOptionalText,
  validateRequiredPhoneField,
} from '@/shared/security/inputRules'
import type { EditContactFormData } from '../types/profile.types'

const CONTACT_FIELD_LIMITS = {
  phone: SECURITY_LIMITS.phone,
  email: SECURITY_LIMITS.email,
  civilStatus: SECURITY_LIMITS.shortText,
  address: SECURITY_LIMITS.address,
} as const

const getContactFieldLimit = (field: keyof EditContactFormData): number =>
  CONTACT_FIELD_LIMITS[field as keyof typeof CONTACT_FIELD_LIMITS] ?? SECURITY_LIMITS.shortText

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
      [field]: limitText(value, getContactFieldLimit(field)),
    }))
    setError(null)
  }

  const handleSubmit = async (onSave: (data: EditContactFormData) => void | Promise<void>) => {
    const validationError =
      validateRequiredPhoneField(formData.phone, 'Telefono') ??
      validateEmailField(formData.email, 'Email') ??
      validateOptionalText(formData.address, 'Domicilio', SECURITY_LIMITS.address)

    if (validationError) {
      setError(validationError)
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      // Guardado real contra la API; el padre resuelve cuando el servidor responde.
      await onSave(formData)
      return true
    } catch {
      setError('No se pudieron guardar los cambios. Intenta de nuevo.')
      return false
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
