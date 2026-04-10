/**
 * Example custom hook
 * Demonstrates hook structure following CLAUDE.md conventions
 *
 * Real hooks should:
 * - Use camelCase naming with 'use' prefix
 * - Be placed in src/hooks/ for global hooks
 * - Be placed in features/[feature]/hooks/ for feature-specific hooks
 */

import { useState, useCallback } from 'react'

export function useExample() {
  const [value, setValue] = useState<string>('')

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue)
  }, [])

  return { value, handleChange }
}
