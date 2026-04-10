/**
 * Runtime Configuration
 *
 * Type-safe access to runtime environment variables loaded by public/runtime-env.js
 * This file provides TypeScript types and helpers to access configuration.
 */

/**
 * Runtime configuration type definition
 * Matches the structure created in public/runtime-env.js
 */
export interface RuntimeConfig {
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
 * Get the runtime configuration
 * Safe to call after app has mounted (runtime-env.js runs first)
 */
export function getRuntimeConfig(): RuntimeConfig {
  // Get from window, or use defaults if not yet loaded
  return (
    (window as any).__RUNTIME_CONFIG__ || {
      api: {
        baseUrl: 'https://localhost:44300',
        timeout: 30000,
      },
      app: {
        name: 'AMNIL Research Claude',
        version: '0.1.0',
        environment: 'development',
        isDevelopment: true,
        isProduction: false,
      },
      analytics: {
        enabled: false,
        id: '',
      },
      features: {
        devTools: true,
        logging: true,
      },
      __raw: {},
    }
  )
}

/**
 * Wait for runtime config to be ready
 * Useful if you need to access config before it's loaded
 */
export function onRuntimeConfigReady(): Promise<RuntimeConfig> {
  return new Promise((resolve) => {
    const config = getRuntimeConfig()

    // If config is already loaded (has api.baseUrl set), resolve immediately
    if (config.api.baseUrl) {
      resolve(config)
      return
    }

    // Otherwise wait for the custom event
    const handler = (event: any) => {
      window.removeEventListener('__RUNTIME_CONFIG_READY__', handler)
      resolve(event.detail)
    }

    window.addEventListener('__RUNTIME_CONFIG_READY__', handler)

    // Timeout after 5 seconds
    setTimeout(() => {
      window.removeEventListener('__RUNTIME_CONFIG_READY__', handler)
      resolve(getRuntimeConfig())
    }, 5000)
  })
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
  apiBaseUrl: () => getRuntimeConfig().api.baseUrl,

  /**
   * Get API timeout in milliseconds
   */
  apiTimeout: () => getRuntimeConfig().api.timeout,

  /**
   * Check if running in development mode
   */
  isDev: () => getRuntimeConfig().app.isDevelopment,

  /**
   * Check if running in production mode
   */
  isProd: () => getRuntimeConfig().app.isProduction,

  /**
   * Check if dev tools are enabled
   */
  hasDevTools: () => getRuntimeConfig().features.devTools,

  /**
   * Check if logging is enabled
   */
  hasLogging: () => getRuntimeConfig().features.logging,

  /**
   * Check if analytics is enabled
   */
  hasAnalytics: () => getRuntimeConfig().analytics.enabled,

  /**
   * Get analytics ID
   */
  analyticsId: () => getRuntimeConfig().analytics.id,

  /**
   * Get app name
   */
  appName: () => getRuntimeConfig().app.name,

  /**
   * Get app version
   */
  appVersion: () => getRuntimeConfig().app.version,
}

/**
 * Global type augmentation for window.__RUNTIME_CONFIG__
 */
declare global {
  interface Window {
    __RUNTIME_CONFIG__: RuntimeConfig
  }
}
