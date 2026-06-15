import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  LandmarkDetailApiResponse,
  LandmarkDetailsDto,
  LandmarksApiResponse,
  LandmarksData,
  LandmarksParams,
  CreateLandmarkWithMediaParams,
  UpdateLandmarkParams,
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

async function createLandmarkWithMedia(params: CreateLandmarkWithMediaParams): Promise<LandmarkDetailsDto> {
  const formData = new FormData()
  formData.append('TitleAr', params.titleAr)
  formData.append('TitleEn', params.titleEn)
  formData.append('DescriptionAr', params.descriptionAr)
  formData.append('DescriptionEn', params.descriptionEn)
  if (params.locationTextAr) formData.append('LocationTextAr', params.locationTextAr)
  if (params.locationTextEn) formData.append('LocationTextEn', params.locationTextEn)
  formData.append('MapUrl', params.mapUrl)
  params.categoryIds.forEach((id) => formData.append('CategoryIds', id.toString()))
  params.files?.forEach((file) => formData.append('Files', file))

  const { data } = await axiosInstance.post('/api/landmarks/with-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function updateLandmark(params: UpdateLandmarkParams): Promise<LandmarkDetailsDto> {
  const { data } = await axiosInstance.put(`/api/landmarks/${params.id}`, {
    titleAr: params.titleAr,
    titleEn: params.titleEn,
    descriptionAr: params.descriptionAr,
    descriptionEn: params.descriptionEn,
    locationTextAr: params.locationTextAr,
    locationTextEn: params.locationTextEn,
    mapUrl: params.mapUrl,
    categoryIds: params.categoryIds,
  })
  return data.data
}

async function deleteLandmark(id: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/landmarks/${id}`)
  return data
}

async function addLandmarkMedia(id: number, file: File): Promise<{ mediaId: number; mediaUrl: string }> {
  const formData = new FormData()
  formData.append('File', file)
  const { data } = await axiosInstance.post(`/api/landmarks/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function deleteLandmarkMedia(mediaId: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/landmarks/media/${mediaId}`)
  return data
}

async function replaceLandmarkMedia(mediaId: number, file: File): Promise<{ mediaId: number; mediaUrl: string }> {
  const formData = new FormData()
  formData.append('File', file)
  const { data } = await axiosInstance.put(`/api/landmarks/media/${mediaId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
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

export function useLandmark(id: number | undefined) {
  return useQuery({
    queryKey: ['landmark', id],
    queryFn: () => fetchLandmarkById(id!),
    enabled: id != null,
  })
}

export function useCreateLandmarkWithMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLandmarkWithMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] })
    },
  })
}

export function useUpdateLandmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateLandmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] })
    },
  })
}

export function useDeleteLandmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteLandmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] })
    },
  })
}

export function useAddLandmarkMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => addLandmarkMedia(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] })
    },
  })
}

export function useDeleteLandmarkMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteLandmarkMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] })
      queryClient.invalidateQueries({ queryKey: ['landmark'] })
    },
  })
}

export function useReplaceLandmarkMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mediaId, file }: { mediaId: number; file: File }) => replaceLandmarkMedia(mediaId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landmarks'] })
      queryClient.invalidateQueries({ queryKey: ['landmark'] })
    },
  })
}
