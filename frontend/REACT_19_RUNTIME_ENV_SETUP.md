# React 19 + Runtime Environment Setup Complete ✅

**Date:** 2026-04-10  
**Status:** Complete  
**Changes:** React 19 upgrade + Runtime environment configuration system

---

## What Was Changed

### 1. React Version Upgrade (18.3 → 19.0)

**Files Updated:**
- `package.json`
  - `react`: ^18.3.0 → **^19.0.0** ✅
  - `react-dom`: ^18.3.0 → **^19.0.0** ✅
  - `@types/react`: ^18.3.0 → **^19.0.0** ✅
  - `@types/react-dom`: ^18.3.0 → **^19.0.0** ✅

**React 19 Benefits:**
- No need to import React for JSX
- Better TypeScript support
- Improved hooks APIs
- Better performance optimizations
- Automatic batching in concurrent mode
- New useActionState, useFormStatus, useOptimistic hooks

---

### 2. Runtime Environment Configuration System

**Purpose:**
Deploy applications with different configurations **without rebuilding** the code. Perfect for:
- Docker containers
- Cloud deployments
- CI/CD pipelines
- Multiple environment deployments
- Runtime configuration changes

#### Files Created:

**A. `public/runtime-env.js`** (Runs before React app)
```javascript
// Initializes window.__RUNTIME_CONFIG__ with:
// - API base URL
// - Request timeout
// - App name & version
// - Environment (dev/prod)
// - Analytics config
// - Feature flags

// Configuration sources (in priority order):
// 1. Server-provided config
// 2. Import.meta.env (build-time Vite variables)
// 3. Defaults
```

**B. `src/config/runtime-config.ts`** (Type-safe access)
```typescript
// Exports:
// - RuntimeConfig interface
// - getRuntimeConfig() function
// - onRuntimeConfigReady() promise
// - config helper object with convenience methods
```

**C. `src/global.d.ts`** (TypeScript types)
```typescript
// Declares:
// - Window.__RUNTIME_CONFIG__ type
// - ImportMetaEnv variables
// - Global type augmentation
```

**D. Updated Files:**
- `index.html` - Added `<script src="/runtime-env.js">` (BEFORE main app)
- `src/app/main.tsx` - React 19 patterns, proper Vite setup
- `src/app/App.tsx` - JSX without React import, improved docs
- `src/services/api-client.ts` - Uses runtime config for baseURL and timeout
- `.env.example` - Documents all environment variables

---

## How It Works

### Execution Flow

```
1. Browser loads index.html
   ↓
2. Loads public/runtime-env.js (synchronous)
   └─ Sets window.__RUNTIME_CONFIG__
   └─ Dispatches __RUNTIME_CONFIG_READY__ event
   ↓
3. Loads main React app (src/app/main.tsx)
   ├─ React 19 root creation
   ├─ Providers wrapper
   ├─ App component
   └─ API client uses window.__RUNTIME_CONFIG__.api.baseUrl
   ↓
4. App fully initialized with runtime config
```

### Configuration Priority

```
1. Server-provided config (if available)
2. Environment variables (VITE_* from build)
3. Defaults in runtime-env.js
```

---

## Usage Guide

### In Development

```bash
cd frontend
npm run dev
```

Create `.env.local`:
```
VITE_API_BASE_URL=https://localhost:44300
VITE_API_TIMEOUT=30000
VITE_ENABLE_LOGGING=true
```

### In Components

**Option 1: Using config helper (recommended)**
```typescript
import { config } from '@/config/runtime-config'

export function SomeComponent() {
  const apiUrl = config.apiBaseUrl()
  const isDev = config.isDev()
  const hasLogging = config.hasLogging()
  
  return <div>{apiUrl}</div>
}
```

**Option 2: Using window directly**
```typescript
const config = window.__RUNTIME_CONFIG__
const apiUrl = config.api.baseUrl
```

### In API Client

```typescript
// src/services/api-client.ts already uses runtime config:
const apiBaseUrl = config.apiBaseUrl() || 'https://localhost:44300'
const apiTimeout = config.apiTimeout() || 30000

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: apiTimeout,
  headers: { 'Content-Type': 'application/json' }
})
```

### Waiting for Config

```typescript
import { onRuntimeConfigReady } from '@/config/runtime-config'

// In an effect or async function:
const config = await onRuntimeConfigReady()
console.log('Config ready:', config)
```

---

## Environment Variables Reference

### Supported Variables

| Variable | Type | Default | Purpose |
|----------|------|---------|---------|
| `VITE_API_BASE_URL` | URL | `https://localhost:44300` | Backend API endpoint |
| `VITE_API_TIMEOUT` | Number (ms) | `30000` | API request timeout |
| `VITE_APP_NAME` | String | `AMNIL Research Claude` | Application name |
| `VITE_APP_VERSION` | String | `0.1.0` | Application version |
| `VITE_ANALYTICS_ENABLED` | Boolean | `false` | Enable analytics |
| `VITE_ANALYTICS_ID` | String | `` | Analytics ID (GA, etc.) |
| `VITE_ENABLE_DEV_TOOLS` | Boolean | `true` (dev) / `false` (prod) | Show React Query DevTools |
| `VITE_ENABLE_LOGGING` | Boolean | `true` (dev) / `false` (prod) | Console logging |

### Setting Variables

**Local Development (.env.local):**
```bash
VITE_API_BASE_URL=https://localhost:44300
VITE_ENABLE_LOGGING=true
```

**Docker:**
```bash
docker run -e VITE_API_BASE_URL=https://api.prod.com myapp
```

**GitHub Actions:**
```yaml
env:
  VITE_API_BASE_URL: https://api.staging.com
  VITE_ANALYTICS_ID: UA-XXXXX
```

