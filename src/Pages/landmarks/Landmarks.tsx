import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import InfiniteScroll from 'react-infinite-scroller'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SharedCard from '@/components/atoms/SharedCard'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useGetRtl } from '@/lib/utils'
import { useLandmarks } from '@/api/landmarks/useLandmarks'
import { useCategories } from '@/api/categories/useCategories'
import { useToggleFavorite } from '@/api/favorites/useFavorites'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

const Landmarks = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])

  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useLandmarks({
    pageSize: 10,
    search: debouncedSearch || undefined,
    categoryId: selectedCategoryIds[0],
  })

  // Fire the API search only once, 1000ms after the user stops typing.
  // useEffect cleanup cancels the pending timer on every new keystroke,
  // so setDebouncedSearch is never called mid-word.
  const { mutate: toggleFavorite } = useToggleFavorite()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSearchChange = (value: string) => setSearchTerm(value)

  const items = data?.pages.flatMap((p) => p.items) ?? []

  // Fetch all categories from the API for the filter dropdown
  const { data: categories = [] } = useCategories()

  const toggleCategory = (id: number, checked: boolean) => {
    setSelectedCategoryIds((prev) => (checked ? [...prev, id] : prev.filter((c) => c !== id)))
  }

  const removeCategory = (id: number) => {
    setSelectedCategoryIds((prev) => prev.filter((c) => c !== id))
  }

  const clearFilters = () => {
    setSelectedCategoryIds([])
    setSearchTerm('')
    setDebouncedSearch('')
  }

  const getCategoryLabel = (id: number) => {
    const cat = categories.find((c) => c.categoryId === id)
    return cat ? (isRtl ? cat.categoryNameAr : cat.categoryNameEn) : String(id)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative mx-4 mt-4 h-[420px] md:h-[480px]">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            src={HERO_IMAGE}
            alt="Hadhramout Landmarks"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
          <h1
            className="text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Thmanyah', serif", direction: 'rtl' }}
          >
            {t('hero.landmarks.ar')}
          </h1>
          <p
            className="text-3xl font-semibold md:text-4xl lg:text-5xl"
            style={{ color: '#cea46c', fontFamily: 'Georgia, serif' }}
          >
            {t('hero.landmarks.en')}
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 translate-y-1/2 px-4">
          <div className="flex items-center gap-2">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-0 bg-white px-5 shadow-lg gap-1 font-medium hover:bg-white/90"
                >
                  {t('label.category')}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="mt-1 w-48"
              >
                {categories.length === 0 && (
                  <p className="px-3 py-2 text-sm text-muted-foreground">{t('label.no_results')}</p>
                )}
                {categories.map((cat) => (
                  <DropdownMenuCheckboxItem
                    key={cat.categoryId}
                    checked={selectedCategoryIds.includes(cat.categoryId)}
                    onCheckedChange={(checked) => toggleCategory(cat.categoryId, checked)}
                  >
                    {isRtl ? cat.categoryNameAr : cat.categoryNameEn}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <div className="mt-16 px-4">
        {selectedCategoryIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t('label.active_filters')}
            </span>
            {selectedCategoryIds.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full border border-secondary-6 bg-white px-3 py-1 text-sm font-medium text-secondary-8"
              >
                {getCategoryLabel(id)}
                <button
                  onClick={() => removeCategory(id)}
                  className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-secondary-2"
                  aria-label={`Remove filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-primary-7 underline-offset-2 transition-colors hover:text-primary-9 hover:underline"
            >
              {t('label.clear_filters')}
            </button>
          </div>
        )}
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
              className="mt-6 grid gap-6 md:grid-cols-1 xl:grid-cols-2"
            >
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] animate-pulse rounded-[32px] bg-muted"
                />
              ))}
            </div>
          }
        >
          {items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
              {items.map((landmark) => {
                const title = isRtl ? landmark.titleAr : landmark.titleEn
                const location = isRtl ? landmark.locationTextAr : landmark.locationTextEn

                return (
                  <SharedCard
                    key={landmark.landmarkId}
                    imageUrl={landmark.coverMediaUrl || ''}
                    location={location}
                    title={title}
                    isFavorite={landmark.isFavorite}
                    onFavoriteClick={() => toggleFavorite(landmark.landmarkId)}
                    onClick={() =>
                      navigate(`/landmarks/${landmark.landmarkId}`, {
                        state: { from: '/landmarks', label: t('landmarks') },
                      })
                    }
                    className="h-[400px]"
                  />
                )
              })}
            </div>
          ) : (
            !isFetching && (
              <div className="col-span-2 flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
                <Search className="h-12 w-12 opacity-30" />
                <p className="text-lg font-medium">{t('landmark.no_results')}</p>
                <p className="text-sm">{t('label.adjust_search')}</p>
              </div>
            )
          )}
        </InfiniteScroll>

        {/* Initial loading skeletons */}
        {isFetching && items.length === 0 && (
          <div className="grid gap-6 md:grid-cols-1 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[400px] animate-pulse rounded-[32px] bg-muted"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Landmarks
