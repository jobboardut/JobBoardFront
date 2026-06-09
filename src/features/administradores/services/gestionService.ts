import { Building2, CheckCircle2, GraduationCap, UserSquare2, XCircle } from 'lucide-react'
import { adminService } from './admin.service'
import type { AdminUsuario } from '../types/admin.types'
import type { ManagementMetric, ManagementUser, ManagementUserType } from '../types/management.types'

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

const toManagementUser = (user: AdminUsuario): ManagementUser | null => {
  const type = toUserType(user.rol)
  if (!type) return null

  const fullName = user.nombreCompleto ?? user.email

  return {
    id: String(user.id),
    fullName,
    description: user.rol,
    avatarLetter: fullName.charAt(0).toUpperCase(),
    type,
    contact: user.email,
    contactPhone: 'No registrado',
    registerDate: formatDate(user.fechaRegistro),
    state: user.estatusValidacion === 'Validado' ? 'Activo' : 'Inactivo',
    detailTitle: type === 'Empresa' ? 'Datos de la empresa' : 'Datos del usuario',
    detailItems: [
      { label: 'Correo', value: user.email },
      { label: 'Rol', value: user.rol },
      { label: 'Registro', value: formatDate(user.fechaRegistro) },
      { label: 'Estado', value: user.estatusValidacion },
    ],
  }
}

export async function getManagementOverview(): Promise<ManagementOverview> {
  const response = await adminService.getUsuarios()
  const users = response.usuarios
    .filter((user) => isManageableRole(user.rol))
    .map(toManagementUser)
    .filter((user): user is ManagementUser => Boolean(user))

  const activeCount = users.filter((user) => user.state === 'Activo').length
  const inactiveCount = users.filter((user) => user.state === 'Inactivo').length
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
    ],
    users,
  }
}
