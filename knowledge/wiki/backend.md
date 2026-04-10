# Backend Development Guide

## Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| .NET | 9.0 | Runtime & framework |
| ABP Framework | 8.x | Enterprise application platform |
| Entity Framework Core | 9.x | ORM |
| SQL Server / PostgreSQL | — | Database |
| Swagger / OpenAPI | Via ABP | API documentation |

## ABP Clean Architecture

Strict layer separation — data flows **inward** (outward is allowed):

```
HttpApi Layer (Controllers)
        ↓
Application Layer (Services)
        ↓
Domain Layer (Entities, Business Logic)
        ↓
Infrastructure Layer (EF Core, Database)
```

### Layer Responsibilities

| Layer | Location | Contains | Depends On |
|-------|----------|----------|-----------|
| **HttpApi** | `MyApp.HttpApi` | Controllers | Application contracts |
| **Application** | `MyApp.Application` | App Services, DTOs | Domain, Domain.Shared |
| **Domain** | `MyApp.Domain` | Entities, Domain Services | Nothing else (standalone) |
| **Infrastructure** | `MyApp.EntityFrameworkCore` | DbContext, Migrations, Repos | Domain |

### Critical Rules

#### 🛑 Never Violate Layer Boundaries

```csharp
// ❌ WRONG — Business logic in controller
public class ProductController : AbpController
{
    private readonly IRepository<Product> _repo;
    
    public async Task<ProductDto> CreateAsync(CreateProductDto input)
    {
        if (input.Price <= 0) // ❌ Business logic in controller!
            return BadRequest("Invalid price");
            
        var product = new Product(input.Name, input.Price);
        await _repo.InsertAsync(product);
        return Ok(ObjectMapper.Map<ProductDto>(product));
    }
}

// ✅ CORRECT — Thin controller
public class ProductController : AbpController
{
    private readonly IProductAppService _service;
    
    public async Task<ProductDto> CreateAsync(CreateProductDto input)
        => await _service.CreateAsync(input); // Delegate to service
}
```

#### 🛑 Never Expose Domain Entities Directly

```csharp
// ❌ WRONG — Returning entity directly
public async Task<Product> GetAsync(Guid id)
{
    return await _repository.GetAsync(id); // ❌ Exposes entity!
}

// ✅ CORRECT — Return DTO
public async Task<ProductDto> GetAsync(Guid id)
{
    var product = await _repository.GetAsync(id);
    return ObjectMapper.Map<ProductDto>(product); // ✅ Return DTO
}
```

#### 🛑 Never Call DbContext Directly in Application Layer

```csharp
// ❌ WRONG — Direct DbContext access
public class ProductAppService
{
    private readonly DbContext _context; // ❌ Never!
    
    public async Task CreateAsync(CreateProductDto input)
    {
        var product = new Product(input.Name);
        _context.Products.Add(product); // ❌ Wrong!
        await _context.SaveChangesAsync();
    }
}

// ✅ CORRECT — Use IRepository
public class ProductAppService
{
    private readonly IRepository<Product> _repository; // ✅ Use repo!
    
    public async Task<ProductDto> CreateAsync(CreateProductDto input)
    {
        var product = new Product(input.Name);
        await _repository.InsertAsync(product); // ✅ Correct
        return ObjectMapper.Map<ProductDto>(product);
    }
}
```

## Project Structure

```
backend/src/
├── MyApp.Domain/                      # Business logic lives here
│   ├── Entities/
│   │   ├── Product.cs
│   │   └── Order.cs
│   ├── Repositories/                  # Repository interfaces only
│   │   └── IProductRepository.cs
│   ├── DomainServices/
│   │   └── ProductDomainService.cs
│   └── MyAppDomainModule.cs
│
├── MyApp.Domain.Shared/               # Constants, enums, DTOs
│   ├── Consts/
│   │   └── MyAppConsts.cs
│   └── Dtos/
│       └── ProductDto.cs
│
├── MyApp.Application/                 # Orchestration layer
│   ├── Dtos/                          # Application layer DTOs
│   │   └── CreateProductDto.cs
│   ├── Services/
│   │   ├── IProductAppService.cs
│   │   └── ProductAppService.cs
│   ├── Mapper/
│   │   └── ProductProfile.cs
│   └── MyAppApplicationModule.cs
│
├── MyApp.Application.Contracts/       # Service interfaces & public DTOs
│   ├── Dtos/
│   │   └── ProductDto.cs
│   ├── Services/
│   │   └── IProductAppService.cs
│   └── MyAppApplicationContractsModule.cs
│
├── MyApp.EntityFrameworkCore/         # Data access layer
│   ├── DbContexts/
│   │   └── MyAppDbContext.cs
│   ├── Repositories/
│   │   └── ProductRepository.cs
│   ├── Migrations/
│   │   └── 2026_04_10_001_Initial.cs
│   └── MyAppEntityFrameworkCoreModule.cs
│
├── MyApp.HttpApi/                     # Controllers
│   ├── Controllers/
│   │   └── ProductController.cs
│   └── MyAppHttpApiModule.cs
│
├── MyApp.HttpApi.Host/                # ASP.NET Core startup
│   ├── appsettings.json               # Configuration
│   ├── appsettings.Development.json
│   ├── Program.cs                     # Startup
│   └── MyAppHttpApiHostModule.cs
│
└── MyApp.DbMigrator/                  # Database migration runner
    ├── DbMigratorHostedService.cs
    └── Program.cs
```

