export interface CategoryResponseDto {
  categoryId: number
  categoryNameAr: string | null
  categoryNameEn: string | null
}

export interface LandmarkMediaResponseDto {
  mediaId: number
  mediaUrl: string | null
  mediaType: number
  createdAt: string
}

export interface LandmarkResponseDto {
  landmarkId: number
  titleAr: string | null
  titleEn: string | null
  locationTextAr: string | null
  locationTextEn: string | null
  coverMediaUrl: string | null
  categories: CategoryResponseDto[] | null
  isFavorite: boolean
  mapUrl: string | null
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

export interface LandmarksParams {
  search?: string
  categoryId?: number
  pageNumber: number
  pageSize: number
}

export interface CreateLandmarkWithMediaParams {
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  locationTextAr?: string
  locationTextEn?: string
  mapUrl: string
  categoryIds: number[]
  files?: File[]
}

export interface UpdateLandmarkParams {
  id: number
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  locationTextAr?: string
  locationTextEn?: string
  mapUrl: string
  categoryIds: number[]
}
