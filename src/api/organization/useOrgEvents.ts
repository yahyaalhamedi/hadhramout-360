import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  EventDetailsDto,
  EventResponseDto,
  EventDetailApiResponse,
  PaginationMeta,
  CreateEventWithMediaParams,
  CreateEventParams,
  UpdateEventParams,
} from '@/api/events/useEvents.types'

interface OrgEventsData {
  items: EventResponseDto[]
  pagination: PaginationMeta
}

interface OrgEventsApiResponse {
  success: boolean
  data: OrgEventsData
}

interface OrgEventsParams {
  search?: string
  fromDate?: string
  toDate?: string
  upcomingOnly?: boolean
  pageNumber: number
  pageSize: number
}

type UseOrgEventsParams = Omit<OrgEventsParams, 'pageNumber'>

// ── Fetch functions ───────────────────────────────────────────────

async function fetchOrgEvents(params: OrgEventsParams): Promise<OrgEventsData> {
  const { data } = await axiosInstance.get<OrgEventsApiResponse>('/api/events/my', {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.search ? { Search: params.search } : {}),
      ...(params.fromDate ? { FromDate: params.fromDate } : {}),
      ...(params.toDate ? { ToDate: params.toDate } : {}),
      ...(params.upcomingOnly != null ? { UpcomingOnly: params.upcomingOnly } : {}),
    },
  })
  return data.data
}

async function fetchOrgEventById(id: number): Promise<EventDetailsDto> {
  const { data } = await axiosInstance.get<EventDetailApiResponse>(`/api/events/${id}`)
  return data.data
}

async function createOrgEventWithMedia(params: CreateEventWithMediaParams): Promise<EventDetailsDto> {
  const formData = new FormData()
  formData.append('TitleAr', params.titleAr)
  formData.append('TitleEn', params.titleEn)
  formData.append('DescriptionAr', params.descriptionAr)
  formData.append('DescriptionEn', params.descriptionEn)
  formData.append('AddressAr', params.addressAr)
  formData.append('AddressEn', params.addressEn)
  if (params.mapUrl) formData.append('MapUrl', params.mapUrl)
  if (params.formUrl) formData.append('FormUrl', params.formUrl)
  formData.append('StartDate', params.startDate)
  formData.append('EndDate', params.endDate)
  // Thumbnail (cover) goes first, then gallery media — media[0] = thumbnail/hero
  const allFiles: File[] = []
  if (params.coverImage) allFiles.push(params.coverImage)
  if (params.files && params.files.length > 0) allFiles.push(...params.files)
  allFiles.forEach((file) => formData.append('Files', file))

  const { data } = await axiosInstance.post('/api/events/with-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function createOrgEvent(params: CreateEventParams): Promise<EventDetailsDto> {
  const { data } = await axiosInstance.post('/api/events', {
    titleAr: params.titleAr,
    titleEn: params.titleEn,
    descriptionAr: params.descriptionAr,
    descriptionEn: params.descriptionEn,
    addressAr: params.addressAr,
    addressEn: params.addressEn,
    mapUrl: params.mapUrl,
    formUrl: params.formUrl,
    startDate: params.startDate,
    endDate: params.endDate,
  })
  return data.data
}

async function updateOrgEvent(params: UpdateEventParams): Promise<EventDetailsDto> {
  const { data } = await axiosInstance.put(`/api/events/${params.id}`, {
    titleAr: params.titleAr,
    titleEn: params.titleEn,
    descriptionAr: params.descriptionAr,
    descriptionEn: params.descriptionEn,
    addressAr: params.addressAr,
    addressEn: params.addressEn,
    mapUrl: params.mapUrl,
    formUrl: params.formUrl,
    startDate: params.startDate,
    endDate: params.endDate,
  })
  return data.data
}

async function deleteOrgEvent(id: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/events/${id}`)
  return data
}

async function addOrgEventMedia(id: number, file: File): Promise<{ mediaId: number; mediaUrl: string }> {
  const formData = new FormData()
  formData.append('File', file)
  const { data } = await axiosInstance.post(`/api/events/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function deleteOrgEventMedia(mediaId: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/events/media/${mediaId}`)
  return data
}

async function replaceOrgEventMedia(mediaId: number, file: File): Promise<{ mediaId: number; mediaUrl: string }> {
  const formData = new FormData()
  formData.append('File', file)
  const { data } = await axiosInstance.put(`/api/events/media/${mediaId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useOrgEvents({ search, fromDate, toDate, upcomingOnly, pageSize }: UseOrgEventsParams) {
  return useInfiniteQuery({
    queryKey: ['org-events', { search, fromDate, toDate, upcomingOnly, pageSize }],
    queryFn: ({ pageParam }) =>
      fetchOrgEvents({ pageNumber: pageParam, pageSize, search, fromDate, toDate, upcomingOnly }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
  })
}

export function useOrgEvent(id: number | undefined) {
  return useQuery({
    queryKey: ['org-event', id],
    queryFn: () => fetchOrgEventById(id!),
    enabled: id != null,
  })
}

export function useCreateOrgEventWithMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrgEventWithMedia,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['org-events'] })
    },
  })
}

export function useCreateOrgEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOrgEvent,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['org-events'] })
    },
  })
}

export function useUpdateOrgEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOrgEvent,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['org-events'] })
    },
  })
}

export function useDeleteOrgEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteOrgEvent,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['org-events'] })
    },
  })
}

export function useAddOrgEventMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => addOrgEventMedia(id, file),
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['org-events'] })
    },
  })
}

export function useDeleteOrgEventMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteOrgEventMedia,
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ['org-events'] })
    },
  })
}

export function useReplaceOrgEventMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ mediaId, file }: { mediaId: number; file: File }) => replaceOrgEventMedia(mediaId, file),
    onSuccess: () => {
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: ['org-events'] }),
        queryClient.invalidateQueries({ queryKey: ['org-event'] })
      ])
    },
  })
}
