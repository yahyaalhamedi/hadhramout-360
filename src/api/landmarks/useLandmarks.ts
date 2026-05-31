import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { axiosInstance } from '@/api/axiosInstance'
import type {
  LandmarkDetailApiResponse,
  LandmarkDetailsDto,
  LandmarksApiResponse,
  LandmarksData,
  LandmarksParams,
} from './useLandmarks.types'

type UseLandmarksParams = Omit<LandmarksParams, 'pageNumber'>

// ── Fetch functions ───────────────────────────────────────────────

async function fetchLandmarks(params: LandmarksParams): Promise<LandmarksData> {
  const { data } = await axiosInstance.get<LandmarksApiResponse>('/api/landmarks', {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.search ? { Search: params.search } : {}),
      ...(params.categoryId != null ? { CategoryId: params.categoryId } : {}),
    },
  })
  return data.data
}

async function fetchLandmarkById(id: number): Promise<LandmarkDetailsDto> {
  const { data } = await axiosInstance.get<LandmarkDetailApiResponse>(`/api/landmarks/${id}`)
  return data.data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useLandmarks({ search, categoryId, pageSize }: UseLandmarksParams) {
  return useInfiniteQuery({
    queryKey: ['landmarks', { search, categoryId, pageSize }],
    queryFn: ({ pageParam }) =>
      fetchLandmarks({ pageNumber: pageParam, pageSize, search, categoryId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
  })
}

/**
 * Fetches full details for a single landmark by its numeric ID.
 *
 * @example
 *   const { data, isLoading } = useLandmark(6)
 */
export function useLandmark(id: number | undefined) {
  return useQuery({
    queryKey: ['landmark', id],
    queryFn: () => fetchLandmarkById(id!),
    enabled: id != null,
  })
}
