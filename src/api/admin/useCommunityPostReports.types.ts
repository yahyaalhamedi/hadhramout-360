export interface ReportedByUserDto {
  userId: number
  fullName: string | null
  profileImageUrl: string | null
}

export interface CommunityPostMediaResponseDto {
  mediaId: number
  mediaUrl: string | null
  mediaType: string
}

export interface CommunityPostUserDto {
  userId: number
  fullName: string | null
  profileImageUrl: string | null
}

export interface ReportedPostDto {
  postId: number
  contentText: string | null
  createdAt: string
  user: CommunityPostUserDto
  media: CommunityPostMediaResponseDto[] | null
}

export interface CommunityPostReportResponseDto {
  reportId: number
  reason: string | null
  createdAt: string
  reportedBy: ReportedByUserDto
  reportedPost: ReportedPostDto
}

export interface PaginationMeta {
  currentPage: number
  nextPage: number | null
  previousPage: number | null
  totalPages: number
  totalEntries: number
  perPage: number
}

export interface CommunityPostReportsData {
  items: CommunityPostReportResponseDto[]
  pagination: PaginationMeta
}

export interface CommunityPostReportsApiResponse {
  success: boolean
  message: string | null
  data: CommunityPostReportsData
  errors: string[] | null
  statusCode: number
}

export interface CommunityPostReportsParams {
  pageNumber: number
  pageSize: number
}
