import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import { useGetRtl } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { useDiscoverContentById } from '@/api/discover/useDiscoverContent'
import { baseURL } from '@/api/axiosInstance'
import { DetailNotFound } from '@/components/atoms/DetailComponents'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

const DiscoverDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isRtl = useGetRtl()

  const id = slug ? Number(slug) : undefined
  const { data: content, isLoading, isError } = useDiscoverContentById(id)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background animate-pulse">
        <div className="h-[55vh] min-h-[400px] w-full bg-muted" />
        <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 space-y-4">
          <div className="h-8 w-1/2 rounded-xl bg-muted" />
          <div className="h-4 w-full rounded-xl bg-muted" />
          <div className="h-4 w-3/4 rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  if (isError || !content) {
    return (
      <DetailNotFound
        icon={MapPin}
        message={t('discover.not_found')}
        ctaLabel={t('discover.back')}
      />
    )
  }

  const title = isRtl ? content.titleAr : content.titleEn
  const body = isRtl ? content.bodyAr : content.bodyEn

  const coverUrl = content.coverImageUrl
    ? `${baseURL}${content.coverImageUrl}`
    : FALLBACK_IMAGE

  return (
    <div className="min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative h-[55vh] min-h-[400px] w-full overflow-hidden">
        <img
          src={coverUrl}
          alt={title ?? ''}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute start-6 top-6 z-10 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/25"
        >
          {isRtl ? (
            <ArrowRight className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
          {t('label.back')}
        </button>

        {/* Bottom-left content */}
        <div className="absolute bottom-0 start-0 px-6 pb-10 md:px-12">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {title}
          </h1>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <article className="space-y-6">
          {body ? (
            body.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground">
                {para}
              </p>
            ))
          ) : (
            <p className="leading-relaxed text-muted-foreground/50 italic">
              {t('discover.no_description')}
            </p>
          )}
        </article>
      </div>
    </div>
  )
}

export default DiscoverDetail
