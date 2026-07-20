import type { LucideIcon } from 'lucide-react'

export type TrackingMetricTone = 'blue' | 'gray' | 'orange' | 'green' | 'red'

export type TrackingMetric = {
  label: string
  value: number
  Icon: LucideIcon
  tone: TrackingMetricTone
}

// Ciclo estandar: Postulado -> CV visto -> Entrevista -> Contratado; Rechazado/Retirado son salidas.
export type TrackingStatus = 'Postulado' | 'CV visto' | 'Entrevista' | 'Contratado' | 'Rechazado' | 'Retirado'

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
