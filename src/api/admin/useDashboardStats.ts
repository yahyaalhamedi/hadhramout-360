import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type { DashboardStats, DashboardStatsApiResponse } from './useDashboardStats.types'

async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await axiosInstance.get<DashboardStatsApiResponse>('/api/dashboard/stats')
  return data.data
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  })
}
