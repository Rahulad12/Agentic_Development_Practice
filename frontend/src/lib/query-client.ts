/**
 * React Query / TanStack Query Configuration
 *
 * This file sets up the QueryClient with sensible defaults for API caching,
 * refetching, and error handling.
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long (in ms) until query is considered stale
      staleTime: 1000 * 60 * 5, // 5 minutes

      // How long to keep unused data in cache (in ms)
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)

      // Number of retry attempts on failure
      retry: 1,

      // Delay between retries in ms
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Always refetch when window regains focus
      refetchOnWindowFocus: true,

      // Refetch when component remounts
      refetchOnMount: true,
    },
    mutations: {
      // Number of retry attempts on failure
      retry: 1,

      // Delay between retries in ms
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
