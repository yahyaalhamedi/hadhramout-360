import axios from 'axios'
import { clearAuthCookies } from '@/lib/auth'

// Full backend origin — used for API requests and <img> src attributes.
// In production builds, it can be overridden by VITE_API_BASE_URL.
export const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://had360.runasp.net'
const API_BASE_URL = baseURL

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
