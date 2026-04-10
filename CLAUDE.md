# CLAUDE.md — Monorepo Project Context

> This file is loaded at the start of every Claude session.
> Read this fully before making any changes to the codebase.

---

## 🧠 Project Overview

- **Type:** Monorepo (Frontend + Backend)
- **Goal:** [FILL IN — what does this project do?]
- **Current Phase:** 🚧 Setup / Planning
- **Last Updated:** 2026-04-10

---

## 📁 Monorepo Structure

```
root/
├── CLAUDE.md                  ← You are here
├── .agentic/
│   ├── rules.md               ← Global rules all agents must follow
│   ├── context.md             ← Persistent session context
│   └── state.json             ← Current project state
│
├── frontend/                  ← Vite + React + Tailwind 4.2 + shadcn/ui
│   ├── src/
│   │   ├── app/               ← App entry, providers, router
│   │   ├── components/
│   │   │   ├── ui/            ← shadcn/ui generated components (DO NOT edit manually)
│   │   │   └── shared/        ← Custom shared components
│   │   ├── features/          ← Feature-based modules
│   │   │   └── [feature]/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── services/
│   │   │       └── types/
│   │   ├── hooks/             ← Global custom hooks
│   │   ├── lib/               ← Utilities, helpers, constants
│   │   ├── services/          ← API service layer (calls to backend)
│   │   ├── stores/            ← State management (Zustand / Jotai)
│   │   ├── styles/            ← Global styles, Tailwind config
│   │   └── types/             ← Global TypeScript types
│   ├── public/
│   ├── components.json        ← shadcn/ui config
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                   ← .NET ABP Framework
│   ├── src/
│   │   ├── MyApp.Domain/              ← Entities, domain services, repos interfaces
│   │   ├── MyApp.Domain.Shared/       ← Shared consts, enums, DTOs (used by all layers)
│   │   ├── MyApp.Application/         ← App services, DTOs, mapping profiles
│   │   ├── MyApp.Application.Contracts/← App service interfaces + DTOs (API contracts)
│   │   ├── MyApp.EntityFrameworkCore/ ← EF Core DbContext, migrations, repo implementations
│   │   ├── MyApp.HttpApi/             ← Controllers (thin — delegate to App services)
│   │   ├── MyApp.HttpApi.Host/        ← ASP.NET Core startup, middleware, DI
│   │   └── MyApp.DbMigrator/          ← DB migration runner + seed data
│   ├── test/
│   │   ├── MyApp.Domain.Tests/
│   │   ├── MyApp.Application.Tests/
│   │   └── MyApp.HttpApi.Tests/
│   └── MyApp.sln
│
├── docs/
│   ├── architecture.md
│   ├── decisions/             ← ADRs (Architecture Decision Records)
│   └── api/                   ← API documentation
│
├── knowledge/
│   └── wiki/
│       ├── README.md
│       ├── frontend.md
│       ├── backend.md
│       └── conventions.md
│
└── scripts/
    ├── setup.sh
    ├── dev.sh                 ← Start both frontend and backend
    └── build.sh
```

---

## 🖥️ Frontend Stack

| Tool | Version | Notes |
|------|---------|-------|
| **React** | 19.x | No React import needed in JSX, concurrent features enabled |
| **Vite** | 6.x | Build tool and dev server with runtime env support |
| **TypeScript** | 5.x | Strict mode enabled |
| **Tailwind CSS** | 4.2 | New `@import "tailwindcss"` syntax |
| **shadcn/ui** | Latest | Component library built on Radix UI |
| **Axios** | Latest | HTTP client for API calls |
| **Zustand** | Latest | State management |
| **React Query** | Latest | Data fetching and caching |
| **React Router** | v7 | File-based or config-based routing |

### ⚠️ Tailwind 4.2 — Critical Differences
Tailwind v4 uses a completely new syntax. Always follow these rules:

