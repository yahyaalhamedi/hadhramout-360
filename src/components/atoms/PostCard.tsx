import { useState, useCallback } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { baseURL } from '@/api/axiosInstance'
import { useTranslation } from 'react-i18next'
import { useGetRtl } from '@/lib/utils'
import type { CommunityPostMediaResponseDto } from '@/api/community/useCommunityPosts.types'

interface PostCardProps {
  userName: string
  userAvatar: string | null
  contentText: string | null
  createdAt: string
  media: CommunityPostMediaResponseDto[] | null
  onReport: () => void
}

function timeAgo(dateString: string, t: (key: string) => string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return t('time.just_now')
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} ${t('time.minutes_ago')}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${t('time.hours_ago')}`
  const days = Math.floor(hours / 24)
  if (days === 1) return t('time.yesterday')
  return `${days} ${t('time.days_ago')}`
}

export default function PostCard({
  userName,
  userAvatar,
  contentText,
  createdAt,
  media,
  onReport,
}: PostCardProps) {
  const { t } = useTranslation()
  const isRtl = useGetRtl()
  const [currentSlide, setCurrentSlide] = useState(0)

  const images = media?.filter((m) => m.mediaUrl) ?? []

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  return (
    <div className="rounded-[24px] bg-white p-6 shadow-sm border border-tertiary-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={userAvatar ? `${baseURL}${userAvatar}` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={userName}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-bold text-tertiary-8">{userName}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {timeAgo(createdAt, t)}
            </p>
          </div>
        </div>
        <button
          onClick={onReport}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
          {t('label.report')}
        </button>
      </div>

      {/* Content */}
      {contentText && (
        <p className="mb-4 text-sm leading-relaxed text-tertiary-8">{contentText}</p>
      )}

      {/* Image Carousel */}
      {images.length > 0 && (
        <div className="relative overflow-hidden rounded-[16px]">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(${isRtl ? currentSlide * 100 : -currentSlide * 100}%)` }}
          >
            {images.map((img) => (
              <div
                key={img.mediaId}
                className="w-full shrink-0 aspect-[16/10]"
              >
                <img
                  src={`${baseURL}${img.mediaUrl}`}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={isRtl ? nextSlide : prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 text-tertiary-8" />
              </button>
              <button
                onClick={isRtl ? prevSlide : nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5 text-tertiary-8" />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors cursor-pointer ${
                    i === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
