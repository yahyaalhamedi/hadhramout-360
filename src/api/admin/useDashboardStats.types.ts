export interface DashboardStats {
  usersCount: number
  organizationsCount: number
  reportsCount: number
  landmarksCount: number
  eventsCount: number
  artisansCount: number
  discoverContentCount: number
  communityPostsCount: number
  totalContentCount: number
}

export interface DashboardStatsApiResponse {
  success: boolean
  message: string | null
  data: DashboardStats
  errors: string[] | null
  statusCode: number
}
