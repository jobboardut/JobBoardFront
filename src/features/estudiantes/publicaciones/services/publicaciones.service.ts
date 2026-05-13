import api from '@/services/api'
import type { JobCardItem, SearchPublicationItem } from '../types/publicaciones.types'

// Cambiar a false cuando el backend de publicaciones este listo.
const USE_MOCK = true

export const publicacionesService = {
  // API para usePublicaciones: lista lateral de vacantes (vista detalle).
  async getListItems(): Promise<JobCardItem[]> {
    if (USE_MOCK) {
      return []
    }

    // TODO API (getListItems -> usePublicaciones.listItems):
    // Endpoint esperado para el listado lateral de publicaciones.
    return api.get('/publicaciones/list')
  },

  // API para usePublicaciones: resultados de publicaciones en modo busqueda.
  async getSearchPublicationItems(): Promise<SearchPublicationItem[]> {
    if (USE_MOCK) {
      return []
    }

    // TODO API (getSearchPublicationItems -> usePublicaciones.searchPublicationItems):
    // Endpoint esperado para tarjetas del buscador de publicaciones.
    return api.get('/publicaciones/search')
  },
}
