/**
 * API Types
 * Demonstrates type structure following CLAUDE.md conventions
 *
 * Real types should:
 * - Use PascalCase with Dto suffix for data transfer objects
 * - Be in src/types/ for global types
 * - Be in features/[feature]/types/ for feature-specific types
 * - Include JSDoc comments for clarity
 */

/**
 * Standard API response envelope
 */
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  pageNumber: number
  pageSize: number
}

/**
 * Error response
 */
export interface ErrorResponse {
  code: string
  message: string
  details?: Record<string, unknown>
}

/**
 * Example product DTO
 */
export interface ProductDto {
  id: string
  name: string
  price: number
  description?: string
  createdAt: string
}

/**
 * Example create product request DTO
 */
export interface CreateProductDto {
  name: string
  price: number
  description?: string
}
