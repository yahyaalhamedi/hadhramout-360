import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getApiErrorMessage } from './getApiError'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (err) => {
        toast.error(getApiErrorMessage(err))
      },
    },
  },
})
