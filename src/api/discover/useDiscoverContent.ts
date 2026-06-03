import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { axiosInstance } from '@/api/axiosInstance'
import type {
  DiscoverContentApiResponse,
  DiscoverContentData,
  DiscoverContentDetailsDto,
  DiscoverContentDetailApiResponse,
  DiscoverContentParams,
} from './useDiscoverContent.types'

type UseDiscoverContentParams = Omit<DiscoverContentParams, 'pageNumber'>

// ── Fetch functions ───────────────────────────────────────────────

async function fetchDiscoverContent(params: DiscoverContentParams): Promise<DiscoverContentData> {
  const url = params.category
    ? `/api/discover-content/${params.category}`
    : '/api/discover-content'

  const { data } = await axiosInstance.get<DiscoverContentApiResponse>(url, {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.search ? { Search: params.search } : {}),
    },
  })
  return data.data
}

async function fetchDiscoverContentById(id: number): Promise<DiscoverContentDetailsDto> {
  const { data } = await axiosInstance.get<DiscoverContentDetailApiResponse>(
    `/api/discover-content/${id}`,
  )
  return data.data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useDiscoverContent({ search, category, pageSize }: UseDiscoverContentParams) {
  return useInfiniteQuery({
    queryKey: ['discover-content', { search, category, pageSize }],
    queryFn: ({ pageParam }) =>
      fetchDiscoverContent({ pageNumber: pageParam, pageSize, search, category }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
  })
}

export function useDiscoverContentById(id: number | undefined) {
  return useQuery({
    queryKey: ['discover-content', id],
    queryFn: () => fetchDiscoverContentById(id!),
    enabled: id != null,
  })
}
