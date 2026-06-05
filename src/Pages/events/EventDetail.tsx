import { useParams } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGetRtl } from '@/lib/utils'
import { useEvent } from '@/api/events/useEvents'
import { baseURL } from '@/api/axiosInstance'
import {
  DetailHero,
  DetailInfoRow,
  DetailGallery,
  DetailNotFound,
} from '@/components/atoms/DetailComponents'
import MapCard from '@/components/atoms/MapCard'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80'

const EventDetail = () => {
  const { id: idParam } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const isRtl = useGetRtl()

  const id = idParam ? Number(idParam) : undefined

  const { data: event, isLoading, isError } = useEvent(id)

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

  if (isError || !event) {
    return (
      <DetailNotFound
        icon={Calendar}
        message={t('event.not_found')}
        ctaLabel={t('event.back')}
      />
    )
  }

  const title = isRtl ? event.titleAr : event.titleEn
  const description = isRtl ? event.descriptionAr : event.descriptionEn
  const address = isRtl ? event.addressAr : event.addressEn
  const orgName = isRtl ? event.organization.orgNameAr : event.organization.orgNameEn

  const coverUrl = event.media?.[0]?.mediaUrl
    ? `${baseURL}${event.media[0].mediaUrl}`
    : FALLBACK_IMAGE

  const galleryImages = (event.media ?? []).map((m) => ({
    url: m.mediaUrl ? `${baseURL}${m.mediaUrl}` : FALLBACK_IMAGE,
    alt: title ?? '',
  }))

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const dateRange = `${formatDate(event.startDate)} – ${formatDate(event.endDate)}`

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <DetailHero
        imageUrl={coverUrl}
        imageAlt={title || ''}
      >
        {/* Title */}
        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
          {title}
        </h1>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {dateRange}
          </span>
          {address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {address}
            </span>
          )}
        </div>
      </DetailHero>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left — article */}
          <article className="lg:col-span-2 space-y-6">
            {/* Author */}
            {orgName && (
              <div className="flex items-center gap-3">
                {event.organization.logoUrl && (
                  <img
                    src={`${baseURL}${event.organization.logoUrl}`}
                    alt={orgName}
                    className="h-10 w-10 rounded-full border border-border object-cover"
                  />
                )}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {t('label.hosted_by')}
                  </p>
                  <p className="text-sm font-medium text-foreground">{orgName}</p>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-foreground">
              {title}
            </h2>

            {description ? (
              <p className="leading-relaxed text-muted-foreground">{description}</p>
            ) : (
              <p className="leading-relaxed text-muted-foreground/50 italic">
                {t('event.no_description', 'No description available.')}
              </p>
            )}
          </article>

          {/* Right — sidebar */}
          <aside className="space-y-5">
            {/* Event Details card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-foreground">
                {t('event.sidebar.details')}
              </h3>

              <DetailInfoRow
                icon={Calendar}
                label={t('event.sidebar.dates')}
                value={dateRange}
              />
            </div>

            {/* Map card */}
            {event.mapUrl && (
              <MapCard
                mapUrl={event.mapUrl}
                venue={title || ''}
                venueDetail={address || undefined}
              />
            )}
          </aside>
        </div>

        {/* ── Photo Gallery ──────────────────────────────────────── */}
        {galleryImages.length > 0 && (
          <DetailGallery
            eyebrow={t('event.gallery.eyebrow')}
            heading={`${t('event.gallery.heading')} ${address?.split(',')[0] ?? ''}`}
            images={galleryImages}
          />
        )}
      </div>
    </div>
  )
}

export default EventDetail
