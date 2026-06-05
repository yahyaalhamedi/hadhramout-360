export interface OrgProfileDto {
  userId: number
  orgNameAr: string | null
  orgNameEn: string | null
  descriptionAr: string | null
  descriptionEn: string | null
  addressAr: string | null
  addressEn: string | null
  mapUrl: string | null
  phoneNumber: string | null
  email: string | null
  logoUrl: string | null
  profileImageUrl: string | null
}

export interface OrgProfileApiResponse {
  success: boolean
  message: string | null
  data: OrgProfileDto
  errors: string[] | null
  statusCode: number
}

export interface UpdateOrgProfileParams {
  orgNameAr: string
  orgNameEn: string
  descriptionAr?: string
  descriptionEn?: string
  addressAr: string
  addressEn: string
  mapUrl?: string
  phoneNumber?: string
  logoFile?: File
}
