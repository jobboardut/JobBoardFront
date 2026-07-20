import { useCallback, useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppToast } from '@/shared/components/appToastContext'
import { useConfirmDialog } from '@/shared/components/appConfirmContext'
import type { Application } from '../types/seguimiento.types'
import type { JobDetailData } from '@/shared/types/job.types'
import { seguimientoService } from '../services/seguimiento.service'
import { estudianteService } from '../services/estudiante.service'

const getUserId = () => Number(localStorage.getItem('userId'))

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code < 0x300 || code > 0x36f
    })
    .join('')
    .trim()
    .toLowerCase()

export const useSeguimiento = () => {
  const estudianteId = getUserId()
  const toast = useAppToast()
  const { confirm } = useConfirmDialog()
  const queryClient = useQueryClient()
  const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [applicationSearchText, setApplicationSearchText] = useState('')
  const [selectedJobModal, setSelectedJobModal] = useState<JobDetailData | null>(null)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [selectedModalidades, setSelectedModalidades] = useState<string[]>([])
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

  const modalidadesNormalizadas = selectedModalidades.map(normalizeText)
  const searchApplications = modalidadesNormalizadas.length
    ? applicationsData.filter((app) =>
        modalidadesNormalizadas.includes(normalizeText(app.modality ?? ''))
      )
    : applicationsData

  const displayApplications = viewMode === 'detail' ? filteredApplications : searchApplications

  const toggleModalidad = useCallback((modalidad: string) => {
    setSelectedModalidades((current) =>
      current.includes(modalidad)
        ? current.filter((value) => value !== modalidad)
        : [...current, modalidad]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedModalidades([])
  }, [])

  const applicationsByStatus = {
    POSTULADO: applicationsData.filter((app) => app.status === 'POSTULADO').length,
    'CV VISTO': applicationsData.filter((app) => app.status === 'CV VISTO').length,
    ENTREVISTA: applicationsData.filter((app) => app.status === 'ENTREVISTA').length,
    CONTRATADO: applicationsData.filter((app) => app.status === 'CONTRATADO').length,
    RECHAZADO: applicationsData.filter((app) => app.status === 'RECHAZADO').length,
  }

  const retirarMutation = useMutation({
    mutationFn: (postulacionId: number) => estudianteService.retirarPostulacion(estudianteId, postulacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'postulaciones', estudianteId] })
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'dashboard', estudianteId] })
    },
  })

  const retirarPostulacion = useCallback(async (app: Application) => {
    if (!app.postulacionId) {
      toast.warning('No se pudo identificar la postulacion', 'Actualiza la pagina e intenta de nuevo.')
      return
    }

    const accepted = await confirm({
      title: 'Retirar postulacion',
      message: `Dejaras de participar en el proceso de "${app.jobTitle}" en ${app.company}. Esta accion no se puede deshacer.`,
      confirmLabel: 'Retirar postulacion',
      cancelLabel: 'Seguir participando',
      tone: 'danger',
    })

    if (!accepted) return

    try {
      await retirarMutation.mutateAsync(app.postulacionId)
      toast.success('Postulacion retirada', `Ya no participas en "${app.jobTitle}".`)
    } catch {
      toast.error('No se pudo retirar', 'Intenta de nuevo en unos segundos.')
    }
  }, [confirm, retirarMutation, toast])

  return {
    retirarPostulacion,
    isRetirando: retirarMutation.isPending,
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
    selectedModalidades,
    hasActiveFilters: selectedModalidades.length > 0,
    toggleModalidad,
    clearFilters,
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
