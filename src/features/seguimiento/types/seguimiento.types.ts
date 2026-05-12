export type ApplicationStatus =
  | 'EN REVISIÓN'
  | 'ACEPTADO'
  | 'PENDIENTE'
  | 'RECHAZADO'
  | 'CONTRATADO'
  | 'APRUEBA'

export interface Application {
  id: string
  jobTitle: string
  company: string
  postulationDate: string
  status: ApplicationStatus
}

export interface StatusInfo {
  status: ApplicationStatus
  color: string
  description: string
  icon: string
}
