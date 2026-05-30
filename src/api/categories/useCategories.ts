import { useQuery } from '@tanstack/react-query'

import { axiosInstance } from '@/api/axiosInstance'
import type { CategoriesApiResponse, CategoryResponseDto } from './useCategories.types'

// ── Query keys ────────────────────────────────────────────────────

export const categoriesKeys = {
  all: ['categories'] as const,
}

// ── Fetch function ────────────────────────────────────────────────

async function fetchCategories(): Promise<CategoryResponseDto[]> {
  const { data } = await axiosInstance.get<CategoriesApiResponse>('/api/categories')
  return data.data
}

// ── Hook ─────────────────────────────────────────────────────────

/**
 * Fetches the full list of landmark categories.
 *
 * @example
 *   const { data: categories = [] } = useCategories()
 */
export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.all,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10, // categories rarely change — cache for 10 min
  })
}
