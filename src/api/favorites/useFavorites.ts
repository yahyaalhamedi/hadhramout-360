import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  FavoriteResponseDtoApiResponse,
  FavoriteStatusResponseDtoApiResponse,
} from './useFavorites.types'

// ── API Fetch Functions ───────────────────────────────────────────

/**
 * Adds a landmark to favorites.
 * POST /api/favorites/{landmarkId}
 */
async function addFavorite(landmarkId: number): Promise<void> {
  await axiosInstance.post<FavoriteResponseDtoApiResponse>(`/api/favorites/${landmarkId}`)
}

/**
 * Removes a landmark from favorites.
 * DELETE /api/favorites/{landmarkId}
 */
async function removeFavorite(landmarkId: number): Promise<void> {
  await axiosInstance.delete<boolean>(`/api/favorites/${landmarkId}`)
}

/**
 * Toggles a landmark's favorite status.
 * POST /api/favorites/{landmarkId}/toggle
 */
async function toggleFavorite(landmarkId: number): Promise<boolean> {
  const { data } = await axiosInstance.post<FavoriteStatusResponseDtoApiResponse>(
    `/api/favorites/${landmarkId}/toggle`
  )
  return data.data.isFavorite
}

// ── React Query Mutations ─────────────────────────────────────────

/**
 * Hook to add a landmark to favorites.
 */
export function useAddFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addFavorite,
    onSuccess: (_, landmarkId) => {
      // Invalidate both the landmarks list and the specific landmark details
      void queryClient.invalidateQueries({ queryKey: ['landmarks'] })
      void queryClient.invalidateQueries({ queryKey: ['landmark', landmarkId] })
    },
  })
}

/**
 * Hook to remove a landmark from favorites.
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_, landmarkId) => {
      // Invalidate both the landmarks list and the specific landmark details
      void queryClient.invalidateQueries({ queryKey: ['landmarks'] })
      void queryClient.invalidateQueries({ queryKey: ['landmark', landmarkId] })
    },
  })
}

/**
 * Hook to toggle a landmark's favorite status.
 * Highly recommended for heart/favorite buttons as it handles the state transition server-side.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: (isFavorite, landmarkId) => {
      // Invalidate both the landmarks list and the specific landmark details
      void queryClient.invalidateQueries({ queryKey: ['landmarks'] })
      void queryClient.invalidateQueries({ queryKey: ['landmark', landmarkId] })
    },
  })
}
