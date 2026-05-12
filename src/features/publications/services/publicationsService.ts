import { BriefcaseBusiness, CircleCheckBig, PauseCircle, Users } from 'lucide-react'
import { apiEndpoints } from '../../../services/apiEndpoints'
import type { Publication, PublicationMetric } from '../types/publications.types'

export const PUBLICATIONS_OVERVIEW_ENDPOINT = apiEndpoints.publicationsOverview

export type PublicationsOverview = {
  metrics: PublicationMetric[]
  publications: Publication[]
  activeCount: number
  totalCount: number
}

export function getPublicationsOverview(): PublicationsOverview {
  // Punto de acoplamiento para API futura de publicaciones.
  // Si el backend cambia nombres/campos, mapear aqui al tipo Publication.
  const publications: Publication[] = [
    {
      id: '1',
      title: 'Desarrollador Frontend Senior',
      company: 'TechSolutions S.A.',
      badgeLetter: 'T',
      status: 'Activo',
      modality: 'Híbrido',
      workday: 'Tiempo completo',
      location: 'Puebla, México',
      salary: '$25,000 - $35,000 MXN',
      date: '2025-01-20',
      applicants: 15,
      experience: '3 a 5 años',
      description:
        'Buscamos un Desarrollador Frontend Senior apasionado para unirse a nuestro equipo en TechSolutions. Trabajarás en proyectos de gran escala que impactan a miles de usuarios.',
      responsibilities: [
        'Desarrollar interfaces responsivas con React y TypeScript',
        'Optimizar rendimiento y experiencia de usuario',
        'Colaborar con diseño para nuevas características',
        'Realizar pruebas unitarias y de integración',
        'Participar en code reviews y mantener estándares de calidad',
      ],
    },
    {
      id: '2',
      title: 'Analista de Datos',
      company: 'Innovatech Corp',
      badgeLetter: 'I',
      status: 'Activo',
      modality: 'Presencial',
      workday: 'Tiempo completo',
      location: 'Tlaxcala, México',
      salary: '$18,000 - $25,000 MXN',
      date: '2025-01-18',
      applicants: 8,
      experience: '2 a 4 años',
      description:
        'Una vacante orientada al análisis de datos y visualización, con participación en reportes clave para la toma de decisiones.',
      responsibilities: [
        'Limpiar y estructurar datos para análisis',
        'Generar dashboards y reportes ejecutivos',
        'Colaborar con equipos de negocio y tecnología',
        'Detectar tendencias y oportunidades de mejora',
      ],
    },
    {
      id: '3',
      title: 'Diseñador UX/UI',
      company: 'CreativeHub',
      badgeLetter: 'C',
      status: 'Pausado',
      modality: 'Remoto',
      workday: 'Medio tiempo',
      location: 'Puebla, México',
      salary: '$12,000 - $18,000 MXN',
      date: '2025-01-15',
      applicants: 22,
      experience: '1 a 3 años',
      description:
        'Buscamos una mente creativa para diseñar experiencias digitales claras, modernas y centradas en el usuario.',
      responsibilities: [
        'Diseñar flujos y prototipos para producto digital',
        'Traducir requerimientos a interfaces claras',
        'Trabajar junto a desarrollo en handoff visual',
        'Mantener consistencia de componentes y estilos',
      ],
    },
    {
      id: '4',
      title: 'Tester QA Manual',
      company: 'Nova Talent',
      badgeLetter: 'N',
      status: 'Pausado',
      modality: 'Híbrido',
      workday: 'Tiempo completo',
      location: 'Puebla, México',
      salary: '$14,000 - $20,000 MXN',
      date: '2025-01-12',
      applicants: 6,
      experience: '1 a 2 años',
      description:
        'Esta publicación se encuentra temporalmente suspendida mientras la empresa ajusta el perfil y los requisitos de contratación.',
      responsibilities: [
        'Diseñar y ejecutar casos de prueba manuales',
        'Reportar incidencias con evidencia clara y reproducible',
        'Validar correcciones junto al equipo de desarrollo',
        'Asegurar la calidad funcional antes de liberar cambios',
      ],
    },
  ]

  const totalCount = publications.length
  const activeCount = publications.filter((publication) => publication.status === 'Activo').length
  const pausedCount = publications.filter((publication) => publication.status === 'Pausado').length
  const applicantsCount = publications.reduce((accumulator, publication) => accumulator + publication.applicants, 0)

  const metrics: PublicationMetric[] = [
    { label: 'Total', value: totalCount, Icon: BriefcaseBusiness, tone: 'blue' },
    { label: 'Activas', value: activeCount, Icon: CircleCheckBig, tone: 'green' },
    { label: 'Pausadas', value: pausedCount, Icon: PauseCircle, tone: 'orange' },
    { label: 'Postulantes', value: applicantsCount, Icon: Users, tone: 'orange' },
  ]

  return {
    metrics,
    publications,
    activeCount,
    totalCount,
  }
}
