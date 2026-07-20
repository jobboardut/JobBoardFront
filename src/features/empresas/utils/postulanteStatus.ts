import { BriefcaseBusiness, CalendarCheck, Eye, Clock3, Undo2, XCircle, type LucideIcon } from 'lucide-react'
import type { PostulanteEstatus } from '../types/empresa.types'

export type PostulanteStatusKey =
  | 'postulado'
  | 'cvvisto'
  | 'entrevista'
  | 'contratado'
  | 'rechazado'
  | 'retirado'

export type PostulanteStatusMeta = {
  key: PostulanteStatusKey
  label: string
  apiValue: PostulanteEstatus
  description: string
  /** true cuando el proceso ya no puede avanzar desde este estatus. */
  terminal: boolean
  Icon: LucideIcon
  dotClass: string
  textClass: string
  pillClass: string
}

// Ciclo estandar: Postulado -> CvVisto -> Entrevista -> Contratado.
// Rechazado (motivo obligatorio) sale desde CvVisto o Entrevista.
// Retirado lo decide el estudiante.
export const POSTULANTE_STATUS_FLOW: PostulanteStatusMeta[] = [
  {
    key: 'postulado',
    label: 'Postulado',
    apiValue: 'Postulado',
    description: 'Postulacion recibida. La empresa aun no revisa el CV.',
    terminal: false,
    Icon: Clock3,
    dotClass: 'bg-orange-400',
    textClass: 'text-orange-500',
    pillClass: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  {
    key: 'cvvisto',
    label: 'CV visto',
    apiValue: 'CvVisto',
    description: 'La empresa ya reviso el perfil y el CV del candidato.',
    terminal: false,
    Icon: Eye,
    dotClass: 'bg-sky-500',
    textClass: 'text-sky-600',
    pillClass: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  {
    key: 'entrevista',
    label: 'Entrevista',
    apiValue: 'Entrevista',
    description: 'El candidato fue citado a entrevista o siguiente filtro.',
    terminal: false,
    Icon: CalendarCheck,
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-600',
    pillClass: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  {
    key: 'contratado',
    label: 'Contratado',
    apiValue: 'Contratado',
    description: 'La empresa confirma que el candidato fue contratado.',
    terminal: true,
    Icon: BriefcaseBusiness,
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600',
    pillClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  {
    key: 'rechazado',
    label: 'Rechazado',
    apiValue: 'Rechazado',
    description: 'La postulacion no continua en el proceso.',
    terminal: true,
    Icon: XCircle,
    dotClass: 'bg-red-500',
    textClass: 'text-red-600',
    pillClass: 'border-red-200 bg-red-50 text-red-700',
  },
  {
    key: 'retirado',
    label: 'Retirado',
    apiValue: 'Retirado',
    description: 'El estudiante retiro su postulacion.',
    terminal: true,
    Icon: Undo2,
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-500',
    pillClass: 'border-slate-200 bg-slate-50 text-slate-600',
  },
]

// Transiciones que puede ejecutar la empresa desde cada etapa.
export const TRANSICIONES_EMPRESA: Record<PostulanteStatusKey, PostulanteEstatus[]> = {
  postulado: ['CvVisto'],
  cvvisto: ['Entrevista', 'Rechazado'],
  entrevista: ['Contratado', 'Rechazado'],
  contratado: [],
  rechazado: [],
  retirado: [],
}

// Etiquetas imperativas para los botones de accion.
export const ETIQUETA_ACCION: Partial<Record<PostulanteEstatus, string>> = {
  CvVisto: 'Marcar CV visto',
  Entrevista: 'Citar a entrevista',
  Contratado: 'Contratar',
  Rechazado: 'Rechazar',
}

export const normalizePostulanteStatusKey = (status?: string | null): PostulanteStatusKey => {
  const normalized = (status ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  if (normalized.includes('visto') || normalized.includes('cv')) return 'cvvisto'
  if (normalized.includes('entrevista')) return 'entrevista'
  if (normalized.includes('contrat')) return 'contratado'
  if (normalized.includes('rechaz')) return 'rechazado'
  if (normalized.includes('retir')) return 'retirado'
  // Legado: "Aceptada/Aprobado" del flujo anterior equivale a estar en entrevista.
  if (normalized.includes('acept') || normalized.includes('aprob') || normalized.includes('aprue')) return 'entrevista'

  return 'postulado'
}

export const getPostulanteStatusMeta = (status?: string | null): PostulanteStatusMeta =>
  POSTULANTE_STATUS_FLOW.find((item) => item.key === normalizePostulanteStatusKey(status)) ?? POSTULANTE_STATUS_FLOW[0]
