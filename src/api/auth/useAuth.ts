import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  LoginParams,
  LoginResponse,
  RegisterUserParams,
  RegisterUserResponse,
  RegisterOrganizationParams,
  RegisterOrganizationResponse,
} from './useAuth.types'

// ── API Fetch Functions ───────────────────────────────────────────

/**
 * Handles user login.
 * POST /api/Auth/login
 */
async function loginUser(params: LoginParams): Promise<LoginResponse['data']> {
  const { data } = await axiosInstance.post<LoginResponse>('/api/Auth/login', {
    email: params.email,
    password: params.password,
  })

  return data.data
}

/**
 * Registers a normal user (multipart/form-data).
 * POST /api/Auth/register-user
 */
async function registerUser(params: RegisterUserParams): Promise<RegisterUserResponse> {
  const formData = new FormData()
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
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return data
}

/**
 * Registers an organization (multipart/form-data).
 * POST /api/Auth/register-organization
 */
async function registerOrganization(
  params: RegisterOrganizationParams,
): Promise<RegisterOrganizationResponse> {
  const formData = new FormData()
  formData.append('OrgNameAr', params.orgNameAr)
  formData.append('OrgNameEn', params.orgNameEn)

  if (params.descriptionAr) {
    formData.append('DescriptionAr', params.descriptionAr)
  }
  if (params.descriptionEn) {
    formData.append('DescriptionEn', params.descriptionEn)
  }

  formData.append('AddressAr', params.addressAr)
  formData.append('AddressEn', params.addressEn)

  if (params.mapUrl) {
    formData.append('MapUrl', params.mapUrl)
  }
  if (params.logoFile) {
    formData.append('LogoFile', params.logoFile)
  }

  formData.append('UserName', params.userName)
  formData.append('Email', params.email)
  formData.append('Password', params.password)

  if (params.phoneNumber) {
    formData.append('PhoneNumber', params.phoneNumber)
  }
  if (params.profileImageFile) {
    formData.append('ProfileImageFile', params.profileImageFile)
  }

  const { data } = await axiosInstance.post<RegisterOrganizationResponse>(
    '/api/Auth/register-organization',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return data
}

// ── React Query Mutations ─────────────────────────────────────────

/**
 * Hook to login a user.
 */
export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      // Invalidate all queries to ensure auth-dependent content is refreshed
      void queryClient.invalidateQueries()
      localStorage.setItem('LoggedIn', 'true')
      localStorage.setItem('user_name', res.userName)
      localStorage.setItem('user_email', res.email)
      localStorage.setItem('user_roles', JSON.stringify(res.roles))
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.token}`
    },
  })
}

/**
 * Hook to register a normal user.
 */
export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUser,
  })
}

/**
 * Hook to register an organization.
 */
export function useRegisterOrganization() {
  return useMutation({
    mutationFn: registerOrganization,
  })
}

/**
 * Helper to log out user and clear storage.
 */
export function logoutUser() {
  localStorage.removeItem('LoggedIn')
  localStorage.removeItem('user_roles')
  localStorage.removeItem('user_name')
  localStorage.removeItem('user_email')
  delete axiosInstance.defaults.headers.common['Authorization']
}

