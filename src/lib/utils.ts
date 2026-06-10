import { clsx, type ClassValue } from 'clsx'
import { useTranslation } from 'react-i18next'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const useGetRtl = () => {
  const { i18n } = useTranslation()
  const isRtl = i18n.language.startsWith('ar')
  return isRtl
}

export function getArtisanSlug(id: number, nameAr: string | null, nameEn: string | null): string {
  const name = nameEn || nameAr || 'artisan'
  const slugified = name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep letters/numbers in any language
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
  return `${slugified}-${id}`
}

export function parseIdFromSlug(slug: string | undefined): number | undefined {
  if (!slug) return undefined
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  const id = Number(lastPart)
  return isNaN(id) ? undefined : id
}
