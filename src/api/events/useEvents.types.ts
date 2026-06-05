export interface EventMediaResponseDto {
  mediaId: number
  eventId: number
  mediaUrl: string | null
  mediaType: number
  createdAt: string
}

export interface EventOrganizationDto {
  userId: number
  orgNameAr: string | null
  orgNameEn: string | null
  logoUrl: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  addressAr: string | null
  addressEn: string | null
  mapUrl: string | null
  phoneNumber: string | null
}

export interface EventResponseDto {
  eventId: number
  titleAr: string | null
  titleEn: string | null
  addressAr: string | null
  addressEn: string | null
  startDate: string
  endDate: string
  coverImageUrl: string | null
  organizationUserId: number
  organizationNameAr: string | null
  organizationNameEn: string | null
  organizationLogoUrl: string | null
}

export interface PaginationMeta {
  currentPage: number
  nextPage: number | null
  previousPage: number | null
  totalPages: number
  totalEntries: number
  perPage: number
}

export interface EventsData {
  items: EventResponseDto[]
  pagination: PaginationMeta
}

export interface EventsApiResponse {
  success: boolean
  data: EventsData
}

export interface EventDetailsDto {
  eventId: number
  titleAr: string | null
  titleEn: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  addressAr: string | null
  addressEn: string | null
  mapUrl: string | null
  formUrl: string | null
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  media: EventMediaResponseDto[] | null
  organization: EventOrganizationDto
}

export interface EventDetailApiResponse {
  success: boolean
  message: string | null
  data: EventDetailsDto
  errors: string[] | null
  statusCode: number
}

export interface EventsParams {
  search?: string
  fromDate?: string
  toDate?: string
  upcomingOnly?: boolean
  pageNumber: number
  pageSize: number
}

export interface CreateEventWithMediaParams {
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  addressAr: string
  addressEn: string
  mapUrl?: string
  formUrl?: string
  startDate: string
  endDate: string
  files?: File[]
}

export interface UpdateEventParams {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  addressAr: string
  addressEn: string
  mapUrl?: string
  formUrl?: string
  startDate: string
  endDate: string
}
