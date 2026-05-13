import type { LucideIcon } from 'lucide-react'

export type ValidationMetric = {
  label: string
  value: number
  Icon: LucideIcon
  tone: 'orange' | 'green' | 'blue'
}

export type ValidationType = 'Egresado' | 'Empresa' | 'Alumno'

export type ValidationDetailItem = {
  label: string
  value: string
  isLink?: boolean
}

export type ValidationRequest = {
  id: string
  fullName: string
  profile: string
  type: ValidationType
  avatarPhoto?: string
  contactEmail: string
  contactPhone: string
  evidencePhoto?: string
  submittedAgo: string
  state: 'Pendiente'
  accountState: 'Activo' | 'Inactivo'
  detailTitle: string
  detailItems: ValidationDetailItem[]
}