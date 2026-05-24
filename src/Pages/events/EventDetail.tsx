import { useParams } from 'react-router-dom'
import { Calendar, MapPin, Ticket, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import {
  DetailHero,
  DetailInfoRow,
  DetailGallery,
  DetailNotFound,
} from '@/components/atoms/DetailComponents'
import { EVENTS_DATA } from './data'

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>()

  const event = EVENTS_DATA.find((e) => e.slug === slug)

  if (!event) {
    return (
      <DetailNotFound
        icon={Calendar}
        message="Event not found"
        ctaLabel="Back to Events"
      />
    )
  }

  const mapsUrl = `https://www.google.com/maps?q=${event.mapLat},${event.mapLng}`
  const osmMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${event.mapLng - 0.05},${event.mapLat - 0.05},${event.mapLng + 0.05},${event.mapLat + 0.05}&layer=mapnik&marker=${event.mapLat},${event.mapLng}`

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <DetailHero
        imageUrl={event.imageUrl}
        imageAlt={event.title}
      >
        {/* Tag chip */}
        <span className="mb-3 inline-block rounded-full bg-secondary-8/90 px-3 py-1 text-xs font-semibold text-secondary-1 backdrop-blur-sm">
          {event.tag}
        </span>

        {/* Title */}
        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
          {event.title}
        </h1>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/80">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {event.dateRange}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {event.venue}, {event.location}
          </span>
        </div>

        {/* CTA */}
        <Button
          onClick={() => window.open(mapsUrl, '_blank')}
          className="mt-5 rounded-full bg-primary-7 px-7 text-white hover:bg-primary-8"
        >
          Register Now
        </Button>
      </DetailHero>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left — article */}
          <article className="lg:col-span-2 space-y-6">
            {/* Author */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={event.authorImage} />
              </Avatar>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Hosted by
                </p>
                <p className="text-sm font-medium text-foreground">{event.authorName}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground">
              {event.title.split(' ').slice(0, 4).join(' ')}
            </h2>

            {event.description.map((para, i) => (
              <p
                key={i}
                className="leading-relaxed text-muted-foreground"
              >
                {para}
              </p>
            ))}
          </article>

          {/* Right — sidebar */}
          <aside className="space-y-5">
            {/* Event Details card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-foreground">Event Details</h3>

              <DetailInfoRow
                icon={Calendar}
                label="Dates"
                value={event.dateRange}
              />
              <DetailInfoRow
                icon={Ticket}
                label="Admission"
                value={event.admission}
              />
            </div>

            {/* Map card */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {/* Embedded OSM map */}
              <iframe
                title="Event location map"
                src={osmMapUrl}
                className="h-48 w-full border-0"
                loading="lazy"
              />
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-foreground">{event.venue}</p>
                <p className="text-xs text-muted-foreground">{event.venueDetail}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Maps
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Photo Gallery ──────────────────────────────────────── */}
        <DetailGallery
          eyebrow="Visual Highlights"
          heading={`Moments from ${event.location.split(',')[0]}`}
          images={event.gallery}
        />
      </div>
    </div>
  )
}

export default EventDetail
