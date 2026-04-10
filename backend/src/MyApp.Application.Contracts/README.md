# MyApp.Application.Contracts

Application Contracts Layer - Contains service interfaces and public DTOs.

## Structure

```
MyApp.Application.Contracts/
├── Services/              # Service interfaces (contracts)
│   └── IProductAppService.cs
├── Dtos/                  # Public DTOs exposed to clients
│   └── ProductDto.cs
└── MyAppApplicationContractsModule.cs  # ABP module definition
```

## Purpose

- **Contracts**: Defines service interfaces
- **Public API**: DTOs exposed to frontend/external clients
- **Decoupling**: Frontend only depends on this layer, not implementation

## Example Service Interface

```csharp
public interface IProductAppService : IApplicationService
{
    Task<ProductDto> GetAsync(Guid id);
    Task<List<ProductDto>> GetListAsync();
    Task<ProductDto> CreateAsync(CreateProductDto input);
    Task UpdateAsync(Guid id, UpdateProductDto input);
    Task DeleteAsync(Guid id);
}
```

## Rules

- ✅ Define service interfaces here
- ✅ Put public DTOs here
- ❌ Never put implementations here
- ❌ No domain entity references

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
