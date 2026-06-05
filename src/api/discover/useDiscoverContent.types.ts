export interface DiscoverContentResponseDto {
  contentId: number
  titleAr: string | null
  titleEn: string | null
  coverImageUrl: string | null
}

export interface PaginationMeta {
  currentPage: number
  nextPage: number | null
  previousPage: number | null
  totalPages: number
  totalEntries: number
  perPage: number
}

export interface DiscoverData {
  items: DiscoverContentResponseDto[]
  pagination: PaginationMeta
}

export interface DiscoverApiResponse {
  success: boolean
  data: DiscoverData
}

export interface DiscoverContentDetailsDto {
  contentId: number
  titleAr: string | null
  titleEn: string | null
  bodyAr: string | null
  bodyEn: string | null
  coverImageUrl: string | null
}

export interface DiscoverDetailApiResponse {
  success: boolean
  message: string | null
  data: DiscoverContentDetailsDto
  errors: string[] | null
  statusCode: number
}

export interface DiscoverParams {
  search?: string
  pageNumber: number
  pageSize: number
}

export interface CreateDiscoverContentParams {
  titleAr: string
  titleEn: string
  bodyAr: string
  bodyEn: string
  coverImage?: File
}

export interface UpdateDiscoverContentParams {
  id: number
  titleAr: string
  titleEn: string
  bodyAr: string
  bodyEn: string
  coverImage?: File
}
