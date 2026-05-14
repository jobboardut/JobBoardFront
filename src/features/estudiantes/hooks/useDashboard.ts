import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BriefcaseBusiness, Users } from 'lucide-react'
import type { ActivityColumn, JobItem, Metric } from '../types/dashboard.types'
import type { Application } from '../types/seguimiento.types'
import type { JobDetailData } from '@/shared/types/job.types'
import { dashboardService } from '../services/dashboard.service'
import { mapApplicationToJobItem } from '../services/estudiante.service'

const getUserId = () => Number(localStorage.getItem('userId'))

const buildMetrics = (applications: Application[], totalPostulaciones: number): Metric[] => {
  const activeApplications = applications.filter(
    (application) => application.status !== 'CONTRATADO' && application.status !== 'RECHAZADO'
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
  const inReview = applications.filter((application) => application.status === 'EN REVISIÓN')
  const inProgress = applications.filter((application) =>
    ['PENDIENTE', 'APRUEBA', 'ACEPTADO'].includes(application.status)
  )
  const finished = applications.filter((application) =>
    ['CONTRATADO', 'RECHAZADO'].includes(application.status)
  )

  return [
    {
      title: 'En revision',
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

  const dashboardQuery = useQuery({
    queryKey: ['estudiante', 'dashboard', estudianteId],
    queryFn: () => dashboardService.getOverview(estudianteId),
    enabled: !!estudianteId,
  })

  const dashboardData = dashboardQuery.data
  const applications = dashboardData?.applications ?? []
  const recentApplications = dashboardData?.recentApplications.length
    ? dashboardData.recentApplications
    : applications.slice(0, 5)
  const totalPostulaciones = dashboardData?.totalPostulaciones ?? applications.length
  const metrics = buildMetrics(applications, totalPostulaciones)
  const activityColumns = buildActivityColumns(recentApplications)
  const searchPublicationItems: JobItem[] = []

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
    openSearchMode,
    closeSearchMode,
    setSearchText,
    openJobModal,
    closeJobModal,
  }
}
