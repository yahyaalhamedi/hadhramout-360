import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { axiosInstance } from '@/api/axiosInstance'
import type {
  ArtisanDetailApiResponse,
  ArtisanDetailsDto,
  ArtisansApiResponse,
  ArtisansData,
  ArtisansParams,
} from './useArtisans.types'

type UseArtisansParams = Omit<ArtisansParams, 'pageNumber'>

// ── Fetch functions ───────────────────────────────────────────────

async function fetchArtisans(params: ArtisansParams): Promise<ArtisansData> {
  const { data } = await axiosInstance.get<ArtisansApiResponse>('/api/artisans', {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.search ? { Search: params.search } : {}),
    },
  })
  return data.data
}

async function fetchArtisanById(id: number): Promise<ArtisanDetailsDto> {
  const { data } = await axiosInstance.get<ArtisanDetailApiResponse>(`/api/artisans/${id}`)
  return data.data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useArtisans({ search, pageSize }: UseArtisansParams) {
  return useInfiniteQuery({
    queryKey: ['artisans', { search, pageSize }],
    queryFn: ({ pageParam }) =>
      fetchArtisans({ pageNumber: pageParam, pageSize, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
  })
}

export function useArtisan(id: number | undefined) {
  return useQuery({
    queryKey: ['artisan', id],
    queryFn: () => fetchArtisanById(id!),
    enabled: id != null,
  })
}
