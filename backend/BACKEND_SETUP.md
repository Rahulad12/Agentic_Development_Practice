# AMNIL Research Claude Backend Setup

**Status:** ✅ Project structure fully implemented  
**Created:** 2026-04-10  
**Stack:** .NET 9, ASP.NET Core, Entity Framework Core, ABP Framework v8.1.3

---

## Overview

The complete backend project structure following ABP (ASP.NET Boilerplate) framework conventions has been created. All project files, modules, entities, services, and controllers are in place.

### Architecture

```
MyApp.sln
├── Domain Layer
│   ├── MyApp.Domain.Shared     ← Constants, enums, shared types
│   └── MyApp.Domain            ← Entities, aggregates, repository interfaces
├── Application Layer
│   ├── MyApp.Application.Contracts  ← DTOs, service interfaces
│   └── MyApp.Application            ← App services (orchestration)
├── Infrastructure Layer
│   └── MyApp.EntityFrameworkCore    ← DbContext, migrations, repositories
├── Presentation Layer
│   ├── MyApp.HttpApi           ← Controllers (thin)
│   └── MyApp.HttpApi.Host      ← ASP.NET Core startup
└── Utilities
    └── MyApp.DbMigrator        ← Database migrations & seeding
```

---

## Project Structure Details

### 1. Domain Layer

#### `MyApp.Domain.Shared` (No external dependencies)
- **Purpose:** Shared constants, enums, DTOs used by all layers
- **Files:**
  - `MyAppDomainSharedModule.cs` - Module definition

#### `MyApp.Domain` (Business Logic)
- **Purpose:** Entities, aggregates, domain services, repository interfaces
- **Key Files:**
  - `MyAppDomainModule.cs` - Module definition
  - `Products/Product.cs` - Sample aggregate root
    - Domain logic: `UpdatePrice()`, `UpdateStock()`, `DeductStock()`
    - No public setters — encapsulated behavior
  - `Products/IProductRepository.cs` - Repository interface
    - `GetByNameAsync()` - Custom query
    - `GetActiveProductsAsync()` - Custom query

### 2. Application Layer

#### `MyApp.Application.Contracts` (API Contracts)
- **Purpose:** DTOs and app service interfaces
- **Files:**
  - `MyAppApplicationContractsModule.cs`
  - `Products/ProductDto.cs` - Output DTO
  - `Products/CreateProductDto.cs` - Create input with validation
  - `Products/UpdateProductDto.cs` - Update input with optional fields
  - `Products/GetProductsInput.cs` - Pagination/filtering input
  - `Products/ProductListDto.cs` - Paginated response
  - `Products/IProductAppService.cs` - Service interface

#### `MyApp.Application` (Orchestration)
- **Purpose:** Application services, object mapping
- **Files:**
  - `MyAppApplicationModule.cs` - Configures AutoMapper
  - `Mapping/AutoMapperProfile.cs` - Entity ↔ DTO mappings
  - `Products/ProductAppService.cs` - Implements `IProductAppService`
    - **Never calls DbContext directly** — uses `IRepository<>`
    - Handles pagination, filtering, sorting
    - Calls domain logic via entity methods

### 3. Infrastructure Layer

#### `MyApp.EntityFrameworkCore` (Data Access)
- **Purpose:** DbContext, migrations, repository implementations
- **Files:**
  - `MyAppEntityFrameworkCoreModule.cs` - Registers repositories & DbContext
  - `MyAppDbContext.cs` - EF Core DbContext
    - Configured for SQL Server
    - Entity mappings, indexes, constraints
  - `Products/ProductRepository.cs` - Implements `IProductRepository`
    - Custom queries for products

### 4. HTTP API Layer

#### `MyApp.HttpApi` (API Definition)
- **Purpose:** Controllers with API routes
- **Files:**
  - `MyAppHttpApiModule.cs`
  - `Products/ProductController.cs` - REST endpoints
    - `GET /api/app/products` - List with pagination
    - `GET /api/app/products/{id}` - Get single
    - `POST /api/app/products` - Create
    - `PUT /api/app/products/{id}` - Update
    - `DELETE /api/app/products/{id}` - Delete

