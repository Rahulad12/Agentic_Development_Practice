/**
 * Product Data Hooks using React Query / TanStack Query
 *
 * This file demonstrates the recommended pattern for:
 * - Fetching lists with pagination and caching
 * - Fetching single items with caching
 * - Creating/updating items with mutations
 * - Automatic cache invalidation
 *
 * Benefits of React Query:
 * - Automatic caching and background refetching
 * - Request deduplication
 * - Error handling and retries
 * - Loading/error states
 * - Dev tools for debugging
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api-client'
import type { ProductDto, CreateProductDto, PaginatedResponse } from '@/types/api.types'

// ============================================================================
// Query Keys - Used for caching and cache invalidation
// ============================================================================

export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (filters: object) => [...productQueryKeys.lists(), { filters }] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
}

// ============================================================================
// Queries - Data fetching with automatic caching
// ============================================================================

/**
 * Fetch paginated list of products
 *
 * @example
 * const { data, isLoading, error } = useProducts({ skip: 0, take: 10 })
 *
 * @param skip - Number of items to skip
 * @param take - Number of items to return
 * @returns Query result with products list and pagination info
 */
export function useProducts(skip = 0, take = 10) {
  return useQuery({
    queryKey: productQueryKeys.list({ skip, take }),
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<ProductDto>>(
        '/api/app/products',
        { params: { skip, take } }
      )
      return response.data
    },
  })
}

/**
 * Fetch single product by ID
 *
 * @example
 * const { data: product, isLoading, error } = useProduct(productId)
 *
 * @param id - Product ID
 * @param enabled - Whether to fetch (useful for conditional queries)
 * @returns Query result with product details
 */
export function useProduct(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: productQueryKeys.detail(id || ''),
    queryFn: async () => {
      const response = await apiClient.get<ProductDto>(`/api/app/products/${id}`)
      return response.data
    },
    enabled: enabled && !!id, // Only fetch if id exists
  })
}

// ============================================================================
// Mutations - Data mutations with automatic cache invalidation
// ============================================================================

/**
 * Create a new product
 *
 * @example
 * const { mutate, isPending, error } = useCreateProduct()
 * mutate({ name: 'New Product', price: 99.99 })
 *
 * @returns Mutation result with mutation function, loading state, and error
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProductDto) => {
      const response = await apiClient.post<ProductDto>('/api/app/products', input)
      return response.data
    },
    onSuccess: () => {
      // Invalidate products list so it refetches
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() })
    },
  })
}

/**
 * Update an existing product
 *
 * @example
 * const { mutate, isPending, error } = useUpdateProduct()
 * mutate({ id: productId, data: { name: 'Updated', price: 89.99 } })
 *
 * @returns Mutation result with mutation function, loading state, and error
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateProductDto> }) => {
      const response = await apiClient.put<ProductDto>(`/api/app/products/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      // Update the specific product in cache
      queryClient.setQueryData(productQueryKeys.detail(data.id), data)
      // Invalidate products list so it refetches
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() })
    },
  })
}

/**
 * Delete a product
 *
 * @example
 * const { mutate, isPending, error } = useDeleteProduct()
 * mutate(productId)
 *
 * @returns Mutation result with mutation function, loading state, and error
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/app/products/${id}`)
    },
    onSuccess: () => {
      // Invalidate products list so it refetches
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() })
    },
  })
}
