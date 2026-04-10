# Architecture Decision Records (ADRs)

This document tracks major architectural and technical decisions made for this project.

## Template

```markdown
### ADR-XXX: [Decision Title]

**Date:** YYYY-MM-DD  
**Status:** Accepted | Proposed | Deprecated  
**Context:** Why this decision was needed  
**Decision:** What we decided  
**Consequences:** What changed as a result  
**Alternatives Considered:** Other options we evaluated
```

## Decisions

### ADR-001: Monorepo Structure

**Date:** 2026-04-10  
**Status:** Accepted

**Context:** Need to coordinate frontend and backend development for a single product.

**Decision:** Use a monorepo (single repository) with separate frontend and backend folders, each with their own build/test/deploy pipelines.

**Consequences:**
- Single source of truth for both teams
- Easier to coordinate schema/API changes
- Shared knowledge base and documentation
- Potential for large repo size over time

**Alternatives Considered:**
- Separate repositories: Harder coordination, duplicate docs
- Yarn workspaces: Adds complexity for .NET backend

---

### ADR-002: Tailwind CSS v4.2

**Date:** 2026-04-10  
**Status:** Accepted

**Context:** Need modern CSS framework with good shadcn integration.

**Decision:** Use Tailwind CSS v4.2 with new `@theme {}` syntax.

**Consequences:**
- Cleaner CSS variable management
- Better integration with shadcn components
- Must never use v3 syntax (`@tailwind` directives)
- Better IDE support with Vite

**Alternatives Considered:**
- Tailwind v3: Older syntax, less IDE support
- CSS Modules: More verbose, less flexibility
- Styled Components: Runtime overhead

---

### ADR-003: ABP Framework for Backend

**Date:** 2026-04-10  
**Status:** Accepted

**Context:** Building enterprise application with .NET, need patterns and infrastructure.

**Decision:** Use ABP Framework v8.x for application infrastructure.

**Consequences:**
- Structured layers: Domain → Application → HttpApi
- Built-in auth, permissions, auditing
- Scaffolding and conventions provided
- Framework learning curve for new team members

**Alternatives Considered:**
- NestJS: JavaScript instead of .NET
- Clean Architecture template: More manual setup
- Minimal APIs: Less infrastructure, more work

---

### ADR-004: React 19 with TypeScript

**Date:** 2026-04-10  
**Status:** Accepted

**Context:** Building modern UI with type safety.

**Decision:** Use React 19 with strict TypeScript mode.

**Consequences:**
- Stronger type safety
- Better IDE autocomplete
- Faster development with fewer bugs
- Build-time errors caught early

**Alternatives Considered:**
- Vue.js: Good but team expertise in React
- Svelte: Emerging, less ecosystem
- Plain JavaScript: More runtime errors

---

### ADR-005: Feature-Based Folder Organization

**Date:** 2026-04-10  
**Status:** Accepted

**Context:** Need clear code organization for scalability.

**Decision:** Organize frontend by features, not by technical type.

```
features/
  ├── products/
  │   ├── components/
  │   ├── hooks/
  │   ├── services/
  │   └── types/
  └── users/
      ├── components/
      ├── hooks/
      └── services/
```

**Consequences:**
- Easy to find all related code for a feature
- Features can be isolated/removed easily
- Clear ownership boundaries
- Scales better than technical organization

**Alternatives Considered:**
- Technical organization: Harder to find related code
- Flat structure: Works for small projects only

---

### ADR-006: Zustand for State Management

**Date:** 2026-04-10  
**Status:** Accepted

**Context:** Need lightweight state management solution.

**Decision:** Use Zustand for global state management.

**Consequences:**
- Minimal boilerplate
- Good TypeScript support
- Small bundle size
- Less ecosystem compared to Redux

**Alternatives Considered:**
- Redux: Overkill, too much boilerplate
- Jotai: Also good, but Zustand simpler
- Context API: Not suitable for complex global state

---

## Future Decisions

### Potential ADR: Database Technology (SQL Server vs PostgreSQL)

**Status:** Pending

Need to decide on primary database based on:
- Performance requirements
- Licensing constraints
- Team expertise
- DevOps infrastructure

---

### Potential ADR: Deployment Platform

**Status:** Pending

Options:
- Docker + Kubernetes
- Azure App Service
- AWS ECS
- DigitalOcean

---

## Revoked Decisions

None yet.

---

## See Also

- [Architecture Overview](./architecture.md)
- [Backend Conventions](../knowledge/wiki/backend.md)
- [Frontend Conventions](../knowledge/wiki/frontend.md)
