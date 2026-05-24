import { CarouselPlugin } from '@/components/atoms/Carousel'
import HomeEvents from './components/HomeEvents'
import HomeLandmarks from './components/HomeLandmarks'

const Home = () => {
  return (
    <main className="flex flex-col gap-10 bg-white">
      <CarouselPlugin />

      <section className="flex flex-col gap-10 px-10 pb-10">
        <HomeLandmarks />
        <HomeEvents />
      </section>
    </main>
  )
}

export default Home
