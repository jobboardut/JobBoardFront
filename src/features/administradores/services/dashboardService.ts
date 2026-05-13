import type { SummaryCard, VacancyRow } from '../types/dashboard.types'
import { ArrowUpRight, BriefcaseBusiness, Users } from 'lucide-react'
import { apiEndpoints } from '../../../services/apiEndpoints'

export const DASHBOARD_OVERVIEW_ENDPOINT = apiEndpoints.dashboardOverview

export type DashboardOverview = {
  summaryCards: SummaryCard[]
  vacancyRows: VacancyRow[]
  recentActivity: string[]
}

export function getDashboardOverview(): DashboardOverview {
  // Punto de acoplamiento para API futura del dashboard.
  return {
    summaryCards: [
      {
        label: 'Vacantes totales',
        value: 12,
        Icon: BriefcaseBusiness,
        accent: 'orange',
        subtitle: 'Publicadas y en revisión',
      },
      {
        label: 'Vacantes activas',
        value: 10,
        Icon: ArrowUpRight,
        accent: 'teal',
        subtitle: 'Listas para recibir candidatos',
      },
      {
        label: 'Usuarios del sistema',
        value: 28,
        Icon: Users,
        accent: 'violet',
        subtitle: 'Cuentas habilitadas para operar',
      },
    ],
    vacancyRows: [
      {
        title: 'Desarrollador frontend',
        description: 'Desarrollo web · Tiempo completo',
        status: 'ACTIVO',
        applicants: 10,
      },
      {
        title: 'Desarrollador backend',
        description: 'Ingeniería de software · Tiempo completo',
        status: 'ACTIVO',
        applicants: 0,
      },
      {
        title: 'Diseñador UX/UI',
        description: 'Diseño de producto · Medio tiempo',
        status: 'ACTIVO',
        applicants: 0,
      },
    ],
    recentActivity: [
      'Nuevo registro de usuario validado por administración.',
      'Vacante "Desarrollador frontend" actualizada.',
      'Se generó un nuevo acceso para un administrador.',
    ],
  }
}