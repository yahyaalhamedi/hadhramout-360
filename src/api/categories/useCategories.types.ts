// ── Resource model ────────────────────────────────────────────────

export interface CategoryResponseDto {
  categoryId: number
  categoryNameAr: string
  categoryNameEn: string
}

// ── Response shape ────────────────────────────────────────────────

export interface CategoriesApiResponse {
  success: boolean
  data: CategoryResponseDto[]
}
