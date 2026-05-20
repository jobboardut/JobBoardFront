import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getValidationOverview, validateUser } from '../services/validationService'
import type { ValidarUsuarioAccion } from '../types/admin.types'

function useValidationOverview() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'validation', 'overview'],
    queryFn: () => getValidationOverview(),
  })

  const validateMutation = useMutation({
    mutationFn: ({ id, accion }: { id: string; accion: ValidarUsuarioAccion }) => validateUser(id, accion),
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
    validateUser: validateMutation.mutateAsync,
    isValidating: validateMutation.isPending,
  }
}

export default useValidationOverview
