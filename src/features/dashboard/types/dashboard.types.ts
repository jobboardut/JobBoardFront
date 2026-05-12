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