import axios from 'axios'
import { clearAuthCookies } from '@/lib/auth'

// Full backend origin — used only for <img> src attributes (no CORS issue).
export const baseURL = 'http://had360.runasp.net'

// API calls use a relative path so they go through Vite's dev-server proxy,
// which eliminates CORS entirely. In production builds, set VITE_API_BASE_URL
// to the real backend origin (e.g. 'http://had360.runasp.net').
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── 401 Response Interceptor ─────────────────────────────────────────
// When the backend returns 401 (token expired / invalid), automatically
// clear cookies and redirect to login.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthCookies()
      // Only redirect if not already on the auth page
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth?mode=login'
      }
    }
    return Promise.reject(error)
  },
)
