import { useEffect, useRef, useState } from 'react'
import type { Application } from '../types/seguimiento.types'
import type { JobDetailData } from '@/shared/types/job.types'
import { seguimientoService } from '../services/seguimiento.service'

// TODO API: cambiar a false cuando se quiera consumir backend real.
const USE_STATIC_DATA = true

// MOCK_DATA (retirar al conectar API): postulaciones de ejemplo.
const MOCK_APPLICATIONS: Application[] = [
  {
    id: '1',
    jobTitle: 'Desarrollador frontend',
    company: 'Desarrollo web / Tiempo completo',
    postulationDate: 'Enero, 22, 2026',
    status: 'EN REVISIÓN',
  },
  {
    id: '2',
    jobTitle: 'Desarrollador backend',
    company: 'Ingenieria de software / Tiempo completo',
    postulationDate: 'Enero, 10, 2026',
    status: 'ACEPTADO',
  },
  {
    id: '3',
    jobTitle: 'Disenador UX/UI',
    company: 'Diseno de producto / Medio tiempo',
    postulationDate: 'Diciembre, 10, 2025',
    status: 'PENDIENTE',
  },
  {
    id: '4',
    jobTitle: 'Desarrollador full stack',
    company: 'Desarrollo web / Tiempo completo',
    postulationDate: 'Diciembre, 4, 2025',
    status: 'RECHAZADO',
  },
  {
    id: '5',
    jobTitle: 'Analista QA',
    company: 'Calidad de software / Tiempo completo',
    postulationDate: 'Enero, 28, 2026',
    status: 'APRUEBA',
  },
  {
    id: '6',
    jobTitle: 'Ingeniero DevOps',
    company: 'Infraestructura / Tiempo completo',
    postulationDate: 'Febrero, 2, 2026',
    status: 'CONTRATADO',
  },
]

export const useSeguimiento = () => {
  // --------------------------------------------------
  // Estado base de UI
  // --------------------------------------------------
  const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [applicationsData, setApplicationsData] = useState<Application[]>(MOCK_APPLICATIONS)
  const [applicationSearchText, setApplicationSearchText] = useState('')
  const [selectedJobModal, setSelectedJobModal] = useState<JobDetailData | null>(null)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const applicationSearchInputRef = useRef<HTMLInputElement>(null)

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

    const loadSeguimientoData = async () => {
      try {
        const applicationsResponse = await seguimientoService.getApplications()
        if (isCancelled) return

        setApplicationsData(applicationsResponse.length ? applicationsResponse : MOCK_APPLICATIONS)
      } catch (error) {
        console.error('Error al cargar seguimiento desde API:', error)
        if (isCancelled) return

        // Fallback temporal mientras se integra backend.
        setApplicationsData(MOCK_APPLICATIONS)
      }
    }

    void loadSeguimientoData()

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

  // Convierte una postulacion a estructura del modal de detalle.
  // TODO API: retirar esta conversion cuando la API de detalle entregue JobDetailData completo.
  const convertApplicationToJobDetailData = (app: Application): JobDetailData => {
    // MOCK_DATA (retirar al conectar API): descripciones para demo de modal por postulación.
    const jobDescriptions: Record<string, { description: string; responsibilities: string[] }> = {
      '1': {
        description: 'Descripción del puesto de Desarrollador frontend. Se busca profesional con experiencia en React, TypeScript y Tailwind CSS para desarrollar interfaces modernas y responsivas.',
        responsibilities: [
          'Desarrollar interfaces de usuario responsivas usando React y TypeScript',
          'Optimizar el rendimiento de la aplicación',
          'Colaborar con el equipo de diseño',
          'Realizar pruebas unitarias',
          'Participar en code reviews',
        ],
      },
      '2': {
        description: 'Posición de Desarrollador backend con experiencia en Node.js y bases de datos. Se requiere capacidad para desarrollar APIs escalables y sistemas distribuidos.',
        responsibilities: [
          'Diseñar y desarrollar APIs RESTful escalables',
          'Optimizar consultas de base de datos',
          'Implementar sistemas de autenticación',
          'Trabajar con arquitecturas de microservicios',
          'Monitorear la salud de servicios',
        ],
      },
      '3': {
        description: 'Buscamos Diseñador UX/UI talentoso para crear experiencias excepcionales. Debe tener experiencia en Figma, prototipado y diseño de interfaces.',
        responsibilities: [
          'Diseñar interfaces de usuario intuitivas',
          'Crear prototipos interactivos',
          'Realizar investigación con usuarios',
          'Colaborar con desarrolladores',
          'Documentar sistemas de diseño',
        ],
      },
      '4': {
        description: 'Desarrollador full stack para proyectos de desarrollo web completos. Experiencia requerida en frontend, backend y bases de datos.',
        responsibilities: [
          'Desarrollar características end-to-end',
          'Diseñar arquitecturas de software',
          'Implementar integración continua',
          'Trabajar con bases de datos relacionales y NoSQL',
          'Optimizar rendimiento de aplicaciones',
        ],
      },
    }

    const [company, type] = app.company.split(' / ')
    const jobInfo = jobDescriptions[app.id] || {
      description: `Posición de ${app.jobTitle}. Oportunidad para desarrollar tus habilidades profesionales.`,
      responsibilities: [
        'Desarrollar soluciones innovadoras',
        'Colaborar con equipos multidisciplinarios',
        'Mantener estándares de calidad',
      ],
    }

    return {
      id: app.id,
      title: app.jobTitle,
      company: company.trim(),
      location: 'No especificado',
      salary: '$60,000 - $100,000',
      schedule: 'Lunes a Viernes',
      type: type.trim(),
      experience: '2 a 5 años',
      timeAgo: app.postulationDate,
      description: jobInfo.description,
      responsibilities: jobInfo.responsibilities,
    }
  }

  const openJobModal = async (app: Application) => {
    // Flujo API real: intenta cargar detalle por id de postulacion.
    if (!USE_STATIC_DATA) {
      try {
        const detailFromApi = await seguimientoService.getApplicationDetail(app.id)
        setSelectedJobModal(detailFromApi)
        setIsJobModalOpen(true)
        return
      } catch (error) {
        console.error('Error al cargar detalle de postulación desde API:', error)
      }
    }

    // Fallback temporal para no bloquear UI mientras se integra backend.
    const detail = convertApplicationToJobDetailData(app)
    setSelectedJobModal(detail)
    setIsJobModalOpen(true)
  }

  const closeJobModal = () => {
    setIsJobModalOpen(false)
    setSelectedJobModal(null)
  }

  // Filtro local por texto para la tabla principal.
  const filteredApplications = applicationSearchText
    ? applicationsData.filter((app) =>
        app.jobTitle.toLowerCase().includes(applicationSearchText.toLowerCase()) ||
        app.company.toLowerCase().includes(applicationSearchText.toLowerCase())
      )
    : applicationsData

  // En modo detail se respeta filtro, en modo search se muestran todas.
  const displayApplications = viewMode === 'detail' ? filteredApplications : applicationsData

  // Contadores para widgets o resumenes por estado.
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
    openSearchMode,
    closeSearchMode,
    setSearchText,
    setApplicationSearchText,
    openJobModal,
    closeJobModal,
  }
}
