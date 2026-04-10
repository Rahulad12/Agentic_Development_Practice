# Persistent Session Context

## Current Project State
- **Status:** 🚧 Setup / Planning
- **Last Updated:** 2026-04-10
- **Initialized:** 2026-04-10

## Key Facts
- Monorepo with Frontend (React) + Backend (.NET ABP)
- Frontend uses: Vite, TypeScript, React 19, Tailwind 4.2, shadcn/ui
- Backend uses: .NET 9.0, ABP Framework 8.x, EF Core 9
- Development workflow: `./scripts/dev.sh` starts both frontend and backend

## Active Initiatives
- [x] Initialize monorepo structure
- [ ] Run setup.sh to bootstrap dependencies
- [ ] Set up ABP project via ABP CLI
- [ ] Set up Vite + React + Tailwind 4.2 + shadcn
- [ ] Configure CORS between frontend and backend
- [ ] Set up first feature module (end-to-end)

## Important Decisions Made
| Date | Decision | Reason |
|------|----------|--------|
| 2026-04-10 | Monorepo structure | Single repo for easier cross-team coordination |
| 2026-04-10 | Tailwind v4.2 | Latest features, better CSS variable integration |
| 2026-04-10 | ABP Framework | Enterprise-grade .NET patterns, multi-tenancy ready |

## Next Steps
1. Initialize frontend with `npm create vite@latest`
2. Initialize backend with ABP CLI
3. Configure database connection
4. Set up authentication (JWT via ABP)
