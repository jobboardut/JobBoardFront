import type { LucideIcon } from 'lucide-react'

export type PublicationMetricTone = 'orange' | 'green' | 'blue'

export type PublicationMetric = {
  label: string
  value: number
  Icon: LucideIcon
  tone: PublicationMetricTone
}

export type PublicationStatus = 'Activo' | 'Pausado'

export type Publication = {
  id: string
  title: string
  company: string
  badgeLetter: string
  status: PublicationStatus
  modality: string
  workday: string
  location: string
  salary: string
  date: string
  applicants: number
  experience: string
  description: string
  responsibilities: string[]
}
