import { useState, useCallback } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2, X, Check } from 'lucide-react'
import { baseURL } from '@/api/axiosInstance'
import { useTranslation } from 'react-i18next'
import { useGetRtl } from '@/lib/utils'
import type { CommunityPostMediaResponseDto } from '@/api/community/useCommunityPosts.types'

interface PostCardProps {
  postId: number
  userName: string
  userAvatar: string | null
  contentText: string | null
  createdAt: string
  media: CommunityPostMediaResponseDto[] | null
  /** The userId of the post author */
  postUserId: number
  /** The currently logged-in userId (null if guest) */
  currentUserId: number | null
  onReport: () => void
  onEdit?: (postId: number, newContent: string) => void
  onDelete?: (postId: number) => void
  /** True while an update mutation is in-flight */
  isUpdating?: boolean
  /** True while a delete mutation is in-flight */
  isDeleting?: boolean
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
  postId,
  userName,
  userAvatar,
  contentText,
  createdAt,
  media,
  postUserId,
  currentUserId,
  onReport,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: PostCardProps) {
  const { t } = useTranslation()
  const isRtl = useGetRtl()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(contentText ?? '')
  const isOwner = currentUserId != null && currentUserId === postUserId

  const images = media?.filter((m) => m.mediaUrl) ?? []

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleSaveEdit = () => {
    if (editText.trim() && onEdit) {
      onEdit(postId, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditText(contentText ?? '')
    setIsEditing(false)
  }

  return (
    <div className={`relative rounded-[24px] bg-white p-6 shadow-sm border border-tertiary-1 transition-opacity ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={userAvatar ? `${baseURL}${userAvatar}` : '/profile.png'}
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

        {/* Actions area */}
        <div className="flex items-center gap-2">
          {/* Report button for non-owners */}
          {!isOwner && (
            <button
              onClick={onReport}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {t('label.report')}
            </button>
          )}

          {/* Owner menu (3-dot) */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-tertiary-1 hover:text-tertiary-8 transition-colors cursor-pointer"
                aria-label="Post actions"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>

              {/* Dropdown */}
              {showMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-tertiary-1 bg-white py-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        setIsEditing(true)
                        setEditText(contentText ?? '')
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-tertiary-7 hover:bg-tertiary-0 transition-colors cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                      {t('post.edit', 'Edit Post')}
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false)
                        onDelete?.(postId)
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t('post.delete', 'Delete Post')}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content — edit mode */}
      {isEditing ? (
        <div className="mb-4">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full min-h-[100px] rounded-xl border border-tertiary-2 bg-tertiary-0 px-4 py-3 text-sm text-tertiary-8 focus:outline-none focus:ring-2 focus:ring-primary-5 resize-none transition-colors"
            autoFocus
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-1.5 rounded-full border border-tertiary-2 px-4 py-2 text-xs font-semibold text-tertiary-6 hover:bg-tertiary-1 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              {t('label.cancel')}
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={!editText.trim() || isUpdating}
              className="flex items-center gap-1.5 rounded-full bg-primary-7 px-4 py-2 text-xs font-semibold text-white hover:bg-primary-8 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              {isUpdating ? t('post.saving', 'Saving...') : t('post.save', 'Save')}
            </button>
          </div>
        </div>
      ) : (
        /* Content — read mode */
        contentText && (
          <p className="mb-4 text-sm leading-relaxed text-tertiary-8">{contentText}</p>
        )
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
