import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  DiscoverContentDetailsDto,
  DiscoverApiResponse,
  DiscoverData,
  DiscoverDetailApiResponse,
  DiscoverParams,
  CreateDiscoverContentParams,
  UpdateDiscoverContentParams,
} from './useDiscoverContent.types'

type UseDiscoverParams = Omit<DiscoverParams, 'pageNumber'>

// ── Category to endpoint mapping ──────────────────────────────────
const CATEGORY_ENDPOINT_MAP: Record<string, string> = {
  culture: 'culture',
  food: 'food',
  games: 'games',
}

// ── Fetch functions ───────────────────────────────────────────────

async function fetchDiscoverContent(params: DiscoverParams): Promise<DiscoverData> {
  const endpoint = params.category
    ? `/api/discover-content/${CATEGORY_ENDPOINT_MAP[params.category] ?? params.category}`
    : '/api/discover-content'

  const { data } = await axiosInstance.get<DiscoverApiResponse>(endpoint, {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.search ? { Search: params.search } : {}),
    },
  })
  return data.data
}

async function fetchDiscoverContentById(id: number): Promise<DiscoverContentDetailsDto> {
  const { data } = await axiosInstance.get<DiscoverDetailApiResponse>(`/api/discover-content/${id}`)
  return data.data
}

async function createDiscoverContent(params: CreateDiscoverContentParams): Promise<DiscoverContentDetailsDto> {
  const formData = new FormData()
  formData.append('TitleAr', params.titleAr)
  formData.append('TitleEn', params.titleEn)
  formData.append('BodyAr', params.bodyAr)
  formData.append('BodyEn', params.bodyEn)
  if (params.coverImage) formData.append('CoverImage', params.coverImage)

  const { data } = await axiosInstance.post('/api/discover-content', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function updateDiscoverContent(params: UpdateDiscoverContentParams): Promise<DiscoverContentDetailsDto> {
  const formData = new FormData()
  formData.append('TitleAr', params.titleAr)
  formData.append('TitleEn', params.titleEn)
  formData.append('BodyAr', params.bodyAr)
  formData.append('BodyEn', params.bodyEn)
  if (params.coverImage) formData.append('CoverImage', params.coverImage)

  const { data } = await axiosInstance.put(`/api/discover-content/${params.id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function deleteDiscoverContent(id: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/discover-content/${id}`)
  return data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useDiscoverContent({ search, pageSize, category }: UseDiscoverParams) {
  return useInfiniteQuery({
    queryKey: ['discover-content', { search, pageSize, category }],
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

export function useCreateDiscoverContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDiscoverContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-content'] })
    },
  })
}

export function useUpdateDiscoverContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateDiscoverContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-content'] })
    },
  })
}

export function useDeleteDiscoverContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDiscoverContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discover-content'] })
    },
  })
}
