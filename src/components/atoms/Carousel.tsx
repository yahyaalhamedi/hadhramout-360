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
import Artisans from '@/assets/images/artisans.jpg'
import Community from '@/assets/images/community.jpg'
import Events from '@/assets/images/events.jpg'
import Landmarks from '@/assets/images/landmarks.jpg'
import Discovery from '@/assets/images/discovery.jpg'
import { useGetRtl } from '@/lib/utils'

const slides = [
  { src: Landmarks, alt: 'Landmarks' },
  { src: Artisans, alt: 'Artisans' },
  { src: Community, alt: 'Community' },
  { src: Events, alt: 'Events' },
  { src: Discovery, alt: 'discovery' },
] as const

export function CarouselPlugin() {
  const isRtl = useGetRtl()
  const direction: 'ltr' | 'rtl' = isRtl ? 'rtl' : 'ltr'

  const [api, setApi] = React.useState<CarouselApi>()
  const autoplay = React.useMemo(() => Autoplay({ delay: 4000, stopOnInteraction: true }), [])

  const carouselOpts = React.useMemo(
    () => ({
      loop: true,
      align: 'start' as const,
      direction,
    }),
    [direction],
  )

  React.useEffect(() => {
    api?.reInit()
  }, [api, direction])

  const handleImageLoad = React.useCallback(() => {
    api?.reInit()
  }, [api])

  return (
    <section
      className="mx-auto w-full"
      dir={direction}
    >
      <Carousel
        key={direction}
        setApi={setApi}
        opts={carouselOpts}
        plugins={[autoplay]}
        className="w-full"
      >
        <CarouselContent className="ms-0">
          {slides.map((slide) => (
            <CarouselItem
              key={slide.alt}
              className="basis-full ps-0"
            >
              <div className="relative aspect-[21/9] w-full overflow-hidden md:aspect-[2.4/1]">
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
        <CarouselPrevious className="start-4 md:start-6" />
        <CarouselNext className="end-4 md:end-6" />
      </Carousel>
    </section>
  )
}
