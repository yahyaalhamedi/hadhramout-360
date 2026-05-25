import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
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
import { LANDMARKS_DATA } from './data'


const HERO_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

const Landmarks = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Historical'])
  const [cards, setCards] = useState(LANDMARKS_DATA)

  const CATEGORIES = [
    { name: t('label.historical'), value: 'Historical' },
    { name: t('label.cultural'), value: 'Cultural' },
    { name: t('label.natural'), value: 'Natural' },
    { name: t('label.modern'), value: 'Modern' },
  ]

  const toggleFavorite = (id: number) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, isFavorite: !card.isFavorite } : card)),
    )
  }

  const removeFilter = (filter: string) => {
    setSelectedCategories((prev) => prev.filter((f) => f !== filter))
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSearchTerm('')
  }

  const toggleCategory = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }

  const filteredCards = cards.filter((card) => {
    const matchesSearch =
      searchTerm === '' ||
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(card.category)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      {/* Outer: relative but NO overflow-hidden so the search pill can spill out */}
      <div className="relative mx-4 mt-4 h-[420px] md:h-[480px]">
        {/* Inner: overflow-hidden keeps the image clipped to rounded corners */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            src={HERO_IMAGE}
            alt="Hadhramout Landmarks"
            className="h-full w-full object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        </div>

        {/* Hero text — sits on top of inner image container */}
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

        {/* Search + Filter bar — overflows below the hero cover */}
        <div className="absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 translate-y-1/2 px-4">
          <div className="flex items-center gap-2">
            {/* Search input */}
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 rounded-full bg-white pl-5 pr-12 text-sm shadow-lg border-0 focus-visible:ring-2 focus-visible:ring-secondary-7"
              />
              <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Category dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 rounded-full bg-white px-5 shadow-lg border-0 gap-1 font-medium hover:bg-white/90"
                >
                  {t('label.category')}
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 mt-1"
              >
                {CATEGORIES.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category.value}
                    checked={selectedCategories.includes(category.value)}
                    onCheckedChange={(checked) => toggleCategory(category.value, checked)}
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* ── Active Filters ────────────────────────────────────────── */}
      <div className="mt-16 px-4">
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t('label.active_filters')}
            </span>
            {selectedCategories.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1.5 rounded-full border border-secondary-6 px-3 py-1 text-sm font-medium text-secondary-8 bg-white"
              >
                {filter}
                <button
                  onClick={() => removeFilter(filter)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-secondary-2 transition-colors"
                  aria-label={`Remove ${filter} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-primary-7 hover:text-primary-9 underline-offset-2 hover:underline transition-colors"
            >
              {t('label.clear_filters')}
            </button>
          </div>
        )}
      </div>

      {/* ── Card Grid ────────────────────────────────────────────── */}
      <div className="mt-6 px-4 pb-12 grid gap-6 md:grid-cols-1 xl:grid-cols-2">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <SharedCard
              key={card.id}
              imageUrl={card.imageUrl}
              location={card.location}
              title={card.title}
              isFavorite={card.isFavorite}
              onClick={() => navigate(`/landmarks/${card.slug}`, { state: { from: '/landmarks', label: 'Landmarks' } })}
              onFavoriteClick={() => toggleFavorite(card.id)}
              className="h-[400px]"
            />
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
            <Search className="h-12 w-12 opacity-30" />
            <p className="text-lg font-medium">{t('landmark.no_results')}</p>
            <p className="text-sm">{t('label.adjust_search')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Landmarks
