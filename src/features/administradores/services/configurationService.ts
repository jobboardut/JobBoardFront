import api from '@/services/api'
import { normalizeCatalogItems } from '@/services/catalog.service'
import type {
  CatalogItemRequest,
  CatalogItemResponse,
  ConfigurationItem,
  ConfigurationListKey,
  ConfigurationOverview,
} from '../types/configuration.types'

const CATALOG_ENDPOINTS: Record<ConfigurationListKey, string> = {
  programs: '/catalogo/carreras',
  sectors: '/catalogo/sectores',
}

const toConfigurationItem = (item: CatalogItemResponse): ConfigurationItem => ({
  id: String(item.id),
  name: item.nombre,
})

const toCatalogPayload = (name: string): CatalogItemRequest => ({
  nombre: name,
})

export const configurationService = {
  getCarreras: async (): Promise<CatalogItemResponse[]> =>
    normalizeCatalogItems(await api.get(CATALOG_ENDPOINTS.programs) as CatalogItemResponse[]),

  getCarrera: (id: string | number): Promise<CatalogItemResponse> =>
    api.get(`${CATALOG_ENDPOINTS.programs}/${id}`) as Promise<CatalogItemResponse>,

  createCarrera: (name: string): Promise<CatalogItemResponse> =>
    api.post(CATALOG_ENDPOINTS.programs, toCatalogPayload(name)) as Promise<CatalogItemResponse>,

  updateCarrera: (id: string | number, name: string): Promise<CatalogItemResponse> =>
    api.put(`${CATALOG_ENDPOINTS.programs}/${id}`, toCatalogPayload(name)) as Promise<CatalogItemResponse>,

  deleteCarrera: (id: string | number): Promise<void> =>
    api.delete(`${CATALOG_ENDPOINTS.programs}/${id}`) as Promise<void>,

  getSectores: async (): Promise<CatalogItemResponse[]> =>
    normalizeCatalogItems(await api.get(CATALOG_ENDPOINTS.sectors) as CatalogItemResponse[]),

  getSector: (id: string | number): Promise<CatalogItemResponse> =>
    api.get(`${CATALOG_ENDPOINTS.sectors}/${id}`) as Promise<CatalogItemResponse>,

  createSector: (name: string): Promise<CatalogItemResponse> =>
    api.post(CATALOG_ENDPOINTS.sectors, toCatalogPayload(name)) as Promise<CatalogItemResponse>,

  updateSector: (id: string | number, name: string): Promise<CatalogItemResponse> =>
    api.put(`${CATALOG_ENDPOINTS.sectors}/${id}`, toCatalogPayload(name)) as Promise<CatalogItemResponse>,

  deleteSector: (id: string | number): Promise<void> =>
    api.delete(`${CATALOG_ENDPOINTS.sectors}/${id}`) as Promise<void>,
}

export async function getConfigurationOverview(): Promise<ConfigurationOverview> {
  const [programs, sectors] = await Promise.all([
    configurationService.getCarreras(),
    configurationService.getSectores(),
  ])

  return {
    programs: programs.map(toConfigurationItem),
    sectors: sectors.map(toConfigurationItem),
  }
}

export function createConfigurationItem(listKey: ConfigurationListKey, name: string): Promise<CatalogItemResponse> {
  return listKey === 'programs'
    ? configurationService.createCarrera(name)
    : configurationService.createSector(name)
}

export function deleteConfigurationItem(listKey: ConfigurationListKey, id: string): Promise<void> {
  return listKey === 'programs'
    ? configurationService.deleteCarrera(id)
    : configurationService.deleteSector(id)
}
