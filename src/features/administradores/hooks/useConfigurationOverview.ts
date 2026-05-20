import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createConfigurationItem,
  deleteConfigurationItem,
  getConfigurationOverview,
} from '../services/configurationService'
import type { ConfigurationListKey } from '../types/configuration.types'

function useConfigurationOverview() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'configuration', 'overview'],
    queryFn: () => getConfigurationOverview(),
  })

  const createMutation = useMutation({
    mutationFn: ({ listKey, value }: { listKey: ConfigurationListKey; value: string }) =>
      createConfigurationItem(listKey, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'configuration'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: ({ listKey, itemId }: { listKey: ConfigurationListKey; itemId: string }) =>
      deleteConfigurationItem(listKey, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'configuration'] })
    },
  })

  return {
    programs: data?.programs ?? [],
    sectors: data?.sectors ?? [],
    isLoading,
    isError,
    error,
    createItem: createMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || deleteMutation.isPending,
  }
}

export default useConfigurationOverview
