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

// ── Community Post ────────────────────────────────────────────────

export interface CommunityPostUserDto {
  userId: number
  fullName: string | null
  profileImageUrl: string | null
}

export interface CommunityPostMediaResponseDto {
  mediaId: number
  postId: number
  mediaUrl: string | null
  mediaType: MediaType
}

export interface CommunityPostResponseDto {
  postId: number
  contentText: string | null
  createdAt: string
  user: CommunityPostUserDto
  media: CommunityPostMediaResponseDto[] | null
}

export interface CommunityPostsData {
  items: CommunityPostResponseDto[]
  pagination: PaginationMeta
}

export interface CommunityPostsApiResponse {
  success: boolean
  data: CommunityPostsData
}

export interface CommunityPostsParams {
  search?: string
  pageNumber: number
  pageSize: number
}

// ── Create Post ───────────────────────────────────────────────────

export interface CreatePostResponse {
  success: boolean
  message: string | null
  data: CommunityPostResponseDto
  errors: string[] | null
  statusCode: number
}

// ── Report ────────────────────────────────────────────────────────

export interface CreateReportDto {
  reason: string
}

export interface ReportResponseDto {
  reportId: number
  postId: number
  reason: string | null
  createdAt: string
}

export interface ReportResponseDtoApiResponse {
  success: boolean
  message: string | null
  data: ReportResponseDto
  errors: string[] | null
  statusCode: number
}
