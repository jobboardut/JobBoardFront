import type { ComponentType } from 'react'

export type JobStatus = 'En revision' | 'En progreso' | 'Proceso finalizado'

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

export interface ActivityColumn {
  title: string
  count: number
  status: JobStatus
  items: JobItem[]
}

export interface Metric {
  label: string
  value: number
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
}
