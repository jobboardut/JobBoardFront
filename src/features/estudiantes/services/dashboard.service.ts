import { estudianteService } from './estudiante.service'
import type { Application } from '../types/seguimiento.types'

export interface StudentDashboardData {
  applications: Application[]
  recentApplications: Application[]
  totalPostulaciones: number
}

export const dashboardService = {
  getOverview: async (estudianteId: number): Promise<StudentDashboardData> => {
    const [applications, recentSummary] = await Promise.all([
      estudianteService.getPostulaciones(estudianteId),
      estudianteService.getPostulacionesRecientes(estudianteId),
    ])

    return {
      applications,
      recentApplications: recentSummary.recientes,
      totalPostulaciones: recentSummary.totalPostulaciones || applications.length,
    }
  },
}
