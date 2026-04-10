# Backend - .NET 9.0 + ABP Framework + EF Core

Enterprise-grade backend with clean architecture and domain-driven design.

## 🚀 Quick Start

### Prerequisites
- .NET 9.0 SDK
- SQL Server or PostgreSQL
- Visual Studio 2022 / VS Code + C# Dev Kit

### Initial Setup

First-time setup requires initializing the ABP project:

```bash
# If not already created, initialize ABP project:
abp new MyApp -d ef -u angular

# Or follow the ABP CLI guide: https://abp.io/get-started

# Then restore and build:
cd backend
dotnet restore
dotnet build
```

### Running

```bash
# Restore dependencies
dotnet restore

# Build solution
dotnet build

# Run database migrations
cd src/MyApp.DbMigrator
dotnet run

# Start API server
cd ../MyApp.HttpApi.Host
dotnet run
```

API available at: `https://localhost:44300`  
Swagger docs: `https://localhost:44300/swagger`

## 📁 Project Structure

```
src/
├── MyApp.Domain/                   # Entities & business logic
├── MyApp.Domain.Shared/            # Constants, enums, shared DTOs
├── MyApp.Application/              # App services & orchestration
├── MyApp.Application.Contracts/    # Service interfaces & public DTOs
├── MyApp.EntityFrameworkCore/      # Data access & migrations
├── MyApp.HttpApi/                  # Controllers
└── MyApp.HttpApi.Host/             # ASP.NET Core startup

test/
├── MyApp.Domain.Tests/             # Domain layer tests
├── MyApp.Application.Tests/        # Application layer tests
└── MyApp.HttpApi.Tests/            # Integration tests
```

## 🏗️ Layer Architecture

```
HttpApi Controller
       ↓
Application Service (Orchestration)
       ↓
Domain Entity (Business Logic)
       ↓
Repository (Data Access)
       ↓
Database
```

**Critical Rules:**
- ✅ Business logic belongs in **Domain layer**
- ✅ Orchestration in **Application layer**
- ✅ Controllers must be **thin**
- ✅ Always use **DTOs** for API contracts
- ✅ Use **async/await** throughout
- ❌ Never expose domain entities to clients
- ❌ Never call DbContext from Application layer

## 📚 Available Commands

```bash
dotnet restore                      # Restore NuGet packages
dotnet build                        # Build solution
dotnet run                          # Run host project
dotnet test                         # Run all tests
dotnet clean                        # Clean build artifacts

# Database management
cd src/MyApp.DbMigrator
dotnet run                          # Apply pending migrations

# Creating migrations
cd src/MyApp.EntityFrameworkCore
dotnet ef migrations add MigrationName
dotnet ef database update
```

## 🗄️ Database

### Connection String
Edit `src/MyApp.HttpApi.Host/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MyAppDb;User Id=sa;Password=YourPassword;"
  }
}
```

### Applying Migrations

```bash
# Run all pending migrations
cd src/MyApp.DbMigrator
dotnet run

# OR update from EntityFrameworkCore project
cd src/MyApp.EntityFrameworkCore
dotnet ef database update
```

### Creating Migrations

```bash
cd src/MyApp.EntityFrameworkCore
dotnet ef migrations add Added_Product_Table
dotnet ef migrations remove  # Undo last migration
dotnet ef database update    # Apply changes
```

## 🔐 Authentication

ABP provides JWT-based authentication:

```csharp
[Authorize]  // Requires authentication
public class ProductController : AbpController
{
    public async Task<ProductDto> GetAsync(Guid id) => ...
}

[AllowAnonymous]  // Public endpoint
public async Task<TokenDto> LoginAsync(LoginDto input) => ...
```

## 📝 Creating a New Feature

1. **Create Entity** in `Domain/Entities/`
   ```csharp
   public class Product : AuditedAggregateRoot<Guid>
   {
       public string Name { get; private set; }
       public decimal Price { get; private set; }
   }
   ```

