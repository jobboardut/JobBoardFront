import type { UserCard } from '../types/usersDashboard.types'
import { apiEndpoints } from '../../../../services/apiEndpoints'

export const USERS_DASHBOARD_ENDPOINT = apiEndpoints.usersDashboard

export type UsersDashboardData = {
  userCards: UserCard[]
}

export function getUsersDashboardData(): UsersDashboardData {
  // Punto de acoplamiento para API futura de usuarios.
  return {
    userCards: [
      {
        title: 'Administradores',
        indicator: 'Acceso total',
        count: 4,
        description: 'Gestionan catálogos, permisos y configuración general.',
        tone: 'accent',
      },
      {
        title: 'Usuarios activos',
        indicator: 'Operando',
        count: 18,
        description: 'Cuentas con actividad reciente y permisos vigentes.',
        tone: 'success',
      },
      {
        title: 'Usuarios en validación',
        indicator: 'Pendiente',
        count: 3,
        description: 'Cuentas en espera de revisión o activación manual.',
        tone: 'warning',
      },
      {
        title: 'Usuarios con acceso limitado',
        indicator: 'Restricción',
        count: 2,
        description: 'Perfiles con permisos parciales o temporales.',
        tone: 'info',
      },
      {
        title: 'Usuarios inactivos',
        indicator: 'Sin sesión',
        count: 1,
        description: 'Cuentas sin actividad reciente o pausadas por control interno.',
        tone: 'neutral',
      },
    ],
  }
}