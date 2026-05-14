import { useQuery } from '@tanstack/react-query'
import { getManagementOverview } from '../services/gestionService'

function useManagementOverview() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'management', 'overview'],
    queryFn: () => getManagementOverview(),
  })

  return {
    metrics: data?.metrics ?? [],
    users: data?.users ?? [],
    isLoading,
    isError,
    error,
  }
}

export default useManagementOverview