## Creating a Feature (Step-by-Step)

### Step 1: Create Domain Entity

```csharp
// MyApp.Domain/Entities/Product.cs
public class Product : AuditedAggregateRoot<Guid>
{
    public string Name { get; private set; }
    public decimal Price { get; private set; }

    public Product() { }

    public Product(string name, decimal price)
    {
        Name = Guard.NotNullOrWhiteSpace(name, nameof(name));
        SetPrice(price);
    }

    public void SetPrice(decimal newPrice)
    {
        if (newPrice <= 0)
            throw new BusinessException("Price must be greater than 0");
        Price = newPrice;
    }
}
```

### Step 2: Create DTOs

```csharp
// MyApp.Domain.Shared/Dtos/ProductDto.cs
public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

// MyApp.Application/Dtos/CreateProductDto.cs
public class CreateProductDto
{
    [Required]
    [StringLength(256)]
    public string Name { get; set; }

    [Range(0.01, float.MaxValue)]
    public decimal Price { get; set; }
}
```

### Step 3: Create Application Service Interface

```csharp
// MyApp.Application.Contracts/Services/IProductAppService.cs
public interface IProductAppService : IApplicationService
{
    Task<ProductDto> GetAsync(Guid id);
    Task<List<ProductDto>> GetListAsync();
    Task<ProductDto> CreateAsync(CreateProductDto input);
    Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto input);
    Task DeleteAsync(Guid id);
}
```

### Step 4: Implement Application Service

```csharp
// MyApp.Application/Services/ProductAppService.cs
[Authorize]
public class ProductAppService : ApplicationService, IProductAppService
{
    private readonly IRepository<Product, Guid> _productRepository;

    public ProductAppService(IRepository<Product, Guid> productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto input)
    {
        var product = new Product(input.Name, input.Price);
        await _productRepository.InsertAsync(product);
        return ObjectMapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> GetAsync(Guid id)
    {
        var product = await _productRepository.GetAsync(id);
        return ObjectMapper.Map<ProductDto>(product);
    }

    public async Task<List<ProductDto>> GetListAsync()
    {
        var products = await _productRepository.GetListAsync();
        return ObjectMapper.Map<List<ProductDto>>(products);
    }

    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto input)
    {
        var product = await _productRepository.GetAsync(id);
        product.SetPrice(input.Price); // Domain method enforces business logic
        await _productRepository.UpdateAsync(product);
        return ObjectMapper.Map<ProductDto>(product);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _productRepository.DeleteAsync(id);
    }
}
```

### Step 5: Create AutoMapper Profile

```csharp
// MyApp.Application/Mapper/ProductProfile.cs
public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<Product, ProductDto>();
        CreateMap<CreateProductDto, Product>();
        CreateMap<UpdateProductDto, Product>();
    }
}
```

### Step 6: Create Controller

```csharp
// MyApp.HttpApi/Controllers/ProductController.cs
[Route("api/app/products")]
public class ProductController : AbpController, IProductAppService
{
    private readonly IProductAppService _productAppService;

    public ProductController(IProductAppService productAppService)
    {
        _productAppService = productAppService;
    }

    [HttpPost]
    public async Task<ProductDto> CreateAsync(CreateProductDto input)
        => await _productAppService.CreateAsync(input);

    [HttpGet("{id}")]
    public async Task<ProductDto> GetAsync(Guid id)
        => await _productAppService.GetAsync(id);

    [HttpGet]
    public async Task<List<ProductDto>> GetListAsync()
        => await _productAppService.GetListAsync();

    [HttpPut("{id}")]
    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto input)
        => await _productAppService.UpdateAsync(id, input);

    [HttpDelete("{id}")]
    public async Task DeleteAsync(Guid id)
        => await _productAppService.DeleteAsync(id);
}
```

### Step 7: Create Database Migration

```bash
cd backend/src/MyApp.EntityFrameworkCore
dotnet ef migrations add Added_Product_Table
dotnet ef database update
```

