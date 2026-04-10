/**
 * Example Zustand Store
 * Demonstrates state management structure following CLAUDE.md conventions
 *
 * Real stores should:
 * - Use Zustand for global state management
 * - Have clear action methods
 * - Be typed with TypeScript
 * - Be in src/stores/ for global state
 */

import { create } from 'zustand'

interface ExampleStore {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

export const useExampleStore = create<ExampleStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))
