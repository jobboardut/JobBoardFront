import { getUsersDashboardData } from '../services/usuariosDashboardService'

function useUsersDashboard() {
  return getUsersDashboardData()
}

export default useUsersDashboard