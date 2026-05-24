import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MapPin, Layers, Clock, Sun, BookOpen, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, useGetRtl } from '@/lib/utils'
import { LANDMARKS_DATA } from './data'
import { useState } from 'react'

// ── Small reusable pieces ────────────────────────────────────────

const OverviewRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
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

// ── Main component ───────────────────────────────────────────────

const LandmarkDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const isRtl = useGetRtl()
  const BackIcon = isRtl ? ArrowRight : ArrowLeft

  // Label injected by the caller via navigate(..., { state })
  const backLabel = (location.state as { label?: string } | null)?.label ?? 'Back'

  const landmark = LANDMARKS_DATA.find((l) => l.slug === slug)
  const [isFavorite, setIsFavorite] = useState(landmark?.isFavorite ?? false)

  if (!landmark) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <MapPin className="h-14 w-14 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground">Landmark not found</h2>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Back to Landmarks
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={landmark.imageUrl}
          alt={landmark.title}
          className="h-full w-full object-cover"
        />
        {/* Multi-layer gradient: dark bottom for text, slight dark top for nav */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/85" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 top-6 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/25"
        >
          <BackIcon className="h-4 w-4" />
          {backLabel}
        </button>

        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite((f) => !f)}
          className={cn(
            'absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all',
            isFavorite
              ? 'bg-secondary text-secondary-9'
              : 'bg-white/15 text-white hover:bg-white/25',
          )}
        >
          <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
        </button>

        {/* Hero text — bottom left */}
        <div className="absolute bottom-0 left-0 px-6 pb-8 md:px-12">
          {/* Breadcrumb chips */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary-8/90 px-3 py-1 text-xs font-semibold text-secondary-1 backdrop-blur-sm">
              {landmark.tag}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <MapPin className="h-3 w-3" />
              {landmark.location}
            </span>
          </div>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {landmark.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/75 md:text-base">{landmark.subtitle}</p>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left — main article content */}
          <article className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Architectural Heritage</h2>

            {landmark.description.map((para, i) => (
              <p
                key={i}
                className="leading-relaxed text-muted-foreground"
              >
                {para}
              </p>
            ))}

            {/* Pull quote */}
            <blockquote className="rounded-2xl border-l-4 border-secondary-6 bg-secondary-1/60 px-6 py-5">
              <p className="text-sm italic leading-relaxed text-secondary-9">{landmark.quote}</p>
            </blockquote>
          </article>

          {/* Right — sidebar */}
          <aside className="space-y-5">
            {/* Quick Overview card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-foreground">Quick Overview</h3>

              <OverviewRow
                icon={MapPin}
                label="Location"
                value={landmark.overview.location}
              />
              <OverviewRow
                icon={Layers}
                label="Style"
                value={landmark.overview.style}
              />
              <OverviewRow
                icon={Clock}
                label="Status"
                value={landmark.overview.status}
              />
              <OverviewRow
                icon={Sun}
                label="Best Time to Visit"
                value={landmark.overview.bestTime}
              />

              <Button className="w-full rounded-full bg-primary-7 text-white hover:bg-primary-8 gap-2">
                <BookOpen className="h-4 w-4" />
                Book a Local Guide
              </Button>
            </div>

            {/* Did You Know card */}
            <div className="rounded-2xl border border-secondary-3 bg-secondary-1/50 p-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary-8">
                Did You Know?
              </p>
              <p className="text-sm leading-relaxed text-secondary-10">{landmark.didYouKnow}</p>
            </div>
          </aside>
        </div>

        {/* ── Photo Gallery ──────────────────────────────────────── */}
        <section className="mt-16">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-secondary-7">
            Visual Journey
          </p>
          <h2 className="mb-6 text-2xl font-bold text-foreground">
            The Lens of {landmark.location.split(',')[0]}
          </h2>

          {/* Masonry-style 2-col grid: first image tall, rest 2×2 */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {/* Large left image */}
            <div className="row-span-2 overflow-hidden rounded-2xl">
              <img
                src={landmark.gallery[0].url}
                alt={landmark.gallery[0].alt}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            {/* Three smaller images on the right */}
            {landmark.gallery.slice(1).map((img, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl aspect-[4/3]"
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
      </div>
    </div>
  )
}

export default LandmarkDetail
