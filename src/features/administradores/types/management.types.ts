import type { LucideIcon } from 'lucide-react'

export type ManagementMetricTone = 'active' | 'inactive' | 'graduate' | 'company' | 'student'

export type ManagementMetric = {
  label: string
  value: number
  Icon: LucideIcon
  tone: ManagementMetricTone
}

export type ManagementUserType = 'Egresado' | 'Empresa'
export type ManagementUserState = 'Activo' | 'Inactivo'

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
  detailTitle: string
  detailItems: { label: string; value: string }[]
}