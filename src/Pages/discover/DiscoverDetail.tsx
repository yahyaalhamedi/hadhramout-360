import { MapPin } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGetRtl } from '@/lib/utils'
import { useDiscoverContentById } from '@/api/discover/useDiscoverContent'
import { baseURL } from '@/api/axiosInstance'
import { DetailHero, DetailNotFound } from '@/components/atoms/DetailComponents'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

const DiscoverDetail = () => {
  const { slug } = useParams<{ slug: string }>()
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
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <DetailHero
        imageUrl={coverUrl}
        imageAlt={title ?? ''}
      >
        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
          {title}
        </h1>
      </DetailHero>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
        <article className="space-y-6">
          {body ? (
            <div
              className="prose prose-slate max-w-none leading-relaxed text-muted-foreground prose-headings:text-foreground prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: body }}
            />
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
