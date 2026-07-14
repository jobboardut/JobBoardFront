import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatMoney } from '@/shared/utils/money'
import { getLugaresInfo } from '@/shared/utils/lugares'
import { publicacionesService } from '../services/publicaciones.service'
import { estudianteService } from '../services/estudiante.service'
import type { Application } from '../types/seguimiento.types'
import type { JobCardItem, SearchPublicationItem, Vacante } from '../types/publicaciones.types'

const getUserId = () => Number(localStorage.getItem('userId'))

const formatSalary = (value: number | null): string => formatMoney(value)

const formatDate = (iso: string): string => {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

const getVacanteKey = (vacante: Pick<Vacante, 'titulo' | 'nombreEmpresa'>): string =>
  `${normalizeText(vacante.titulo)}|${normalizeText(vacante.nombreEmpresa)}`

const getApplicationKey = (application: Pick<Application, 'jobTitle' | 'company'>): string =>
  `${normalizeText(application.jobTitle)}|${normalizeText(application.company)}`

const toJobCardItem = (vacante: Vacante, isApplied = false): JobCardItem => {
  const lugares = getLugaresInfo(vacante)

  return {
    id: vacante.id,
    title: vacante.titulo,
    company: vacante.nombreEmpresa,
    salary: formatSalary(vacante.sueldoAprox),
    modality: vacante.modalidad,
    dateLabel: formatDate(vacante.fechaPublicacion),
    applicantCount: vacante.totalPostulantes,
    logoUrl: vacante.empresaLogoUrl,
    isApplied,
    placesLabel: lugares?.label ?? null,
    placesFull: lugares?.isFull ?? false,
  }
}

const toSearchItem = (vacante: Vacante, isApplied = false): SearchPublicationItem => ({
  id: vacante.id,
  title: vacante.titulo,
  company: vacante.nombreEmpresa,
  description: vacante.descripcion,
  typeTag: vacante.modalidad,
  salaryTag: formatSalary(vacante.sueldoAprox),
  timeAgo: formatDate(vacante.fechaPublicacion),
  logoUrl: vacante.empresaLogoUrl,
  isApplied,
})

export type ApplyFeedback = {
  type: 'ok' | 'error'
  message: string
}

const SALARY_BOUNDS = { min: 5000, max: 100000 }

export const usePublicaciones = () => {
  const userId = getUserId()
  const queryClient = useQueryClient()
  const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [appliedIds, setAppliedIds] = useState<number[]>([])
  const [feedback, setFeedback] = useState<ApplyFeedback | null>(null)
  const [selectedModalidades, setSelectedModalidades] = useState<string[]>([])
  const [minSalary, setMinSalary] = useState<number>(SALARY_BOUNDS.min)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus()
  }, [isSearchOpen])

  const { data: vacantes = [], isLoading, isError } = useQuery({
    queryKey: ['estudiante', 'vacantes'],
    queryFn: () => publicacionesService.getVacantes(),
  })

  const postulacionesQuery = useQuery({
    queryKey: ['estudiante', 'postulaciones', userId],
    queryFn: () => estudianteService.getPostulaciones(userId),
    enabled: !!userId,
  })

  const appliedVacanteIds = useMemo(() => {
    const ids = new Set(appliedIds)
    const applicationKeys = new Set<string>()

    for (const application of postulacionesQuery.data ?? []) {
      if (application.vacancyId) {
        ids.add(application.vacancyId)
      }

      applicationKeys.add(getApplicationKey(application))
    }

    for (const vacante of vacantes) {
      if (applicationKeys.has(getVacanteKey(vacante))) {
        ids.add(vacante.id)
      }
    }

    return ids
  }, [appliedIds, postulacionesQuery.data, vacantes])

  const isVacanteApplied = useCallback(
    (vacante: Vacante) => appliedVacanteIds.has(vacante.id),
    [appliedVacanteIds]
  )

  const vacantesFiltradas = useMemo(() => {
    const term = searchText.trim().toLowerCase()
    const modalidadesNormalizadas = selectedModalidades.map(normalizeText)

    return vacantes.filter((vacante) => {
      const matchTerm = !term || [vacante.titulo, vacante.nombreEmpresa, vacante.descripcion, vacante.modalidad]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))

      const matchModalidad = modalidadesNormalizadas.length === 0 ||
        modalidadesNormalizadas.includes(normalizeText(vacante.modalidad ?? ''))

      const matchSueldo = minSalary <= SALARY_BOUNDS.min ||
        !vacante.sueldoAprox ||
        vacante.sueldoAprox >= minSalary

      return matchTerm && matchModalidad && matchSueldo
    })
  }, [vacantes, searchText, selectedModalidades, minSalary])

  const toggleModalidad = useCallback((modalidad: string) => {
    setSelectedModalidades((current) =>
      current.includes(modalidad)
        ? current.filter((value) => value !== modalidad)
        : [...current, modalidad]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedModalidades([])
    setMinSalary(SALARY_BOUNDS.min)
  }, [])

  const hasActiveFilters = selectedModalidades.length > 0 || minSalary > SALARY_BOUNDS.min

  const vacantesDisponibles = useMemo(
    () => vacantesFiltradas.filter((vacante) => !isVacanteApplied(vacante)),
    [isVacanteApplied, vacantesFiltradas]
  )

  const vacantesPostuladas = useMemo(
    () => vacantesFiltradas.filter((vacante) => isVacanteApplied(vacante)),
    [isVacanteApplied, vacantesFiltradas]
  )

  const orderedSearchVacantes = useMemo(
    () => [...vacantesDisponibles, ...vacantesPostuladas],
    [vacantesDisponibles, vacantesPostuladas]
  )

  const selectedVacante = useMemo<Vacante | null>(() => {
    if (vacantes.length === 0) return null

    return vacantes.find((vacante) => vacante.id === selectedId) ??
      vacantesDisponibles[0] ??
      vacantesPostuladas[0] ??
      null
  }, [selectedId, vacantes, vacantesDisponibles, vacantesPostuladas])

  const listItems = useMemo(
    () => vacantesDisponibles.map((vacante) => toJobCardItem(vacante)),
    [vacantesDisponibles]
  )
  const appliedListItems = useMemo(
    () => vacantesPostuladas.map((vacante) => toJobCardItem(vacante, true)),
    [vacantesPostuladas]
  )
  const searchPublicationItems = useMemo(
    () => orderedSearchVacantes.map((vacante) => toSearchItem(vacante, isVacanteApplied(vacante))),
    [isVacanteApplied, orderedSearchVacantes]
  )

  const postularMutation = useMutation({
    mutationFn: (publicacionId: number) => {
      if (!userId) {
        return Promise.reject(new Error('No se encontro la sesion del estudiante.'))
      }

      return publicacionesService.postular(userId, publicacionId)
    },
    onSuccess: (_data, publicacionId) => {
      setAppliedIds((current) => (
        current.includes(publicacionId) ? current : [...current, publicacionId]
      ))
      setFeedback({ type: 'ok', message: 'Tu postulacion fue enviada correctamente.' })
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'postulaciones'] })
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'vacantes'] })
    },
    onError: (error: unknown) => {
      const message = (error as { message?: string })?.message ?? 'No se pudo enviar la postulacion.'
      setFeedback({ type: 'error', message })
    },
  })

  const openSearchMode = () => {
    setIsSearchOpen(true)
    setViewMode('search')
  }

  const closeSearchMode = () => {
    setIsSearchOpen(false)
    window.setTimeout(() => setViewMode('detail'), 220)
  }

  const clearFeedback = useCallback(() => {
    setFeedback(null)
  }, [])

  return {
    viewMode,
    isSearchOpen,
    searchText,
    searchInputRef,
    listItems,
    searchPublicationItems,
    selectedVacante,
    isLoading,
    isError,
    isApplying: postularMutation.isPending,
    appliedIds: [...appliedVacanteIds],
    appliedListItems,
    feedback,
    selectedModalidades,
    minSalary,
    salaryBounds: SALARY_BOUNDS,
    hasActiveFilters,
    toggleModalidad,
    setMinSalary,
    clearFilters,
    openSearchMode,
    closeSearchMode,
    setSearchText,
    selectVacante: setSelectedId,
    postular: (publicacionId: number) => postularMutation.mutate(publicacionId),
    clearFeedback,
  }
}
