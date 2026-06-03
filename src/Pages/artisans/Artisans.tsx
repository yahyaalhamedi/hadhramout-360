import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroller'
import { Input } from '@/components/ui/input'
import ArtisanCard from '@/components/atoms/ArtisanCard'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetRtl } from '@/lib/utils'
import { useArtisans } from '@/api/artisans/useArtisans'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80'

const Artisans = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useArtisans({
    pageSize: 12,
    search: debouncedSearch || undefined,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSearchChange = (value: string) => setSearchTerm(value)

  const items = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative mx-4 mt-4 h-[420px] md:h-[480px]">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            src={HERO_IMAGE}
            alt="Hadhramout Artisans"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <h1
            className="text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Thmanyah', serif", direction: 'rtl' }}
          >
            {t('hero.artisans.ar')}
          </h1>
          <p
            className="text-3xl font-semibold md:text-4xl lg:text-5xl"
            style={{ color: '#cea46c', fontFamily: 'Georgia, serif' }}
          >
            {t('hero.artisans.en')}
          </p>
        </div>

        {/* Search bar */}
        <div className="absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 translate-y-1/2 px-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-12 rounded-full border-0 bg-white pl-5 pr-12 text-sm shadow-lg focus-visible:ring-2 focus-visible:ring-secondary-7"
            />
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Error */}
      {isError && <p className="mt-8 px-4 text-destructive">{t('label.no_results')}</p>}

      {/* Card Grid with Infinite Scroll */}
      <div className="mt-16 px-4 pb-12">
        <InfiniteScroll
          pageStart={0}
          loadMore={() => {
            if (!isFetching) void fetchNextPage()
          }}
          hasMore={!!hasNextPage}
          loader={
            <div
              key="loader"
              className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[380px] animate-pulse rounded-[24px] bg-muted"
                />
              ))}
            </div>
          }
        >
          {items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {items.map((artisan) => {
                const name = isRtl ? artisan.nameAr : artisan.nameEn

                return (
                  <ArtisanCard
                    key={artisan.artisanId}
                    imageUrl={artisan.coverImageUrl || ''}
                    name={name || ''}
                    onClick={() =>
                      navigate(`/artisans/${artisan.artisanId}`, {
                        state: { from: '/artisans', label: t('artisans') },
                      })
                    }
                  />
                )
              })}
            </div>
          ) : (
            !isFetching && (
              <div className="col-span-2 flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
                <Search className="h-12 w-12 opacity-30" />
                <p className="text-lg font-medium">{t('artisan.no_results')}</p>
                <p className="text-sm">{t('label.adjust_search')}</p>
              </div>
            )
          )}
        </InfiniteScroll>

        {/* Initial loading skeletons */}
        {isFetching && items.length === 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[380px] animate-pulse rounded-[24px] bg-muted"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Artisans
