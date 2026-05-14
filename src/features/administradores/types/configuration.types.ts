export type ConfigurationListKey = 'programs' | 'sectors'

export type ConfigurationItem = {
  id: string
  name: string
}

export type CatalogItemResponse = {
  id: number
  nombre: string
}

export type CatalogItemRequest = {
  nombre: string
}

export type ConfigurationOverview = {
  programs: ConfigurationItem[]
  sectors: ConfigurationItem[]
}
