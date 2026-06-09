import { useState, useEffect } from 'react'
import { Search, Landmark, UtensilsCrossed, Gamepad2, Globe, type LucideIcon } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroller'
import { Input } from '@/components/ui/input'
import DiscoverCard from '@/components/atoms/DiscoverCard'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetRtl } from '@/lib/utils'
import { useDiscoverContent } from '@/api/discover/useDiscoverContent'
import { cn } from '@/lib/utils'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

// ── Fixed categories matching API endpoints ────────────────────────
interface Tab {
  key: string
  icon: LucideIcon
  labelAr: string
  labelEn: string
}

const CATEGORY_TABS: Tab[] = [
  { key: 'culture', icon: Landmark, labelAr: 'ثقافة', labelEn: 'Culture' },
  { key: 'food', icon: UtensilsCrossed, labelAr: 'طعام', labelEn: 'Food' },
  { key: 'games', icon: Gamepad2, labelAr: 'ألعاب', labelEn: 'Games' },
]

const Discover = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeTab, setActiveTab] = useState<string>('all')

  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useDiscoverContent({
    pageSize: 9,
    search: debouncedSearch || undefined,
    category: activeTab === 'all' ? undefined : activeTab,
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
            alt="Hadhramout Discover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <h1
            className="text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Thmanyah', serif", direction: 'rtl' }}
          >
            {t('hero.discover.ar')}
          </h1>
          <p
            className="text-3xl font-semibold md:text-4xl lg:text-5xl"
            style={{ color: '#cea46c', fontFamily: 'Georgia, serif' }}
          >
            {t('hero.discover.en')}
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

      {/* Category Tabs */}
      <div className="mt-16 px-4">
        <div className="flex items-center justify-center gap-8 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex flex-col items-center gap-2 shrink-0 cursor-pointer transition-colors',
              activeTab === 'all' ? 'text-secondary-8' : 'text-muted-foreground hover:text-secondary-8',
            )}
          >
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors',
                activeTab === 'all' ? 'border-secondary-8 bg-secondary-1' : 'border-muted-foreground/30 bg-white',
              )}
            >
              <Globe className="h-7 w-7" />
            </div>
            <span className="text-xs font-medium">{t('label.all')}</span>
          </button>

          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            const label = isRtl ? tab.labelAr : tab.labelEn

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex flex-col items-center gap-2 shrink-0 cursor-pointer transition-colors',
                  isActive ? 'text-secondary-8' : 'text-muted-foreground hover:text-secondary-8',
                )}
              >
                <div
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-full border-2 transition-colors',
                    isActive ? 'border-secondary-8 bg-secondary-1' : 'border-muted-foreground/30 bg-white',
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Error */}
      {isError && <p className="mt-8 px-4 text-destructive">{t('label.no_results')}</p>}

      {/* Card Grid with Infinite Scroll */}
      <div className="mt-6 px-4 pb-12">
        <InfiniteScroll
          pageStart={0}
          loadMore={() => {
            if (!isFetching) void fetchNextPage()
          }}
          hasMore={!!hasNextPage}
          loader={
            <div
              key="loader"
              className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3"
            >
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
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {items.map((content) => {
                const title = isRtl ? content.titleAr : content.titleEn

                return (
                  <DiscoverCard
                    key={content.contentId}
                    imageUrl={content.coverImageUrl || ''}
                    title={title || ''}
                    onClick={() =>
                      navigate(`/discover/${content.contentId}`, {
                        state: { from: '/discover', label: t('discover') },
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
                <p className="text-lg font-medium">{t('discover.no_results')}</p>
                <p className="text-sm">{t('label.adjust_search')}</p>
              </div>
            )
          )}
        </InfiniteScroll>

        {/* Initial loading skeletons */}
        {isFetching && items.length === 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[520px] animate-pulse rounded-[40px] bg-muted"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Discover
