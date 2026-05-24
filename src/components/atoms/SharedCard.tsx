import { Heart, MapPin, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, useGetRtl } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

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

  return (
    <div className={`group relative overflow-hidden rounded-[32px] ${className}`}>
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between">
        <div>
          {/* Location */}
          <div className="mb-3 flex items-center gap-2 text-sm text-white/90">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          {/* Title */}
          <h2 className="max-w-[80%] text-xl font-bold leading-tight text-white">{title}</h2>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex items-center gap-3">
          {/* Details Button */}
          <Button
            onClick={onClick}
            className="h-14 rounded-full bg-secondary px-8 text-secondary-8 font-semibold  hover:bg-secondary-1 cursor-pointer"
          >
            {t('label.view_details')}
            {isRtl ? (
              <ArrowLeft className="ml-2 h-5 w-5" />
            ) : (
              <ArrowRight className="ml-2 h-5 w-5" />
            )}
          </Button>

          {/* Favorite Button */}
          <button
            onClick={onFavoriteClick}
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full border backdrop-blur-md transition-all cursor-pointer',
              isFavorite
                ? 'border-white bg-secondary text-secondary-9'
                : 'border-white/30 bg-white/10 text-white hover:bg-white/20',
            )}
          >
            <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
          </button>
        </div>
      </div>
    </div>
  )
}
