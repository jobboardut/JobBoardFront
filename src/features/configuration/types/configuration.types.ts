export type ConfigurationListKey = 'programs' | 'sectors'

export type ConfigurationItem = {
  id: string
  name: string
}

export type ConfigurationOverview = {
  programs: ConfigurationItem[]
  sectors: ConfigurationItem[]
}
