import { Routes, Route } from 'react-router-dom'
import { NavigationMenuDemo } from './components/atoms/Navbar'

function App() {
  return (
    <>
      <NavigationMenuDemo />
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
    </>
  )
}

export default App
