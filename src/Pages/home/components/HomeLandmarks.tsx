import SharedCard from '@/components/atoms/SharedCard'
import { useGetRtl } from '@/lib/utils'
import { LANDMARKS_DATA } from '@/Pages/landmarks/data'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const HomeLandmarks = () => {
  const { i18n, t } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()

  const [cards, setCards] = useState(LANDMARKS_DATA)

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
    <div>
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
                onClick={() =>
                  navigate(`/landmarks/${card.slug}`, { state: { from: '/', label: t('landmarks') } })
                }
                onFavoriteClick={() => toggleFavorite(card.id)}
                className="h-[400px] w-fit"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomeLandmarks
