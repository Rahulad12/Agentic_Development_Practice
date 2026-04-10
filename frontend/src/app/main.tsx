/**
 * Application Entry Point
 *
 * This is the main.tsx file that Vite uses to bootstrap the React application.
 * The runtime environment configuration (runtime-env.js) is loaded BEFORE this script.
 *
 * Vite + React 19 Setup:
 * - React 19 doesn't require importing React for JSX
 * - Uses React.createRoot() for concurrent features
 * - StrictMode enabled for development checks
 * - Providers wrapper for global context (React Query, etc.)
 */

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Providers } from './providers'
import '../styles/index.css'

// Get or create root element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found in index.html')
}

// Create React root with concurrent features
const root = ReactDOM.createRoot(rootElement)

// Render app with providers
root.render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
