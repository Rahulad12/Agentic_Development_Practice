# MyApp.Application

Application Layer - Contains application services that orchestrate domain logic.

## Structure

```
MyApp.Application/
├── Services/              # Application services (implementations)
│   ├── IProductAppService.cs
│   └── ProductAppService.cs
├── Dtos/                  # Application-layer specific DTOs
│   ├── CreateProductDto.cs
│   └── UpdateProductDto.cs
├── AutoMapper/            # AutoMapper profiles for object mapping
│   └── ProductProfile.cs
├── AppServices/           # Additional app-level services
│   └── AuthAppService.cs
└── MyAppApplicationModule.cs  # ABP module definition
```

## Purpose

- **Orchestration**: Coordinates domain logic
- **DTOs**: Uses DTOs for input/output
- **Services**: Implements interfaces from Application.Contracts
- **Dependency**: Depends on Domain and Domain.Shared

## Example Application Service

```csharp
[Authorize]
public class ProductAppService : ApplicationService, IProductAppService
{
    private readonly IRepository<Product, Guid> _productRepository;

    public async Task<ProductDto> CreateAsync(CreateProductDto input)
    {
        var product = new Product(input.Name, input.Price);
        await _productRepository.InsertAsync(product);
        return ObjectMapper.Map<ProductDto>(product);
    }
}
```

## Rules

- ✅ Use IRepository<> for data access
- ✅ Use DTOs for input/output
- ✅ Delegate business logic to domain
- ❌ Never use DbContext directly
- ❌ Never expose domain entities

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
