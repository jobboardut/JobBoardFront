import { useQuery } from '@tanstack/react-query'
import { adminService } from '../services/admin.service'

/**
 * Carga los documentos (foto + PDFs) de un usuario para la Mesa de Validación.
 * Solo dispara la petición cuando hay un userId (modal abierto).
 * La vigencia de las Pre-signed URLs la dicta el backend (urlExpirationSeconds):
 * refrescamos al 80% de su vida para no servir enlaces caducados.
 */
export function useValidationDocuments(userId: string | null) {
  return useQuery({
    queryKey: ['admin', 'validation', 'documentos', userId],
    queryFn: () => adminService.getDocumentosUsuario(userId!),
    enabled: Boolean(userId),
    staleTime: (query) => {
      const seconds = query.state.data?.urlExpirationSeconds ?? 0
      return seconds > 0 ? seconds * 800 : 0
    },
  })
}

export default useValidationDocuments
