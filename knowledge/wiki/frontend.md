# Frontend Development Guide

## Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool & dev server |
| Tailwind CSS | 4.2 | Utility-first styling |
| shadcn/ui | Latest | Component library |
| Axios | Latest | HTTP client |
| Zustand | Latest | State management |
| React Query | Latest | Data fetching and caching |
| React Router | v7 | Client-side routing |

## Project Structure

``
frontend/src/
├── app/                    # Application entry point
│   ├── main.tsx           # React DOM render
│   ├── App.tsx            # Root component & router
│   └── providers.tsx      # Global providers (theme, state, etc)
│
├── components/
│   ├── ui/                # shadcn/ui generated components (DO NOT EDIT)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── shared/            # Custom reusable components
│       ├── navbar.tsx
│       ├── sidebar.tsx
│       └── ...
│
├── features/              # Feature-based modules
│   ├── products/
│   │   ├── components/
│   │   │   ├── product-list.tsx
│   │   │   ├── product-form.tsx
│   │   │   └── product-detail.tsx
│   │   ├── hooks/
│   │   │   └── use-products.ts
│   │   ├── services/
│   │   │   └── product.service.ts
│   │   └── types/
│   │       └── product.types.ts
│   └── users/
│       └── ... (same structure)
│
├── hooks/                 # Global custom hooks
│   ├── use-auth.ts       # Authentication context
│   ├── use-toast.ts      # Toast notifications
│   └── use-theme.ts      # Theme switcher
│
├── lib/                   # Utilities & helpers
│   ├── utils.ts          # Tailwind cn() and other helpers
│   ├── api-client.ts     # Axios instance with auth
│   └── constants.ts      # Global constants
│
├── services/              # Data fetching & API layer
│   ├── api-client.ts     # HTTP client setup
│   ├── product.service.ts
│   └── user.service.ts
│
├── stores/                # State management (Zustand/Jotai)
│   └── auth.store.ts
│
├── styles/                # Global styles
│   ├── index.css          # Global CSS with Tailwind imports
│   └── theme.css          # Theme variables
│
├── types/                 # Global TypeScript types
│   ├── api.types.ts       # API response/request types
│   └── domain.types.ts    # Domain model types
│
└── index.css              # Entry stylesheet
```

## Naming Conventions

```typescript
// ✅ Components (PascalCase, .tsx)
export function UserProfileCard() { }
export function ProductForm() { }

// ✅ Hooks (camelCase, use prefix, .ts)
export function useUserProfile() { }
export function useProductForm() { }

// ✅ Services (camelCase, Service suffix, .ts)
export const userService = { ... }
export const productService = { ... }

// ✅ Types (PascalCase, Dto suffix, .ts)
type UserProfileDto = { ... }
type ProductDto = { ... }

// ✅ Files (kebab-case)
// user-profile-card.tsx
// use-user-profile.ts
// user.service.ts
// user.types.ts
```

## Tailwind CSS v4.2

### ⚠️ Critical: New Syntax

Tailwind v4 uses a completely new syntax. **Never use v3 directives.**

```css
/* ✅ CORRECT — Tailwind v4 */
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --color-primary-foreground: #ffffff;
  --font-sans: "GeistSans", sans-serif;
  --radius: 0.5rem;
}

/* ❌ WRONG — Do NOT use this (Tailwind v3) */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Using Custom CSS Variables

```css
/* Define in styles/index.css */
@theme {
  --color-primary: #6366f1;
}

/* Use in TypeScript */
<div className="bg-[var(--color-primary)]">
  Styled with CSS variable
</div>
```

### Arbitrary Values Still Work

```jsx
<div className="bg-[#ff0000] w-[200px] grid-cols-[1fr,2fr]">
  Content
</div>
```

## shadcn/ui Components

### Adding New Components

```bash
# From frontend/ directory
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add data-table
```

### Using Components

```typescript
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function MyComponent() {
  return (
    <>
      <Button onClick={() => alert('Clicked')}>
        Click me
      </Button>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <h2>Dialog Content</h2>
        </DialogContent>
      </Dialog>
    </>
  )
}
```

### Customization

**Never edit files in `components/ui/`** — they are auto-generated.

Customize via:
1. **Tailwind classes:** `<Button className="text-xl font-bold">`
2. **CSS variables in @theme:** Update in `styles/index.css`
3. **Component props:** Use variant, size, disabled, etc props

### Available Components

Run this to see all available:
```bash
npx shadcn@latest list
```

Popular ones: button, card, dialog, input, label, form, table, dropdown-menu, sheet, etc.

## API Integration with React Query

### Overview

**All API calls use React Query (TanStack Query) for automatic caching, background refetching, and data synchronization.**

Benefits:
- ✅ Automatic caching and request deduplication
- ✅ Background refetching when window regains focus
- ✅ Automatic retry on failure with exponential backoff
- ✅ Built-in loading/error states
- ✅ Cache invalidation on mutations
- ✅ React Query DevTools for debugging
- ✅ No manual state management for server state

### Setup

