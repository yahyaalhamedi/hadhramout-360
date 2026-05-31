import { useParams } from 'react-router-dom'
import { MapPin, Sun, Heart } from 'lucide-react'
import { cn, useGetRtl } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLandmark } from '@/api/landmarks/useLandmarks'
import { useToggleFavorite } from '@/api/favorites/useFavorites'
import { baseURL } from '@/api/axiosInstance'
import {
  DetailHero,
  DetailInfoRow,
  DetailGallery,
  DetailNotFound,
} from '@/components/atoms/DetailComponents'
import MapCard from '@/components/atoms/MapCard'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

const LandmarkDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const isRtl = useGetRtl()

  // The route param is the landmark's numeric id
  const id = slug ? Number(slug) : undefined

  const { data: landmark, isLoading, isError } = useLandmark(id)
  const { mutate: toggleFavorite } = useToggleFavorite()

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (landmark) {
      setIsFavorite(landmark.isFavorite)
    }
  }, [landmark])

  // ── Loading skeleton ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="h-[55vh] min-h-[400px] w-full bg-muted" />
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 space-y-4">
          <div className="h-8 w-1/2 rounded-xl bg-muted" />
          <div className="h-4 w-full rounded-xl bg-muted" />
          <div className="h-4 w-3/4 rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  // ── Error / not found ──────────────────────────────────────────
  if (isError || !landmark) {
    return (
      <DetailNotFound
        icon={MapPin}
        message={t('landmark.not_found')}
        ctaLabel={t('landmark.back')}
      />
    )
  }

  // ── Derived display values ─────────────────────────────────────
  const title = isRtl ? landmark.titleAr : landmark.titleEn
  const description = isRtl ? landmark.descriptionAr : landmark.descriptionEn
  const location = isRtl ? landmark.locationTextAr : landmark.locationTextEn
  const categories = landmark.categories ?? []

  // Cover image: first media item, or fallback
  const coverUrl = landmark.media?.[0]?.mediaUrl
    ? `${baseURL}${landmark.media[0].mediaUrl}`
    : FALLBACK_IMAGE

  // Gallery: all media items mapped to DetailGallery's shape
  const galleryImages = (landmark.media ?? []).map((m) => ({
    url: m.mediaUrl ? `${baseURL}${m.mediaUrl}` : FALLBACK_IMAGE,
    alt: title ?? '',
  }))

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <DetailHero
        imageUrl={coverUrl}
        imageAlt={title ?? ''}
        topRight={
          <button
            onClick={() => {
              if (id) {
                setIsFavorite((f) => !f)
                toggleFavorite(id)
              }
            }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all',
              isFavorite
                ? 'bg-secondary text-secondary-9'
                : 'bg-white/15 text-white hover:bg-white/25',
            )}
          >
            <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
          </button>
        }
      >
        {/* Category chips */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <span
              key={cat.categoryId}
              className="rounded-full bg-secondary-8/90 px-3 py-1 text-xs font-semibold text-secondary-1 backdrop-blur-sm"
            >
              {isRtl ? cat.categoryNameAr : cat.categoryNameEn}
            </span>
          ))}
          {location && (
            <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
        </div>

        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
          {title}
        </h1>
      </DetailHero>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left — description */}
          <article className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">{t('landmark.section.heritage')}</h2>
            {description ? (
              <p className="leading-relaxed text-muted-foreground">{description}</p>
            ) : (
              <p className="leading-relaxed text-muted-foreground/50 italic">
                {t('landmark.no_description', 'No description available.')}
              </p>
            )}
          </article>

          {/* Right — sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-foreground">
                {t('landmark.sidebar.overview')}
              </h3>

              {location && (
                <DetailInfoRow
                  icon={MapPin}
                  label={t('landmark.sidebar.location')}
                  value={location}
                />
              )}
              <DetailInfoRow
                icon={Sun}
                label={t('landmark.sidebar.best_time')}
                value={t('landmark.best_time')}
              />
            </div>

            {landmark.mapUrl && (
              <MapCard
                mapUrl={landmark.mapUrl}
                venue={title || ''}
                venueDetail={location || undefined}
              />
            )}
          </aside>
        </div>

        {/* ── Gallery ────────────────────────────────────────────── */}
        {galleryImages.length > 0 && (
          <DetailGallery
            eyebrow={t('landmark.gallery.eyebrow')}
            heading={`${t('landmark.gallery.heading')} ${location ?? ''}`}
            images={galleryImages}
          />
        )}
      </div>
    </div>
  )
}

export default LandmarkDetail
