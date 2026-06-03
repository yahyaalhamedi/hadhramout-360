import { Heart, MapPin, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, useGetRtl } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { baseURL } from '@/api/axiosInstance'

interface SharedCardProps {
  imageUrl: string
  className?: string
  location: string
  title: string
  onClick: () => void
  isFavorite: boolean
  onFavoriteClick?: () => void
}

export default function SharedCard({
  imageUrl,
  className,
  location,
  title,
  onClick,
  isFavorite,
  onFavoriteClick,
}: SharedCardProps) {
  const { t } = useTranslation()
  const isRtl = useGetRtl()

  const image = `${baseURL}${imageUrl}`

  return (
    <div className={`group relative overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px] ${className}`}>
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col sm:flex-row sm:justify-between sm:items-end sm:p-6 md:p-8">
        <div className="mb-3 sm:mb-0">
          {/* Location */}
          <div className="mb-2 flex items-center gap-1.5 text-xs text-white/90 sm:mb-3 sm:gap-2 sm:text-sm">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{location}</span>
          </div>

          {/* Title */}
          <h2 className="max-w-[90%] text-base font-bold leading-tight text-white sm:max-w-[80%] sm:text-lg md:text-xl">{title}</h2>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Details Button */}
          <Button
            onClick={onClick}
            className="h-10 rounded-full bg-secondary px-4 text-xs text-secondary-8 font-semibold hover:bg-secondary-1 cursor-pointer sm:h-12 sm:px-6 sm:text-sm md:h-14 md:px-8 md:text-base"
          >
            {t('label.view_details')}
            {isRtl ? (
              <ArrowLeft className="ml-1.5 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />
            ) : (
              <ArrowRight className="ml-1.5 h-4 w-4 sm:ml-2 sm:h-5 sm:w-5" />
            )}
          </Button>

          {/* Favorite Button */}
          <button
            onClick={onFavoriteClick}
            className={cn(
              'flex items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer',
              'h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14',
              isFavorite
                ? 'border-white bg-secondary text-secondary-9'
                : 'border-white/30 bg-white/10 text-white hover:bg-white/20',
            )}
          >
            <Heart className={cn('h-4 w-4 sm:h-5 sm:w-5', isFavorite && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  )
}