**1. QueryClient Configuration**

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes (cache time)
      retry: 1,                         // Retry once on failure
      refetchOnWindowFocus: true,       // Refetch when tab regains focus
      refetchOnMount: true,             // Refetch on component remount
    },
    mutations: {
      retry: 1,
    },
  },
})
```

**2. Wrap App with Provider**

```typescript
// app/main.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { Providers } from './providers'

// In Providers component:
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
```

### Creating Data Hooks

**1. Define Query Keys**

```typescript
// features/products/hooks/use-products.ts
export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (filters: object) => [...productQueryKeys.lists(), { filters }] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...productQueryKeys.details(), id] as const,
}
```

**2. Create Query Hooks**

```typescript
// features/products/hooks/use-products.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services/api-client'

export function useProducts(skip = 0, take = 10) {
  return useQuery({
    queryKey: productQueryKeys.list({ skip, take }),
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<ProductDto>>(
        '/api/app/products',
        { params: { skip, take } }
      )
      return response.data
    },
  })
}

export function useProduct(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: productQueryKeys.detail(id || ''),
    queryFn: async () => {
      const response = await apiClient.get<ProductDto>(`/api/app/products/${id}`)
      return response.data
    },
    enabled: enabled && !!id, // Only fetch if id exists
  })
}
```

**3. Create Mutation Hooks**

```typescript
// features/products/hooks/use-products.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProductDto) => {
      const response = await apiClient.post<ProductDto>('/api/app/products', input)
      return response.data
    },
    onSuccess: () => {
      // Invalidate list so it refetches
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateProductDto> }) => {
      const response = await apiClient.put<ProductDto>(`/api/app/products/${id}`, data)
      return response.data
    },
    onSuccess: (data) => {
      // Update specific product cache
      queryClient.setQueryData(productQueryKeys.detail(data.id), data)
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/app/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() })
    },
  })
}
```

### Using Hooks in Components

```typescript
// features/products/components/product-list.tsx
import { useProducts, useCreateProduct, useDeleteProduct } from '../hooks/use-products'
import { Button } from '@/components/ui/button'

export function ProductList() {
  const { data, isLoading, error } = useProducts(0, 10)
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: deleteProduct } = useDeleteProduct()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <table>
        <tbody>
          {data?.items.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                <Button
                  onClick={() => deleteProduct(product.id)}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        onClick={() => createProduct({ name: 'New Product', price: 99.99 })}
        disabled={isCreating}
      >
        {isCreating ? 'Creating...' : 'Create Product'}
      </Button>
    </div>
  )
}
```

### API Client Setup

```typescript
// lib/api-client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:44300',
  headers: { 'Content-Type': 'application/json' }
})

// JWT token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## State Management with Zustand

**Use Zustand ONLY for client state (UI state, preferences, etc.), NOT for server state.**

```typescript
// stores/ui.store.ts
import { create } from 'zustand'

type UIStore = {
  sidebarOpen: boolean
  toggleSidebar: () => void
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  darkMode: false,
  setDarkMode: (dark) => set({ darkMode: dark }),
}))

// In component
export function Header() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  
  return <button onClick={toggleSidebar}>{sidebarOpen ? 'Hide' : 'Show'}</button>
}
```

**❌ DON'T use Zustand for server data:**
```typescript
// WRONG: Don't do this!
const store = create((set) => ({
  products: [],
  fetchProducts: async () => {
    const data = await apiClient.get('/api/app/products')
    set({ products: data })
  }
}))

// RIGHT: Use React Query instead!
const { data: products } = useProducts()
```

## Routing with React Router v7

```typescript
// app/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/features/home'
import { ProductPage } from '@/features/products'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## TypeScript Best Practices

```typescript
// ✅ Prefer interfaces for contracts
interface ProductDto {
  id: string
  name: string
  price: number
}

// ✅ Use strict null checks
const product: ProductDto | null = await getProduct(id)
if (product) {
  console.log(product.name)
}

// ✅ Avoid any
// ❌ let data: any = response.data
// ✅ let data: ProductDto = response.data

// ✅ Use discriminated unions
type Response<T> = 
  | { status: 'success', data: T }
  | { status: 'error', error: string }
```

## Performance Tips

1. **Lazy load routes:** `const ProductPage = lazy(() => import('@/features/products'))`
2. **Memoize components:** `export const ProductCard = memo(function ProductCard() {})`
3. **Use useCallback for handlers:** `const handleClick = useCallback(() => {}, [])`
4. **Image optimization:** Use `<img src={url} loading="lazy" />`
5. **Bundle analysis:** `npm run build -- --analyze`

## Testing

```typescript
// features/products/product-list.test.tsx
import { render, screen } from '@testing-library/react'
import { ProductList } from './product-list'

describe('ProductList', () => {
  it('renders product list', () => {
    render(<ProductList />)
    expect(screen.getByText('Products')).toBeInTheDocument()
  })
})
```

## Debugging

```typescript
// Use React DevTools extension
// Chrome: React Developer Tools extension
// Firefox: React DevTools extension

// Use console debugging
console.log('Debug value:', value)

// Use debugger
debugger;
```
