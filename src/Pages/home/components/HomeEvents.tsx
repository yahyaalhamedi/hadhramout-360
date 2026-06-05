import { EventCard } from '@/components/atoms/EventCard'
import { useGetRtl } from '@/lib/utils'
import { useEvents } from '@/api/events/useEvents'
import { baseURL } from '@/api/axiosInstance'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80'

const HomeEvents = () => {
  const navigate = useNavigate()
  const { i18n, t } = useTranslation()
  const isRtl = useGetRtl()

  const { data } = useEvents({ pageSize: 6 })
  const items = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold text-primary">
          {i18n.t('events')}
        </h1>
        <p
          className="scroll-m-20 font-heading text-secondary-5 cursor-pointer flex items-center"
          onClick={() => navigate('/events')}
        >
          {i18n.t('label.view_all')}
          {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((event) => {
          const title = isRtl ? event.titleAr : event.titleEn
          const address = isRtl ? event.addressAr : event.addressEn
          const orgName = isRtl ? event.organizationNameAr : event.organizationNameEn
          const coverUrl = event.coverImageUrl
            ? `${baseURL}${event.coverImageUrl}`
            : FALLBACK_IMAGE
          const startDate = new Date(event.startDate).toLocaleDateString(
            isRtl ? 'ar-YE' : 'en-US',
            { year: 'numeric', month: 'long', day: 'numeric' },
          )

          return (
            <EventCard
              key={event.eventId}
              imageUrl={coverUrl}
              author={orgName || ''}
              authorImage={event.organizationLogoUrl ? `${baseURL}${event.organizationLogoUrl}` : ''}
              title={title || ''}
              location={address || ''}
              date={startDate}
              onClick={() =>
                navigate(`/events/${event.eventId}`, {
                  state: { from: '/events', label: t('events') },
                })
              }
            />
          )
        })}
      </div>
    </div>
  )
}

export default HomeEvents
