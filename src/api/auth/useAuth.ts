import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import { useAuthContext } from '@/lib/AuthContext'
import type {
  LoginParams,
  LoginResponse,
  LoginResponseData,
  RegisterUserParams,
  RegisterUserResponse,
  RegisterOrganizationParams,
  RegisterOrganizationResponse,
} from './useAuth.types'

// ── API Fetch Functions ───────────────────────────────────────────

async function loginUser(params: LoginParams): Promise<LoginResponseData> {
  const { data } = await axiosInstance.post<LoginResponse>('/api/Auth/login', {
    email: params.email,
    password: params.password,
  })
  return data.data
}

async function registerUser(params: RegisterUserParams): Promise<RegisterUserResponse> {
  const formData = new FormData()
  formData.append('FullName', params.userName)
  formData.append('UserName', params.userName)
  formData.append('Email', params.email)
  formData.append('Password', params.password)

  if (params.phoneNumber) {
    formData.append('PhoneNumber', params.phoneNumber)
  }
  if (params.profileImageFile) {
    formData.append('ProfileImageFile', params.profileImageFile)
  }

  const { data } = await axiosInstance.post<RegisterUserResponse>(
    '/api/Auth/register-user',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

async function registerOrganization(
  params: RegisterOrganizationParams,
): Promise<RegisterOrganizationResponse> {
  const formData = new FormData()
  formData.append('OrgNameAr', params.orgNameAr)
  formData.append('OrgNameEn', params.orgNameEn)

  if (params.descriptionAr) formData.append('DescriptionAr', params.descriptionAr)
  if (params.descriptionEn) formData.append('DescriptionEn', params.descriptionEn)

  formData.append('AddressAr', params.addressAr)
  formData.append('AddressEn', params.addressEn)

  if (params.mapUrl) formData.append('MapUrl', params.mapUrl)
  if (params.logoFile) formData.append('LogoFile', params.logoFile)

  formData.append('FullName', params.userName)
  formData.append('UserName', params.userName)
  formData.append('Email', params.email)
  formData.append('Password', params.password)

  if (params.phoneNumber) formData.append('PhoneNumber', params.phoneNumber)
  if (params.profileImageFile) formData.append('ProfileImageFile', params.profileImageFile)

  const { data } = await axiosInstance.post<RegisterOrganizationResponse>(
    '/api/Auth/register-organization',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

// ── React Query Mutations ─────────────────────────────────────────

export function useLogin() {
  const queryClient = useQueryClient()
  const { login } = useAuthContext()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      // Persist to cookies + update React context
      login({
        token: res.token,
        expiration: res.expiration,
        email: res.email,
        roles: res.roles,
        userId: res.userId,
      })
      void queryClient.invalidateQueries()
    },
  })
}

export function useRegisterUser() {
  return useMutation({ mutationFn: registerUser })
}

export function useRegisterOrganization() {
  return useMutation({ mutationFn: registerOrganization })
}
