import { CircleCheckBig, CircleX, FileCheck2, MessagesSquare, Users } from 'lucide-react'
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
  const status = asText(value, 'Postulado')
  const normalized = status.toLowerCase()

  if (normalized.includes('visto') || normalized.includes('cv')) {
    return 'CV visto'
  }

  if (normalized.includes('entrevista')) {
    return 'Entrevista'
  }

  if (normalized.includes('contrat')) {
    return 'Contratado'
  }

  if (normalized.includes('rechaz')) {
    return 'Rechazado'
  }

  if (normalized.includes('retir')) {
    return 'Retirado'
  }

  // Legado: "Aceptada/Aprobado" del flujo anterior equivale a entrevista.
  if (normalized.includes('acept') || normalized.includes('aprob') || normalized.includes('aprue')) {
    return 'Entrevista'
  }

  return 'Postulado'
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
    id: String(item.postulacionId ?? item.id ?? index),
    candidateName,
    candidateCareer: asText(item.carrera ?? item.programa, 'Sin carrera'),
    candidateLetter: initials(candidateName),
    vacancyTitle,
    companyName,
    vacancyLetter: companyName.charAt(0).toUpperCase(),
    // El backend manda "estatusPostulacion"; los otros nombres son compatibilidad.
    status: asStatus(item.estatusPostulacion ?? item.estatus ?? item.status),
    date: formatDate(item.fechaPostulacion ?? item.fecha ?? item.createdAt),
    email: asText(item.email ?? item.correo, 'Sin correo'),
    note: asText(item.motivoRechazo ?? item.observacion ?? item.nota, 'Sin observaciones'),
  }
}

export async function getTrackingOverview(): Promise<TrackingOverview> {
  const response = await adminService.getPostulantes()
  const allRows = asArray(response).map(toTrackingRow)
  // Los "Postulado" aun no son revisados por la empresa: no se muestran al admin.
  const rows = allRows.filter((row) => row.status !== 'Postulado')

  const countByStatus = (status: TrackingStatus) => rows.filter((row) => row.status === status).length

  return {
    metrics: [
      { label: 'Total', value: rows.length, Icon: Users, tone: 'blue' },
      { label: 'CV vistos', value: countByStatus('CV visto'), Icon: CircleCheckBig, tone: 'blue' },
      { label: 'Entrevistas', value: countByStatus('Entrevista'), Icon: MessagesSquare, tone: 'orange' },
      { label: 'Contratados', value: countByStatus('Contratado'), Icon: FileCheck2, tone: 'green' },
      { label: 'Rechazados', value: countByStatus('Rechazado'), Icon: CircleX, tone: 'red' },
    ],
    rows,
  }
}
