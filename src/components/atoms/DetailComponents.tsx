/**
 * Shared presentational primitives used by both LandmarkDetail and EventDetail.
 */
import React from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGetRtl } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

// ── BackButton ───────────────────────────────────────────────────
/**
 * Floating pill that always goes back in browser history.
 * The label is injected by the caller via navigate(..., { state: { label } }).
 */
export const BackButton = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isRtl = useGetRtl()
  const { t } = useTranslation()
  const Icon = isRtl ? ArrowRight : ArrowLeft
  const label = (location.state as { label?: string } | null)?.label ?? t('label.back')

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute start-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/25"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

// ── DetailHero ───────────────────────────────────────────────────
/**
 * Full-width hero with image, gradient, back button, and a slot for
 * any bottom-left overlay content (chips, title, meta, CTA, etc.).
 */
interface DetailHeroProps {
  imageUrl: string
  imageAlt: string
  children: React.ReactNode
  /** Extra elements rendered top-right (e.g. favourite button) */
  topRight?: React.ReactNode
}

export const DetailHero = ({ imageUrl, imageAlt, children, topRight }: DetailHeroProps) => (
  <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
    <img
      src={imageUrl}
      alt={imageAlt}
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/85" />

    <BackButton />
    {topRight && <div className="absolute end-6 top-6 z-10">{topRight}</div>}

    {/* Bottom-start content */}
    <div className="absolute bottom-0 start-0 px-6 pb-8 md:px-12">{children}</div>
  </div>
)

// ── DetailInfoRow ────────────────────────────────────────────────
/**
 * One labelled row inside a sidebar card (icon + label + value).
 */
interface DetailInfoRowProps {
  icon: React.ElementType
  label: string
  value: string
}

export const DetailInfoRow = ({ icon: Icon, label, value }: DetailInfoRowProps) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-2 text-secondary-8">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
)

// ── DetailPullQuote ──────────────────────────────────────────────
/** Gold-accented pull-quote block. */
export const DetailPullQuote = ({ text }: { text: string }) => (
  <blockquote className="rounded-2xl border-l-4 border-secondary-6 bg-secondary-1/60 px-6 py-5">
    <p className="text-sm italic leading-relaxed text-secondary-9">{text}</p>
  </blockquote>
)

// ── DetailGallery ────────────────────────────────────────────────
/** Masonry-ish 2-col grid: one tall left image + up to 3 on the right. */
interface GalleryImage {
  url: string
  alt: string
}

interface DetailGalleryProps {
  eyebrow: string
  heading: string
  images: GalleryImage[]
}

export const DetailGallery = ({ eyebrow, heading, images }: DetailGalleryProps) => (
  <section className="mt-16">
    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-secondary-7">
      {eyebrow}
    </p>
    <h2 className="mb-6 text-2xl font-bold text-foreground">{heading}</h2>

    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {/* Large left image — spans 2 rows */}
      {images[0] && (
        <div className="row-span-2 overflow-hidden rounded-2xl">
          <img
            src={images[0].url}
            alt={images[0].alt}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}
      {/* Remaining images */}
      {images.slice(1).map((img, i) => (
        <div
          key={i}
          className="aspect-[4/3] overflow-hidden rounded-2xl"
        >
          <img
            src={img.url}
            alt={img.alt}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      ))}
    </div>
  </section>
)

// ── NotFound ─────────────────────────────────────────────────────
/** Generic "not found" empty state for detail pages. */
export const DetailNotFound = ({
  icon: Icon,
  message,
  ctaLabel,
}: {
  icon: React.ElementType
  message: string
  ctaLabel: string
}) => {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <Icon className="h-14 w-14 text-muted-foreground/30" />
      <h2 className="text-xl font-semibold text-foreground">{message}</h2>
      <button
        onClick={() => navigate(-1)}
        className="rounded-full border border-border px-6 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        {ctaLabel}
      </button>
    </div>
  )
}
