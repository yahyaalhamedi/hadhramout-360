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
    <div className="group relative h-[520px] w-full overflow-hidden rounded-[40px]">
      {/* Background Image */}
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5">
        {/* Author */}
        <div className="mb-5 flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white/30">
            <AvatarImage src={authorImage} />
          </Avatar>

          <span className="text-sm text-white">{author}</span>
        </div>

        {/* Title */}
        <h2 className="mb-5 text-4xl font-bold leading-tight text-white">{title}</h2>

        {/* Meta */}
        <div className="mb-8 flex items-center gap-6 text-sm text-white/90">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={onClick}
          className="h-14 rounded-2xl bg-[#F3E7D7] text-lg font-semibold text-[#B98B4A] hover:bg-[#F3E7D7]/90"
        >
          {t('label.view_details')}
          {isRtl ? <ArrowLeft className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5" />}
        </Button>
      </div>
    </div>
  )
}
