import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'

export interface CategoryResponseDto {
  categoryId: number
  categoryNameAr: string | null
  categoryNameEn: string | null
}

export interface CategoriesApiResponse {
  success: boolean
  data: CategoryResponseDto[]
}

async function fetchCategories(): Promise<CategoryResponseDto[]> {
  const { data } = await axiosInstance.get<CategoriesApiResponse>('/api/categories')
  return data.data
}

async function createCategory(dto: { categoryNameAr: string; categoryNameEn: string }) {
  const { data } = await axiosInstance.post('/api/categories', dto)
  return data.data
}

async function updateCategory(params: { id: number; categoryNameAr: string; categoryNameEn: string }) {
  const { data } = await axiosInstance.put(`/api/categories/${params.id}`, {
    categoryNameAr: params.categoryNameAr,
    categoryNameEn: params.categoryNameEn,
  })
  return data.data
}

async function deleteCategory(id: number) {
  const { data } = await axiosInstance.delete(`/api/categories/${id}`)
  return data
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
