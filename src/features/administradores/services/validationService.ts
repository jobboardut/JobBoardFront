import { Building2, FileBadge, GraduationCap, Users } from 'lucide-react'
import { adminService } from './admin.service'
import type { AdminUsuario, ValidarUsuarioAccion, ValidarUsuarioRequest } from '../types/admin.types'
import type { ValidationMetric, ValidationRequest, ValidationType } from '../types/validation.types'

export type ValidationOverview = {
  metrics: ValidationMetric[]
  requests: ValidationRequest[]
}

const toValidationType = (rol: string): ValidationType => {
  const normalizedRole = rol
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

  if (normalizedRole === 'empresa') {
    return 'Empresa'
  }

  if (normalizedRole === 'egresado') {
    return 'Egresado'
  }

  if (normalizedRole === 'estudiante' || normalizedRole === 'alumno') {
    return 'Alumno'
  }

  return 'Alumno'
}

const isValidableRole = (rol: string): boolean => {
  const normalizedRole = rol
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

  return ['empresa', 'estudiante', 'alumno', 'egresado'].includes(normalizedRole)
}

const toRelativeDate = (value: string): string => {
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

const buildDetailItems = (user: AdminUsuario) => [
  { label: 'Correo', value: user.email },
  { label: 'Rol', value: user.rol },
  { label: 'Estatus', value: user.estatusValidacion },
  { label: 'Registro', value: toRelativeDate(user.fechaRegistro) },
]

const mapUserToRequest = (user: AdminUsuario): ValidationRequest => {
  const type = toValidationType(user.rol)

  return {
    id: String(user.id),
    fullName: user.nombreCompleto ?? user.email,
    profile: user.rol,
    type,
    contactEmail: user.email,
    contactPhone: 'No registrado',
    submittedAgo: toRelativeDate(user.fechaRegistro),
    state: 'Pendiente',
    accountState: user.estatusValidacion === 'Validado' ? 'Activo' : 'Inactivo',
    detailTitle: type === 'Empresa' ? 'Datos de la Empresa' : 'Datos del Alumno',
    detailItems: buildDetailItems(user),
  }
}

export async function getValidationOverview(): Promise<ValidationOverview> {
  const response = await adminService.getUsuarios()
  const requests = response.usuarios
    .filter((user) => user.estatusValidacion === 'Pendiente' && isValidableRole(user.rol))
    .map(mapUserToRequest)

  const companyCount = requests.filter((request) => request.type === 'Empresa').length
  const studentCount = requests.filter((request) => request.type === 'Alumno').length
  const graduateCount = requests.filter((request) => request.type === 'Egresado').length

  return {
    metrics: [
      { label: 'Pendientes', value: requests.length, Icon: FileBadge, tone: 'orange' },
      { label: 'Egresados', value: graduateCount, Icon: GraduationCap, tone: 'green' },
      { label: 'Empresas', value: companyCount, Icon: Building2, tone: 'blue' },
      { label: 'Alumnos', value: studentCount, Icon: Users, tone: 'green' },
    ],
    requests,
  }
}

export function validateUser(
  id: string,
  accion: ValidarUsuarioAccion,
  observaciones?: string,
): Promise<void> {
  const payload: ValidarUsuarioRequest = { accion }

  // El motivo solo aplica al rechazar.
  if (accion === 'rechazar' && observaciones?.trim()) {
    payload.observaciones = observaciones.trim()
  }

  return adminService.validarUsuario(id, payload)
}
