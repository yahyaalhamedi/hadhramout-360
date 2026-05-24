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
