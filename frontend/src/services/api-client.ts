/**
 * API Client Setup
 *
 * This file:
 * - Creates an Axios instance with base configuration
 * - Uses runtime configuration from public/runtime-env.js
 * - Adds JWT authentication interceptor
 * - Handles 401 errors (token expiration)
 * - Exports for use with React Query hooks
 *
 * Configuration Priority:
 * 1. Runtime config from window.__RUNTIME_CONFIG__ (set by runtime-env.js)
 * 2. Build-time env from import.meta.env.VITE_API_BASE_URL
 * 3. Default: https://localhost:44300
 */

import axios from 'axios'
import { config } from '@/config/runtime-config'

// Get API base URL from runtime configuration
// This allows changing the API URL without rebuilding the app
const apiBaseUrl = config.apiBaseUrl() || 'https://localhost:44300'
const apiTimeout = config.apiTimeout() || 30000

/**
 * Axios instance configured with:
 * - Base URL from runtime configuration
 * - Request timeout from runtime configuration
 * - Content-Type header
 * - JWT authentication interceptor
 * - Error handling for 401 responses
 */
export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: apiTimeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor: Add JWT token from localStorage to all requests
 */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Response interceptor: Handle authentication errors
 * - 401: Clear token and redirect to login
 * - Other errors: Pass through to caller
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear and redirect to login
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
