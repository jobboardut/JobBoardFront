export type ApplicationStatus =
  | 'PENDIENTE'
  | 'ENTREVISTA'
  | 'APROBADO'
  | 'CONTRATADO'
  | 'RECHAZADO'

export interface Application {
  id: string
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
