import { EventCard } from '@/components/atoms/EventCard'
import { useGetRtl } from '@/lib/utils'
import { EVENTS_DATA } from '@/Pages/events/data'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const HomeEvents = () => {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const isRtl = useGetRtl()

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mb-4 scroll-m-20 text-2xl font-extrabold text-primary sm:mb-6 sm:text-3xl md:text-4xl">
          {i18n.t('events')}
        </h1>
        <p
          className="scroll-m-20 font-heading text-sm text-secondary-5 cursor-pointer flex items-center sm:text-base"
          onClick={() => console.log('clicked')}
        >
          {i18n.t('label.view_all')}
          {isRtl ? <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {EVENTS_DATA.map((event) => (
          <EventCard
            key={event.id}
            imageUrl={event.imageUrl}
            author={event.authorName}
            authorImage={event.authorImage}
            title={event.title}
            location={event.location}
            date={event.date}
            onClick={() =>
              navigate(`/events/${event.slug}`, {
                state: { from: '/events', label: 'Events' },
              })
            }
          />
        ))}
      </div>
    </div>
  )
}

export default HomeEvents
