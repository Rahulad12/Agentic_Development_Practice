/**
 * Runtime Configuration
 *
 * Type-safe access to runtime environment variables loaded by public/runtime-env.js
 * This file provides TypeScript types and helpers to access configuration.
 */

import { RuntimeConfig } from "@/global"

/**
 * Get the runtime configuration
 * Safe to call after app has mounted (runtime-env.js runs first)
 */
export function getRuntimeConfig(): RuntimeConfig {
  // Get from window, or use defaults if not yet loaded
  return window.__RUNTIME_CONFIG__ as RuntimeConfig
}

/**
 * Convenience helpers for common config values
 */
export const config = {
  /**
   * Get API base URL
   * @example
   * const url = `${config.apiBaseUrl()}/api/app/products`
   */
  apiBaseUrl: () => getRuntimeConfig().VITE_API_BASE_URL,

  /**
   * Get API timeout in milliseconds
   */
  apiTimeout: () => getRuntimeConfig().timeout,
}
