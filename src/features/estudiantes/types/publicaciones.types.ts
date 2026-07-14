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
  ubicacion?: string | null
  competencias?: string | null
  responsabilidades?: string | null
  lugares?: number | null
  lugaresOcupados?: number | null
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
  /** Contador de lugares listo para pintar, ej. "3/10". */
  placesLabel?: string | null
  placesFull?: boolean
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
