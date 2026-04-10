# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser                           │
│              (React 19 + TypeScript + Vite)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTP/HTTPS (JSON)
                  │ https://localhost:44300/api/app/*
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                 ASP.NET Core Host                           │
│          (Authentication, CORS, Middleware)                 │
│              https://localhost:44300                        │
└──────────────┬────────────────────────────────────────────┬─┘
               │                                             │
               ↓                                             ↓
        ┌──────────────┐                          ┌──────────────────┐
        │   HttpApi    │                          │ ABP Infrastructure
        │  Controllers │                          │ (Auth, Audit, etc)
        └──────┬───────┘                          └──────────────────┘
               │
               ↓
        ┌──────────────────┐
        │  Application     │
        │   Services       │
        │  (Orchestration) │
        └──────┬───────────┘
               │
               ↓
        ┌──────────────────┐
        │    Domain        │
        │   Entities       │
        │  & Aggregates    │
        │ (Business Logic) │
        └──────┬───────────┘
               │
               ↓
        ┌──────────────────┐
        │ Entity Framework │
        │      Core        │
        │  (Data Mapping)  │
        └──────┬───────────┘
               │
               ↓
        ┌──────────────────┐
        │    Database      │
        │  (SQL Server)    │
        └──────────────────┘
```

## Layer Responsibilities

### Frontend (React)
- **Location:** `frontend/src`
- **Responsibility:** User interface, state management, API client
- **Technology:** React 19, TypeScript, Vite, Tailwind CSS 4.2, shadcn/ui
- **Pattern:** Feature-based organization with hooks and components

### Backend (.NET ABP)
- **Location:** `backend/src`
- **Responsibility:** Business logic, data persistence, API endpoints
- **Technology:** .NET 9.0, ABP Framework 8.x, EF Core 9
- **Pattern:** Clean architecture with strict layer separation

#### Backend Layer Details

**HttpApi** → **Application** → **Domain** → **EntityFrameworkCore** → **Database**

1. **HttpApi Layer** (`MyApp.HttpApi`)
   - Controllers (thin, delegate to application services)
   - Request routing
   - API versioning

2. **Application Layer** (`MyApp.Application`)
   - Application Services (orchestrate domain logic)
   - DTOs (data transfer objects)
   - Mapping profiles

3. **Domain Layer** (`MyApp.Domain`)
   - Entities and Aggregates (with business logic)
   - Domain Services
   - Repository Interfaces

4. **Infrastructure Layer** (`MyApp.EntityFrameworkCore`)
   - EF Core DbContext
   - Repository Implementations
   - Migrations
   - Query Specifications

## Communication Flow

### Request → Response Cycle

1. **Frontend** sends HTTP request with JWT token
   ```typescript
   POST https://localhost:44300/api/app/products
   Authorization: Bearer {token}
   ```

2. **HttpApi Controller** receives request and delegates
   ```csharp
   public class ProductController
   {
       public async Task<ProductDto> CreateAsync(CreateProductDto input)
           => await _service.CreateAsync(input);
   }
   ```

3. **Application Service** orchestrates business logic
   ```csharp
   public class ProductAppService
   {
       public async Task<ProductDto> CreateAsync(CreateProductDto input)
       {
           var entity = new Product(input.Name, input.Price);
           await _repository.InsertAsync(entity);
           return _mapper.Map<ProductDto>(entity);
       }
   }
   ```

4. **Domain** contains business rules
   ```csharp
   public class Product : AggregateRoot<Guid>
   {
       public void UpdatePrice(decimal newPrice)
       {
           if (newPrice <= 0)
               throw new BusinessException("Price must be > 0");
           Price = newPrice;
       }
   }
   ```

5. **Database** persists data via EF Core

## Database

- **Type:** SQL Server (configurable)
- **ORM:** Entity Framework Core 9
- **Migrations:** Code-first approach
- **Seeding:** Via `IDataSeedContributor`

### Connection String
Located in: `backend/src/MyApp.HttpApi.Host/appsettings.json`

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MyAppDb;User Id=sa;Password=YourPassword;"
  }
}
```

## Authentication & Authorization

- **Type:** JWT Bearer Token (ABP standard)
- **Flow:** Login endpoint returns JWT → Frontend stores in localStorage
- **Every request:** Frontend includes `Authorization: Bearer {token}`
- **Permissions:** ABP permission system with role-based access control

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev          # Start Vite dev server on :5173
npm run build        # Production build
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend/src/MyApp.HttpApi.Host
dotnet run           # Start ASP.NET Core on :44300
dotnet build         # Build solution
dotnet test          # Run unit tests
```

### Database Management
```bash
cd backend/src/MyApp.DbMigrator
dotnet run           # Run pending migrations
```

## File Structure Reference

```
frontend/src/
├── app/                 # App entry, router, providers
├── components/
│   ├── ui/             # Generated shadcn components
│   └── shared/         # Custom shared components
├── features/           # Feature modules
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── hooks/              # Global hooks
├── lib/                # Utilities, helpers
├── services/           # API client, data services
├── stores/             # State management
├── styles/             # Global CSS
└── types/              # TypeScript types

backend/src/
├── MyApp.Domain/              # Entities, business logic
├── MyApp.Domain.Shared/       # Constants, shared types
├── MyApp.Application/         # Application services
├── MyApp.Application.Contracts/ # Service interfaces
├── MyApp.EntityFrameworkCore/ # Data access
├── MyApp.HttpApi/             # Controllers
└── MyApp.HttpApi.Host/        # ASP.NET startup
```

## Configuration Management

### Frontend
- **Env Vars:** `.env`, `.env.local` (not committed)
- **Key Var:** `VITE_API_BASE_URL` — Backend API URL
- **Config:** `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`

### Backend
- **Secrets:** `appsettings.json` (not committed)
- **Config:** `appsettings.Development.json`, `appsettings.Production.json`
- **Key Settings:** Database connection, JWT secret, CORS origins

## Deployment

### Frontend
- **Build:** `npm run build` → `frontend/dist/`
- **Hosting:** Static file hosting (Netlify, Vercel, S3, etc.)
- **Env:** Set `VITE_API_BASE_URL` in deployment environment

### Backend
- **Build:** `dotnet publish -c Release`
- **Hosting:** Docker, Azure App Service, dedicated server
- **DB:** Run migrations before deploying
