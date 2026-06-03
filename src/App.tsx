import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/atoms/Navbar'
import Home from './Pages/home/Home'
import Footer from './components/atoms/Footer'
import Landmarks from './Pages/landmarks/Landmarks'
import LandmarkDetail from './Pages/landmarks/LandmarkDetail'
import Events from './Pages/events/Events'
import EventDetail from './Pages/events/EventDetail'
import ScrollToTop from './components/atoms/ScrollToTop'
import AuthPage from './Pages/auth/AuthPage'
import Artisans from './Pages/artisans/Artisans'
import ArtisanDetail from './Pages/artisans/ArtisanDetail'
import Discover from './Pages/discover/Discover'
import DiscoverDetail from './Pages/discover/DiscoverDetail'
import Community from './Pages/community/Community'
import Dashboard from './Pages/dashboard/Dashboard'
import Posts from './Pages/posts/Posts'
import Favorites from './Pages/favorites/Favorites'
import ProtectedRoute from './components/atoms/ProtectedRoute'
import { Roles } from './lib/roles'

function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <div className="flex flex-col">
      <ScrollToTop />
      {!isDashboard && <Navbar />}
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
          element={<Events />}
        />
        <Route
          path="/events/:slug"
          element={<EventDetail />}
        />
        <Route
          path="/auth"
          element={<AuthPage />}
        />
        <Route
          path="/artisans"
          element={<Artisans />}
        />
        <Route
          path="/artisans/:slug"
          element={<ArtisanDetail />}
        />
        <Route
          path="/discover"
          element={<Discover />}
        />
        <Route
          path="/discover/:slug"
          element={<DiscoverDetail />}
        />
        <Route
          path="/community"
          element={<Community />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRoles={[Roles.Admin, Roles.ContentManager]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isDashboard && <Footer />}
    </div>
  )
}

export default App
