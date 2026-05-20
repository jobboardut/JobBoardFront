import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'

export const useEstadisticasUsuarios = () =>
  useQuery({
    queryKey: ['admin', 'estadisticas', 'usuarios'],
    queryFn: () => adminService.getEstadisticasUsuarios(),
  })

export const useVacantesRecientes = () =>
  useQuery({
    queryKey: ['admin', 'vacantes', 'recientes'],
    queryFn: () => adminService.getVacantesRecientes(),
  })