import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Application } from '../types/seguimiento.types'
import type { JobDetailData } from '@/shared/types/job.types'
import { seguimientoService } from '../services/seguimiento.service'

const getUserId = () => Number(localStorage.getItem('userId'))

export const useSeguimiento = () => {
  const estudianteId = getUserId()
  const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [applicationSearchText, setApplicationSearchText] = useState('')
  const [selectedJobModal, setSelectedJobModal] = useState<JobDetailData | null>(null)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const applicationSearchInputRef = useRef<HTMLInputElement>(null)

  const applicationsQuery = useQuery({
    queryKey: ['estudiante', 'postulaciones', estudianteId],
    queryFn: () => seguimientoService.getApplications(estudianteId),
    enabled: !!estudianteId,
  })

  const applicationsData = applicationsQuery.data ?? []

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

  const convertApplicationToJobDetailData = (app: Application): JobDetailData => ({
    id: app.id,
    title: app.jobTitle,
    company: app.company,
    location: app.location ?? 'No especificado',
    salary: app.salary ?? 'Sueldo no especificado',
    schedule: app.schedule ?? 'No especificado',
    type: app.modality ?? 'No especificado',
    experience: app.experience ?? 'No especificado',
    timeAgo: app.postulationDate,
    description:
      app.description ||
      `Tu postulacion para ${app.jobTitle} en ${app.company} fue registrada correctamente.`,
    responsibilities: app.responsibilities?.length
      ? app.responsibilities
      : ['Revisa periodicamente el avance de tu candidatura.'],
  })

  const openJobModal = (app: Application) => {
    const detail = convertApplicationToJobDetailData(app)
    setSelectedJobModal(detail)
    setIsJobModalOpen(true)
  }

  const closeJobModal = () => {
    setIsJobModalOpen(false)
    setSelectedJobModal(null)
  }

  const filteredApplications = applicationSearchText
    ? applicationsData.filter((app) =>
        app.jobTitle.toLowerCase().includes(applicationSearchText.toLowerCase()) ||
        app.company.toLowerCase().includes(applicationSearchText.toLowerCase())
      )
    : applicationsData

  const displayApplications = viewMode === 'detail' ? filteredApplications : applicationsData

  const applicationsByStatus = {
    'EN REVISIÓN': applicationsData.filter((app) => app.status === 'EN REVISIÓN').length,
    ACEPTADO: applicationsData.filter((app) => app.status === 'ACEPTADO').length,
    APRUEBA: applicationsData.filter((app) => app.status === 'APRUEBA').length,
    CONTRATADO: applicationsData.filter((app) => app.status === 'CONTRATADO').length,
    PENDIENTE: applicationsData.filter((app) => app.status === 'PENDIENTE').length,
    RECHAZADO: applicationsData.filter((app) => app.status === 'RECHAZADO').length,
  }

  return {
    viewMode,
    applications: displayApplications,
    applicationsByStatus,
    isSearchOpen,
    searchText,
    searchInputRef,
    selectedJobModal,
    isJobModalOpen,
    applicationSearchText,
    applicationSearchInputRef,
    isLoading: applicationsQuery.isLoading,
    isError: applicationsQuery.isError,
    openSearchMode,
    closeSearchMode,
    setSearchText,
    setApplicationSearchText,
    openJobModal,
    closeJobModal,
  }
}
