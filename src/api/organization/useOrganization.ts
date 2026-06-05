import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  OrgProfileDto,
  OrgProfileApiResponse,
  UpdateOrgProfileParams,
} from './useOrganization.types'

// ── Fetch functions ───────────────────────────────────────────────

async function fetchOrgProfile(): Promise<OrgProfileDto> {
  const { data } = await axiosInstance.get<OrgProfileApiResponse>('/api/organizations/me')
  return data.data
}

async function updateOrgProfile(params: UpdateOrgProfileParams): Promise<OrgProfileDto> {
  const formData = new FormData()
  formData.append('OrgNameAr', params.orgNameAr)
  formData.append('OrgNameEn', params.orgNameEn)
  if (params.descriptionAr) formData.append('DescriptionAr', params.descriptionAr)
  if (params.descriptionEn) formData.append('DescriptionEn', params.descriptionEn)
  formData.append('AddressAr', params.addressAr)
  formData.append('AddressEn', params.addressEn)
  if (params.mapUrl) formData.append('MapUrl', params.mapUrl)
  if (params.phoneNumber) formData.append('PhoneNumber', params.phoneNumber)
  if (params.logoFile) formData.append('LogoFile', params.logoFile)

  const { data } = await axiosInstance.put<OrgProfileApiResponse>('/api/organizations/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useOrgProfile() {
  return useQuery({
    queryKey: ['org-profile'],
    queryFn: fetchOrgProfile,
  })
}

export function useUpdateOrgProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOrgProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['org-profile'] })
    },
  })
}
