import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { EventCard } from '@/components/atoms/EventCard'
import { EVENTS_DATA } from './data'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80'

const Events = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEvents = EVENTS_DATA.filter(
    (e) =>
      searchTerm === '' ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      {/* Outer: no overflow-hidden so the search pill can spill out */}
      <div className="relative mx-4 mt-4 h-[340px] md:h-[380px]">
        {/* Inner: clips the image to rounded corners */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            src={HERO_IMAGE}
            alt="Hadhramout Events"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </div>

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <h1
            className="text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Thmanyah', serif", direction: 'rtl' }}
          >
            فعاليات حيّة
          </h1>
          <p
            className="text-3xl font-semibold md:text-4xl lg:text-5xl"
            style={{ color: '#cea46c', fontFamily: 'Georgia, serif' }}
          >
            Vibrant Events
          </p>
        </div>

        {/* Search bar — overflows below the hero cover */}
        <div className="absolute bottom-0 left-1/2 w-full max-w-xl -translate-x-1/2 translate-y-1/2 px-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 rounded-full bg-white pl-5 pr-12 text-sm shadow-lg border-0 focus-visible:ring-2 focus-visible:ring-secondary-7"
            />
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* ── Event Grid ───────────────────────────────────────────── */}
      <div className="mt-16 px-4 pb-12">
        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                imageUrl={event.imageUrl}
                author={event.authorName}
                authorImage={event.authorImage}
                title={event.title}
                location={event.location}
                date={event.date}
                onClick={() =>
                  navigate(`/events/${event.slug}`, {
                    state: { from: '/events', label: 'Events' },
                  })
                }
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
            <Search className="h-12 w-12 opacity-30" />
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
