/**
 * Global Type Definitions
 *
 * TypeScript type definitions for global objects and variables
 */

/**
 * Runtime configuration type
 * Defined by public/runtime-env.js
 */
export interface RuntimeConfig {
  timeout: number
  VITE_API_BASE_URL: string
}

/**
 * Extend Window interface with custom properties
 */
declare global {
  interface Window {
    /**
     * Runtime configuration loaded by public/runtime-env.js
     * Available after app initializes
     */
    __RUNTIME_CONFIG__: RuntimeConfig
  }
}

export {}
