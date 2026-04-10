# Backend Documentation

Complete .NET 9 + ABP Framework backend with clean architecture and full Product CRUD example.

## 📚 Documentation Files

### 1. **BACKEND_SETUP.md** (Most Important)
- Complete ABP backend project structure
- 9 projects with full source code
- Clean Architecture layers (Domain → Application → HttpApi → Infrastructure)
- Product feature end-to-end example
- API endpoints reference (GET, POST, PUT, DELETE)
- CORS configuration for frontend
- Environment variables & configuration
- Development workflow and commands
- Database migrations guide
- Troubleshooting & common issues

**Use when:** Setting up, understanding architecture, adding new features

### 2. **BACKEND_COMPLETE.md**
- Implementation summary
- What was created (9 projects)
- Architecture overview
- Product feature implementation
- API endpoints ready
- CORS configuration
- Technology stack details
- Folder structure
- Key files reference
- Next steps to run

**Use when:** Reviewing what was implemented, quick reference

### 3. **BUILD_NOTES.md**
- NuGet package resolution troubleshooting
- Expected build behavior on your machine
- All NuGet packages listed with versions
- Build commands (clean, rebuild, publish)
- Common build issues & solutions
- Project structure verification
- Docker build setup
- Build configuration (Debug vs Release)

**Use when:** Troubleshooting build issues, setting up CI/CD

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── MyApp.Domain.Shared/        ← Shared types (no deps)
│   ├── MyApp.Domain/               ← Entities, domain logic
│   ├── MyApp.Application.Contracts/← DTOs, service interfaces
│   ├── MyApp.Application/          ← App services, orchestration
│   ├── MyApp.EntityFrameworkCore/  ← EF Core, DbContext, repos
│   ├── MyApp.HttpApi/              ← Controllers (thin)
│   ├── MyApp.HttpApi.Host/         ← ASP.NET Core startup
│   └── MyApp.DbMigrator/           ← Migrations runner
├── test/
│   ├── MyApp.Domain.Tests/
│   ├── MyApp.Application.Tests/
│   └── MyApp.HttpApi.Tests/
├── MyApp.sln                       ← Solution file
├── global.json                     ← .NET 9 SDK config
├── Directory.Build.props           ← Common project settings
└── .gitignore                      ← Git exclusions
```

## 🚀 Quick Start

### Prerequisites
- .NET 9 SDK ([download](https://dotnet.microsoft.com/download/dotnet/9.0))
- SQL Server 2019+ or LocalDB
- Visual Studio 2022 / VS Code / Rider

### Build
```bash
cd backend
dotnet restore
dotnet build
```

### Database Setup
```bash
# Create database
CREATE DATABASE AmniResearchClaude;
GO
```

Or use LocalDB (configured in appsettings.json)

### Run Migrations
```bash
cd src/MyApp.DbMigrator
dotnet run
```

### Start Server
```bash
cd src/MyApp.HttpApi.Host
dotnet run
# Server: https://localhost:44300
# Swagger: https://localhost:44300/swagger
```

## 📋 Technology Stack

| Tech | Version | Purpose |
|------|---------|---------|
| .NET | 9.0 | Language & runtime |
| ASP.NET Core | 9.0 | Web framework |
| Entity Framework Core | 9.0 | ORM |
| ABP Framework | 8.1.3 | Enterprise architecture |
| SQL Server | 2019+ | Database |
| AutoMapper | 13.0.1 | Object mapping |
| Serilog | 8.0.0 | Structured logging |
| Swagger | Built-in | API documentation |

## 🏛️ Architecture Overview

```
HttpApi.Host (ASP.NET Core Startup)
    ↓
HttpApi Layer (Controllers) ← Application Layer (Services)
    ↓                              ↓
Domain Layer (Entities)      Application.Contracts (DTOs)
    ↓                              ↓
EntityFrameworkCore (EF Core, Repositories)
    ↓
Database (SQL Server)
```

**Key Principle:** Each layer depends only on layers below it.

## 💡 Common Tasks

### Add a new entity
1. Create entity in `MyApp.Domain/Features/{Feature}/`
   ```csharp
   public class Order : AuditedAggregateRoot<Guid> { }
   ```

2. Create repository interface in Domain
   ```csharp
   public interface IOrderRepository : IRepository<Order, Guid> { }
   ```

3. Create DTOs in `Application.Contracts/Features/{Feature}/`
   ```csharp
   public class OrderDto { }
   public class CreateOrderDto { }
   ```

4. Create app service in `Application/Features/{Feature}/`
   ```csharp
   public class OrderAppService : IOrderAppService { }
   ```

5. Add DbSet to `MyAppDbContext`
   ```csharp
   public DbSet<Order> Orders => Set<Order>();
   ```

6. Implement repository in `EntityFrameworkCore/Features/{Feature}/`
   ```csharp
   public class OrderRepository : EfCoreRepository<...>, IOrderRepository { }
   ```

7. Create controller in `HttpApi/Features/{Feature}/`
   ```csharp
   [Route("api/app/orders")]
   public class OrderController : AbpController { }
   ```

8. Create migration
   ```bash
   cd src/MyApp.EntityFrameworkCore
   dotnet ef migrations add Added_Order_Table --startup-project ../MyApp.HttpApi.Host
   ```

9. Run migration
   ```bash
   cd src/MyApp.DbMigrator && dotnet run
   ```

### Test an API endpoint
```bash
# List products
curl -X GET https://localhost:44300/api/app/products \
  -H "Content-Type: application/json" \
  --insecure

# Create product
curl -X POST https://localhost:44300/api/app/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99}' \
  --insecure
```

### Run tests
```bash
# All tests
dotnet test

# Specific project
dotnet test src/MyApp.Domain.Tests

# With coverage
dotnet test /p:CollectCoverage=true
```

## 🔗 Related Documentation

- **CLAUDE.md** - Main project documentation
- **docs/INTEGRATION_GUIDE.md** - Frontend ↔ Backend testing
- **docs/PROJECT_COMPLETE.md** - Full project overview
- **knowledge/wiki/backend.md** - .NET/ABP conventions

## 📝 Key Patterns

### Clean Architecture Layers
```
Domain.Shared      ← Constants, enums (no dependencies)
Domain             ← Entities, domain services
Application.Contracts ← DTOs, interfaces
Application        ← App services, orchestration
EntityFrameworkCore ← EF Core, repositories
HttpApi            ← Controllers
HttpApi.Host       ← Startup, middleware
```

### Repository Pattern
- Never use DbContext directly in Application layer
- Always use `IRepository<T>` abstraction
- Custom repositories implement domain interfaces

### Dependency Injection
```csharp
[DependsOn(typeof(MyAppApplicationModule))]
public class MyAppHttpApiModule : AbpModule { }
```

### AutoMapper
```csharp
CreateMap<Product, ProductDto>();
CreateMap<CreateProductDto, Product>();
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| NuGet packages not found | Check internet, run `dotnet nuget locals all --clear` |
| Build fails | Run `dotnet build` with detailed output: `-v diag` |
| EF Core migration errors | Verify DbContext has entity registered |
| Controller route not working | Check `[Route("...")]` and `[ControllerName(...)]` |
| 404 on API call | Verify endpoint exists in Swagger |
| CORS error from frontend | Check Program.cs CORS config |

## 📖 More Info

See **BACKEND_SETUP.md** for:
- Complete API endpoint reference
- Migration commands
- Development workflow
- Deployment strategies
- Architecture decision records

---

**All setup complete. Ready to build features!** 🚀
