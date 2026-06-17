import React, { useState, useEffect } from 'react'
import { Search, UtensilsCrossed, Globe, type LucideIcon } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroller'
import { Input } from '@/components/ui/input'
import DiscoverCard from '@/components/atoms/DiscoverCard'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetRtl } from '@/lib/utils'
import { useDiscoverContent } from '@/api/discover/useDiscoverContent'
import { cn } from '@/lib/utils'
import HERO_IMAGE from '@/assets/images/discovery.jpg'


// ── Custom Throne of Bilqis Icon (Commented out for later use) ─────
// const ThroneIcon = (props: React.ComponentProps<'svg'>) => (
//   <svg
//     viewBox="0 0 24 24"
//     width="24"
//     height="24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     {/* Base Platform */}
//     <rect x="1" y="16" width="22" height="6" rx="1" />
//     <path d="M8 16v6" />
//     <path d="M16 16v6" />
//     <path d="M8 18h8" />
//     <path d="M8 20h8" />
//
//     {/* Pillars */}
//     <path d="M2 16V10" />
//     <path d="M6 16V4" />
//     <path d="M10 16V4" />
//     <path d="M14 16V4" />
//     <path d="M18 16V4" />
//     <path d="M22 16V4" />
//   </svg>
// )

// ── Custom Yemeni Castle Icon (Dar Al-Hajar) ───────────────────────
const CastleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Rock and Castle Outline */}
    <path d="M2 22l2-3 1 1 1-4V8l1-3 1 3h3l1-3 1 3h3l1-3 1 3v8l2 3-1 1 3 2z" />
    {/* Decorative Belt */}
    <path d="M6 12h12" />
    {/* Windows */}
    <path d="M9 9.5v.01" />
    <path d="M15 9.5v.01" />
    <path d="M12 14.5v.01" />
  </svg>
)

// ── Custom Dominoes Icon ───────────────────────────────────────────
const DominoIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Vertical Domino (Left) */}
    <rect x="2" y="3" width="8" height="16" rx="2" />
    <line x1="2" y1="11" x2="10" y2="11" />
    <path d="M4.5 5.5h.01" />
    <path d="M7.5 5.5h.01" />
    <path d="M4.5 8.5h.01" />
    <path d="M7.5 8.5h.01" />
    <path d="M6 15h.01" />

    {/* Horizontal Domino (Right) */}
    <rect x="11" y="8" width="11" height="8" rx="2" />
    <line x1="16.5" y1="8" x2="16.5" y2="16" />
    <path d="M12.25 10.5h.01" />
    <path d="M15.25 13.5h.01" />
    <path d="M17.75 10.5h.01" />
    <path d="M19.25 12h.01" />
    <path d="M20.75 13.5h.01" />
  </svg>
)

// ── Fixed categories matching API endpoints ────────────────────────
interface Tab {
  key: string
  icon: LucideIcon | React.ComponentType<any>
  labelAr: string
  labelEn: string
}

const CATEGORY_TABS: Tab[] = [
  { key: 'culture', icon: CastleIcon, labelAr: 'الأماكن الشعبية', labelEn: 'Traditional Places' },
  { key: 'food', icon: UtensilsCrossed, labelAr: 'الأكلات الشعبية', labelEn: 'Traditional Food' },
  { key: 'games', icon: DominoIcon, labelAr: 'الألعاب الشعبية', labelEn: 'Traditional Games' },
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
