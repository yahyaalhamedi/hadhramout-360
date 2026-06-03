export interface LoginParams {
  email: string
  password: string
}

export interface LoginResponseData {
  token: string
  userName: string
  email: string
  roles?: string[]
}

export interface LoginResponse {
  success: boolean
  message: string | null
  data: LoginResponseData
  errors: string[] | null
  statusCode: number
}

export interface RegisterUserParams {
  userName: string
  email: string
  password: string
  phoneNumber?: string
  profileImageFile?: File | null
}

export interface RegisterUserResponse {
  success: boolean
  message: string | null
  errors: string[] | null
  statusCode: number
}

export interface RegisterOrganizationParams {
  orgNameAr: string
  orgNameEn: string
  descriptionAr?: string
  descriptionEn?: string
  addressAr: string
  addressEn: string
  mapUrl?: string
  logoFile?: File | null
  userName: string
  email: string
  password: string
  phoneNumber?: string
  profileImageFile?: File | null
}

export interface RegisterOrganizationResponse {
  success: boolean
  message: string | null
  errors: string[] | null
  statusCode: number
}