```csharp
// Generated migration
public class Added_Product_Table : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable("Products",
            columns: table => new
            {
                Id = table.Column<Guid>(),
                Name = table.Column<string>(maxLength: 256),
                Price = table.Column<decimal>(precision: 18, scale: 2),
                // Audited fields (CreatedAt, ModifiedAt, etc)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Products", x => x.Id);
            });
    }
}
```

## Entity Patterns

### Aggregate Root with Business Logic

```csharp
public class Order : AuditedAggregateRoot<Guid>
{
    public string OrderNumber { get; private set; }
    public OrderStatus Status { get; private set; }
    public List<OrderLine> Lines { get; private set; } = new();

    // Domain logic
    public void AddLine(Product product, int quantity)
    {
        if (quantity <= 0)
            throw new BusinessException("Quantity must be > 0");
        
        var line = new OrderLine(product, quantity);
        Lines.Add(line);
        
        DomainEvents.AddLocalEvent(new OrderLineAddedEvent(this, line));
    }

    public void Cancel()
    {
        if (Status != OrderStatus.Pending)
            throw new BusinessException("Can only cancel pending orders");
        
        Status = OrderStatus.Cancelled;
        DomainEvents.AddLocalEvent(new OrderCancelledEvent(this));
    }
}
```

### Value Objects

```csharp
public class Money : ValueObject
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency = "USD")
    {
        if (amount < 0) throw new ArgumentException("Amount cannot be negative");
        Amount = amount;
        Currency = currency;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }
}
```

## Database Queries

```csharp
// Using LINQ with IRepository
var products = await _repository
    .Where(p => p.Price > 100)
    .OrderBy(p => p.Name)
    .ToListAsync();

// Using specification pattern (for complex queries)
var spec = new ProductsByPriceSpecification(minPrice: 100);
var products = await _repository.GetListAsync(spec);

// Direct DbContext access (only in Infrastructure layer)
var products = await _dbContext.Products
    .Include(p => p.Lines)
    .Where(p => p.Status == OrderStatus.Completed)
    .ToListAsync();
```

## Dependency Injection

ABP uses Autofac. Services are registered in module classes:

```csharp
// MyApp.Application/MyAppApplicationModule.cs
[DependsOn(typeof(MyAppDomainModule))]
public class MyAppApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddAutoMapperObjectMapper<MyAppApplicationModule>();
    }
}
```

## Testing

```csharp
// MyApp.Application.Tests/Services/ProductAppService_Tests.cs
public class ProductAppService_Tests : MyAppApplicationTestBase
{
    private readonly IProductAppService _productAppService;
    private readonly IRepository<Product, Guid> _productRepository;

    public ProductAppService_Tests()
    {
        _productAppService = GetRequiredService<IProductAppService>();
        _productRepository = GetRequiredService<IRepository<Product, Guid>>();
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateProduct()
    {
        var input = new CreateProductDto { Name = "Test", Price = 100 };
        
        var result = await _productAppService.CreateAsync(input);
        
        result.Id.ShouldNotBe(Guid.Empty);
        result.Name.ShouldBe("Test");
    }

    [Fact]
    public async Task SetPrice_ShouldThrowForNegativePrice()
    {
        var product = new Product("Test", 100);
        await _productRepository.InsertAsync(product);

        var exception = await Should.ThrowAsync<BusinessException>(
            () => product.SetPrice(-10)
        );

        exception.Message.ShouldContain("greater than 0");
    }
}
```

## Naming Conventions

```csharp
// Entities
public class Product : AuditedAggregateRoot<Guid> { }
public class OrderLine : Entity<Guid> { }

// Application Services
public interface IProductAppService : IApplicationService { }
public class ProductAppService : ApplicationService, IProductAppService { }

// DTOs
public class ProductDto { }
public class CreateProductDto { }
public class UpdateProductDto { }

// Repositories (interfaces in Domain, impls in EntityFrameworkCore)
public interface IProductRepository : IRepository<Product, Guid> { }
public class ProductRepository : RepositoryBase<Product, Guid> { }

// Events
public class OrderCreatedEvent : DomainEventBase { }
public class OrderCancelledEvent : DomainEventBase { }

// Domain Services
public class OrderDomainService { }

// Migrations (datetime_descriptive)
// 2026_04_10_001_Added_Product_Table.cs
// 2026_04_10_002_Added_Order_Lines.cs
```

## Configuration

### Connection String

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MyAppDb;User Id=sa;Password=YourPassword;"
  }
}
```

### Database Provider

```csharp
// MyApp.EntityFrameworkCore/MyAppEntityFrameworkCoreModule.cs
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddAbpDbContext<MyAppDbContext>(options =>
    {
        options.UseSqlServer(); // or UseNpgsql() for PostgreSQL
    });
}
```
