export interface LoginParams {
  email: string
  password: string
}

export interface LoginResponseData {
  token: string
  expiration: string
  email: string
  roles: string[]
  userId: number
}

export interface LoginResponse {
  message: string
  data: LoginResponseData
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
