export interface AccountProfile {
  userId: number
  fullName: string
  email: string
  phoneNumber: string | null
  profileImageUrl: string | null
}

export interface UpdateProfileParams {
  fullName: string
  phoneNumber?: string
  profileImageFile?: File
}

export interface ChangeEmailParams {
  newEmail: string
  currentPassword: string
}

export interface ChangePasswordParams {
  currentPassword: string
  newPassword: string
}

export interface ApiResponse<T> {
  succeeded: boolean
  message: string | null
  errors: string[] | null
  data: T
}
