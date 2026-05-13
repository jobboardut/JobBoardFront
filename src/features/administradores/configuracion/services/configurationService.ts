import type { ConfigurationOverview } from '../types/configuration.types'
import { apiEndpoints } from '../../../../services/apiEndpoints'

export const CONFIGURATION_OVERVIEW_ENDPOINT = apiEndpoints.configurationOverview

export function getConfigurationOverview(): ConfigurationOverview {
  // Punto de acoplamiento para API futura de configuracion.
  return {
    programs: [
      { id: '1', name: 'Ingeniería en Software' },
      { id: '2', name: 'Ingeniería Industrial' },
      { id: '3', name: 'Administración de Empresas' },
      { id: '4', name: 'Diseño Gráfico' },
    ],
    sectors: [
      { id: '1', name: 'Tecnología' },
      { id: '2', name: 'Manufactura' },
      { id: '3', name: 'Servicios' },
      { id: '4', name: 'Comercio' },
    ],
  }
}
