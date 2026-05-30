export interface CategoryResponseDto {
  categoryId: number
  nameAr: string
  nameEn: string
}

export interface LandmarkResponseDto {
  landmarkId: number
  titleAr: string
  titleEn: string
  locationTextAr: string
  locationTextEn: string
  coverMediaUrl: string
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
