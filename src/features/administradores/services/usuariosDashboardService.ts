import type { UserCard } from '../types/usersDashboard.types'
import { apiEndpoints } from '../../../services/apiEndpoints'
import api from '@/services/api'

export const USERS_DASHBOARD_ENDPOINT = apiEndpoints.usersDashboard

export type UsersDashboardData = {
  userCards: UserCard[]
}

export async function getUsersDashboardData(): Promise<UsersDashboardData> {
  return api.get(USERS_DASHBOARD_ENDPOINT) as Promise<UsersDashboardData>
}