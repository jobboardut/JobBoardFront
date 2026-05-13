import { useEffect, useRef, useState } from 'react'
import type { JobCardItem, SearchPublicationItem } from '../types/publicaciones.types'
import { publicacionesService } from '../services/publicaciones.service'

// TODO API: cambiar a false cuando se quiera consumir backend real.
const USE_STATIC_DATA = true

// MOCK_DATA (retirar al conectar API): listado lateral de vacantes.
const MOCK_LIST_ITEMS: JobCardItem[] = [
  {
    id: 1,
    title: 'Desarrollador Frontend',
    company: 'Volkswagen',
    location: 'Puebla',
    salary: '$ 45,000 - $ 75,000',
    modality: 'Tiempo completo',
  },
  {
    id: 2,
    title: 'Desarrollador Frontend',
    company: 'Volkswagen',
    location: 'Puebla',
    salary: '$ 45,000 - $ 75,000',
    modality: 'Tiempo completo',
  },
  {
    id: 3,
    title: 'Desarrollador Frontend',
    company: 'Volkswagen',
    location: 'Puebla',
    salary: '$ 45,000 - $ 75,000',
    modality: 'Tiempo completo',
  },
  {
    id: 4,
    title: 'Desarrollador Frontend',
    company: 'Volkswagen',
    location: 'Puebla',
    salary: '$ 45,000 - $ 75,000',
    modality: 'Tiempo completo',
  },
]

// MOCK_DATA (retirar al conectar API): resultados del modo busqueda.
const MOCK_SEARCH_PUBLICATION_ITEMS: SearchPublicationItem[] = [
  {
    id: 1,
    title: 'Programador Senior',
    location: 'Tecamachalco Pue., 20 Oriente 4302, La villita, 75482',
    description:
      'En Audi buscamos un experto para liderar la arquitectura de nuestra plataforma SaaS y escalar nuestros microservicios.',
    typeTag: 'Tiempo completo',
    salaryTag: '$ 25,000 - $ 35,000',
    timeAgo: 'Hace 22 Horas',
  },
  {
    id: 2,
    title: 'Programador Senior',
    location: 'Tecamachalco Pue., 20 Oriente 4302, La villita, 75482',
    description:
      'En Audi buscamos un experto para liderar la arquitectura de nuestra plataforma SaaS y escalar nuestros microservicios.',
    typeTag: 'Tiempo completo',
    salaryTag: '$ 25,000 - $ 35,000',
    timeAgo: 'Hace 22 Horas',
  },
  {
    id: 3,
    title: 'Programador Senior',
    location: 'Tecamachalco Pue., 20 Oriente 4302, La villita, 75482',
    description:
      'En Audi buscamos un experto para liderar la arquitectura de nuestra plataforma SaaS y escalar nuestros microservicios.',
    typeTag: 'Tiempo completo',
    salaryTag: '$ 25,000 - $ 35,000',
    timeAgo: 'Hace 22 Horas',
  },
  {
    id: 4,
    title: 'Programador Senior',
    location: 'Tecamachalco Pue., 20 Oriente 4302, La villita, 75482',
    description:
      'En Audi buscamos un experto para liderar la arquitectura de nuestra plataforma SaaS y escalar nuestros microservicios.',
    typeTag: 'Tiempo completo',
    salaryTag: '$ 25,000 - $ 35,000',
    timeAgo: 'Hace 22 Horas',
  },
]

export const usePublicaciones = () => {
  // --------------------------------------------------
  // Estado base de UI
  // --------------------------------------------------
  const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [listItems, setListItems] = useState<JobCardItem[]>(MOCK_LIST_ITEMS)
  const [searchPublicationItems, setSearchPublicationItems] =
    useState<SearchPublicationItem[]>(MOCK_SEARCH_PUBLICATION_ITEMS)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // --------------------------------------------------
  // Efecto UI: focus automatico al abrir buscador
  // --------------------------------------------------
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus()
    }
  }, [isSearchOpen])

  // --------------------------------------------------
  // Carga de datos (API o mock)
  // --------------------------------------------------
  useEffect(() => {
    if (USE_STATIC_DATA) return

    let isCancelled = false

    const loadPublicacionesData = async () => {
      try {
        const [listResponse, searchResponse] = await Promise.all([
          publicacionesService.getListItems(),
          publicacionesService.getSearchPublicationItems(),
        ])

        if (isCancelled) return

        setListItems(listResponse.length ? listResponse : MOCK_LIST_ITEMS)
        setSearchPublicationItems(
          searchResponse.length ? searchResponse : MOCK_SEARCH_PUBLICATION_ITEMS
        )
      } catch (error) {
        console.error('Error al cargar publicaciones desde API:', error)
        if (isCancelled) return

        // Fallback temporal mientras se integra backend.
        setListItems(MOCK_LIST_ITEMS)
        setSearchPublicationItems(MOCK_SEARCH_PUBLICATION_ITEMS)
      }
    }

    void loadPublicacionesData()

    return () => {
      isCancelled = true
    }
  }, [])

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

  return {
    viewMode,
    isSearchOpen,
    searchText,
    searchInputRef,
    listItems,
    searchPublicationItems,
    openSearchMode,
    closeSearchMode,
    setSearchText,
  }
}
