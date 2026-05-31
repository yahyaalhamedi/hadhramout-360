// ── Shared ────────────────────────────────────────────────────────

export interface CategoryResponseDto {
  categoryId: number
  categoryNameAr: string
  categoryNameEn: string
}

export interface LandmarkMediaResponseDto {
  mediaId: number
  mediaUrl: string | null
  mediaType: 'Image' | 'Video' | string
  createdAt: string
}

// ── List endpoint ─────────────────────────────────────────────────

export interface LandmarkResponseDto {
  landmarkId: number
  titleAr: string
  titleEn: string
  locationTextAr: string
  locationTextEn: string
  coverMediaUrl: string | null
  categories: CategoryResponseDto[]
  isFavorite: boolean
  mapUrl: string
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  currentPage: number
  nextPage: number | null
  previousPage: number | null
  totalPages: number
  totalEntries: number
  perPage: number
}

export interface LandmarksData {
  items: LandmarkResponseDto[]
  pagination: PaginationMeta
}

export interface LandmarksApiResponse {
  success: boolean
  data: LandmarksData
}

export interface LandmarksParams {
  search?: string
  categoryId?: number
  pageNumber: number
  pageSize: number
}

// ── Detail endpoint ───────────────────────────────────────────────

/** Full detail shape returned by GET /api/landmarks/{id} */
export interface LandmarkDetailsDto {
  landmarkId: number
  titleAr: string | null
  titleEn: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  locationTextAr: string | null
  locationTextEn: string | null
  mapUrl: string | null
  createdAt: string
  updatedAt: string
  categories: CategoryResponseDto[] | null
  media: LandmarkMediaResponseDto[] | null
  isFavorite: boolean
}

export interface LandmarkDetailApiResponse {
  success: boolean
  message: string | null
  data: LandmarkDetailsDto
  errors: string[] | null
  statusCode: number
}
