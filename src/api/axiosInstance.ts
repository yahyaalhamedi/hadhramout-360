import axios from 'axios'
import { clearAuthCookies } from '@/lib/auth'

// Full backend origin — used only for <img> src attributes to load images directly.
export const baseURL = 'https://had360.runasp.net'

// For API calls, use VITE_API_BASE_URL to allow proxying on Netlify/Vercel and bypass CORS.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || baseURL

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
