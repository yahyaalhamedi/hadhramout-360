import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Artisans from '@/assets/images/artisans.png'
import Community from '@/assets/images/community.png'
import Events from '@/assets/images/events.png'
import Landmarks from '@/assets/images/landmarks.png'

const slides = [
  { src: Landmarks, alt: 'Landmarks' },
  { src: Artisans, alt: 'Artisans' },
  { src: Community, alt: 'Community' },
  { src: Events, alt: 'Events' },
] as const

export function CarouselPlugin() {
  const [api, setApi] = React.useState<CarouselApi>()
  const autoplay = React.useMemo(() => Autoplay({ delay: 4000, stopOnInteraction: true }), [])

  const handleImageLoad = React.useCallback(() => {
    api?.reInit()
  }, [api])

  return (
    <section className="mx-auto w-full">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: 'start' }}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.alt}
              className=" pl-0"
            >
              <div className="md:aspect-[2.4/1]">
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="size-full object-cover"
                  onLoad={handleImageLoad}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 md:left-6" />
        <CarouselNext className="right-4 md:right-6" />
      </Carousel>
    </section>
  )
}