2. **Create DTOs** in `Domain.Shared/Dtos/`
   ```csharp
   public class ProductDto { }
   public class CreateProductDto { }
   ```

3. **Create AppService** in `Application/Services/`
   ```csharp
   public class ProductAppService : ApplicationService, IProductAppService
   {
       private readonly IRepository<Product> _repo;
       
       public async Task<ProductDto> CreateAsync(CreateProductDto input) => ...
   }
   ```

4. **Create Controller** in `HttpApi/Controllers/`
   ```csharp
   [Route("api/app/products")]
   public class ProductController : AbpController
   {
       public async Task<ProductDto> CreateAsync(CreateProductDto input) => ...
   }
   ```

5. **Create Migration**
   ```bash
   dotnet ef migrations add Added_Product_Table
   dotnet ef database update
   ```

## 🧪 Testing

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test test/MyApp.Domain.Tests

# Run with coverage
dotnet test /p:CollectCoverage=true
```

Test example:
```csharp
public class ProductAppService_Tests : MyAppApplicationTestBase
{
    [Fact]
    public async Task CreateAsync_ShouldCreateProduct()
    {
        var service = GetRequiredService<IProductAppService>();
        var result = await service.CreateAsync(new CreateProductDto { Name = "Test" });
        result.Name.ShouldBe("Test");
    }
}
```

## 🔧 Configuration

### Application Settings
`appsettings.json`:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "ConnectionStrings": {
    "Default": "Server=..."
  }
}
```

### Permissions
Define in `Application/Permissions/MyAppPermissionDefinitionProvider.cs`:
```csharp
public class MyAppPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var productGroup = context.AddGroup("Products");
        productGroup.AddPermission("Products.Create");
        productGroup.AddPermission("Products.Edit");
        productGroup.AddPermission("Products.Delete");
    }
}
```

## 🌐 API Endpoints

All endpoints follow this pattern:
```
GET    /api/app/[entity]           - List
GET    /api/app/[entity]/{id}      - Get by ID
POST   /api/app/[entity]           - Create
PUT    /api/app/[entity]/{id}      - Update
DELETE /api/app/[entity]/{id}      - Delete
```

Example:
```
GET    /api/app/products
GET    /api/app/products/{id}
POST   /api/app/products
PUT    /api/app/products/{id}
DELETE /api/app/products/{id}
```

## 📖 Documentation

- Full guide: [`knowledge/wiki/backend.md`](../knowledge/wiki/backend.md)
- Architecture: [`docs/architecture.md`](../docs/architecture.md)
- Conventions: [`knowledge/wiki/conventions.md`](../knowledge/wiki/conventions.md)
- ABP Framework: [https://abp.io/docs](https://abp.io/docs)

## 🐛 Debugging

- Use **Visual Studio Debugger** to set breakpoints
- Check **Output window** for logs
- View **Application Insights** (if configured)
- Check database directly with **SQL Server Management Studio**

## 📦 NuGet Packages

Managed via ABP Framework. Common packages:
- `Volo.Abp.Domain`
- `Volo.Abp.Application`
- `Volo.Abp.EntityFrameworkCore`
- `Volo.Abp.AspNetCore`
- `AutoMapper`
- `Serilog`

Update with: `dotnet add package PackageName`

## 🚀 Deployment

```bash
# Production build
dotnet publish -c Release -o ./publish

# Run migrations in production
cd src/MyApp.DbMigrator
dotnet run --configuration Release
```

Environment variables (set on server):
- `ConnectionStrings__Default`: Database connection
- `Logging__LogLevel__Default`: Log level

## 🤝 Contributing

Before committing:
1. Run `dotnet build` to check for errors
2. Run `dotnet test` to verify tests pass
3. Follow naming conventions (see conventions guide)
4. Keep layers separated

See [`knowledge/wiki/conventions.md`](../knowledge/wiki/conventions.md) for code standards.
