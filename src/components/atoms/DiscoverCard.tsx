import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useGetRtl } from '@/lib/utils'
import { baseURL } from '@/api/axiosInstance'
import { useTranslation } from 'react-i18next'

interface DiscoverCardProps {
  imageUrl: string
  title: string
  onClick: () => void
  className?: string
}

export default function DiscoverCard({
  imageUrl,
  title,
  onClick,
  className,
}: DiscoverCardProps) {
  const { t } = useTranslation()
  const isRtl = useGetRtl()
  const image = `${baseURL}${imageUrl}`

  return (
    <div
      className={`group cursor-pointer overflow-hidden rounded-[24px] bg-white transition-shadow hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="px-1 pt-4 pb-2">
        <h3 className="mb-3 line-clamp-2 text-lg font-bold text-secondary-8">{title}</h3>
        <button
          className="flex w-full items-center justify-center gap-2 rounded-full border border-secondary-6 bg-white py-3 text-sm font-semibold text-secondary-8 transition-colors hover:bg-secondary-2 cursor-pointer"
        >
          {t('label.view_details')}
          {isRtl ? (
            <ArrowLeft className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
