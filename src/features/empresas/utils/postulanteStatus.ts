import {
  CalendarCheck,
  CheckCircle2,
  CircleSlash,
  Clock3,
  Search,
  Undo2,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import type { EmpresaTransicion, PostulanteEstatus } from '../types/empresa.types'

export type PostulanteStatusMeta = {
  key: PostulanteEstatus
  label: string
  description: string
  Icon: LucideIcon
  dotClass: string
  textClass: string
  pillClass: string
  /** Los terminales no admiten salida: la postulación no se "revive". */
  terminal: boolean
}

/**
 * Espejo de TransicionesPostulacion.cs. Se usa solo para render optimista;
 * la verdad la impone el servidor y viaja en `postulante.transicionesPermitidas`.
 */
export const POSTULANTE_STATUS: Record<PostulanteEstatus, PostulanteStatusMeta> = {
  Enviada: {
    key: 'Enviada',
    label: 'Enviada',
    description: 'El candidato envió su postulación. Aún no la has revisado.',
    Icon: Clock3,
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-600',
    pillClass: 'border-slate-200 bg-slate-50 text-slate-700',
    terminal: false,
  },
  EnRevision: {
    key: 'EnRevision',
    label: 'En revisión',
    description: 'Estás evaluando el perfil y el CV del candidato.',
    Icon: Search,
    dotClass: 'bg-orange-400',
    textClass: 'text-orange-500',
    pillClass: 'border-orange-200 bg-orange-50 text-orange-700',
    terminal: false,
  },
  Entrevista: {
    key: 'Entrevista',
    label: 'Entrevista',
    description: 'Contactarás al candidato por teléfono o correo para entrevistarlo.',
    Icon: CalendarCheck,
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-600',
    pillClass: 'border-blue-200 bg-blue-50 text-blue-700',
    terminal: false,
  },
  Aceptada: {
    key: 'Aceptada',
    label: 'Aceptada',
    description: 'El candidato fue seleccionado. Cuenta como vinculación para la UTTECAM.',
    Icon: CheckCircle2,
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600',
    pillClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    terminal: true,
  },
  Rechazada: {
    key: 'Rechazada',
    label: 'Rechazada',
    description: 'La postulación no continúa en el proceso.',
    Icon: XCircle,
    dotClass: 'bg-red-500',
    textClass: 'text-red-600',
    pillClass: 'border-red-200 bg-red-50 text-red-700',
    terminal: true,
  },
  Retirada: {
    key: 'Retirada',
    label: 'Retirada',
    description: 'El candidato retiró su postulación.',
    Icon: Undo2,
    dotClass: 'bg-amber-500',
    textClass: 'text-amber-600',
    pillClass: 'border-amber-200 bg-amber-50 text-amber-700',
    terminal: true,
  },
  Cerrada: {
    key: 'Cerrada',
    label: 'Cerrada',
    description: 'Se cerró automáticamente porque la vacante dejó de estar activa.',
    Icon: CircleSlash,
    dotClass: 'bg-slate-400',
    textClass: 'text-slate-500',
    pillClass: 'border-slate-200 bg-slate-100 text-slate-600',
    terminal: true,
  },
}

/** Columnas del buzón, en orden del embudo. Los terminales se agrupan al final. */
export const COLUMNAS_BUZON: PostulanteEstatus[] = [
  'Enviada',
  'EnRevision',
  'Entrevista',
  'Aceptada',
  'Rechazada',
]

/** Etiqueta del botón que dispara cada transición (imperativo, no sustantivo). */
export const ETIQUETA_ACCION: Record<EmpresaTransicion, string> = {
  EnRevision: 'Pasar a revisión',
  Entrevista: 'Citar a entrevista',
  Aceptada: 'Aceptar candidato',
  Rechazada: 'Rechazar',
}

const ES_ESTATUS_CONOCIDO = (valor: string): valor is PostulanteEstatus =>
  Object.prototype.hasOwnProperty.call(POSTULANTE_STATUS, valor)

/**
 * Normaliza el estatus que llega del backend. Ante un valor desconocido cae en
 * 'Enviada' en lugar de romper el render — pero no adivina con `includes()`,
 * que era lo que hacía que 'EnRevision' se pintara como 'Pendiente'.
 */
export const normalizePostulanteStatus = (status?: string | null): PostulanteEstatus =>
  status && ES_ESTATUS_CONOCIDO(status) ? status : 'Enviada'

export const getPostulanteStatusMeta = (status?: string | null): PostulanteStatusMeta =>
  POSTULANTE_STATUS[normalizePostulanteStatus(status)]

/** La etapa determina qué segmento del catálogo de motivos se puede usar. */
export const etapaDeRechazo = (estatusActual: string): 'Screening' | 'Entrevista' =>
  normalizePostulanteStatus(estatusActual) === 'Entrevista' ? 'Entrevista' : 'Screening'
