import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'
import { getPublicationsOverview } from '../services/publicacionesService'
import type { PublicacionEstatusAdmin } from '../types/admin.types'

function usePublicationsOverview() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'publications', 'overview'],
    queryFn: () => getPublicationsOverview(),
  })

  return {
    metrics: data?.metrics ?? [],
    publications: data?.publications ?? [],
    activeCount: data?.activeCount ?? 0,
    totalCount: data?.totalCount ?? 0,
    isLoading,
    isError,
    error,
  }
}

export default usePublicationsOverview

export function useActualizarEstatusPublicacion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      publicacionId,
      estatus,
    }: {
      publicacionId: string
      estatus: PublicacionEstatusAdmin
    }) => adminService.actualizarEstatusPublicacion(publicacionId, { estatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'publications', 'overview'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'overview'] })
    },
  })
}
