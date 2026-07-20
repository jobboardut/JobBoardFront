import { Ban, Building2, CheckCircle2, GraduationCap, UserSquare2, XCircle } from 'lucide-react'
import { adminService } from './admin.service'
import type { AdminUsuario } from '../types/admin.types'
import type { ManagementMetric, ManagementUser, ManagementUserState, ManagementUserType } from '../types/management.types'

export type ManagementOverview = {
  metrics: ManagementMetric[]
  users: ManagementUser[]
}

const formatDate = (value: string): string => {
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

const normalizeRole = (rol: string): string =>
  rol
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const toUserType = (rol: string): ManagementUserType | null => {
  const normalizedRole = normalizeRole(rol)

  if (normalizedRole === 'empresa') return 'Empresa'
  if (normalizedRole === 'egresado') return 'Egresado'
  if (normalizedRole === 'estudiante' || normalizedRole === 'alumno') return 'Alumno'

  return null
}

const isManageableRole = (rol: string): boolean => toUserType(rol) !== null

const toUserState = (estatusValidacion: string): ManagementUserState => {
  const normalized = normalizeRole(estatusValidacion)

  if (normalized === 'validado') return 'Activo'
  if (normalized.startsWith('devuel')) return 'Devuelto'
  if (normalized === 'rechazado') return 'Rechazado'
  if (normalized === 'inhabilitado') return 'Inhabilitado'

  return 'Inactivo'
}

// Rechazados e inhabilitados van al final, despues de activos, inactivos y devueltos.
const STATE_ORDER: Record<ManagementUserState, number> = {
  Activo: 0,
  Inactivo: 1,
  Devuelto: 2,
  Rechazado: 3,
  Inhabilitado: 4,
}

const toManagementUser = (user: AdminUsuario): ManagementUser | null => {
  const type = toUserType(user.rol)
  if (!type) return null

  const fullName = user.nombreCompleto ?? user.email
  const state = toUserState(user.estatusValidacion)
  const ultimaObservacion = user.ultimaObservacion ?? user.observaciones ?? null

  const detailItems = [
    { label: 'Correo', value: user.email },
    { label: 'Rol', value: user.rol },
    { label: 'Registro', value: formatDate(user.fechaRegistro) },
    { label: 'Estado', value: user.estatusValidacion },
  ]

  if (ultimaObservacion) {
    detailItems.push({ label: 'Ultima observacion', value: ultimaObservacion })
  }

  if (typeof user.totalDevoluciones === 'number' && user.totalDevoluciones > 0) {
    detailItems.push({ label: 'Devoluciones', value: String(user.totalDevoluciones) })
  }

  const mostrarObservacion = state === 'Rechazado' || state === 'Devuelto' || state === 'Inhabilitado'

  return {
    id: String(user.id),
    fullName,
    description: user.rol,
    avatarLetter: fullName.charAt(0).toUpperCase(),
    type,
    contact: user.email,
    contactPhone: 'No registrado',
    registerDate: formatDate(user.fechaRegistro),
    state,
    rejectionReason: mostrarObservacion ? ultimaObservacion : null,
    detailTitle: type === 'Empresa' ? 'Datos de la empresa' : 'Datos del usuario',
    detailItems,
  }
}

export async function getManagementOverview(): Promise<ManagementOverview> {
  const response = await adminService.getUsuarios()
  const users = response.usuarios
    .filter((user) => isManageableRole(user.rol))
    .map(toManagementUser)
    .filter((user): user is ManagementUser => Boolean(user))
    .sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state])

  const activeCount = users.filter((user) => user.state === 'Activo').length
  const inactiveCount = users.filter((user) => user.state === 'Inactivo' || user.state === 'Devuelto').length
  const rejectedCount = users.filter((user) => user.state === 'Rechazado' || user.state === 'Inhabilitado').length
  const graduateCount = users.filter((user) => user.type === 'Egresado').length
  const studentCount = users.filter((user) => user.type === 'Alumno').length
  const companyCount = users.filter((user) => user.type === 'Empresa').length

  return {
    metrics: [
      { label: 'Activos', value: activeCount, Icon: CheckCircle2, tone: 'active' },
      { label: 'Inactivos', value: inactiveCount, Icon: XCircle, tone: 'inactive' },
      { label: 'Egresados', value: graduateCount, Icon: GraduationCap, tone: 'graduate' },
      { label: 'Empresas', value: companyCount, Icon: Building2, tone: 'company' },
      { label: 'Estudiantes', value: studentCount, Icon: UserSquare2, tone: 'student' },
      { label: 'Rechazados', value: rejectedCount, Icon: Ban, tone: 'rejected' },
    ],
    users,
  }
}
