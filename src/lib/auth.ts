import Cookies from 'js-cookie'
import { axiosInstance } from '@/api/axiosInstance'
import type { Role } from './roles'
import { Roles } from './roles'

// ── Cookie Keys ──────────────────────────────────────────────────────
const COOKIE_KEYS = {
  token: 'had360_token',
  userId: 'had360_user_id',
  userName: 'had360_user_name',
  userEmail: 'had360_user_email',
  userRoles: 'had360_user_roles',
} as const

// ── Auth State Type ──────────────────────────────────────────────────
export interface AuthState {
  isLoggedIn: boolean
  token: string | null
  userId: number | null
  userName: string
  userEmail: string
  roles: Role[]
  isAdmin: boolean
  isContentManager: boolean
  isOrganization: boolean
  isUser: boolean
}

// ── Default (logged-out) state ───────────────────────────────────────
export const EMPTY_AUTH_STATE: AuthState = {
  isLoggedIn: false,
  token: null,
  userId: null,
  userName: '',
  userEmail: '',
  roles: [],
  isAdmin: false,
  isContentManager: false,
  isOrganization: false,
  isUser: false,
}

// ── Read current auth state from cookies ─────────────────────────────
export function getAuthStateFromCookies(): AuthState {
  const token = Cookies.get(COOKIE_KEYS.token) ?? null

  if (!token) return EMPTY_AUTH_STATE

  const userId = Cookies.get(COOKIE_KEYS.userId)
  const userName = Cookies.get(COOKIE_KEYS.userName) ?? ''
  const userEmail = Cookies.get(COOKIE_KEYS.userEmail) ?? ''
  const rolesRaw = Cookies.get(COOKIE_KEYS.userRoles)

  let roles: Role[] = []
  try {
    roles = rolesRaw ? JSON.parse(rolesRaw) : []
  } catch {
    roles = []
  }

  return {
    isLoggedIn: true,
    token,
    userId: userId ? Number(userId) : null,
    userName,
    userEmail,
    roles,
    isAdmin: roles.includes(Roles.Admin),
    isContentManager: roles.includes(Roles.ContentManager),
    isOrganization: roles.includes(Roles.Organization),
    isUser: roles.includes(Roles.User),
  }
}

// ── Persist auth data to cookies + set axios header ──────────────────
export function setAuthCookies(data: {
  token: string
  expiration: string
  userId: number
  userName: string
  email: string
  roles: string[]
}) {
  // Calculate expiry from the backend's expiration date
  const expiresAt = new Date(data.expiration)
  const now = new Date()
  const daysUntilExpiry = Math.max(
    (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    0,
  )

  const cookieOptions: Cookies.CookieAttributes = {
    expires: daysUntilExpiry,
    sameSite: 'Lax',
    path: '/',
  }

  Cookies.set(COOKIE_KEYS.token, data.token, cookieOptions)
  Cookies.set(COOKIE_KEYS.userId, String(data.userId), cookieOptions)
  Cookies.set(COOKIE_KEYS.userName, data.userName, cookieOptions)
  Cookies.set(COOKIE_KEYS.userEmail, data.email, cookieOptions)
  Cookies.set(COOKIE_KEYS.userRoles, JSON.stringify(data.roles), cookieOptions)

  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
}

// ── Clear all auth cookies + remove axios header ─────────────────────
export function clearAuthCookies() {
  Object.values(COOKIE_KEYS).forEach((key) => Cookies.remove(key, { path: '/' }))
  delete axiosInstance.defaults.headers.common['Authorization']
}

// ── Initialize axios header from cookies (call on app boot) ──────────
export function initAuthHeader() {
  const token = Cookies.get(COOKIE_KEYS.token)
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}
