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
        <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold text-primary">
          {i18n.t('landmarks')}
        </h1>
        <p
          className="flex cursor-pointer scroll-m-20 items-center font-heading text-secondary-5"
          onClick={() => navigate('/landmarks')}
        >
          {i18n.t('label.view_all')}
          {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </p>
      </div>

      {isError && <p className="text-destructive py-4">{t('label.error_loading')}</p>}

      {isLoading && (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[400px] min-w-[380px] shrink-0 animate-pulse rounded-[32px] bg-muted"
            />
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((landmark) => {
            const title = isRtl ? landmark.titleAr : landmark.titleEn
            const location = isRtl ? landmark.locationTextAr : landmark.locationTextEn

            return (
              <div
                key={landmark.landmarkId}
                className="min-w-[380px] shrink-0"
              >
                <SharedCard
                  imageUrl={landmark.coverMediaUrl || ''}
                  location={location ?? ''}
                  title={title ?? ''}
                  isFavorite={landmark.isFavorite}
                  onFavoriteClick={() => toggleFavorite(landmark.landmarkId)}
                  onClick={() =>
                    navigate(`/landmarks/${landmark.landmarkId}`, {
                      state: { from: '/', label: t('landmarks') },
                    })
                  }
                  className="h-[400px] w-fit"
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
