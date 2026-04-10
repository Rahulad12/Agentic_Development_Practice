/**
 * Runtime Environment Configuration
 *
 * This file runs BEFORE the React app loads and sets up environment variables
 * dynamically at runtime. This allows you to change environment configuration
 * without rebuilding the application.
 *
 * Usage:
 * 1. In index.html: <script src="/runtime-env.js"></script> (before main app script)
 * 2. In your app: window.__RUNTIME_CONFIG__ contains all env vars
 * 3. Or import from: src/config/runtime-config.ts
 *
 * Environment Variable Priority:
 * 1. Server-provided config (if available)
 * 2. Import.meta.env (build-time Vite variables)
 * 3. Defaults
 */

(function initializeRuntimeEnv() {
  // Create global config object
  window.__RUNTIME_CONFIG__ = window.__RUNTIME_CONFIG__ || {}

  /**
   * Helper to get environment variable with fallback
   * @param {string} key - Environment variable name
   * @param {string} defaultValue - Default value if not found
   * @returns {string} Environment value or default
   */
  function getEnvVar(key, defaultValue) {
    // 1. Check if provided by server (e.g., in HTML data attribute or global var)
    if (window.__RUNTIME_CONFIG__[key]) {
      return window.__RUNTIME_CONFIG__[key]
    }

    // 2. Check import.meta.env (build-time variables)
    // Note: These are injected by Vite at build time
    const viteEnvKey = `VITE_${key}`
    if (import.meta?.env?.[viteEnvKey]) {
      return import.meta.env[viteEnvKey]
    }

    // 3. Return default or empty string
    return defaultValue || ''
  }

  /**
   * API Configuration
   */
  const apiBaseUrl =
    getEnvVar('API_BASE_URL') ||
    (import.meta.env.MODE === 'development'
      ? 'https://localhost:44300'
      : 'https://api.example.com')

  const apiTimeout = parseInt(getEnvVar('API_TIMEOUT', '30000'))

  /**
   * Application Configuration
   */
  const appName = getEnvVar('APP_NAME', 'AMNIL Research Claude')
  const appVersion = getEnvVar('APP_VERSION', '0.1.0')
  const environment = import.meta.env.MODE || 'development'
  const isDevelopment = environment === 'development'
  const isProduction = environment === 'production'

  /**
   * Analytics Configuration (optional)
   */
  const analyticsEnabled = getEnvVar('ANALYTICS_ENABLED', 'false') === 'true'
  const analyticsId = getEnvVar('ANALYTICS_ID', '')

  /**
   * Feature Flags (optional)
   */
  const enableDevTools = isDevelopment || getEnvVar('ENABLE_DEV_TOOLS', 'false') === 'true'
  const enableLogging = isDevelopment || getEnvVar('ENABLE_LOGGING', 'false') === 'true'

  /**
   * Build the runtime configuration object
   */
  const runtimeConfig = {
    // API
    api: {
      baseUrl: apiBaseUrl,
      timeout: apiTimeout,
    },

    // App
    app: {
      name: appName,
      version: appVersion,
      environment,
      isDevelopment,
      isProduction,
    },

    // Analytics
    analytics: {
      enabled: analyticsEnabled,
      id: analyticsId,
    },

    // Feature Flags
    features: {
      devTools: enableDevTools,
      logging: enableLogging,
    },

    // Raw env object for direct access if needed
    __raw: {
      VITE_API_BASE_URL: getEnvVar('API_BASE_URL'),
      VITE_API_TIMEOUT: getEnvVar('API_TIMEOUT'),
      VITE_APP_NAME: getEnvVar('APP_NAME'),
      VITE_ANALYTICS_ID: getEnvVar('ANALYTICS_ID'),
    },
  }

  // Assign to window for global access
  window.__RUNTIME_CONFIG__ = runtimeConfig

  // Log in development
  if (isDevelopment && enableLogging) {
    console.log('[Runtime Config] Environment loaded:', {
      environment: runtimeConfig.app.environment,
      apiBaseUrl: runtimeConfig.api.baseUrl,
      isDevelopment: runtimeConfig.app.isDevelopment,
      devToolsEnabled: runtimeConfig.features.devTools,
    })
  }

  // Dispatch event so app can know config is ready
  if (typeof window.CustomEvent === 'function') {
    window.dispatchEvent(
      new CustomEvent('__RUNTIME_CONFIG_READY__', { detail: runtimeConfig })
    )
  }
})()

/**
 * TypeScript type definition
 * Add this to your src/global.d.ts:
 *
 * declare global {
 *   interface Window {
 *     __RUNTIME_CONFIG__: {
 *       api: {
 *         baseUrl: string
 *         timeout: number
 *       }
 *       app: {
 *         name: string
 *         version: string
 *         environment: 'development' | 'production'
 *         isDevelopment: boolean
 *         isProduction: boolean
 *       }
 *       analytics: {
 *         enabled: boolean
 *         id: string
 *       }
 *       features: {
 *         devTools: boolean
 *         logging: boolean
 *       }
 *       __raw: Record<string, string>
 *     }
 *   }
 * }
 */
