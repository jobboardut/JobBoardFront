import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { publicacionesService } from '../services/publicaciones.service'
import type { JobCardItem, SearchPublicationItem, Vacante } from '../types/publicaciones.types'

const getUserId = () => Number(localStorage.getItem('userId'))

const formatSalary = (value: number | null): string =>
  typeof value === 'number' && value > 0 ? `$ ${value.toLocaleString('es-MX')}` : 'Sueldo no especificado'

const formatTimeAgo = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

const toJobCardItem = (v: Vacante): JobCardItem => ({
  id: v.id,
  title: v.titulo,
  company: v.nombreEmpresa,
  location: v.modalidad,
  salary: formatSalary(v.sueldoAprox),
  modality: v.modalidad,
})

const toSearchItem = (v: Vacante): SearchPublicationItem => ({
  id: v.id,
  title: v.titulo,
  location: v.nombreEmpresa,
  description: v.descripcion,
  typeTag: v.modalidad,
  salaryTag: formatSalary(v.sueldoAprox),
  timeAgo: formatTimeAgo(v.fechaPublicacion),
})

export type ApplyFeedback = { type: 'ok' | 'error'; message: string }

export const usePublicaciones = () => {
  const userId = getUserId()
  const queryClient = useQueryClient()

  // --- Estado de UI ---
  const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [appliedIds, setAppliedIds] = useState<number[]>([])
  const [feedback, setFeedback] = useState<ApplyFeedback | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus()
  }, [isSearchOpen])

  // --- Datos reales ---
  const { data: vacantes = [], isLoading, isError } = useQuery({
    queryKey: ['estudiante', 'vacantes'],
    queryFn: () => publicacionesService.getVacantes(),
  })

  // Filtrado en cliente por el texto del buscador.
  const vacantesFiltradas = useMemo(() => {
    const term = searchText.trim().toLowerCase()
    if (!term) return vacantes
    return vacantes.filter(
      (v) =>
        v.titulo.toLowerCase().includes(term) ||
        v.nombreEmpresa.toLowerCase().includes(term) ||
        v.descripcion.toLowerCase().includes(term)
    )
  }, [vacantes, searchText])

  const selectedVacante = useMemo<Vacante | null>(() => {
    if (vacantes.length === 0) return null
    return vacantes.find((v) => v.id === selectedId) ?? vacantes[0]
  }, [vacantes, selectedId])

  const listItems = useMemo(() => vacantesFiltradas.map(toJobCardItem), [vacantesFiltradas])
  const searchPublicationItems = useMemo(() => vacantesFiltradas.map(toSearchItem), [vacantesFiltradas])

  // --- Postulación (req 007) ---
  const postularMutation = useMutation({
    mutationFn: (publicacionId: number) => publicacionesService.postular(userId, publicacionId),
    onSuccess: (_data, publicacionId) => {
      setAppliedIds((prev) => (prev.includes(publicacionId) ? prev : [...prev, publicacionId]))
      setFeedback({ type: 'ok', message: '¡Postulación enviada correctamente!' })
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'postulaciones'] })
      queryClient.invalidateQueries({ queryKey: ['estudiante', 'vacantes'] })
    },
    onError: (error: unknown) => {
      const message =
        (error as { message?: string })?.message ?? 'No se pudo enviar la postulación. Intenta de nuevo.'
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

  return {
    // UI
    viewMode,
    isSearchOpen,
    searchText,
    searchInputRef,
    openSearchMode,
    closeSearchMode,
    setSearchText,
    // datos
    listItems,
    searchPublicationItems,
    selectedVacante,
    selectVacante: setSelectedId,
    isLoading,
    isError,
    // postulación
    postular: (publicacionId: number) => postularMutation.mutate(publicacionId),
    isApplying: postularMutation.isPending,
    appliedIds,
    feedback,
    clearFeedback: () => setFeedback(null),
  }
}
