import { CarouselPlugin } from '@/components/atoms/Carousel'
import SharedCard from '@/components/atoms/SharedCard'
import { useGetRtl } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { i18n } = useTranslation()
  const isRtl = useGetRtl()

  const [cards, setCards] = useState([
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      location: 'Shibam, Hadhramout',
      title: 'The Manhattan of the Desert',
      isFavorite: false,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      location: 'Shibam, Hadhramout',
      title: 'The Manhattan of the Desert',
      isFavorite: false,
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      location: 'Shibam, Hadhramout',
      title: 'The Manhattan of the Desert',
      isFavorite: false,
    },
    {
      id: 4,
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      location: 'Shibam, Hadhramout',
      title: 'The Manhattan of the Desert',
      isFavorite: false,
    },
  ])

  const toggleFavorite = (id: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? {
              ...card,
              isFavorite: !card.isFavorite,
            }
          : card,
      ),
    )
  }

  return (
    <main className="flex flex-col gap-8 bg-white">
      <CarouselPlugin />

      <section className="px-10">
        <div className="flex justify-between items-center">
          <h1 className="mb-6 scroll-m-20 text-4xl font-extrabold text-primary">
            {i18n.t('landmarks')}
          </h1>
          <p
            className="scroll-m-20 font-heading text-secondary-5 cursor-pointer flex items-center"
            onClick={() => console.log('clicked')}
          >
            {i18n.t('label.view_all')}
            {isRtl ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {cards.map((card) => {
            return (
              <div
                key={card.id}
                className="min-w-[380px] shrink-0"
              >
                <SharedCard
                  imageUrl={card.imageUrl}
                  location={card.location}
                  title={card.title}
                  isFavorite={card.isFavorite}
                  onClick={() => console.log(card.title)}
                  onFavoriteClick={() => toggleFavorite(card.id)}
                />
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default Home
