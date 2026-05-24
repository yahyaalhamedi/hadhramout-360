import { Routes, Route } from 'react-router-dom'
import { NavigationMenuDemo } from './components/atoms/Navbar'
import Home from './Pages/Home'
import Footer from './components/atoms/Footer'

function App() {
  return (
    <div className="flex flex-col">
      <NavigationMenuDemo />
      {/* <main className="mx-auto flex w-full flex-1 flex-col items-center"> */}
      <Routes>
        <Route
          path="/"
          element={<Home />}
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
      {/* </main> */}
      <Footer />
    </div>
  )
}

export default App
