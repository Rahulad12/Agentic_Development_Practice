/**
 * Root Application Component
 *
 * This is the main App component that:
 * - Sets up routing with React Router v7
 * - Defines all application routes
 * - Integrates with global providers (React Query, theme, etc.)
 *
 * The component is wrapped by:
 * 1. main.tsx: StrictMode (development checks)
 * 2. main.tsx: Providers (React Query, DevTools, etc.)
 * 3. App.tsx: BrowserRouter (client-side routing)
 *
 * React 19 Notes:
 * - No need to import React for JSX
 * - Component function exported as named export
 * - Props are typed via TypeScript
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../features/home/pages/home-page'
import '../styles/App.css'

/**
 * App Component
 *
 * Main application component with routing setup
 */
export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<HomePage />} />

        {/* Add more routes here */}
        {/* <Route path="/products" element={<ProductsPage />} /> */}
        {/* <Route path="/about" element={<AboutPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