```css
/* ✅ CORRECT — Tailwind v4 */
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --color-primary-foreground: #ffffff;
  --font-sans: "GeistSans", sans-serif;
  --radius: 0.5rem;
}

/* ❌ WRONG — This is Tailwind v3 syntax, do NOT use */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- No `tailwind.config.js` for theme — use `@theme {}` in CSS
- CSS variables are auto-generated from `@theme` tokens
- Use `var(--color-primary)` in custom CSS
- Arbitrary values still work: `bg-[#ff0000]`

### shadcn/ui Rules
- Components live in `frontend/src/components/ui/`
- **NEVER manually edit files in `components/ui/`** — they are generated
- Add new components via MCP or CLI: `npx shadcn@latest add button`
- Customize via Tailwind classes and CSS variables, not by editing source
- `components.json` controls paths — do not change without updating all imports
- Always check if a shadcn component exists before building a custom one

### shadcn MCP Usage
When using the shadcn MCP server:
- Use it to add, list, and check available components
- Always run adds from the `frontend/` directory
- After adding, import from `@/components/ui/[component]`

### Runtime Environment Configuration — Dynamic Configuration Without Rebuilding

**Setup:** `public/runtime-env.js` loads BEFORE React app and sets `window.__RUNTIME_CONFIG__`

```typescript
// ✅ USE — Access config dynamically
import { config } from '@/config/runtime-config'

export function Settings() {
  const apiUrl = config.apiBaseUrl()
  const isDev = config.isDev()
  const appVersion = config.appVersion()
  
  return <div>{apiUrl}</div>
}
```

**Configuration Priority:**
1. **Server-provided config** (if available)
2. **Environment variables** (build-time `VITE_*` from Vite)
3. **Defaults** (in `public/runtime-env.js`)

**Available Variables:**
- `VITE_API_BASE_URL` — Backend API endpoint
- `VITE_API_TIMEOUT` — Request timeout (ms)
- `VITE_APP_NAME` — Application name
- `VITE_APP_VERSION` — Application version
- `VITE_ANALYTICS_ID` — Analytics tracking ID
- `VITE_ENABLE_DEV_TOOLS` — Show React Query DevTools
- `VITE_ENABLE_LOGGING` — Console logging

**Deployment:** Change env vars without rebuilding
```bash
# Docker
docker run -e VITE_API_BASE_URL=https://api.prod.com myapp

# Docker Compose
environment:
  - VITE_API_BASE_URL=https://api.staging.com

# GitHub Actions
env:
  VITE_API_BASE_URL: https://api.k8s.local
```

**Files:**
- `public/runtime-env.js` — Sets up `window.__RUNTIME_CONFIG__` (loads FIRST)
- `src/config/runtime-config.ts` — Type-safe access helpers
- `src/global.d.ts` — TypeScript type definitions
- `.env.example` — Documents all env variables

### React 19 — Latest React Features

**Key Differences from React 18:**

```typescript
// ❌ React 18 — React import required
import React from 'react'
function Component() { return <div>Test</div> }

// ✅ React 19 — No React import needed
function Component() { return <div>Test</div> }
```

**New Hooks in React 19:**
- `useActionState` — For server actions & form state
- `useFormStatus` — Get form submission status
- `useOptimistic` — Optimistic updates before server response

**Auto Batching:** All state updates batched automatically
```typescript
setState1()  // Batched
setState2()  // Batched
setState3()  // Single re-render
```

### React Query (TanStack Query) — Data Fetching & Caching

**All API calls use React Query for automatic caching, background refetching, and state management.**

```typescript
// ✅ CORRECT — Use React Query hooks
import { useProducts, useProduct, useCreateProduct } from '@/features/products/hooks'

export function ProductList() {
  const { data, isLoading, error } = useProducts(skip: 0, take: 10)
  const { mutate: createProduct } = useCreateProduct()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <>
      {data?.items.map(p => <div key={p.id}>{p.name}</div>)}
      <button onClick={() => createProduct({ name: 'New', price: 99 })}>
        Create
      </button>
    </>
  )
}

// ❌ WRONG — Don't use Axios directly
// const products = await apiClient.get('/api/app/products')
// const [products, setProducts] = useState([])
// useEffect(() => { apiClient.get(...).then(setProducts) }, [])
```

**Key Patterns:**

1. **Query Hooks** — For data fetching with caching
   ```typescript
   const { data, isLoading, error, isPending } = useProducts()
   ```

2. **Mutation Hooks** — For create/update/delete with cache invalidation
   ```typescript
   const { mutate, isPending, error } = useCreateProduct()
   mutate({ name: 'Product', price: 99 })
   ```

3. **Query Keys** — Hierarchical structure for cache management
   ```typescript
   const queryKeys = {
     all: ['products'],
     lists: () => [...queryKeys.all, 'list'],
     list: (filters) => [...queryKeys.lists(), { filters }],
     detail: (id) => [...queryKeys.all, 'detail', id],
   }
   ```

4. **Setup** — App wrapped with QueryClientProvider
   ```typescript
   // src/app/main.tsx
   <QueryClientProvider client={queryClient}>
     <App />
   </QueryClientProvider>
   ```

**Benefits:**
- ✅ Automatic caching and deduplication
- ✅ Background refetching when window regains focus
- ✅ Automatic retry on failure
- ✅ Built-in loading/error states
- ✅ React Query Devtools for debugging
- ✅ Cache invalidation on mutations

### Frontend Conventions
```typescript
// ✅ Component naming — PascalCase
export function UserProfileCard() {}

// ✅ Hook naming — camelCase with "use" prefix
export function useUserProfile() {}
export function useProducts() {}  // Data fetching hooks use React Query

// ✅ Service naming — camelCase with "Service" suffix
export const userService = { ... }  // Use sparingly; prefer React Query

// ✅ Type naming — PascalCase with descriptive names
type UserProfileDto = { ... }

// ✅ File naming — kebab-case
// user-profile-card.tsx
// use-user-profile.ts
```

---

## 🔧 Backend Stack

| Tool | Version | Notes |
|------|---------|-------|
| **.NET** | 9.0 | Latest LTS |
| **ABP Framework** | 8.x | `Volo.Abp.*` packages |
| **EF Core** | 9.x | Code-first migrations |
| **SQL Server / PostgreSQL** | — | [FILL IN which DB] |
| **AutoMapper** | Via ABP | Object mapping |
| **Swagger / OpenAPI** | Via ABP | Auto-generated API docs |

### ABP Layer Rules — CRITICAL

#### Domain Layer (`MyApp.Domain`)
- Contains **Entities**, **Aggregates**, **Domain Services**, **Repository Interfaces**
- Entities inherit from `Entity<TKey>` or `AggregateRoot<TKey>`
- Business logic lives HERE, not in application services
- No dependency on Application or Infrastructure layers

```csharp
// ✅ Correct — Entity in Domain layer
public class Product : AuditedAggregateRoot<Guid>
{
    public string Name { get; private set; }
    public decimal Price { get; private set; }

    // Domain logic inside the entity
    public void UpdatePrice(decimal newPrice)
    {
        if (newPrice <= 0) throw new BusinessException("Price must be positive");
        Price = newPrice;
    }
}
```

#### Application Layer (`MyApp.Application`)
- Contains **Application Services** that orchestrate domain logic
- Uses **DTOs** for input/output (never expose domain entities directly)
- Implement interfaces defined in `Application.Contracts`
- Use `IRepository<>` — never use DbContext directly here

```csharp
// ✅ Correct — Application Service
public class ProductAppService : ApplicationService, IProductAppService
{
    private readonly IRepository<Product, Guid> _productRepository;

    public async Task<ProductDto> CreateAsync(CreateProductDto input)
    {
        var product = new Product(GuidGenerator.Create(), input.Name, input.Price);
        await _productRepository.InsertAsync(product);
        return ObjectMapper.Map<Product, ProductDto>(product);
    }
}
```

#### HttpApi Layer (`MyApp.HttpApi`)
- Controllers are **thin** — they only call application services
- Never put business logic in controllers
- ABP auto-generates API endpoints from App Services — prefer that over manual controllers

```csharp
// ✅ Correct — Thin controller
[Route("api/app/products")]
public class ProductController : AbpController, IProductAppService
{
    private readonly IProductAppService _productAppService;
    public async Task<ProductDto> CreateAsync(CreateProductDto input)
        => await _productAppService.CreateAsync(input);
}
```

#### Domain.Shared Layer
- Only contains: **Consts**, **Enums**, **Error codes**, **Localization keys**
- Zero dependencies on other layers
- Both frontend types and backend can reference these conventions

### Backend Conventions
```csharp
// Naming
- Entities: PascalCase noun (Product, OrderLine)
- App Services: [Entity]AppService
- DTOs: [Action][Entity]Dto (CreateProductDto, ProductDto)
- Repositories: I[Entity]Repository
- Migrations: descriptive names (Added_Product_Table)

// Always use
- GuidGenerator.Create() for new Guids (not Guid.NewGuid())
- CurrentUser for authenticated user info
- IRepository<> not DbContext in app layer
- async/await throughout
- ABP's ILogger, not Microsoft's directly
```

---

## 🔌 MCP Servers

| MCP Server | Purpose | When to Use |
|------------|---------|-------------|
| **shadcn/ui MCP** | Add/list shadcn components | Adding new UI components |

### shadcn MCP — Usage Guide
```bash
# List available components
mcp shadcn list

# Add a component
mcp shadcn add dialog
mcp shadcn add data-table

# Check component details
mcp shadcn info button
```

> Always verify component is not already installed before adding.
> After adding, check `frontend/src/components/ui/` for the new file.

---

## 🚀 Running the Project

```bash
# First time setup
./scripts/setup.sh

# Start everything (frontend + backend)
./scripts/dev.sh

# Frontend only
cd frontend && npm run dev          # http://localhost:5173

# Backend only
cd backend/src/MyApp.HttpApi.Host
dotnet run                          # https://localhost:44300
                                    # Swagger: https://localhost:44300/swagger

# Run DB migrations
cd backend/src/MyApp.DbMigrator
dotnet run
```

---

## 🌐 API Communication (Frontend ↔ Backend)

- Backend base URL (dev): `https://localhost:44300`
- Frontend API base URL env var: `VITE_API_BASE_URL`
- Authentication: ABP uses JWT Bearer tokens
- API prefix: `/api/app/` for app services, `/api/abp/` for ABP internals

```typescript
// frontend/src/services/api-client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

---

## 🚨 Global Rules (ALL Agents Must Follow)

1. **Never** edit files in `frontend/src/components/ui/` manually
2. **Never** put business logic in ABP Controllers or outside Domain layer
3. **Never** expose Domain Entities directly from API — always use DTOs
4. **Never** use `Guid.NewGuid()` — use `GuidGenerator.Create()`
5. **Never** call DbContext directly in Application layer — use `IRepository<>`
6. **Never** commit `.env` files or secrets
7. **Always** use `async/await` — no sync DB calls
8. **Always** run `dotnet build` after backend changes to verify no errors
9. **Always** use Tailwind v4 `@theme {}` syntax — never v3 `@tailwind` directives
10. **Always** check shadcn MCP for existing components before building custom ones

---

## 📋 Current Tasks

- [ ] Initialize monorepo folder structure
- [ ] Run `setup.sh` to bootstrap project
- [ ] Set up ABP project via ABP CLI
- [ ] Set up Vite + React + Tailwind 4.2 + shadcn
- [ ] Configure CORS between frontend and backend
- [ ] Set up first feature module (end-to-end)
- [ ] Write first eval test cases

---

## 📝 Architecture Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-04-10 | Monorepo structure | Single repo for easier cross-team coordination |
| 2026-04-10 | Tailwind v4.2 | Latest features, better CSS variable integration with shadcn |
| 2026-04-10 | ABP Framework | Enterprise-grade .NET patterns, built-in auth, multi-tenancy ready |

---

## ⚠️ Known Gotchas

### Frontend
- Tailwind v4 IntelliSense requires the `@tailwindcss/vite` plugin — not `postcss`
- shadcn components require `cn()` utility from `@/lib/utils`
- Vite needs `@vitejs/plugin-react` (not `react-swc`) for full compatibility

### Backend
- ABP module dependencies must be declared in `[Module].DependsOn()` attributes
- EF Core migrations must be added from `EntityFrameworkCore` project, not Host
- ABP permission system requires defining permissions in `[App]PermissionDefinitionProvider`
- Always seed data via `IDataSeedContributor`, not raw SQL

---

## 🔗 Key References

- Wiki: `knowledge/wiki/README.md`
- Architecture: `docs/architecture.md`
- Frontend conventions: `knowledge/wiki/frontend.md`
- Backend conventions: `knowledge/wiki/backend.md`
- ABP Docs: https://abp.io/docs
- shadcn/ui Docs: https://ui.shadcn.com
- Tailwind v4 Docs: https://tailwindcss.com/docs
- Vite Docs: https://vitejs.dev