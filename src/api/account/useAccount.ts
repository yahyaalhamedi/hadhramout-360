import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  AccountProfile,
  UpdateProfileParams,
  ChangeEmailParams,
  ChangePasswordParams,
  ApiResponse,
} from './useAccount.types'

// ── Fetchers ─────────────────────────────────────────────────────────

async function getProfile(): Promise<AccountProfile> {
  const { data } = await axiosInstance.get<ApiResponse<AccountProfile>>('/api/account/me')
  return data.data
}

async function updateProfile(params: UpdateProfileParams): Promise<AccountProfile> {
  const formData = new FormData()
  formData.append('FullName', params.fullName)
  if (params.phoneNumber !== undefined) {
    formData.append('PhoneNumber', params.phoneNumber)
  }
  if (params.profileImageFile) {
    formData.append('ProfileImageFile', params.profileImageFile)
  }

  const { data } = await axiosInstance.put<ApiResponse<AccountProfile>>(
    '/api/account/me',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.data
}

async function changeEmail(params: ChangeEmailParams): Promise<AccountProfile> {
  const { data } = await axiosInstance.put<ApiResponse<AccountProfile>>(
    '/api/account/email',
    { newEmail: params.newEmail, currentPassword: params.currentPassword },
  )
  return data.data
}

async function changePassword(params: ChangePasswordParams): Promise<boolean> {
  const { data } = await axiosInstance.put<ApiResponse<boolean>>(
    '/api/account/password',
    { currentPassword: params.currentPassword, newPassword: params.newPassword },
  )
  return data.data
}

async function deleteProfileImage(): Promise<AccountProfile> {
  const { data } = await axiosInstance.delete<ApiResponse<AccountProfile>>(
    '/api/account/profile-image',
  )
  return data.data
}

// ── Hooks ────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useChangeEmail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changeEmail,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  })
}

export function useDeleteProfileImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProfileImage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
