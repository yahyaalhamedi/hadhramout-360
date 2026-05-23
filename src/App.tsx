import { Routes, Route } from 'react-router-dom'
import { NavigationMenuDemo } from './components/atoms/Navbar'
import { CarouselPlugin } from './components/atoms/Carousel'

function App() {
  return (
    <div className="flex flex-col">
      <NavigationMenuDemo />
      <main className="mx-auto flex w-full flex-1 flex-col items-center">
        <CarouselPlugin />
        <Routes>
          <Route
            path="/"
            element={<div>Home</div>}
          />
          <Route
            path="/landmarks"
            element={<div>Landmarks</div>}
          />
          <Route
            path="/events"
            element={<div>Events</div>}
          />
          <Route
            path="/artisans"
            element={<div>Artisans</div>}
          />
          <Route
            path="/discover"
            element={<div>Discover</div>}
          />
          <Route
            path="/community"
            element={<div>Community</div>}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
