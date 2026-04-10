# AMNIL Research Claude - Developer Wiki

Welcome to the project knowledge base. Start here to understand how to work on this monorepo.

## 📚 Quick Navigation

- **[Frontend Guide](./frontend.md)** — React, TypeScript, Tailwind, shadcn/ui conventions
- **[Backend Guide](./backend.md)** — .NET, ABP Framework, clean architecture patterns  
- **[Conventions](./conventions.md)** — Naming, file structure, code style across the stack

## 🚀 Getting Started

### First Time Setup
```bash
./scripts/setup.sh   # Bootstrap entire project
./scripts/dev.sh     # Start development servers
```

**Frontend:** http://localhost:5173  
**Backend API:** https://localhost:44300  
**API Docs:** https://localhost:44300/swagger

### Project Structure
```
frontend/        ← React + Vite + Tailwind 4.2 + shadcn/ui
backend/         ← .NET 9 + ABP Framework + EF Core
docs/            ← Architecture and decision records
knowledge/       ← This wiki
scripts/         ← Automation and setup
```

## 🎯 Key Principles

### Frontend
- **Component-driven:** Reusable, testable, composable UI components
- **TypeScript first:** Strict types for reliability
- **Tailwind 4.2:** Modern CSS with `@theme {}` syntax (not v3!)
- **shadcn/ui:** Pre-built accessible components via MCP
- **Zustand:** Global state management
- **React Query:** Data fetching and caching
- **Axios:** HTTP client
- **React Router:** Client-side routing | Data Model Layer

### Backend
- **Clean Architecture:** Strict layer separation (HttpApi → Application → Domain)
- **Domain-driven:** Business logic lives in Domain layer, not controllers
- **DTOs everywhere:** Never expose domain entities to clients
- **Async/await:** All database operations are async

## 📖 Common Tasks

### Adding a New UI Component
1. Check if shadcn component exists: `mcp shadcn search button`
2. If needed: `npx shadcn@latest add dialog` from `frontend/`
3. Import and use: `import { Dialog } from "@/components/ui/dialog"`

### Adding a Backend Feature
1. Create entity in `MyApp.Domain`
2. Create AppService in `MyApp.Application`
3. Create controller in `MyApp.HttpApi`
4. Create migration if schema changed

### API Integration
- Frontend calls backend at `https://localhost:44300/api/app/*`
- All requests include JWT bearer token in Authorization header
- Responses are always JSON DTOs, never raw domain entities

## 🔗 References

- [ABP Framework Docs](https://abp.io/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [EF Core](https://learn.microsoft.com/en-us/ef/core/)

## 🤝 Code Review Checklist

**Frontend**
- [ ] No manual edits to `components/ui/`
- [ ] Tailwind v4 syntax used correctly
- [ ] Components are reusable and testable
- [ ] Types are explicit (no `any`)

**Backend**
- [ ] Business logic in Domain, not Controller
- [ ] DTOs used for API contracts
- [ ] `async/await` throughout
- [ ] Migrations added if schema changed
- [ ] No direct DbContext in Application layer

## ❓ Need Help?

- Check the relevant guide: Frontend, Backend, or Conventions
- Review existing code in the same area for patterns
- Check git history for similar changes
- Ask questions in code reviews
