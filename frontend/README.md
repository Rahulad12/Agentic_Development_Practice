# Frontend - React + Vite + TypeScript + Tailwind + shadcn/ui

Modern React application with enterprise-grade tooling.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Setup
```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

## 📦 Available Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run tests
```

## 🎯 Architecture

- **Components:** Reusable UI components in `components/`
- **Features:** Feature modules in `features/`
- **State:** Global state with Zustand in `stores/`
- **Services:** API client and data services in `services/`
- **Hooks:** Custom React hooks in `hooks/`

## 📚 Key Technologies

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 6 | Build tool |
| Tailwind CSS 4.2 | Styling |
| shadcn/ui | Component library |
| React Router 7 | Client routing |
| Zustand | State management |
| Axios | HTTP client |

## 🎨 Tailwind CSS v4.2

This project uses **Tailwind CSS v4.2** with new syntax:

```css
/* frontend/src/styles/index.css */
@import "tailwindcss";

@theme {
  --color-primary: #6366f1;
  --color-primary-foreground: #ffffff;
  --radius: 0.5rem;
}
```

**Never use Tailwind v3 syntax** (`@tailwind base;` etc) — it will break.

## 🧩 shadcn/ui Components

Add components with:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form
```

⚠️ **Do NOT manually edit files in `src/components/ui/`** — they are auto-generated.

## 🔗 API Integration

Backend API is at: `https://localhost:44300/api/app/`

Authentication via JWT Bearer tokens. Configure in `src/lib/api-client.ts`:

```typescript
const token = localStorage.getItem('access_token')
apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

## 📖 Documentation

- Full guide: [`knowledge/wiki/frontend.md`](../knowledge/wiki/frontend.md)
- Architecture: [`docs/architecture.md`](../docs/architecture.md)
- Conventions: [`knowledge/wiki/conventions.md`](../knowledge/wiki/conventions.md)

## 🐛 Debugging

- Use [React DevTools](https://react.dev/learn/react-developer-tools)
- Browser DevTools for styling and console
- VS Code debug configuration in `.vscode/launch.json`

## 🧪 Testing

```bash
npm run test           # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

Use `@testing-library/react` for component testing.

## 🚀 Deployment

```bash
npm run build
# Deploy contents of dist/ to your hosting
```

Environment variables:
- `VITE_API_BASE_URL`: Backend API URL (set in deployment)

## 📝 Environment Variables

Create `.env.local` (not committed):
```
VITE_API_BASE_URL=https://localhost:44300
```

## 🤝 Contributing

Before committing:
1. Run `npm run lint` to check code
2. Run `npm run format` to format code
3. Run tests: `npm run test`
4. Create meaningful commit messages

See [`knowledge/wiki/conventions.md`](../knowledge/wiki/conventions.md) for code standards.
