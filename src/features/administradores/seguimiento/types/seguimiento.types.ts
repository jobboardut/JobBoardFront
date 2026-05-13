import type { LucideIcon } from 'lucide-react'

export type TrackingMetricTone = 'blue' | 'gray' | 'orange' | 'green' | 'red'

export type TrackingMetric = {
  label: string
  value: number
  Icon: LucideIcon
  tone: TrackingMetricTone
}

export type TrackingStatus = 'Entrevista' | 'Pendiente' | 'En revisión' | 'Rechazado' | 'Aceptado'

export type TrackingRow = {
  id: string
  candidateName: string
  candidateCareer: string
  candidateLetter: string
  vacancyTitle: string
  companyName: string
  vacancyLetter: string
  status: TrackingStatus
  date: string
  email: string
  note: string
}
