import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type { FavoriteResponseDto } from '@/api/favorites/useFavorites.types'

interface FavoritesListApiResponse {
  success: boolean
  data: FavoriteResponseDto[]
}

async function fetchUserFavorites(): Promise<FavoriteResponseDto[]> {
  const { data } = await axiosInstance.get<FavoritesListApiResponse>('/api/favorites/my')
  // Handle both shapes: { data: [...] } or { data: { items: [...] } }
  const payload = data.data
  return Array.isArray(payload) ? payload : (payload as unknown as { items: FavoriteResponseDto[] }).items ?? []
}

export function useUserFavorites() {
  return useQuery({
    queryKey: ['user-favorites'],
    queryFn: fetchUserFavorites,
  })
}

