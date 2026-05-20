import api from './api'

export interface CatalogItem {
  id: number
  nombre: string
}

export const catalogService = {
  getCarreras: (): Promise<CatalogItem[]> =>
    api.get('/catalogo/carreras') as Promise<CatalogItem[]>,

  getSectores: (): Promise<CatalogItem[]> =>
    api.get('/catalogo/sectores') as Promise<CatalogItem[]>,
}
