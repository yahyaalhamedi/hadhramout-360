// ── Shared ────────────────────────────────────────────────────────

export type MediaType = 0 | 1

export interface PaginationMeta {
  currentPage: number
  nextPage: number | null
  perPage: number
  previousPage: number | null
  totalEntries: number
  totalPages: number
}

// ── List endpoint ─────────────────────────────────────────────────

export interface ArtisanResponseDto {
  artisanId: number
  nameAr: string | null
  nameEn: string | null
  coverImageUrl: string | null
}

export interface ArtisansData {
  items: ArtisanResponseDto[]
  pagination: PaginationMeta
}

export interface ArtisansApiResponse {
  success: boolean
  data: ArtisansData
}

export interface ArtisansParams {
  search?: string
  pageNumber: number
  pageSize: number
}

// ── Detail endpoint ───────────────────────────────────────────────

export interface ArtisanMediaResponseDto {
  mediaId: number
  artisanId: number
  mediaUrl: string | null
  mediaType: MediaType
  isCover: boolean
}

export interface ArtisanDetailsDto {
  artisanId: number
  nameAr: string | null
  nameEn: string | null
  phone: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  locationTextAr: string | null
  locationTextEn: string | null
  mapUrl: string | null
  coverImageUrl: string | null
  media: ArtisanMediaResponseDto[] | null
}

export interface ArtisanDetailApiResponse {
  success: boolean
  message: string | null
  data: ArtisanDetailsDto
  errors: string[] | null
  statusCode: number
}
