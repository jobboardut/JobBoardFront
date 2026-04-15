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
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}
