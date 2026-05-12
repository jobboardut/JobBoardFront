import { Building2, FileBadge, GraduationCap, Users } from 'lucide-react'
import { apiEndpoints } from '../../../services/apiEndpoints'
import type { ValidationMetric, ValidationRequest } from '../types/validation.types'

export const VALIDATION_OVERVIEW_ENDPOINT = apiEndpoints.validationOverview

export type ValidationOverview = {
  metrics: ValidationMetric[]
  requests: ValidationRequest[]
}

export function getValidationOverview(): ValidationOverview {
  // Punto de acoplamiento para API futura de validacion.
  return {
    metrics: [
      { label: 'Pendientes', value: 4, Icon: FileBadge, tone: 'orange' },
      { label: 'Egresados', value: 2, Icon: GraduationCap, tone: 'green' },
      { label: 'Empresas', value: 2, Icon: Building2, tone: 'blue' },
      { label: 'Alumnos', value: 6, Icon: Users, tone: 'green' },
    ],
    requests: [
      {
        id: '1',
        fullName: 'María García López',
        profile: 'Ingeniería en Software',
        type: 'Alumno',
        avatarPhoto: '/perfil-alumno.svg',
        contactEmail: 'maria.garcia@email.com',
        contactPhone: '222-123-4567',
        evidencePhoto: '/documento-probatorio.svg',
        submittedAgo: 'Hace 2 horas',
        state: 'Pendiente',
        accountState: 'Activo',
        detailTitle: 'Datos del Alumno',
        detailItems: [
          { label: 'Programa', value: 'Ingeniería en Software' },
          { label: 'Nacimiento', value: '2000-04-11' },
          { label: 'Dirección', value: 'Av. Juárez 101, Puebla' },
          { label: 'Correo institucional', value: 'maria.garcia@uttec.com' },
          { label: 'Estado civil', value: 'Soltera' },
          { label: 'CV', value: 'curriculum_maria.pdf', isLink: true },
        ],
      },
      {
        id: '2',
        fullName: 'TechSolutions S.A.',
        profile: 'Tecnología',
        type: 'Empresa',
        contactEmail: 'contacto@techsolutions.com',
        contactPhone: '222-987-6543',
        submittedAgo: 'Hace 5 horas',
        state: 'Pendiente',
        accountState: 'Inactivo',
        detailTitle: 'Datos de la Empresa',
        detailItems: [
          { label: 'Empresa', value: 'TechSolutions S.A.' },
          { label: 'Sector', value: 'Tecnología' },
          { label: 'Ubicación', value: 'Puebla, México' },
          { label: 'Representante', value: 'Carlos Mendoza' },
        ],
      },
      {
        id: '3',
        fullName: 'Juan Pérez Ramírez',
        profile: 'Administración de Empresas',
        type: 'Egresado',
        avatarPhoto: '/perfil-egresado.svg',
        contactEmail: 'juan.perez@email.com',
        contactPhone: '222-456-7890',
        evidencePhoto: '/documento-probatorio.svg',
        submittedAgo: 'Hace 1 día',
        state: 'Pendiente',
        accountState: 'Inactivo',
        detailTitle: 'Datos del Egresado',
        detailItems: [
          { label: 'Programa', value: 'Administración de Empresas' },
          { label: 'Nacimiento', value: '1999-08-22' },
          { label: 'Dirección', value: 'Av. Reforma 456, Puebla' },
          { label: 'Correo institucional', value: 'juan.perez@uttec.com' },
          { label: 'Estado civil', value: 'Casado' },
          { label: 'CV', value: 'curriculum_juan.pdf', isLink: true },
        ],
      },
      {
        id: '4',
        fullName: 'Innovatech Corp',
        profile: 'Manufactura',
        type: 'Empresa',
        contactEmail: 'rh@innovatech.mx',
        contactPhone: '222-111-2233',
        submittedAgo: 'Hace 2 días',
        state: 'Pendiente',
        accountState: 'Inactivo',
        detailTitle: 'Datos de la Empresa',
        detailItems: [
          { label: 'Empresa', value: 'Innovatech Corp' },
          { label: 'Sector', value: 'Manufactura' },
          { label: 'Ubicación', value: 'Puebla, México' },
          { label: 'Representante', value: 'Laura Hernández' },
        ],
      },
    ],
  }
}