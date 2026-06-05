export interface AdminUser {
  userId: number
  fullName: string | null
  email: string | null
  phoneNumber: string | null
  profileImageUrl: string | null
  roles: string[] | null
}

export interface PaginationMeta {
  currentPage: number
  nextPage: number | null
  previousPage: number | null
  totalPages: number
  totalEntries: number
  perPage: number
}

export interface AdminUsersData {
  items: AdminUser[]
  pagination: PaginationMeta
}

export interface AdminUsersApiResponse {
  success: boolean
  message: string | null
  data: AdminUsersData
  errors: string[] | null
  statusCode: number
}

export interface AdminUserApiResponse {
  success: boolean
  message: string | null
  data: AdminUser
  errors: string[] | null
  statusCode: number
}

export interface AdminUsersParams {
  search?: string
  role?: string
  pageNumber: number
  pageSize: number
}

export interface CreateContentManagerParams {
  fullName: string
  email: string
  password: string
  phoneNumber?: string
  profileImageFile?: File
}
