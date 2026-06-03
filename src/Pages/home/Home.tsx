import { CarouselPlugin } from '@/components/atoms/Carousel'
import HomeEvents from './components/HomeEvents'
import HomeLandmarks from './components/HomeLandmarks'

const Home = () => {
  return (
    <main className="flex flex-col gap-8 bg-white sm:gap-10 md:gap-14">
      <CarouselPlugin />

      <section className="flex flex-col gap-8 px-4 pb-8 sm:gap-10 sm:px-6 md:gap-14 md:px-10 lg:px-16 xl:px-20 md:pb-10 lg:pb-14">
        <HomeLandmarks />
        <HomeEvents />
      </section>
    </main>
  )
}

export default Home
