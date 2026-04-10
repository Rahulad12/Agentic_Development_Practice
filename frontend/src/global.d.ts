/**
 * Global Type Definitions
 *
 * TypeScript type definitions for global objects and variables
 */

/**
 * Runtime configuration type
 * Defined by public/runtime-env.js
 */
interface RuntimeConfig {
  api: {
    baseUrl: string
    timeout: number
  }
  app: {
    name: string
    version: string
    environment: 'development' | 'production'
    isDevelopment: boolean
    isProduction: boolean
  }
  analytics: {
    enabled: boolean
    id: string
  }
  features: {
    devTools: boolean
    logging: boolean
  }
  __raw: Record<string, string>
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

/**
 * Import.meta.env type definitions for Vite
 * These are injected at build time by Vite
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_TIMEOUT?: string
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_ANALYTICS_ID?: string
  readonly VITE_ENABLE_DEV_TOOLS?: string
  readonly VITE_ENABLE_LOGGING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
