import api from './api'

export interface CatalogItem {
  id: number
  nombre: string
}

type CatalogResponse = CatalogItem | CatalogItem[] | {
  value?: CatalogItem | CatalogItem[]
  Value?: CatalogItem | CatalogItem[]
  count?: number
  Count?: number
}

export const normalizeCatalogItems = (response: CatalogResponse): CatalogItem[] => {
  const rawItems = Array.isArray(response)
    ? response
    : 'id' in response && 'nombre' in response
      ? [response]
      : response.value ?? response.Value ?? []

  const items = Array.isArray(rawItems) ? rawItems : [rawItems]

  return items
    .filter((item) => item && item.id !== undefined && typeof item.nombre === 'string')
    .map((item) => ({
      id: Number(item.id),
      nombre: item.nombre,
    }))
}

export const catalogService = {
  getCarreras: async (): Promise<CatalogItem[]> =>
    normalizeCatalogItems(await api.get('/catalogo/carreras') as CatalogResponse),

  getSectores: async (): Promise<CatalogItem[]> =>
    normalizeCatalogItems(await api.get('/catalogo/sectores') as CatalogResponse),
}
