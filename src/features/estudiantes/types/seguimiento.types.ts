// Ciclo estandar: POSTULADO -> CV VISTO -> ENTREVISTA -> CONTRATADO
// RECHAZADO sale desde CV visto o Entrevista; RETIRADO lo decide el estudiante.
export type ApplicationStatus =
  | 'POSTULADO'
  | 'CV VISTO'
  | 'ENTREVISTA'
  | 'CONTRATADO'
  | 'RECHAZADO'
  | 'RETIRADO'

export interface Application {
  id: string
  postulacionId?: number
  vacancyId?: number
  jobTitle: string
  company: string
  postulationDate: string
  status: ApplicationStatus
  modality?: string
  salary?: string
  location?: string
  schedule?: string
  experience?: string
  description?: string
  responsibilities?: string[]
}

export interface StatusInfo {
  status: ApplicationStatus
  color: string
  description: string
  icon: string
}
