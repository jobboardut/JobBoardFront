import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export type SummaryCard = {
  label: string
  value: number
  Icon: LucideIcon
  accent: 'orange' | 'teal' | 'violet'
  subtitle: string
}

export type VacancyRow = {
  title: string
  description: string
  status: 'ACTIVO' | 'PAUSADO' | 'BORRADOR'
  applicants: number
}

export type JobStatus = 'En revision' | 'En progreso' | 'Proceso finalizado'

export interface ActivityColumn {
  title: string
  count: number
  status: JobStatus
}

export interface JobItem {
  id: string
  title: string
  company: string
  salary: string
  location: string
  type: string
  availability: string
  date?: string
}

export interface Metric {
  label: string
  value: number
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}
