import { useParams } from 'react-router-dom'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
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

  // media[0] is the thumbnail/hero image, the rest are gallery media
  const galleryImages = (event.media ?? []).slice(1).map((m) => ({
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
        contentClassName="inset-x-0 pb-12"
      >
        <div className="flex w-full flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Left side: Title and Meta */}
          <div className="flex flex-col items-start gap-4">
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-lg text-left">
              {title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90 drop-shadow-md">
              <span className="flex items-center gap-1.5 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
                <Calendar className="h-4 w-4" />
                {dateRange}
              </span>
              {address && (
                <span className="flex items-center gap-1.5 bg-black/30 px-4 py-2 rounded-full backdrop-blur-md">
                  <MapPin className="h-4 w-4" />
                  {address}
                </span>
              )}
            </div>
          </div>

          {/* Registration Button */}
          {event.formUrl && (
            <div className="shrink-0 mb-1">
              <a
                href={event.formUrl.startsWith('http') ? event.formUrl : `https://${event.formUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#0a5c66] via-[#0d7a88] to-[#0a5c66] bg-[length:200%_auto] px-8 py-4 text-[15px] font-bold text-white shadow-[0_0_20px_rgba(10,92,102,0.4)] transition-all duration-500 hover:scale-105 hover:bg-[position:right_center] hover:shadow-[0_0_30px_rgba(10,92,102,0.6)] focus:outline-none focus:ring-2 focus:ring-[#0a5c66]/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {t('label.register_now')}
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </div>
          )}
        </div>
      </DetailHero>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left — article */}
          <article className="lg:col-span-2 space-y-6 min-w-0">
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
              <div
                className="prose prose-slate max-w-none w-full leading-relaxed text-muted-foreground prose-headings:text-foreground prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: description }}
              />
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

              {address && (
                <DetailInfoRow
                  icon={MapPin}
                  label={t('event.sidebar.location')}
                  value={address}
                />
              )}
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