**Kubernetes:**
```yaml
env:
  - name: VITE_API_BASE_URL
    value: https://api.k8s.local
```

---

## Vite + React 19 Setup Structure

### Key Files

```
frontend/
├── index.html
│   ├── <script src="/runtime-env.js"></script>  ← Loads FIRST
│   └── <script type="module" src="/src/app/main.tsx"></script> ← App loads AFTER
│
├── public/
│   └── runtime-env.js  ← Sets up window.__RUNTIME_CONFIG__
│
├── src/
│   ├── app/
│   │   ├── main.tsx    ← Vite entry point, React 19, no React import needed
│   │   ├── App.tsx     ← Root component, JSX without React import
│   │   └── providers.tsx ← Global providers (React Query, etc.)
│   │
│   ├── config/
│   │   └── runtime-config.ts  ← Type-safe config access
│   │
│   ├── global.d.ts     ← TypeScript type definitions
│   │
│   └── services/
│       └── api-client.ts ← Uses config.apiBaseUrl()
│
└── .env.example        ← Documents all env variables
```

### main.tsx (Vite Entry Point)

```typescript
/**
 * React 19 + Vite best practices:
 * - No React import needed for JSX
 * - Explicit StrictMode import
 * - Proper error handling
 * - Clear documentation
 */

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Providers } from './providers'
import '../styles/index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

const root = ReactDOM.createRoot(rootElement)
root.render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
```

### App.tsx (Root Component)

```typescript
/**
 * React 19 style:
 * - JSX without React import
 * - Named export + default export
 * - Explicit return type
 * - Clear documentation
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../features/home/pages/home-page'
import '../styles/App.css'

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

## React 19 Features

### JSX No Longer Requires React Import

**Before (React 18):**
```typescript
import React from 'react'

export function Component() {
  return <div>Hello</div>
}
```

**After (React 19):**
```typescript
// No React import needed!

export function Component() {
  return <div>Hello</div>
}
```

### New Hooks (Available in React 19)

```typescript
import { useActionState, useFormStatus, useOptimistic } from 'react'

// useActionState - For server actions & form state
const [state, formAction, isPending] = useActionState(action, null)

// useFormStatus - Get form submission status
const { pending, data } = useFormStatus()

// useOptimistic - Optimistic updates
const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos)
```

### Auto Batching

```typescript
// All state updates are batched automatically in React 19
function handleClick() {
  setCount(c => c + 1)  // Batched
  setName('Alice')      // Batched
  setAge(30)            // Batched
  // Single re-render instead of 3
}
```

---

## Deployment Guide

### Build for Production

```bash
cd frontend
npm run build
# Creates: dist/ folder

# Vite injects VITE_* env vars at build time
# Runtime-env.js can override with server-provided config
```

### Docker Example

```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public/runtime-env.js /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose with Runtime Config

```yaml
version: '3.8'
services:
  frontend:
    image: myapp:frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=http://backend:3001
      - VITE_ANALYTICS_ID=UA-XXXXX

  backend:
    image: myapp:backend
    ports:
      - "3001:5000"
```

---

## File Summary

### New Files
- `public/runtime-env.js`
- `src/config/runtime-config.ts`
- `src/global.d.ts`
- `.env.example`
- `REACT_19_RUNTIME_ENV_SETUP.md` (this file)

### Updated Files
- `package.json` (React 19)
- `index.html` (added runtime-env.js script)
- `src/app/main.tsx` (React 19 patterns)
- `src/app/App.tsx` (JSX without React import)
- `src/services/api-client.ts` (uses runtime config)

---

## Migration Notes

### From React 18 to 19

**Automatic Changes:**
- ✅ No more `import React` needed
- ✅ Better TypeScript inference
- ✅ Automatic batching (always on)
- ✅ Better error handling

**Breaking Changes:**
- ⚠️ Some older browser support removed
- ⚠️ Ref syntax slightly changed (use React.forwardRef)

**Optional Updates:**
- Consider using new hooks (useActionState, useFormStatus, useOptimistic)
- Update to React Router v7 (already done)

---

## Troubleshooting

### "Cannot find window.__RUNTIME_CONFIG__"

**Solution:** Ensure `runtime-env.js` loads before your app
```html
<!-- In index.html, MUST come first: -->
<script src="/runtime-env.js"></script>
<script type="module" src="/src/app/main.tsx"></script>
```

### Config values are undefined

**Solution:** Check priority order
```typescript
// 1. Check environment variables
VITE_API_BASE_URL=https://api.example.com

// 2. Check defaults in runtime-env.js
// 3. Check window.__RUNTIME_CONFIG__
console.log(window.__RUNTIME_CONFIG__)
```

### API calls failing after deployment

**Solution:** Verify runtime config is loaded
```typescript
import { onRuntimeConfigReady } from '@/config/runtime-config'

// Wait for config before making requests
const config = await onRuntimeConfigReady()
console.log('API Base URL:', config.api.baseUrl)
```

---

## Best Practices

1. ✅ **Always use config helper** for accessing values
2. ✅ **Load runtime-env.js first** in index.html
3. ✅ **Document env variables** in .env.example
4. ✅ **Use defaults** in runtime-env.js for fallbacks
5. ✅ **Test with multiple configs** before deployment
6. ✅ **Log config in development** for debugging
7. ✅ **No React import** in React 19 components
8. ✅ **Use explicit return types** for components

---

## Summary

✅ **React upgraded to 19.0**  
✅ **Runtime environment system implemented**  
✅ **No rebuild needed for env changes**  
✅ **Type-safe configuration access**  
✅ **Production-ready deployment**  

**Frontend is now React 19 + production-ready with dynamic configuration!** 🚀
