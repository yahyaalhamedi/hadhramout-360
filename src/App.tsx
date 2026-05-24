import { Routes, Route } from 'react-router-dom'
import Navbar from './components/atoms/Navbar'
import Home from './Pages/home/Home'
import Footer from './components/atoms/Footer'
import Landmarks from './Pages/landmarks/Landmarks'
import LandmarkDetail from './Pages/landmarks/LandmarkDetail'

function App() {
  return (
    <div className="flex flex-col">
      <Navbar />
      {/* <main className="mx-auto flex w-full flex-1 flex-col items-center"> */}
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/landmarks"
          element={<Landmarks />}
        />
        <Route
          path="/landmarks/:slug"
          element={<LandmarkDetail />}
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