#### `MyApp.HttpApi.Host` (Web Host)
- **Purpose:** ASP.NET Core application entry point
- **Files:**
  - `MyAppHttpApiHostModule.cs` - Configures all modules
  - `Program.cs` - Kestrel startup, middleware pipeline
  - `appsettings.json` - Configuration
    - Connection string for SQL Server
    - CORS enabled for frontend (localhost:5173)
    - Swagger/OpenAPI enabled

### 5. Database Layer

#### `MyApp.DbMigrator` (Migrations)
- **Purpose:** Database setup and seeding
- **Files:**
  - `DbMigratorModule.cs`
  - `DbMigratorService.cs` - Runs migrations
  - `Program.cs` - Entry point
  - `appsettings.json` - DB connection string

---

## Getting Started

### Prerequisites

- .NET 9.0 SDK or later ([download](https://dotnet.microsoft.com/en-us/download/dotnet/9.0))
- SQL Server 2019+ (or Express Edition)
- Visual Studio 2022 / VS Code / Rider

### 1. Setup Database

```bash
# Open SQL Server Management Studio or use sqlcmd
# Create database
CREATE DATABASE AmniResearchClaude;
GO
```

Or update `appsettings.json` to use LocalDB:

```json
{
  "ConnectionStrings": {
    "Default": "(LocalDB)\\mssqllocaldb;Database=AmniResearchClaude;Trusted_Connection=true;TrustServerCertificate=true;"
  }
}
```

### 2. Restore Dependencies

```bash
cd backend
dotnet restore
```

This will download all NuGet packages (ABP, EF Core, Serilog, etc.)

### 3. Run Migrations

```bash
cd src/MyApp.DbMigrator
dotnet run
```

This applies all EF Core migrations and creates the database schema.

### 4. Start Backend Server

```bash
cd src/MyApp.HttpApi.Host
dotnet run
```

Server starts on: **https://localhost:44300**

Swagger UI: **https://localhost:44300/swagger**

---

## API Endpoints

All endpoints return JSON with proper HTTP status codes.

### List Products (Paginated)
```http
GET /api/app/products?page=1&pageSize=10&searchTerm=&isActive=true&sortBy=name&sortOrder=ascending
Content-Type: application/json

Response: ProductListDto
{
  "totalCount": 50,
  "currentPage": 1,
  "pageSize": 10,
  "totalPages": 5,
  "items": [ { ProductDto }, ... ],
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

### Get Single Product
```http
GET /api/app/products/{id}

Response: ProductDto
{
  "id": "guid",
  "name": "Product Name",
  "description": "...",
  "price": 99.99,
  "stockQuantity": 100,
  "isActive": true,
  "creationTime": "2026-04-10T...",
  "lastModificationTime": null
}
```

### Create Product
```http
POST /api/app/products
Content-Type: application/json

Request: CreateProductDto
{
  "name": "New Product",
  "description": "Description",
  "price": 99.99,
  "stockQuantity": 50,
  "isActive": true
}

Response: ProductDto (with ID and timestamps)
```

### Update Product
```http
PUT /api/app/products/{id}
Content-Type: application/json

Request: UpdateProductDto (all fields optional)
{
  "name": "Updated Name",
  "price": 79.99,
  "stockQuantity": 30
  // Other fields omitted remain unchanged
}

Response: ProductDto
```

### Delete Product
```http
DELETE /api/app/products/{id}

Response: 204 No Content
```

---

## CORS Configuration

Frontend at `http://localhost:5173` (Vite) can call the backend.

Configured in `Program.cs`:
```csharp
app.UseCors(policy =>
{
    policy
        .WithOrigins("http://localhost:5173", "https://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
});
```

**Frontend .env.local:**
```
VITE_API_BASE_URL=https://localhost:44300
```

---

## Entity Framework Core Migrations

### Create New Migration

```bash
cd src/MyApp.EntityFrameworkCore

# After modifying DbContext or entities
dotnet ef migrations add MigrationName --startup-project ../MyApp.HttpApi.Host
```

### Apply Migrations

```bash
cd src/MyApp.DbMigrator
dotnet run
```

Or from Package Manager Console:
```powershell
Update-Database
```

---

## Project Dependencies

### Layer Dependencies (Strict)

```
HttpApi.Host
    ↓
HttpApi + Application + EntityFrameworkCore
    ↓
Application.Contracts + Domain
    ↓
Domain.Shared
    
(Domain.Shared has zero dependencies)
```

**Rule:** Each layer only depends on layers below it.

### NuGet Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `Volo.Abp.Core` | 8.1.3 | ABP core framework |
| `Volo.Abp.Ddd.Domain` | 8.1.3 | DDD support |
| `Volo.Abp.Application` | 8.1.3 | App services |
| `Volo.Abp.EntityFrameworkCore` | 8.1.3 | EF Core integration |
| `Volo.Abp.AspNetCore.Mvc` | 8.1.3 | MVC controllers |
| `Volo.Abp.Swashbuckle` | 8.1.3 | Swagger/OpenAPI |
| `Volo.Abp.Autofac` | 8.1.3 | Dependency injection |
| `Microsoft.EntityFrameworkCore` | 9.0.0 | ORM |
| `Microsoft.EntityFrameworkCore.SqlServer` | 9.0.0 | SQL Server provider |
| `AutoMapper` | 13.0.1 | Object mapping |
| `Serilog.AspNetCore` | 8.0.0 | Structured logging |

---

## Development Workflow

### 1. Add New Entity

**1a. Create in Domain layer:**
```csharp
// MyApp.Domain/Orders/Order.cs
public class Order : AuditedAggregateRoot<Guid>
{
    public Guid CustomerId { get; private set; }
    public decimal TotalAmount { get; private set; }
    public List<OrderLine> Lines { get; private set; } = [];

    private Order() { }

    public Order(Guid id, Guid customerId) { ... }

    // Domain logic
    public void AddLine(Guid productId, int quantity, decimal price) { ... }
}
```

**1b. Create repository interface:**
```csharp
// MyApp.Domain/Orders/IOrderRepository.cs
public interface IOrderRepository : IRepository<Order, Guid>
{
    Task<Order?> GetWithLinesAsync(Guid id);
}
```

**1c. Create DTOs in Application.Contracts:**
```csharp
// Contracts/Orders/OrderDto.cs
public class OrderDto { ... }

// Contracts/Orders/CreateOrderDto.cs
public class CreateOrderDto { ... }

public interface IOrderAppService : IApplicationService
{
    Task<OrderDto> CreateAsync(CreateOrderDto input);
}
```

**1d. Implement in Application layer:**
```csharp
// Application/Orders/OrderAppService.cs
public class OrderAppService : ApplicationService, IOrderAppService
{
    private readonly IRepository<Order> _orderRepository;
    
    public async Task<OrderDto> CreateAsync(CreateOrderDto input)
    {
        var order = new Order(GuidGenerator.Create(), input.CustomerId);
        await _orderRepository.InsertAsync(order);
        return _mapper.Map<OrderDto>(order);
    }
}
```

**1e. Add DbSet to DbContext:**
```csharp
// EntityFrameworkCore/MyAppDbContext.cs
public DbSet<Order> Orders => Set<Order>();

protected override void OnModelCreating(ModelBuilder builder)
{
    base.OnModelCreating(builder);
    
    builder.Entity<Order>(b =>
    {
        b.ToTable("Orders", schema: "app");
        // Configure...
    });
}
```

**1f. Implement custom repository (if needed):**
```csharp
// EntityFrameworkCore/Orders/OrderRepository.cs
public class OrderRepository : EfCoreRepository<MyAppDbContext, Order, Guid>, IOrderRepository
{
    // Custom query implementations
}
```

**1g. Create controller:**
```csharp
// HttpApi/Orders/OrderController.cs
[Route("api/app/orders")]
public class OrderController : AbpController
{
    private readonly IOrderAppService _service;
    
    [HttpPost]
    public async Task<OrderDto> CreateAsync([FromBody] CreateOrderDto input)
        => await _service.CreateAsync(input);
}
```

**1h. Create EF Core migration:**
```bash
cd src/MyApp.EntityFrameworkCore
dotnet ef migrations add Added_Order_Table --startup-project ../MyApp.HttpApi.Host

cd ../MyApp.DbMigrator
dotnet run
```

### 2. Common Development Commands

```bash
# Restore packages
dotnet restore

# Build entire solution
dotnet build

# Run backend server
cd src/MyApp.HttpApi.Host && dotnet run

# Run migrations
cd src/MyApp.DbMigrator && dotnet run

# Run specific project tests
dotnet test src/MyApp.Domain.Tests

# Create migration
cd src/MyApp.EntityFrameworkCore
dotnet ef migrations add MigrationName --startup-project ../MyApp.HttpApi.Host

# Drop & recreate database (dangerous!)
dotnet ef database drop --startup-project ../MyApp.HttpApi.Host
dotnet ef database update --startup-project ../MyApp.HttpApi.Host
```

---

## Testing

### Test Projects (Placeholder Structure)

```
test/
├── MyApp.Domain.Tests/
│   ├── Products/
│   │   └── ProductTests.cs
├── MyApp.Application.Tests/
│   ├── Products/
│   │   └── ProductAppServiceTests.cs
└── MyApp.HttpApi.Tests/
    ├── Products/
    │   └── ProductControllerTests.cs
```

**Test Setup:**
```csharp
public class ProductTests
{
    [Fact]
    public void UpdatePrice_WithValidPrice_ShouldUpdate()
    {
        var product = new Product(Guid.NewGuid(), "Test", 99.99m);
        product.UpdatePrice(79.99m);
        Assert.Equal(79.99m, product.Price);
    }

    [Fact]
    public void UpdatePrice_WithNegativePrice_ShouldThrow()
    {
        var product = new Product(Guid.NewGuid(), "Test", 99.99m);
        Assert.Throws<InvalidOperationException>(
            () => product.UpdatePrice(-10m)
        );
    }
}
```

---

## Troubleshooting

### "Cannot find package Volo.Abp.*"
**Solution:** Ensure you have internet and run `dotnet restore`
```bash
dotnet restore --force
```

### "Database connection failed"
**Solution:** Check connection string in `appsettings.json`
```bash
# Test connection
dotnet ef dbcontext info --startup-project src/MyApp.HttpApi.Host
```

### "Entity type not found in context"
**Solution:** Ensure entity is registered in DbContext:
```csharp
public DbSet<MyEntity> MyEntities => Set<MyEntity>();
```

### "Circular dependency" or module loading errors
**Solution:** Check module dependencies in `[DependsOn(...)]` attributes
- Domain depends only on Domain.Shared
- Application depends on Domain + Application.Contracts
- HttpApi depends on Application.Contracts
- HttpApi.Host depends on all layers

---

## Next Steps

1. ✅ **Backend Structure** — Complete
2. **Database Setup** — Run migrations on your local SQL Server
3. **Frontend Integration** — Configure CORS and API base URL
4. **First Feature** — Extend the Product module with orders
5. **Authentication** — Add ABP Identity & JWT tokens
6. **Testing** — Create unit & integration tests
7. **Deployment** — Docker containerization, CI/CD

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `MyApp.sln` | Solution file (open in Visual Studio) |
| `global.json` | .NET 9 SDK configuration |
| `Directory.Build.props` | Common project settings |
| `src/*/appsettings.json` | Runtime configuration |
| `.gitignore` | Git exclusions (bin/, obj/, etc.) |

---

## ABP Framework Resources

- **Official Docs:** https://abp.io/docs
- **Architecture:** https://abp.io/docs/latest/fundamentals/architecture
- **Module Development:** https://abp.io/docs/latest/framework-features/module-architecture
- **EF Core Integration:** https://abp.io/docs/latest/framework-features/data-access/entity-framework-core

---

## Summary

✅ Complete ABP backend project structure implemented  
✅ Clean architecture with strict layer separation  
✅ Entity Framework Core configured for SQL Server  
✅ Sample Product feature (CRUD + domain logic)  
✅ CORS enabled for frontend development  
✅ Swagger/OpenAPI documentation ready  
✅ Database migrations tooling prepared  

**Next:** Run `dotnet restore` then `dotnet run` from `src/MyApp.HttpApi.Host`
