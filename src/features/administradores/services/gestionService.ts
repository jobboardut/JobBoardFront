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

const toUserType = (rol: string): ManagementUserType => (rol === 'Empresa' ? 'Empresa' : 'Egresado')

const toManagementUser = (user: AdminUsuario): ManagementUser => {
  const type = toUserType(user.rol)
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
  const users = response.usuarios.map(toManagementUser)
  const graduateCount = response.usuarios.filter((user) => user.rol === 'Estudiante').length
  const companyCount = response.usuarios.filter((user) => user.rol === 'Empresa').length

  return {
    metrics: [
      { label: 'Activos', value: response.totalActivos, Icon: CheckCircle2, tone: 'active' },
      { label: 'Inactivos', value: response.totalInactivos, Icon: XCircle, tone: 'inactive' },
      { label: 'Egresados', value: graduateCount, Icon: GraduationCap, tone: 'graduate' },
      { label: 'Empresas', value: companyCount, Icon: Building2, tone: 'company' },
      { label: 'Estudiantes', value: graduateCount, Icon: UserSquare2, tone: 'student' },
    ],
    users,
  }
}
