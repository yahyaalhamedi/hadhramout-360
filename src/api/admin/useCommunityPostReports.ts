import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  CommunityPostReportsApiResponse,
  CommunityPostReportsData,
  CommunityPostReportsParams,
} from './useCommunityPostReports.types'

// ── Fetch functions ───────────────────────────────────────────────

async function fetchReports(params: CommunityPostReportsParams): Promise<CommunityPostReportsData> {
  const { data } = await axiosInstance.get<CommunityPostReportsApiResponse>(
    '/api/community-post-reports',
    {
      params: {
        PageNumber: params.pageNumber,
        PageSize: params.pageSize,
      },
    },
  )
  return data.data
}

async function dismissReport(reportId: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/community-post-reports/${reportId}`)
  return data
}

async function deleteReportedPost(reportId: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/community-post-reports/${reportId}/post`)
  return data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useCommunityPostReports({ pageSize }: Omit<CommunityPostReportsParams, 'pageNumber'>) {
  return useInfiniteQuery({
    queryKey: ['community-post-reports', { pageSize }],
    queryFn: ({ pageParam = 1 }) =>
      fetchReports({ pageNumber: pageParam, pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
  })
}

export function useDismissReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dismissReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-post-reports'] })
    },
  })
}

export function useDeleteReportedPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteReportedPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-post-reports'] })
    },
  })
}
