# Frontend Documentation

Quick reference for React 19 + Vite setup and React Query integration.

## 📚 Documentation Files

### 1. **REACT_19_RUNTIME_ENV_SETUP.md**
- React 19 upgrade (18.3 → 19.0)
- Runtime environment configuration system
- runtime-env.js for dynamic config without rebuilding
- Vite setup with proper main.tsx and App.tsx structure
- JSX without React imports
- New React 19 hooks (useActionState, useFormStatus, useOptimistic)
- Deployment guide (Docker, Docker Compose, Kubernetes)

**Use when:** Setting up React 19, configuring environment variables, deploying

### 2. **REACT_QUERY_INTEGRATION.md**
- React Query (TanStack Query) setup
- Query client configuration (5-min staleTime, 10-min gcTime)
- React Query hooks pattern (useProducts, useCreateProduct, etc.)
- Query key factory pattern
- Cache invalidation strategy
- Zustand for UI state (separate from server state)
- Performance improvements (~60% fewer API calls)
- Anti-patterns to avoid

**Use when:** Fetching data, caching, mutations, synchronizing with backend

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/              ← Vite entry point (main.tsx)
│   ├── components/       ← shadcn/ui + custom components
│   ├── features/         ← Feature modules (products, orders, etc.)
│   ├── hooks/            ← React hooks (data fetching + UI)
│   ├── lib/              ← Utilities and helpers
│   ├── services/         ← API client
│   ├── stores/           ← Zustand state (UI only, not server data)
│   ├── styles/           ← Tailwind CSS + global styles
│   ├── types/            ← TypeScript type definitions
│   └── config/           ← Runtime configuration
├── public/
│   └── runtime-env.js    ← Dynamic config loader
├── vite.config.ts        ← Vite configuration
├── tsconfig.json         ← TypeScript strict mode
├── tailwind.config.ts    ← Tailwind CSS v4 @theme syntax
├── components.json       ← shadcn/ui registry
└── package.json          ← Dependencies
```

## 🚀 Quick Start

### Development Server
```bash
cd frontend
npm run dev
# Opens http://localhost:5173
```

### Build for Production
```bash
npm run build
# Creates dist/ folder
```

### Environment Variables
Create `.env.local`:
```
VITE_API_BASE_URL=https://localhost:44300
VITE_API_TIMEOUT=30000
VITE_ENABLE_LOGGING=true
```

## 📋 Key Technologies

| Tech | Version | Purpose |
|------|---------|---------|
| React | 19 | UI framework |
| Vite | 6 | Build tool & dev server |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4.2 | Styling |
| shadcn/ui | Latest | Component library |
| React Query | 5.28 | Data fetching & caching |
| React Router | 7 | Routing |
| Zustand | Latest | UI state management |

## 💡 Common Tasks

### Add a new feature
1. Create `src/features/my-feature/` folder
2. Add `components/`, `hooks/`, `pages/`, `types/` subfolders
3. Create React Query hooks in `hooks/`
4. Create components using hooks
5. Add route to `src/app/App.tsx`

### Create API hooks
Follow pattern in `src/features/products/hooks/use-products.ts`:
1. Define query/mutation functions
2. Use React Query hooks (useQuery, useMutation)
3. Implement cache invalidation
4. Export hooks for components

### Use React Query in components
```typescript
import { useProducts } from '@/features/products/hooks/use-products'

export function MyComponent() {
  const { data, isLoading, error } = useProducts()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error!</div>
  
  return <div>{data?.items.length} products</div>
}
```

## 🔗 Related Documentation

- **CLAUDE.md** - Main project documentation
- **docs/INTEGRATION_GUIDE.md** - Frontend ↔ Backend testing
- **docs/PROJECT_COMPLETE.md** - Full project overview
- **knowledge/wiki/frontend.md** - React conventions

## 📝 Notes

- ✅ React 19: No React import needed for JSX
- ✅ Tailwind 4.2: Use `@theme {}` syntax, not v3 `@tailwind` directives
- ✅ shadcn/ui: Never manually edit `components/ui/`, use CLI to add
- ✅ React Query: Handles server state caching automatically
- ✅ Runtime config: Changes via environment variables without rebuild

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Vite not starting | Check `vite.config.ts` imports, run `npm install` |
| Type errors | Run `npm run type-check` |
| Tailwind not working | Check `@theme {}` syntax in CSS |
| API calls failing | Check `VITE_API_BASE_URL` in `.env.local` |
| React Query not caching | Check staleTime and query key factory |

---

**See REACT_19_RUNTIME_ENV_SETUP.md and REACT_QUERY_INTEGRATION.md for detailed guides.**
