import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createConfigurationItem,
  deleteConfigurationItem,
  getConfigurationOverview,
  updateConfigurationItem,
} from '../services/configurationService'
import type { ConfigurationListKey } from '../types/configuration.types'

function useConfigurationOverview() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError, error, refetch } = useQuery({
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

  const updateMutation = useMutation({
    mutationFn: ({ listKey, itemId, value }: { listKey: ConfigurationListKey; itemId: string; value: string }) =>
      updateConfigurationItem(listKey, itemId, value),
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
    refetch,
    createItem: createMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  }
}

export default useConfigurationOverview
