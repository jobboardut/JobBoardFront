import { useEffect, useRef, useState } from 'react'
import { BriefcaseBusiness, Users } from 'lucide-react'
import type { ActivityColumn, JobItem, Metric } from '../types/dashboard.types'
import type { JobDetailData } from '@/shared/types/job.types'
import { dashboardService } from '../services/dashboard.service'

// TODO API: cambiar a false cuando se quiera consumir backend real.
const USE_STATIC_DATA = true

// MOCK_DATA (retirar al conectar API): metricas de ejemplo para la UI.
const MOCK_METRICS: Metric[] = [
  {
    label: 'Total de postulaciones',
    value: 12,
    icon: BriefcaseBusiness,
  },
  {
    label: 'Postulaciones activas',
    value: 12,
    icon: Users,
  },
]

// MOCK_DATA (retirar al conectar API): columnas de actividad de ejemplo.
const MOCK_ACTIVITY_COLUMNS: ActivityColumn[] = [
  { title: 'En revision', count: 3, status: 'En revision' },
  { title: 'En progreso', count: 3, status: 'En progreso' },
  { title: 'Proceso finalizado', count: 3, status: 'Proceso finalizado' },
]

// MOCK_DATA (retirar al conectar API): publicaciones para modo busqueda.
const MOCK_SEARCH_PUBLICATION_ITEMS: JobItem[] = [
  {
    id: '1',
    title: 'Desarrollador Frontend',
    company: 'Google',
    salary: '$80,000 - $120,000',
    location: 'San Francisco, USA',
    type: 'Tiempo Completo',
    availability: 'Remoto',
  },
  {
    id: '2',
    title: 'Desarrollador Backend',
    company: 'Amazon',
    salary: '$90,000 - $130,000',
    location: 'Seattle, USA',
    type: 'Tiempo Completo',
    availability: 'Hibrido',
  },
  {
    id: '3',
    title: 'Ingeniero Full Stack',
    company: 'Microsoft',
    salary: '$100,000 - $150,000',
    location: 'Nueva York, USA',
    type: 'Tiempo Completo',
    availability: 'Presencial',
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'Meta',
    salary: '$120,000 - $160,000',
    location: 'Menlo Park, USA',
    type: 'Tiempo Completo',
    availability: 'Hibrido',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Netflix',
    salary: '$110,000 - $140,000',
    location: 'Los Angeles, USA',
    type: 'Tiempo Completo',
    availability: 'Remoto',
  },
]

