import { CircleCheckBig, CircleX, Clock3, FileCheck2, MessagesSquare, Users } from 'lucide-react'
import { apiEndpoints } from '../../../services/apiEndpoints'
import type { TrackingMetric, TrackingRow } from '../types/tracking.types'

export const TRACKING_OVERVIEW_ENDPOINT = apiEndpoints.trackingOverview

export type TrackingOverview = {
  metrics: TrackingMetric[]
  rows: TrackingRow[]
}

export function getTrackingOverview(): TrackingOverview {
  // Punto de acoplamiento para API futura de seguimiento de postulaciones.
  const rows: TrackingRow[] = [
    {
      id: '1',
      candidateName: 'María García López',
      candidateCareer: 'Ingeniería en Software',
      candidateLetter: 'MG',
      vacancyTitle: 'Desarrollador Full Stack',
      companyName: 'TechSolutions S.A.',
      vacancyLetter: 'T',
      status: 'Entrevista',
      date: '2025-01-25',
      email: 'maria.garcia@email.com',
      note: 'Entrevista programada para el 30 de enero',
    },
    {
      id: '2',
      candidateName: 'Juan Pérez Ramírez',
      candidateCareer: 'Administración de Empresas',
      candidateLetter: 'JP',
      vacancyTitle: 'Contador Jr.',
      companyName: 'Innovaztech Corp',
      vacancyLetter: 'I',
      status: 'Pendiente',
      date: '2025-01-24',
      email: 'juan.perez@email.com',
      note: 'En revisión de documentos',
    },
    {
      id: '3',
      candidateName: 'Laura Sánchez Mora',
      candidateCareer: 'Diseño Gráfico',
      candidateLetter: 'LS',
      vacancyTitle: 'Diseñador UI/UX',
      companyName: 'Creative Labs',
      vacancyLetter: 'C',
      status: 'En revisión',
      date: '2025-01-23',
      email: 'laura.sanchez@email.com',
      note: 'CV revisado, buen perfil',
    },
    {
      id: '4',
      candidateName: 'Carlos Hernández',
      candidateCareer: 'Ingeniería Industrial',
      candidateLetter: 'CH',
      vacancyTitle: 'Desarrollador Full Stack',
      companyName: 'TechSolutions S.A.',
      vacancyLetter: 'T',
      status: 'Rechazado',
      date: '2025-01-22',
      email: 'carlos.h@email.com',
      note: 'No cumple con los requisitos técnicos',
    },
  ]

  const metrics: TrackingMetric[] = [
    { label: 'Total', value: 5, Icon: Users, tone: 'blue' },
    { label: 'Pendientes', value: 1, Icon: Clock3, tone: 'gray' },
    { label: 'En revisión', value: 1, Icon: FileCheck2, tone: 'blue' },
    { label: 'Entrevistas', value: 1, Icon: MessagesSquare, tone: 'orange' },
    { label: 'Aceptados', value: 1, Icon: CircleCheckBig, tone: 'green' },
    { label: 'Rechazados', value: 1, Icon: CircleX, tone: 'red' },
  ]

  return {
    metrics,
    rows,
  }
}
