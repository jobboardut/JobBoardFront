export interface Vacante {
  id: number
  empresaId: number
  nombreEmpresa: string
  empresaLogoUrl: string | null
  titulo: string
  descripcion: string
  requisitos: string | null
  sueldoAprox: number | null
  modalidad: string
  fechaPublicacion: string
  totalPostulantes: number
}

export interface JobCardItem {
  id: number
  title: string
  company: string
  salary: string
  modality: string
  dateLabel: string
  applicantCount: number
  logoUrl?: string | null
  isApplied?: boolean
}

export interface SearchPublicationItem {
  id: number
  title: string
  company: string
  description: string
  typeTag: string
  salaryTag: string
  timeAgo: string
  logoUrl?: string | null
  isApplied?: boolean
}