export const useDashboard = () => {
  // --------------------------------------------------
  // Estado base de UI
  // --------------------------------------------------
  const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [metrics, setMetrics] = useState<Metric[]>(MOCK_METRICS)
  const [activityColumns, setActivityColumns] = useState<ActivityColumn[]>(MOCK_ACTIVITY_COLUMNS)
  const [searchPublicationItems, setSearchPublicationItems] = useState<JobItem[]>(MOCK_SEARCH_PUBLICATION_ITEMS)
  const [selectedJobModal, setSelectedJobModal] = useState<JobDetailData | null>(null)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
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

    const loadDashboardData = async () => {
      try {
        const [metricsResponse, activityResponse, searchResponse] = await Promise.all([
          dashboardService.getMetrics(),
          dashboardService.getActivityColumns(),
          dashboardService.getSearchPublicationItems(),
        ])

        if (isCancelled) return

        setMetrics(metricsResponse.length ? metricsResponse : MOCK_METRICS)
        setActivityColumns(activityResponse.length ? activityResponse : MOCK_ACTIVITY_COLUMNS)
        setSearchPublicationItems(searchResponse.length ? searchResponse : MOCK_SEARCH_PUBLICATION_ITEMS)
      } catch (error) {
        console.error('Error al cargar dashboard desde API:', error)
        if (isCancelled) return

        // Fallback temporal mientras se integra backend.
        setMetrics(MOCK_METRICS)
        setActivityColumns(MOCK_ACTIVITY_COLUMNS)
        setSearchPublicationItems(MOCK_SEARCH_PUBLICATION_ITEMS)
      }
    }

    void loadDashboardData()

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

  // Convierte una tarjeta de listado a estructura del modal de detalle.
  // TODO API: retirar esta conversion cuando el backend entregue JobDetailData directamente.
  const convertJobItemToJobDetailData = (item: JobItem): JobDetailData => {
    // MOCK_DATA (retirar al conectar API): descripciones por id para demo de modal.
    const jobDescriptions: Record<string, { description: string; responsibilities: string[] }> = {
      '1': {
        description: 'Buscamos un Desarrollador Frontend apasionado para unirse a nuestro equipo en Google. Trabajarás en proyectos de gran escala que impactan a millones de usuarios alrededor del mundo.',
        responsibilities: [
          'Desarrollar interfaces de usuario responsivas usando React y TypeScript',
          'Optimizar el rendimiento de la aplicación y la experiencia del usuario',
          'Colaborar con el equipo de diseño para implementar nuevas características',
          'Realizar pruebas unitarias y de integración',
          'Participar en code reviews y mantener estándares de calidad',
        ],
      },
      '2': {
        description: 'Amazon busca un Desarrollador Backend experimentado para construir servicios altamente escalables. Serás parte de un equipo que maneja millones de transacciones diarias.',
        responsibilities: [
          'Diseñar y desarrollar APIs RESTful escalables',
          'Optimizar consultas de base de datos y performance del servidor',
          'Implementar sistemas de autenticación y autorización seguros',
          'Trabajar con arquitecturas de microservicios',
          'Monitorear y mejorar la salud de los servicios en producción',
        ],
      },
      '3': {
        description: 'Microsoft está buscando un Ingeniero Full Stack talentoso para desarrollar soluciones completas. Trabajarás en el stack moderno de Azure con React en frontend y .NET en backend.',
        responsibilities: [
          'Desarrollar características end-to-end en frontend y backend',
          'Diseñar arquitecturas de software escalables y mantenibles',
          'Implementar integración continua y despliegue continuo (CI/CD)',
          'Trabajar con bases de datos relacionales y NoSQL',
          'Mentorar a desarrolladores junior del equipo',
        ],
      },
      '4': {
        description: 'Meta busca Data Scientists para analizar datos complejos y crear modelos de machine learning. Tendrás acceso a datasets masivos y herramientas de análisis avanzadas.',
        responsibilities: [
          'Análisis exploratorio de datos con Python y SQL',
          'Desarrollo de modelos de machine learning con TensorFlow y PyTorch',
          'Visualización y comunicación de insights a stakeholders',
          'Optimización de modelos para producción',
          'Participar en investigación de nuevas técnicas de ML',
        ],
      },
      '5': {
        description: 'Netflix necesita un DevOps Engineer con experiencia en infraestructura en la nube. Serás responsable de mantener sistemas altamente disponibles.',
        responsibilities: [
          'Gestionar infraestructura en AWS y Google Cloud',
          'Implementar y mantener pipelines de CI/CD',
          'Monitoreo y alertas con Prometheus y Grafana',
          'Mantenimiento de seguridad y compliance',
          'Automatización de procesos de deployment',
        ],
      },
    }

    const jobInfo = jobDescriptions[item.id] || {
      description: `Posición de ${item.title} en ${item.company}. Oportunidad para desarrollar tus habilidades profesionales.`,
      responsibilities: [
        'Desarrollar soluciones innovadoras',
        'Colaborar con equipos multidisciplinarios',
        'Mantener estándares de calidad',
      ],
    }

    return {
      id: item.id,
      title: item.title,
      company: item.company,
      location: item.location,
      salary: item.salary,
      schedule: 'Lunes a Viernes',
      type: item.type,
      experience: '1 a 3 años',
      timeAgo: 'Hace 3 días',
      description: jobInfo.description,
      responsibilities: jobInfo.responsibilities,
    }
  }

  const openJobModal = (item: JobItem) => {
    // Modo actual: detalle construido localmente desde la tarjeta seleccionada.
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
    openSearchMode,
    closeSearchMode,
    setSearchText,
    openJobModal,
    closeJobModal,
  }
}
