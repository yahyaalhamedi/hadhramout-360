import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop handles resetting the window scroll position to the top
 * whenever a new route/navigation event occurs in React Router.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Smooth or instant
    })
  }, [pathname])

  return null
}
