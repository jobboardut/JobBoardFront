import { useQuery } from '@tanstack/react-query'
import { getPublicationsOverview } from '../services/publicacionesService'

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
