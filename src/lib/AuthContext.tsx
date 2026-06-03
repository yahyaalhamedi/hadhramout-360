import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import {
  getAuthStateFromCookies,
  setAuthCookies,
  clearAuthCookies,
  initAuthHeader,
  EMPTY_AUTH_STATE,
  type AuthState,
} from './auth'

// ── Login payload (matches the backend response `data` object) ───────
export interface LoginPayload {
  token: string
  expiration: string
  email: string
  roles: string[]
  userId: number
}

// ── Context shape ────────────────────────────────────────────────────
interface AuthContextValue extends AuthState {
  /** Persist login data and update state */
  login: (payload: LoginPayload) => void
  /** Clear cookies and reset state */
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // On mount, hydrate from cookies and set axios header
    initAuthHeader()
    return getAuthStateFromCookies()
  })

  const login = useCallback((payload: LoginPayload) => {
    setAuthCookies({
      token: payload.token,
      expiration: payload.expiration,
      userId: payload.userId,
      userName: payload.email.split('@')[0], // derive username from email
      email: payload.email,
      roles: payload.roles,
    })
    // Re-read from cookies to get a consistent state
    setAuthState(getAuthStateFromCookies())
  }, [])

  const logout = useCallback(() => {
    clearAuthCookies()
    setAuthState(EMPTY_AUTH_STATE)
  }, [])

  // Check for cookie expiry on visibility change (e.g. user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const current = getAuthStateFromCookies()
        if (!current.isLoggedIn && authState.isLoggedIn) {
          // Token cookie expired while tab was inactive
          logout()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [authState.isLoggedIn, logout])

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────────
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuthContext must be used within an <AuthProvider>')
  }
  return ctx
}
