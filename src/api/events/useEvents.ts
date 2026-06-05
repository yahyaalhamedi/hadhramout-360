import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  EventDetailApiResponse,
  EventDetailsDto,
  EventsApiResponse,
  EventsData,
  EventsParams,
  CreateEventWithMediaParams,
  UpdateEventParams,
} from './useEvents.types'

type UseEventsParams = Omit<EventsParams, 'pageNumber'>

// ── Fetch functions ───────────────────────────────────────────────

async function fetchEvents(params: EventsParams): Promise<EventsData> {
  const { data } = await axiosInstance.get<EventsApiResponse>('/api/events', {
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

async function fetchEventById(id: number): Promise<EventDetailsDto> {
  const { data } = await axiosInstance.get<EventDetailApiResponse>(`/api/events/${id}`)
  return data.data
}

async function createEventWithMedia(params: CreateEventWithMediaParams): Promise<EventDetailsDto> {
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
  params.files?.forEach((file) => formData.append('Files', file))

  const { data } = await axiosInstance.post('/api/events/with-media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function updateEvent(params: UpdateEventParams): Promise<EventDetailsDto> {
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

async function deleteEvent(id: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/events/${id}`)
  return data
}

async function addEventMedia(id: number, file: File): Promise<{ mediaId: number; mediaUrl: string }> {
  const formData = new FormData()
  formData.append('File', file)
  const { data } = await axiosInstance.post(`/api/events/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

async function deleteEventMedia(mediaId: number): Promise<{ success: boolean }> {
  const { data } = await axiosInstance.delete(`/api/events/media/${mediaId}`)
  return data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useEvents({ search, fromDate, toDate, upcomingOnly, pageSize }: UseEventsParams) {
  return useInfiniteQuery({
    queryKey: ['events', { search, fromDate, toDate, upcomingOnly, pageSize }],
    queryFn: ({ pageParam }) =>
      fetchEvents({ pageNumber: pageParam, pageSize, search, fromDate, toDate, upcomingOnly }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
  })
}

export function useEvent(id: number | undefined) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id!),
    enabled: id != null,
  })
}

export function useCreateEventWithMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEventWithMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useAddEventMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => addEventMedia(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export function useDeleteEventMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEventMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
