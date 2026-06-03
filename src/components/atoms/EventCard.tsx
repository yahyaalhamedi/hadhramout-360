import { Calendar, MapPin, ArrowRight, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useGetRtl } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

type EventCardProps = {
  imageUrl: string
  author: string
  authorImage: string
  title: string
  location: string
  date: string
  onClick?: () => void
}

export function EventCard({
  imageUrl,
  author,
  authorImage,
  title,
  location,
  date,
  onClick,
}: EventCardProps) {
  const { t } = useTranslation()
  const isRtl = useGetRtl()

  return (
    <div className="group relative h-[380px] w-full overflow-hidden rounded-[28px] sm:h-[440px] sm:rounded-[32px] md:h-[520px] md:rounded-[40px]">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-4 sm:p-5">
        {/* Author */}
        <div className="mb-3 flex items-center gap-2 sm:mb-5 sm:gap-3">
          <Avatar className="h-8 w-8 border border-white/30 sm:h-10 sm:w-10">
            <AvatarImage src={authorImage} />
          </Avatar>

          <span className="text-xs text-white sm:text-sm">{author}</span>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-xl font-bold leading-tight text-white sm:mb-5 sm:text-2xl md:text-4xl">{title}</h2>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/90 sm:mb-8 sm:gap-6 sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{date}</span>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={onClick}
          className="h-11 rounded-xl bg-[#F3E7D7] text-sm font-semibold text-[#B98B4A] hover:bg-[#F3E7D7]/90 sm:h-14 sm:rounded-2xl sm:text-lg"
        >
          {t('label.view_details')}
          {isRtl ? <ArrowLeft className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /> : <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>
    </div>
  )
}
