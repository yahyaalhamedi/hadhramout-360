import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Artisans from '@/assets/images/artisans.png'
import Community from '@/assets/images/community.png'
import Events from '@/assets/images/events.png'
import Landmarks from '@/assets/images/landmarks.png'
import { useGetRtl } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const slides = [
  { src: Landmarks, alt: 'Landmarks', href: '/landmarks' },
  { src: Events, alt: 'Events', href: '/events' },
  { src: Artisans, alt: 'Artisans', href: '/artisans' },
  { src: Community, alt: 'Community', href: '/community' },
] as const

const AUTOPLAY_DELAY = 5000

export function CarouselPlugin() {
  const isRtl = useGetRtl()
  const direction: 'ltr' | 'rtl' = isRtl ? 'rtl' : 'ltr'
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [progress, setProgress] = React.useState(0)
  const progressRef = React.useRef<number | null>(null)
  const lastTimeRef = React.useRef<number>(0)

  const autoplay = React.useMemo(
    () => Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false, stopOnMouseEnter: true }),
    [],
  )

  const carouselOpts = React.useMemo(
    () => ({
      loop: true,
      align: 'start' as const,
      direction,
    }),
    [direction],
  )

  // Track current slide
  React.useEffect(() => {
    if (!api) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
      setProgress(0)
      lastTimeRef.current = 0
    }

    api.on('select', onSelect)
    api.on('reInit', onSelect)
    onSelect()

    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api])

  // Animate progress bar
  React.useEffect(() => {
    if (!api) return

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time
      const elapsed = time - lastTimeRef.current
      const pct = Math.min((elapsed / AUTOPLAY_DELAY) * 100, 100)
      setProgress(pct)
      progressRef.current = requestAnimationFrame(animate)
    }

    progressRef.current = requestAnimationFrame(animate)

    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
    }
  }, [api, current])

  React.useEffect(() => {
    api?.reInit()
  }, [api, direction])

  const handleImageLoad = React.useCallback(() => {
    api?.reInit()
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api],
  )

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  return (
    <section
      id="hero-carousel"
      className="relative mx-auto w-full"
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
          {slides.map((slide, index) => (
            <CarouselItem
              key={slide.alt}
              className="basis-full ps-0"
            >
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/7' }}>
                {/* Image with Ken Burns effect */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className={`
                    size-full object-cover transition-transform duration-[8000ms] ease-out
                    ${index === current ? 'scale-110' : 'scale-100'}
                  `}
                  onLoad={handleImageLoad}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Gradient overlays for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

                {/* Bottom CTA area */}
                <div
                  className={`
                    absolute bottom-8 flex items-center gap-4
                    sm:bottom-12 md:bottom-16 lg:bottom-20
                    ${isRtl ? 'right-6 sm:right-10 md:right-16' : 'left-6 sm:left-10 md:left-16'}
                  `}
                >
                  <button
                    onClick={() => navigate(slide.href)}
                    className="
                      group/btn flex items-center gap-2
                      rounded-full bg-white/15 px-6 py-3 backdrop-blur-md
                      text-sm font-semibold text-white
                      border border-white/20
                      transition-all duration-300
                      hover:bg-white/25 hover:border-white/40 hover:scale-105
                      active:scale-95
                      sm:px-8 sm:py-3.5 sm:text-base
                      md:px-10 md:py-4 md:text-lg
                      cursor-pointer
                    "
                  >
                    {t('label.view_details')}
                    {isRtl ? (
                      <ChevronLeft className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-x-1 sm:h-5 sm:w-5" />
                    ) : (
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom navigation arrows — glassmorphic */}
        <button
          onClick={scrollPrev}
          aria-label="Previous slide"
          className={`
            absolute top-1/2 -translate-y-1/2
            flex h-10 w-10 items-center justify-center
            rounded-full border border-white/20 bg-white/10 backdrop-blur-md
            text-white transition-all duration-300
            hover:bg-white/25 hover:border-white/40 hover:scale-110
            active:scale-95 cursor-pointer
            sm:h-12 sm:w-12
            md:h-14 md:w-14
            ${isRtl ? 'right-3 sm:right-5 md:right-8' : 'left-3 sm:left-5 md:left-8'}
          `}
        >
          {isRtl ? <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" /> : <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>

        <button
          onClick={scrollNext}
          aria-label="Next slide"
          className={`
            absolute top-1/2 -translate-y-1/2
            flex h-10 w-10 items-center justify-center
            rounded-full border border-white/20 bg-white/10 backdrop-blur-md
            text-white transition-all duration-300
            hover:bg-white/25 hover:border-white/40 hover:scale-110
            active:scale-95 cursor-pointer
            sm:h-12 sm:w-12
            md:h-14 md:w-14
            ${isRtl ? 'left-3 sm:left-5 md:left-8' : 'right-3 sm:right-5 md:right-8'}
          `}
        >
          {isRtl ? <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" /> : <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />}
        </button>
      </Carousel>

      {/* Dot indicators with progress bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:bottom-4 sm:gap-3 md:bottom-6">
        {slides.map((slide, index) => (
          <button
            key={slide.alt}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`
              group relative overflow-hidden rounded-full transition-all duration-500 cursor-pointer
              ${
                index === current
                  ? 'h-2.5 w-8 bg-white/30 sm:h-3 sm:w-10 md:w-12'
                  : 'h-2.5 w-2.5 bg-white/40 hover:bg-white/60 sm:h-3 sm:w-3'
              }
            `}
          >
            {/* Animated progress fill for active dot */}
            {index === current && (
              <div
                className="absolute inset-y-0 start-0 rounded-full bg-white transition-none"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
