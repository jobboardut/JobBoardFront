import type { LucideIcon } from 'lucide-react'

export type ManagementMetricTone = 'active' | 'inactive' | 'graduate' | 'company' | 'student' | 'rejected'

export type ManagementMetric = {
  label: string
  value: number
  Icon: LucideIcon
  tone: ManagementMetricTone
}

export type ManagementUserType = 'Alumno' | 'Egresado' | 'Empresa'
// Devuelto: el registro regreso al usuario con observaciones para corregir.
// Inhabilitado: el admin desactivo la cuenta.
export type ManagementUserState = 'Activo' | 'Inactivo' | 'Devuelto' | 'Rechazado' | 'Inhabilitado'

export type ManagementUser = {
  id: string
  fullName: string
  description: string
  avatarLetter: string
  type: ManagementUserType
  contact: string
  contactPhone: string
  registerDate: string
  state: ManagementUserState
  rejectionReason: string | null
  detailTitle: string
  detailItems: { label: string; value: string }[]
}
