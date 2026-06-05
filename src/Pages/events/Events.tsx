import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetRtl } from '@/lib/utils'
import { EventCard } from '@/components/atoms/EventCard'
import { useEvents } from '@/api/events/useEvents'
import { baseURL } from '@/api/axiosInstance'
import InfiniteScroll from 'react-infinite-scroller'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80'

const Events = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isRtl = useGetRtl()
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useEvents({
    pageSize: 9,
    search: debouncedSearch || undefined,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const items = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative mx-4 mt-4 h-[340px] md:h-[380px]">
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
            {t('hero.events.ar')}
          </h1>
          <p
            className="text-3xl font-semibold md:text-4xl lg:text-5xl"
            style={{ color: '#cea46c', fontFamily: 'Georgia, serif' }}
          >
            {t('hero.events.en')}
          </p>
        </div>

        {/* Search bar */}
        <div className="absolute bottom-0 left-1/2 w-full max-w-xl -translate-x-1/2 translate-y-1/2 px-4">
          <div className="relative">
            <Input
              type="text"
              placeholder={t('search.placeholder')}
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
        {isError && <p className="mt-8 text-destructive">{t('label.no_results')}</p>}

        <InfiniteScroll
          pageStart={0}
          loadMore={() => {
            if (!isFetching) void fetchNextPage()
          }}
          hasMore={!!hasNextPage}
          loader={
            <div key="loader" className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[520px] animate-pulse rounded-[40px] bg-muted"
                />
              ))}
            </div>
          }
        >
          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((event) => {
                const title = isRtl ? event.titleAr : event.titleEn
                const address = isRtl ? event.addressAr : event.addressEn
                const orgName = isRtl ? event.organizationNameAr : event.organizationNameEn
                const coverUrl = event.coverImageUrl
                  ? `${baseURL}${event.coverImageUrl}`
                  : FALLBACK_IMAGE
                const startDate = new Date(event.startDate).toLocaleDateString(
                  isRtl ? 'ar-YE' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' },
                )

                return (
                  <EventCard
                    key={event.eventId}
                    imageUrl={coverUrl}
                    author={orgName || ''}
                    authorImage={event.organizationLogoUrl ? `${baseURL}${event.organizationLogoUrl}` : ''}
                    title={title || ''}
                    location={address || ''}
                    date={startDate}
                    onClick={() =>
                      navigate(`/events/${event.eventId}`, {
                        state: { from: '/events', label: t('events') },
                      })
                    }
                  />
                )
              })}
            </div>
          ) : (
            !isFetching && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
                <Search className="h-12 w-12 opacity-30" />
                <p className="text-lg font-medium">{t('event.no_results')}</p>
                <p className="text-sm">{t('label.adjust_search_simple')}</p>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default Events
