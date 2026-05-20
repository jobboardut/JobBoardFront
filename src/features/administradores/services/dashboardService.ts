import { BriefcaseBusiness, CircleCheckBig, Users } from 'lucide-react'
import { adminService } from './admin.service'
import type { VacanteReciente } from '../types/admin.types'
import type { SummaryCard, VacancyRow } from '../types/dashboard.types'

export type DashboardOverview = {
  summaryCards: SummaryCard[]
  vacancyRows: VacancyRow[]
  recentActivity: string[]
}

const normalizeStatus = (estatus: string): VacancyRow['status'] => {
  const normalized = estatus.toLowerCase()
  if (normalized.includes('paus')) {
    return 'PAUSADO'
  }

  if (normalized.includes('borr')) {
    return 'BORRADOR'
  }

  return 'ACTIVO'
}

const toVacancyRow = (vacancy: VacanteReciente): VacancyRow => ({
  title: vacancy.titulo,
  description: `${vacancy.nombreEmpresa} - ${vacancy.modalidad}`,
  status: normalizeStatus(vacancy.estatus),
  applicants: vacancy.totalPostulantes,
})

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [stats, publications, recentVacancies] = await Promise.all([
    adminService.getEstadisticasUsuarios(),
    adminService.getPublicaciones(),
    adminService.getVacantesRecientes(),
  ])

  const totalUsers = stats.totalEstudiantes + stats.totalEmpresas
  const totalApplications = publications.publicaciones.reduce(
    (total, vacancy) => total + vacancy.totalPostulantes,
    0
  )

  return {
    summaryCards: [
      {
        label: 'Usuarios',
        value: totalUsers,
        Icon: Users,
        accent: 'orange',
        subtitle: `${stats.totalEstudiantes} estudiantes / ${stats.totalEmpresas} empresas`,
      },
      {
        label: 'Vacantes activas',
        value: publications.activas,
        Icon: CircleCheckBig,
        accent: 'teal',
        subtitle: `${publications.total} publicaciones registradas`,
      },
      {
        label: 'Postulantes',
        value: totalApplications,
        Icon: BriefcaseBusiness,
        accent: 'violet',
        subtitle: 'Postulaciones en publicaciones',
      },
    ],
    vacancyRows: recentVacancies.map(toVacancyRow),
    recentActivity: recentVacancies.map(
      (vacancy) => `${vacancy.nombreEmpresa} publico ${vacancy.titulo}`
    ),
  }
}
