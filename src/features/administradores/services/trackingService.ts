import { CircleCheckBig, CircleX, Clock3, FileCheck2, MessagesSquare, Users } from 'lucide-react'
import { adminService } from './admin.service'
import type { TrackingMetric, TrackingRow, TrackingStatus } from '../types/seguimiento.types'

type RawPostulacion = Record<string, unknown>

export type TrackingOverview = {
  metrics: TrackingMetric[]
  rows: TrackingRow[]
}

const asText = (value: unknown, fallback = 'No especificado'): string =>
  typeof value === 'string' && value.trim() ? value : fallback

const asArray = (value: unknown): RawPostulacion[] => (Array.isArray(value) ? value as RawPostulacion[] : [])

const asStatus = (value: unknown): TrackingStatus => {
  const status = asText(value, 'Pendiente')
  const normalized = status.toLowerCase()

  if (normalized.includes('entrevista')) {
    return 'Entrevista'
  }

  if (normalized.includes('acept')) {
    return 'Aceptado'
  }

  if (normalized.includes('rechaz')) {
    return 'Rechazado'
  }

  if (normalized.includes('revision') || normalized.includes('revisi')) {
    return 'En revisión'
  }

  return 'Pendiente'
}

const formatDate = (value: unknown): string => {
  if (typeof value !== 'string') {
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

const initials = (value: string): string =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'NA'

const toTrackingRow = (item: RawPostulacion, index: number): TrackingRow => {
  const candidateName = asText(item.nombrePostulante ?? item.candidato ?? item.nombreCompleto, 'Postulante')
  const companyName = asText(item.nombreEmpresa ?? item.empresa, 'Empresa')
  const vacancyTitle = asText(item.tituloVacante ?? item.vacante ?? item.titulo, 'Vacante')

  return {
    id: String(item.id ?? index),
    candidateName,
    candidateCareer: asText(item.carrera ?? item.programa, 'Sin carrera'),
    candidateLetter: initials(candidateName),
    vacancyTitle,
    companyName,
    vacancyLetter: companyName.charAt(0).toUpperCase(),
    status: asStatus(item.estatus ?? item.status),
    date: formatDate(item.fechaPostulacion ?? item.fecha ?? item.createdAt),
    email: asText(item.email ?? item.correo, 'Sin correo'),
    note: asText(item.observacion ?? item.nota, 'Sin observaciones'),
  }
}

export async function getTrackingOverview(): Promise<TrackingOverview> {
  const response = await adminService.getPostulantes()
  const rows = asArray(response).map(toTrackingRow)

  const countByStatus = (status: TrackingStatus) => rows.filter((row) => row.status === status).length

  return {
    metrics: [
      { label: 'Total', value: rows.length, Icon: Users, tone: 'blue' },
      { label: 'Pendientes', value: countByStatus('Pendiente'), Icon: Clock3, tone: 'gray' },
      { label: 'En revisión', value: countByStatus('En revisión'), Icon: FileCheck2, tone: 'blue' },
      { label: 'Entrevistas', value: countByStatus('Entrevista'), Icon: MessagesSquare, tone: 'orange' },
      { label: 'Aceptados', value: countByStatus('Aceptado'), Icon: CircleCheckBig, tone: 'green' },
      { label: 'Rechazados', value: countByStatus('Rechazado'), Icon: CircleX, tone: 'red' },
    ],
    rows,
  }
}
