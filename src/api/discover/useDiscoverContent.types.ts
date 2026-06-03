// ── Shared ────────────────────────────────────────────────────────

export interface PaginationMeta {
  currentPage: number
  nextPage: number | null
  perPage: number
  previousPage: number | null
  totalEntries: number
  totalPages: number
}

// ── List endpoint ─────────────────────────────────────────────────

export interface DiscoverContentResponseDto {
  contentId: number
  titleAr: string | null
  titleEn: string | null
  coverImageUrl: string | null
}

export interface DiscoverContentData {
  items: DiscoverContentResponseDto[]
  pagination: PaginationMeta
}

export interface DiscoverContentApiResponse {
  success: boolean
  data: DiscoverContentData
}

export type DiscoverContentCategory = 'culture' | 'food' | 'games'

export interface DiscoverContentParams {
  search?: string
  category?: DiscoverContentCategory
  pageNumber: number
  pageSize: number
}

// ── Detail endpoint ───────────────────────────────────────────────

export interface DiscoverContentDetailsDto {
  contentId: number
  titleAr: string | null
  titleEn: string | null
  bodyAr: string | null
  bodyEn: string | null
  coverImageUrl: string | null
}

export interface DiscoverContentDetailApiResponse {
  success: boolean
  message: string | null
  data: DiscoverContentDetailsDto
  errors: string[] | null
  statusCode: number
}
