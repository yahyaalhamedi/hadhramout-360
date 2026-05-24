import { useParams } from 'react-router-dom'
import { MapPin, Layers, Clock, Sun, BookOpen, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LANDMARKS_DATA } from './data'
import { useState } from 'react'
import {
  DetailHero,
  DetailInfoRow,
  DetailPullQuote,
  DetailGallery,
  DetailNotFound,
} from '@/components/atoms/DetailComponents'

const LandmarkDetail = () => {
  const { slug } = useParams<{ slug: string }>()

  const landmark = LANDMARKS_DATA.find((l) => l.slug === slug)
  const [isFavorite, setIsFavorite] = useState(landmark?.isFavorite ?? false)

  if (!landmark) {
    return (
      <DetailNotFound
        icon={MapPin}
        message="Landmark not found"
        ctaLabel="Back to Landmarks"
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <DetailHero
        imageUrl={landmark.imageUrl}
        imageAlt={landmark.title}
        topRight={
          <button
            onClick={() => setIsFavorite((f) => !f)}
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
      </DetailHero>

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

            <DetailPullQuote text={landmark.quote} />
          </article>

          {/* Right — sidebar */}
          <aside className="space-y-5">
            {/* Quick Overview card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-foreground">Quick Overview</h3>

              <DetailInfoRow
                icon={MapPin}
                label="Location"
                value={landmark.overview.location}
              />
              <DetailInfoRow
                icon={Layers}
                label="Style"
                value={landmark.overview.style}
              />
              <DetailInfoRow
                icon={Clock}
                label="Status"
                value={landmark.overview.status}
              />
              <DetailInfoRow
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
        <DetailGallery
          eyebrow="Visual Journey"
          heading={`The Lens of ${landmark.location.split(',')[0]}`}
          images={landmark.gallery}
        />
      </div>
    </div>
  )
}

export default LandmarkDetail
