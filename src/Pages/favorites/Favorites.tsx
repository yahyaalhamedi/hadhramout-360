import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useUserFavorites } from '@/api/user/useUserFavorites'
import { useGetRtl } from '@/lib/utils'
import { baseURL } from '@/api/axiosInstance'
import { ArrowLeft, MapPin, Heart } from 'lucide-react'

const Favorites = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()

  const {
    data,
    isFetching,
    isError,
  } = useUserFavorites()

  const items = data ?? []

  return (
    <div className="min-h-screen bg-tertiary-0">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('profile.favorites', 'My Favorites')}
          </h1>
        </div>

        {isError && (
          <p className="text-destructive text-center py-8">{t('label.no_results')}</p>
        )}

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {items.map((fav) => (
            <button
              key={fav.favoriteId}
              onClick={() => navigate(`/landmarks/${fav.landmarkId}`)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer text-left"
            >
              {/* Cover Image */}
              <div className="relative h-44 overflow-hidden">
                {fav.coverMediaUrl ? (
                  <img
                    src={`${baseURL}${fav.coverMediaUrl}`}
                    alt={isRtl ? fav.titleAr : fav.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-slate-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-tertiary-8 mb-1 line-clamp-1">
                  {isRtl ? fav.titleAr : fav.titleEn}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">
                    {isRtl ? fav.locationTextAr : fav.locationTextEn}
                  </span>
                </div>
                {fav.categoryNamesEn && fav.categoryNamesEn.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(isRtl ? fav.categoryNamesAr : fav.categoryNamesEn)?.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-0.5 rounded-full bg-tertiary-1 text-[11px] font-medium text-tertiary-7"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {isFetching && items.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[260px] animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        )}

        {!isFetching && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
            <Heart className="h-12 w-12 text-slate-300" />
            <p className="text-lg font-medium">{t('favorites.empty', 'No favorites yet')}</p>
            <p className="text-sm">{t('favorites.explore', 'Explore landmarks and add them to your favorites!')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites
