import SharedCard from '@/components/atoms/SharedCard'
import { useGetRtl } from '@/lib/utils'
import { useLandmarks } from '@/api/landmarks/useLandmarks'
import { useToggleFavorite } from '@/api/favorites/useFavorites'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const HomeLandmarks = () => {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()

  const { data, isLoading, isError } = useLandmarks({ pageSize: 10 })
  const { mutate: toggleFavorite } = useToggleFavorite()

  const items = data?.pages[0]?.items ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 scroll-m-20 text-2xl font-extrabold text-primary sm:mb-6 sm:text-3xl md:text-4xl">
          {i18n.t('landmarks')}
        </h1>
        <p
          className="flex cursor-pointer scroll-m-20 items-center font-heading text-sm text-secondary-5 sm:text-base"
          onClick={() => navigate('/landmarks')}
        >
          {i18n.t('label.view_all')}
          {isRtl ? <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </p>
      </div>

      {isError && <p className="text-destructive py-4">{t('label.error_loading')}</p>}

      {isLoading && (
        <div className="flex gap-4 overflow-x-auto pb-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[280px] min-w-[260px] shrink-0 animate-pulse rounded-[24px] bg-muted sm:h-[340px] sm:min-w-[320px] sm:rounded-[28px] md:h-[400px] md:min-w-[380px] md:rounded-[32px]"
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-0 sm:gap-6 sm:px-0 snap-x snap-mandatory">
          {items.map((landmark) => {
            const title = isRtl ? landmark.titleAr : landmark.titleEn
            const location = isRtl ? landmark.locationTextAr : landmark.locationTextEn

            return (
              <div
                key={landmark.landmarkId}
                className="min-w-[260px] shrink-0 snap-start sm:min-w-[320px] md:min-w-[380px]"
              >
                <SharedCard
                  imageUrl={landmark.coverMediaUrl || ''}
                  location={location}
                  title={title}
                  isFavorite={landmark.isFavorite}
                  onFavoriteClick={() => toggleFavorite(landmark.landmarkId)}
                  onClick={() =>
                    navigate(`/landmarks/${landmark.landmarkId}`, {
                      state: { from: '/', label: t('landmarks') },
                    })
                  }
                  className="h-[280px] w-full sm:h-[340px] md:h-[400px]"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default HomeLandmarks
