import api from '@/services/api'
import type { ActivityColumn, JobItem, Metric } from '../types/dashboard.types'

// Cambiar a false cuando el backend del dashboard este listo.
const USE_MOCK = true

export const dashboardService = {
  // API para useDashboard: llena las tarjetas KPI del dashboard.
  async getMetrics(): Promise<Metric[]> {
    if (USE_MOCK) {
      return []
    }

    // TODO API (getMetrics -> useDashboard.metrics):
    // Endpoint esperado para metricas principales del dashboard.
    return api.get('/dashboard/metrics')
  },

  // API para useDashboard: alimenta columnas de actividad reciente.
  async getActivityColumns(): Promise<ActivityColumn[]> {
    if (USE_MOCK) {
      return []
    }

    // TODO API (getActivityColumns -> useDashboard.activityColumns):
    // Endpoint esperado para conteos por columna/estado.
    return api.get('/dashboard/activity-columns')
  },

  // API para useDashboard: listado de vacantes en modo busqueda.
  async getSearchPublicationItems(): Promise<JobItem[]> {
    if (USE_MOCK) {
      return []
    }

    // TODO API (getSearchPublicationItems -> useDashboard.searchPublicationItems):
    // Endpoint esperado para tarjetas de publicaciones del buscador.
    return api.get('/dashboard/search-publications')
  },
}
