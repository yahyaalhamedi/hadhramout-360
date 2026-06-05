import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  ArtisanDetailApiResponse,
  ArtisanDetailsDto,
  ArtisansApiResponse,
  ArtisansData,
  ArtisansParams,
  CreateArtisanWithMediaParams,
  UpdateArtisanParams,
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

async function createArtisanWithMedia(params: CreateArtisanWithMediaParams): Promise<ArtisanDetailsDto> {
  const formData = new FormData()
  formData.append('NameAr', params.nameAr)
  formData.append('NameEn', params.nameEn)
  formData.append('Phone', params.phone)
  formData.append('DescriptionAr', params.descriptionAr)
  formData.append('DescriptionEn', params.descriptionEn)
  if (params.locationTextAr) formData.append('LocationTextAr', params.locationTextAr)
  if (params.locationTextEn) formData.append('LocationTextEn', params.locationTextEn)
  if (params.mapUrl) formData.append('MapUrl', params.mapUrl)
  params.files?.forEach((file) => formData.append('Files', file))

  const { data } = await axiosInstance.post('/api/artisans/with-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function updateArtisan(params: UpdateArtisanParams): Promise<ArtisanDetailsDto> {
  const { data } = await axiosInstance.put(`/api/artisans/${params.id}`, {
    nameAr: params.nameAr,
    nameEn: params.nameEn,
    phone: params.phone,
    descriptionAr: params.descriptionAr,
    descriptionEn: params.descriptionEn,
    locationTextAr: params.locationTextAr,
    locationTextEn: params.locationTextEn,
    mapUrl: params.mapUrl,
  })
  return data.data
}

async function deleteArtisan(id: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/artisans/${id}`)
  return data
}

async function addArtisanMedia(id: number, file: File): Promise<{ mediaId: number; mediaUrl: string }> {
  const formData = new FormData()
  formData.append('File', file)
  const { data } = await axiosInstance.post(`/api/artisans/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function deleteArtisanMedia(mediaId: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/artisans/media/${mediaId}`)
  return data
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

export function useCreateArtisanWithMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createArtisanWithMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
    },
  })
}

export function useUpdateArtisan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateArtisan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
    },
  })
}

export function useDeleteArtisan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteArtisan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
    },
  })
}

export function useAddArtisanMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => addArtisanMedia(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
    },
  })
}

export function useDeleteArtisanMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteArtisanMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artisans'] })
    },
  })
}
