import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BriefcaseBusiness, Users } from 'lucide-react'
import { formatMoney } from '@/shared/utils/money'
import type { ActivityColumn, JobItem, Metric } from '../types/dashboard.types'
import type { Application } from '../types/seguimiento.types'
import type { Vacante } from '../types/publicaciones.types'
import type { JobDetailData } from '@/shared/types/job.types'
import { dashboardService } from '../services/dashboard.service'
import { publicacionesService } from '../services/publicaciones.service'
import { mapApplicationToJobItem } from '../services/estudiante.service'

const getUserId = () => Number(localStorage.getItem('userId'))

export const MODALIDADES_DASHBOARD = ['Presencial', 'Remota', 'Hibrida'] as const
export const SALARY_BOUNDS_DASHBOARD = { min: 5000, max: 100000 } as const

const normalizeText = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const vacanteToJobItem = (vacante: Vacante): JobItem => ({
  id: String(vacante.id),
  title: vacante.titulo,
  company: vacante.nombreEmpresa,
  salary: formatMoney(vacante.sueldoAprox),
  location: vacante.modalidad || 'No especificada',
  type: vacante.modalidad || 'No especificada',
  availability: 'Inmediata',
})

const buildMetrics = (applications: Application[], totalPostulaciones: number): Metric[] => {
  const activeApplications = applications.filter(
    (application) =>
      application.status !== 'CONTRATADO' &&
      application.status !== 'RECHAZADO' &&
      application.status !== 'RETIRADO'
  ).length

  return [
    {
      label: 'Total de postulaciones',
      value: totalPostulaciones,
      icon: BriefcaseBusiness,
    },
    {
      label: 'Postulaciones activas',
      value: activeApplications,
      icon: Users,
    },
  ]
}

const buildActivityColumns = (applications: Application[]): ActivityColumn[] => {
  const inReview = applications.filter((application) =>
    ['POSTULADO', 'CV VISTO'].includes(application.status)
  )
  const inProgress = applications.filter((application) => application.status === 'ENTREVISTA')
  const finished = applications.filter((application) =>
    ['CONTRATADO', 'RECHAZADO', 'RETIRADO'].includes(application.status)
  )

  return [
    {
      title: 'Pendientes',
      count: inReview.length,
      status: 'En revision',
      items: inReview.slice(0, 2).map(mapApplicationToJobItem),
    },
    {
      title: 'En progreso',
      count: inProgress.length,
      status: 'En progreso',
      items: inProgress.slice(0, 2).map(mapApplicationToJobItem),
    },
    {
      title: 'Proceso finalizado',
      count: finished.length,
      status: 'Proceso finalizado',
      items: finished.slice(0, 2).map(mapApplicationToJobItem),
    },
  ]
}

const convertJobItemToJobDetailData = (item: JobItem): JobDetailData => ({
  id: item.id,
  title: item.title,
  company: item.company,
  location: item.location,
  salary: item.salary,
  schedule: 'No especificado',
  type: item.type,
  experience: 'No especificado',
  timeAgo: item.date ?? 'Sin fecha',
  description: `Oportunidad para trabajar como ${item.title} en ${item.company}.`,
  responsibilities: ['Revisa los detalles de la vacante con la empresa.'],
})

export const useDashboard = () => {
  const estudianteId = getUserId()
  const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedJobModal, setSelectedJobModal] = useState<JobDetailData | null>(null)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [selectedModalidades, setSelectedModalidades] = useState<string[]>([])
  const [minSalary, setMinSalary] = useState<number>(SALARY_BOUNDS_DASHBOARD.min)

  const dashboardQuery = useQuery({
    queryKey: ['estudiante', 'dashboard', estudianteId],
    queryFn: () => dashboardService.getOverview(estudianteId),
    enabled: !!estudianteId,
  })

  // La vista de busqueda antes siempre venia vacia; ahora consulta vacantes reales.
  const vacantesQuery = useQuery({
    queryKey: ['estudiante', 'vacantes', 'dashboard'],
    queryFn: () => publicacionesService.getVacantes(),
  })

  const dashboardData = dashboardQuery.data
  const applications = dashboardData?.applications ?? []
  const recentApplications = dashboardData?.recentApplications.length
    ? dashboardData.recentApplications
    : applications.slice(0, 5)
  const totalPostulaciones = dashboardData?.totalPostulaciones ?? applications.length
  const metrics = buildMetrics(applications, totalPostulaciones)
  const activityColumns = buildActivityColumns(recentApplications)

  const searchPublicationItems: JobItem[] = useMemo(() => {
    const vacantes = vacantesQuery.data ?? []
    const query = normalizeText(searchText)

    return vacantes
      .filter((vacante) => {
        const matchTexto =
          !query ||
          normalizeText(vacante.titulo).includes(query) ||
          normalizeText(vacante.nombreEmpresa).includes(query)

        const matchModalidad =
          selectedModalidades.length === 0 ||
          selectedModalidades.some(
            (modalidad) => normalizeText(modalidad) === normalizeText(vacante.modalidad ?? ''),
          )

        const matchSueldo =
          minSalary <= SALARY_BOUNDS_DASHBOARD.min ||
          !vacante.sueldoAprox ||
          vacante.sueldoAprox >= minSalary

        return matchTexto && matchModalidad && matchSueldo
      })
      .map(vacanteToJobItem)
  }, [vacantesQuery.data, searchText, selectedModalidades, minSalary])

  const toggleModalidad = (modalidad: string) => {
    setSelectedModalidades((current) =>
      current.includes(modalidad)
        ? current.filter((item) => item !== modalidad)
        : [...current, modalidad],
    )
  }

  const clearFilters = () => {
    setSelectedModalidades([])
    setMinSalary(SALARY_BOUNDS_DASHBOARD.min)
  }

  const hasActiveFilters =
    selectedModalidades.length > 0 || minSalary > SALARY_BOUNDS_DASHBOARD.min

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus()
    }
  }, [isSearchOpen])

  const openSearchMode = () => {
    setIsSearchOpen(true)
    setViewMode('search')
  }

  const closeSearchMode = () => {
    setIsSearchOpen(false)
    window.setTimeout(() => {
      setViewMode('detail')
    }, 220)
  }

  const openJobModal = (item: JobItem) => {
    const detail = convertJobItemToJobDetailData(item)
    setSelectedJobModal(detail)
    setIsJobModalOpen(true)
  }

  const closeJobModal = () => {
    setIsJobModalOpen(false)
    setSelectedJobModal(null)
  }

  return {
    viewMode,
    isSearchOpen,
    searchText,
    searchInputRef,
    metrics,
    activityColumns,
    searchPublicationItems,
    selectedJobModal,
    isJobModalOpen,
    isLoading: dashboardQuery.isLoading,
    isError: dashboardQuery.isError,
    isLoadingVacantes: vacantesQuery.isLoading,
    openSearchMode,
    closeSearchMode,
    setSearchText,
    openJobModal,
    closeJobModal,
    // Filtros de la vista de busqueda
    modalidades: MODALIDADES_DASHBOARD,
    selectedModalidades,
    toggleModalidad,
    minSalary,
    setMinSalary,
    salaryBounds: SALARY_BOUNDS_DASHBOARD,
    clearFilters,
    hasActiveFilters,
  }
}
