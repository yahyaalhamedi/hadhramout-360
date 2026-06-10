import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin,
  Phone,
  MessageSquare,
  Share2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useGetRtl, parseIdFromSlug, getArtisanSlug } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { useArtisan, useArtisans } from '@/api/artisans/useArtisans'
import { baseURL } from '@/api/axiosInstance'
import { toast } from 'sonner'
import { DetailGallery, DetailNotFound } from '@/components/atoms/DetailComponents'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80'

const ArtisanDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isRtl = useGetRtl()

  const id = parseIdFromSlug(slug)
  const { data: artisan, isLoading, isError } = useArtisan(id)

  const { data: otherArtisansData } = useArtisans({ pageSize: 4 })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="h-[65vh] min-h-[500px] w-full bg-muted" />
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 space-y-4">
          <div className="h-8 w-1/2 rounded-xl bg-muted" />
          <div className="h-4 w-full rounded-xl bg-muted" />
          <div className="h-4 w-3/4 rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  if (isError || !artisan) {
    return (
      <DetailNotFound
        icon={MapPin}
        message={t('artisan.not_found')}
        ctaLabel={t('artisan.back')}
      />
    )
  }

  const name = isRtl ? artisan.nameAr : artisan.nameEn
  const description = isRtl ? artisan.descriptionAr : artisan.descriptionEn
  const location = isRtl ? artisan.locationTextAr : artisan.locationTextEn

  const handleShare = async () => {
    const shareUrl = window.location.href
    const shareTitle = name || t('artisans')
    const shareText = description || ''

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success(t('share.success', 'Link copied to clipboard!'))
      } catch (err) {
        console.error('Failed to copy link:', err)
      }
    }
  }

  const coverUrl = artisan.media?.find((m) => m.isCover)?.mediaUrl
    ? `${baseURL}${artisan.media.find((m) => m.isCover)!.mediaUrl}`
    : artisan.coverImageUrl
      ? `${baseURL}${artisan.coverImageUrl}`
      : FALLBACK_IMAGE

  const galleryImages = (() => {
    const mediaImages = (artisan.media ?? [])
      .filter((m) => !m.isCover)
      .map((m) => ({
        url: m.mediaUrl ? `${baseURL}${m.mediaUrl}` : FALLBACK_IMAGE,
        alt: name ?? '',
      }))

    if (mediaImages.length >= 4) return mediaImages

    const fallback = { url: coverUrl, alt: name ?? '' }
    const filled = [...mediaImages]
    while (filled.length < 5) {
      filled.push(fallback)
    }
    return filled
  })()

  const otherArtisans = (() => {
    const real = otherArtisansData?.pages
      .flatMap((p) => p.items)
      .filter((a) => a.artisanId !== id) ?? []

    if (real.length >= 4) return real.slice(0, 4)

    const placeholders = Array.from({ length: 4 - real.length }, (_, i) => ({
      artisanId: -(i + 1),
      nameAr: name,
      nameEn: name,
      coverImageUrl: null,
    }))

    return [...real, ...placeholders]
  })()

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative h-[65vh] min-h-[500px] w-full overflow-hidden">
        <img
          src={coverUrl}
          alt={name ?? ''}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute start-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/25"
        >
          {isRtl ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
          {t('label.back')}
        </button>

        {/* Bottom-right actions */}
        <div className="absolute bottom-8 end-6 z-10 flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:bg-white/25"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom-left content */}
        <div className="absolute bottom-0 start-0 px-6 pb-10 md:px-12">
          {/* Tags */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {location && (
              <span className="flex items-center gap-1 rounded-full bg-secondary-8/90 px-3 py-1 text-xs font-semibold text-secondary-1 backdrop-blur-sm">
                {location}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {name}
          </h1>

          {/* Short description */}
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              {description.length > 150
                ? `${description.slice(0, 150)}...`
                : description}
            </p>
          )}
        </div>
      </div>

      {/* ── The Artisan's Journey ────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left — text */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-[2px] w-8 bg-secondary-7" />
              <span className="text-xs font-bold uppercase tracking-widest text-secondary-7">
                {t('artisan.journey.label')}
              </span>
            </div>

            <h2 className="mb-6 text-3xl font-bold leading-snug text-foreground md:text-4xl">
              {t('artisan.journey.title')}
            </h2>

            {description ? (
              <div className="space-y-4">
                {description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="leading-relaxed text-muted-foreground">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="leading-relaxed text-muted-foreground/50 italic">
                {t('artisan.no_description')}
              </p>
            )}
          </div>

          {/* Right — image with badge */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <img
                src={coverUrl}
                alt={name ?? ''}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Years of craft badge */}
            <div className="absolute -bottom-5 start-6 rounded-2xl bg-gradient-to-br from-[#096866] to-[#075553] px-6 py-4 text-center shadow-lg">
              <span className="block text-3xl font-bold text-white">54</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                {t('artisan.journey.years')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Commission a Piece ───────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <div className="rounded-3xl border border-border bg-gray-50 p-8 md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-md">
              <h3 className="mb-2 text-2xl font-bold text-foreground">
                {t('artisan.commission.title')}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t('artisan.commission.description')}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {artisan.phone && (
                <a
                  href={`tel:${artisan.phone}`}
                  className="flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Phone className="h-4 w-4" />
                  {t('artisan.commission.call')}
                </a>
              )}
              <button className="flex items-center gap-2 rounded-full bg-[#096866] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#075553]">
                <MessageSquare className="h-4 w-4" />
                {t('artisan.commission.message')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Portfolio / The Master's Gallery ─────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary-7">
            {t('artisan.gallery.eyebrow')}
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            {t('artisan.gallery.heading')}
          </h2>
        </div>
        <DetailGallery
          eyebrow=""
          heading=""
          images={galleryImages}
        />
      </div>

      {/* ── Masters of Other Crafts ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 md:px-8">
        <div className="mb-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary-7">
            {t('artisan.community.label')}
          </p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-foreground">
              {t('artisan.community.title')}
            </h2>
          </div>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
            direction: isRtl ? 'rtl' : 'ltr',
          }}
          className="w-full"
        >
          <CarouselContent className="pe-6">
            {otherArtisans.map((a) => {
              const otherName = isRtl ? a.nameAr : a.nameEn
              const isPlaceholder = a.artisanId < 0
              const otherImage = isPlaceholder || !a.coverImageUrl
                ? coverUrl
                : `${baseURL}${a.coverImageUrl}`

              return (
                <CarouselItem
                  key={a.artisanId}
                  className="basis-full sm:basis-1/2 md:basis-1/3"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      if (!isPlaceholder) {
                        navigate(`/artisans/${getArtisanSlug(a.artisanId, a.nameAr, a.nameEn)}`, {
                          state: { from: '/artisans', label: t('artisans') },
                        })
                        window.scrollTo(0, 0)
                      }
                    }}
                  >
                    <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl">
                      <img
                        src={otherImage}
                        alt={otherName ?? ''}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t('artisan.community.card_label')}
                    </p>
                    <h4 className="mb-1 text-base font-bold text-foreground">
                      {otherName}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {t('artisan.community.card_description')}
                    </p>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious className="top-[40%]" />
          <CarouselNext className="top-[40%]" />
        </Carousel>
      </section>
    </div>
  )
}

export default ArtisanDetail
