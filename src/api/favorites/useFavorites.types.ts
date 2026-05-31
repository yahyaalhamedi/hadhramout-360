export interface FavoriteResponseDto {
  favoriteId: number
  landmarkId: number
  titleAr: string | null
  titleEn: string | null
  locationTextAr: string | null
  locationTextEn: string | null
  mapUrl: string | null
  coverMediaUrl: string | null
  createdAt: string
  categoryNamesAr: string[] | null
  categoryNamesEn: string[] | null
}

export interface FavoriteResponseDtoApiResponse {
  success: boolean
  message: string | null
  data: FavoriteResponseDto
  errors: string[] | null
  statusCode: number
}

export interface FavoriteStatusResponseDto {
  landmarkId: number
  isFavorite: boolean
}

export interface FavoriteStatusResponseDtoApiResponse {
  success: boolean
  message: string | null
  data: FavoriteStatusResponseDto
  errors: string[] | null
  statusCode: number
}
