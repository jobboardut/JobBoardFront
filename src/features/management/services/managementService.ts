import { Building2, CheckCircle2, GraduationCap, UserSquare2, XCircle } from 'lucide-react'
import { apiEndpoints } from '../../../services/apiEndpoints'
import type { ManagementMetric, ManagementUser } from '../types/management.types'

export const MANAGEMENT_OVERVIEW_ENDPOINT = apiEndpoints.managementOverview

export type ManagementOverview = {
  metrics: ManagementMetric[]
  users: ManagementUser[]
}

export function getManagementOverview(): ManagementOverview {
  // Punto de acoplamiento para API futura del centro de gestion.
  return {
    metrics: [
      { label: 'Activos', value: 4, Icon: CheckCircle2, tone: 'active' },
      { label: 'Inactivos', value: 1, Icon: XCircle, tone: 'inactive' },
      { label: 'Egresados', value: 3, Icon: GraduationCap, tone: 'graduate' },
      { label: 'Empresas', value: 2, Icon: Building2, tone: 'company' },
      { label: 'Estudiantes', value: 5, Icon: UserSquare2, tone: 'student' },
    ],
    users: [
      {
        id: '1',
        fullName: 'María García López',
        description: 'Descripción de compafioz',
        avatarLetter: 'M',
        type: 'Egresado',
        contact: 'maria@gmail.com',
        contactPhone: '222-123-4567',
        registerDate: '29/09/2023',
        state: 'Activo',
        detailTitle: 'Datos del usuario',
        detailItems: [
          { label: 'Programa', value: 'Ingeniería en Software' },
          { label: 'Correo institucional', value: 'maria.garcia@uttec.com' },
          { label: 'Registro', value: '29/09/2023' },
          { label: 'Estado', value: 'Activo' },
        ],
      },
      {
        id: '2',
        fullName: 'TechSolutions S.A.',
        description: 'Descripción de carachos',
        avatarLetter: 'T',
        type: 'Empresa',
        contact: 'techsolutions.com',
        contactPhone: '222-987-6543',
        registerDate: '20/08/2023',
        state: 'Inactivo',
        detailTitle: 'Datos de la empresa',
        detailItems: [
          { label: 'Sector', value: 'Tecnología' },
          { label: 'Representante', value: 'Carlos Mendoza' },
          { label: 'RFC', value: 'TSA200820A11' },
          { label: 'Estado', value: 'Inactivo' },
        ],
      },
      {
        id: '3',
        fullName: 'TechSolutions S.A.',
        description: 'Descripción de napoloona',
        avatarLetter: 'T',
        type: 'Empresa',
        contact: 'techcom@gmail.com',
        contactPhone: '222-654-1200',
        registerDate: '29/03/2023',
        state: 'Activo',
        detailTitle: 'Datos de la empresa',
        detailItems: [
          { label: 'Sector', value: 'Tecnología' },
          { label: 'Representante', value: 'Laura Hernández' },
          { label: 'RFC', value: 'TEC230329B22' },
          { label: 'Estado', value: 'Activo' },
        ],
      },
      {
        id: '4',
        fullName: 'TechSolutions S.A.',
        description: 'Descripción de conacto y',
        avatarLetter: 'T',
        type: 'Empresa',
        contact: 'uttecam@gmail.com',
        contactPhone: '222-445-3399',
        registerDate: '29/03/2023',
        state: 'Inactivo',
        detailTitle: 'Datos de la empresa',
        detailItems: [
          { label: 'Sector', value: 'Manufactura' },
          { label: 'Representante', value: 'Laura Hernández' },
          { label: 'RFC', value: 'UTM230329C33' },
          { label: 'Estado', value: 'Inactivo' },
        ],
      },
      {
        id: '5',
        fullName: 'TechSolutions S.A.',
        description: 'Descripción de napoloona',
        avatarLetter: 'T',
        type: 'Empresa',
        contact: 'techcom@gmail.com',
        contactPhone: '222-654-1201',
        registerDate: '29/03/2023',
        state: 'Activo',
        detailTitle: 'Datos de la empresa',
        detailItems: [
          { label: 'Sector', value: 'Manufactura' },
          { label: 'Representante', value: 'Laura Hernández' },
          { label: 'RFC', value: 'TEC230329D44' },
          { label: 'Estado', value: 'Activo' },
        ],
      },
    ],
  }
}