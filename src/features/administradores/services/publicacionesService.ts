import { BriefcaseBusiness, CircleCheckBig, PauseCircle, Users } from 'lucide-react'
import { formatMoney } from '@/shared/utils/money'
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
  location: vacancy.ubicacion ?? 'No especificada',
  salary: formatMoney(vacancy.sueldoAprox, 'No especificado'),
  date: formatDate(vacancy.fechaPublicacion),
  applicants: vacancy.totalPostulantes,
  experience: 'No especificada',
  description: `Vacante publicada por ${vacancy.nombreEmpresa}.`,
  responsibilities: vacancy.responsabilidades
    ? vacancy.responsabilidades.split(/\r?\n|;/).map((item) => item.trim()).filter(Boolean)
    : ['Informacion pendiente de especificar por la empresa.'],
  // El backend nombra "cupo" a los lugares; se normaliza al formato interno.
  lugares: vacancy.cupo ?? vacancy.lugares,
  lugaresOcupados:
    typeof vacancy.cupo === 'number' && typeof vacancy.cuposDisponibles === 'number'
      ? vacancy.cupo - vacancy.cuposDisponibles
      : vacancy.lugaresOcupados,
})

// Las eliminadas se muestran al final, igual que los usuarios rechazados.
const STATUS_ORDER: Record<PublicationStatus, number> = {
  Activo: 0,
  Pausado: 1,
  Finalizada: 2,
  Baneada: 3,
  Eliminada: 4,
}

export async function getPublicationsOverview(): Promise<PublicationsOverview> {
  const response = await adminService.getPublicaciones()
  const publications = response.publicaciones
    .map(toPublication)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])

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
