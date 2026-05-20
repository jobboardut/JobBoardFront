import { BriefcaseBusiness, CircleCheckBig, PauseCircle, Users } from 'lucide-react'
import { adminService } from './admin.service'
import type { VacanteReciente } from '../types/admin.types'
import type { Publication, PublicationMetric, PublicationStatus } from '../types/publicaciones.types'

export type PublicationsOverview = {
  metrics: PublicationMetric[]
  publications: Publication[]
  activeCount: number
  totalCount: number
}

const toPublicationStatus = (estatus: string): PublicationStatus => {
  const normalized = estatus.toLowerCase()
  if (normalized.includes('paus')) return 'Pausado'
  if (normalized.includes('final')) return 'Finalizada'
  if (normalized.includes('bane')) return 'Baneada'
  if (normalized.includes('elimin')) return 'Eliminada'
  return 'Activo'
}

const formatDate = (value?: string): string => {
  if (!value) {
    return 'Sin fecha'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

const toPublication = (vacancy: VacanteReciente): Publication => ({
  id: String(vacancy.id),
  title: vacancy.titulo,
  company: vacancy.nombreEmpresa,
  badgeLetter: vacancy.nombreEmpresa.charAt(0).toUpperCase(),
  status: toPublicationStatus(vacancy.estatus),
  modality: vacancy.modalidad,
  workday: 'No especificada',
  location: 'No especificada',
  salary: 'No especificado',
  date: formatDate(vacancy.fechaPublicacion),
  applicants: vacancy.totalPostulantes,
  experience: 'No especificada',
  description: `Vacante publicada por ${vacancy.nombreEmpresa}.`,
  responsibilities: ['Informacion pendiente de especificar por la empresa.'],
})

export async function getPublicationsOverview(): Promise<PublicationsOverview> {
  const response = await adminService.getPublicaciones()
  const publications = response.publicaciones.map(toPublication)

  return {
    metrics: [
      { label: 'Total', value: response.total, Icon: BriefcaseBusiness, tone: 'blue' },
      { label: 'Activas', value: response.activas, Icon: CircleCheckBig, tone: 'green' },
      { label: 'Pausadas', value: response.pausadas, Icon: PauseCircle, tone: 'orange' },
      { label: 'Postulantes', value: response.totalPostulantes, Icon: Users, tone: 'orange' },
    ],
    publications,
    activeCount: response.activas,
    totalCount: response.total,
  }
}
