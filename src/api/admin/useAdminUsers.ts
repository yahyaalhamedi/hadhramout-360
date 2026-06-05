import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  AdminUsersApiResponse,
  AdminUsersData,
  AdminUserApiResponse,
  AdminUsersParams,
  CreateContentManagerParams,
} from './useAdminUsers.types'

// ── Fetch functions ───────────────────────────────────────────────

async function fetchAdminUsers(params: AdminUsersParams): Promise<AdminUsersData> {
  const { data } = await axiosInstance.get<AdminUsersApiResponse>('/api/admin/users', {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.search ? { Search: params.search } : {}),
      ...(params.role ? { Role: params.role } : {}),
    },
  })
  return data.data
}

async function createContentManager(params: CreateContentManagerParams): Promise<AdminUserApiResponse> {
  const formData = new FormData()
  formData.append('FullName', params.fullName)
  formData.append('Email', params.email)
  formData.append('Password', params.password)
  if (params.phoneNumber) formData.append('PhoneNumber', params.phoneNumber)
  if (params.profileImageFile) formData.append('ProfileImageFile', params.profileImageFile)

  const { data } = await axiosInstance.post<AdminUserApiResponse>(
    '/api/admin/users/content-managers',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

async function deleteUser(id: number): Promise<{ success: boolean; message: string | null; statusCode: number }> {
  const { data } = await axiosInstance.delete(`/api/admin/users/${id}`)
  return data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useAdminUsers({ search, role, pageSize }: Omit<AdminUsersParams, 'pageNumber'>) {
  return useInfiniteQuery({
    queryKey: ['admin-users', { search, role, pageSize }],
    queryFn: ({ pageParam = 1 }) =>
      fetchAdminUsers({ pageNumber: pageParam, pageSize, search, role }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
  })
}

export function useCreateContentManager() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createContentManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })
}
