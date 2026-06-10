import { BriefcaseBusiness, CalendarCheck, CheckCircle2, Clock3, XCircle, type LucideIcon } from 'lucide-react'
import type { PostulanteEstatus } from '../types/empresa.types'

export type PostulanteStatusKey = 'pendiente' | 'entrevista' | 'aceptada' | 'contratado' | 'rechazada'

export type PostulanteStatusMeta = {
  key: PostulanteStatusKey
  label: string
  apiValue: PostulanteEstatus
  description: string
  Icon: LucideIcon
  dotClass: string
  textClass: string
  pillClass: string
}

export const POSTULANTE_STATUS_FLOW: PostulanteStatusMeta[] = [
  {
    key: 'pendiente',
    label: 'Pendiente',
    apiValue: 'Pendiente',
    description: 'Postulacion recibida, pendiente de revision por la empresa.',
    Icon: Clock3,
    dotClass: 'bg-orange-400',
    textClass: 'text-orange-500',
    pillClass: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  {
    key: 'entrevista',
    label: 'Entrevista',
    apiValue: 'Entrevista',
    description: 'La empresa debe contactar al candidato para entrevista o siguiente filtro.',
    Icon: CalendarCheck,
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-600',
    pillClass: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  {
    key: 'aceptada',
    label: 'Aprobado',
    apiValue: 'Aceptada',
    description: 'El perfil fue aprobado y puede avanzar a contratacion.',
    Icon: CheckCircle2,
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600',
    pillClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  {
    key: 'contratado',
    label: 'Contratado',
    apiValue: 'Contratado',
    description: 'La empresa confirma que el candidato fue contratado.',
    Icon: BriefcaseBusiness,
    dotClass: 'bg-teal-500',
    textClass: 'text-teal-600',
    pillClass: 'border-teal-200 bg-teal-50 text-teal-700',
  },
  {
    key: 'rechazada',
    label: 'Rechazado',
    apiValue: 'Rechazada',
    description: 'La postulacion no continua en el proceso.',
    Icon: XCircle,
    dotClass: 'bg-red-500',
    textClass: 'text-red-600',
    pillClass: 'border-red-200 bg-red-50 text-red-700',
  },
]

export const normalizePostulanteStatusKey = (status?: string | null): PostulanteStatusKey => {
  const normalized = (status ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (normalized.includes('entrevista')) return 'entrevista'
  if (normalized.includes('contrat')) return 'contratado'
  if (normalized.includes('rechaz')) return 'rechazada'
  if (normalized.includes('acept') || normalized.includes('aprob') || normalized.includes('aprue')) return 'aceptada'

  return 'pendiente'
}

export const getPostulanteStatusMeta = (status?: string | null): PostulanteStatusMeta =>
  POSTULANTE_STATUS_FLOW.find((item) => item.key === normalizePostulanteStatusKey(status)) ?? POSTULANTE_STATUS_FLOW[0]
