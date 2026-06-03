import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/lib/AuthContext'
import type { Role } from '@/lib/roles'
import { hasAnyRole } from '@/lib/roles'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** If provided, user must have at least one of these roles. */
  requiredRoles?: Role[]
}

/**
 * Wraps a route that requires authentication (and optionally specific roles).
 * Redirects to `/auth?mode=login` if the user is not authenticated,
 * or to `/` if authenticated but lacks the required role.
 */
export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isLoggedIn, roles } = useAuthContext()
  const location = useLocation()

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/auth?mode=login"
        replace
        state={{ from: location }}
      />
    )
  }

  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(roles, requiredRoles)) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return <>{children}</>
}
