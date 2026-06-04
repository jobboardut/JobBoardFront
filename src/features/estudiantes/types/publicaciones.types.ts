/** Vacante activa devuelta por el backend (VacantePublicaDto). */
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
  location: string
  salary: string
  modality: string
}

export interface SearchPublicationItem {
  id: number
  title: string
  location: string
  description: string
  typeTag: string
  salaryTag: string
  timeAgo: string
}
