export interface ArtisanMediaResponseDto {
  mediaId: number
  artisanId: number
  mediaUrl: string | null
  mediaType: number
  isCover: boolean
}

export interface ArtisanResponseDto {
  artisanId: number
  nameAr: string | null
  nameEn: string | null
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

export interface ArtisansData {
  items: ArtisanResponseDto[]
  pagination: PaginationMeta
}

export interface ArtisansApiResponse {
  success: boolean
  data: ArtisansData
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

export interface ArtisansParams {
  search?: string
  pageNumber: number
  pageSize: number
}

export interface CreateArtisanWithMediaParams {
  nameAr: string
  nameEn: string
  phone: string
  descriptionAr: string
  descriptionEn: string
  locationTextAr?: string
  locationTextEn?: string
  mapUrl?: string
  files?: File[]
}

export interface UpdateArtisanParams {
  id: number
  nameAr: string
  nameEn: string
  phone: string
  descriptionAr: string
  descriptionEn: string
  locationTextAr?: string
  locationTextEn?: string
  mapUrl?: string
}
