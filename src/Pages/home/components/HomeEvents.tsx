import { EventCard } from '@/components/atoms/EventCard'
import { useGetRtl } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const HomeEvents = () => {
  const { i18n } = useTranslation()
  const isRtl = useGetRtl()

  const eventCards = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      author: 'Ahmed Bin Hashim',
      authorImage: 'https://i.pravatar.cc/150?img=3',
      title: 'The Manhattan of the Desert',
      location: 'Shibam, Hadhramout',
      date: 'September 28, 2024',
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      author: 'Ahmed Bin Hashim',
      authorImage: 'https://i.pravatar.cc/150?img=4',
      title: 'The Manhattan of the Desert',
      location: 'Shibam, Hadhramout',
      date: 'September 28, 2024',
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      author: 'Ahmed Bin Hashim',
      authorImage: 'https://i.pravatar.cc/150?img=5',
      title: 'The Manhattan of the Desert',
      location: 'Shibam, Hadhramout',
      date: 'September 28, 2024',
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      author: 'Ahmed Bin Hashim',
      authorImage: 'https://i.pravatar.cc/150?img=3',
      title: 'The Manhattan of the Desert',
      location: 'Shibam, Hadhramout',
      date: 'September 28, 2024',
    },
    {
      id: 5,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      author: 'Ahmed Bin Hashim',
      authorImage: 'https://i.pravatar.cc/150?img=4',
      title: 'The Manhattan of the Desert',
      location: 'Shibam, Hadhramout',
      date: 'September 28, 2024',
    },
    {
      id: 6,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      author: 'Ahmed Bin Hashim',
      authorImage: 'https://i.pravatar.cc/150?img=5',
      title: 'The Manhattan of the Desert',
      location: 'Shibam, Hadhramout',
      date: 'September 28, 2024',
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold text-primary">
          {i18n.t('events')}
        </h1>
        <p
          className="scroll-m-20 font-heading text-secondary-5 cursor-pointer flex items-center"
          onClick={() => console.log('clicked')}
        >
          {i18n.t('label.view_all')}
          {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {eventCards.map((card) => (
          <EventCard
            key={card.id}
            imageUrl={card.imageUrl}
            author={card.author}
            authorImage={card.authorImage}
            title={card.title}
            location={card.location}
            date={card.date}
            onClick={() => console.log(card.title)}
          />
        ))}
      </div>
    </div>
  )
}

export default HomeEvents
