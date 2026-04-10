/**
 * Root Application Component
 */

import { RouterProvider } from 'react-router'
import { JSX } from 'react'
import { router } from './routes'

/**
 * App Component
 *
 * Main application component with routing setup
 */
export function App(): JSX.Element {
  return (
    <RouterProvider router={router} />
  )
}

export default App
