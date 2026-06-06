import axios from 'axios'

interface ApiErrorData {
  message?: string
  title?: string
  errors?: Record<string, string[]>
}

/**
 * Extracts a human-readable error message from an API error response.
 * Handles both simple `{ message }` and ASP.NET validation `{ errors }` formats.
 */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (!axios.isAxiosError(err)) return fallback

  const data = err.response?.data as ApiErrorData | undefined
  if (!data) return fallback

  // Simple message field
  if (data.message) return data.message

  // ASP.NET validation errors — join all field messages
  if (data.errors) {
    const messages = Object.values(data.errors).flat()
    if (messages.length > 0) return messages.join('. ')
  }

  // Fallback to title
  if (data.title) return data.title

  return fallback
}
