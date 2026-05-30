import { useInfiniteQuery } from '@tanstack/react-query'

import { axiosInstance } from '@/api/axiosInstance'
import type { LandmarksApiResponse, LandmarksData, LandmarksParams } from './useLandmarks.types'

type UseLandmarksParams = Omit<LandmarksParams, 'pageNumber'>

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
