import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getValidationOverview, validateUser } from '../services/validationService'
import type { ValidarUsuarioAccion } from '../types/admin.types'

function useValidationOverview() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'validation', 'overview'],
    queryFn: () => getValidationOverview(),
  })

  const validateMutation = useMutation({
    mutationFn: ({
      id,
      accion,
      observaciones,
    }: {
      id: string
      accion: ValidarUsuarioAccion
      observaciones?: string
    }) => validateUser(id, accion, observaciones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
  })

  return {
    metrics: data?.metrics ?? [],
    requests: data?.requests ?? [],
    isLoading,
    isError,
    error,
    refetch,
    validateUser: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
  }
}

export default useValidationOverview
