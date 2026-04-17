import { getUsersDashboardData } from '../services/usersDashboardService'

function useUsersDashboard() {
  return getUsersDashboardData()
}

export default useUsersDashboard