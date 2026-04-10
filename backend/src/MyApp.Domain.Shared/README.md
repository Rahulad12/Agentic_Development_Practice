# MyApp.Domain.Shared

Shared Domain Layer - Contains constants, enums, and DTOs used across all layers.

## Structure

```
MyApp.Domain.Shared/
├── Constants/             # Domain constants
│   └── MyAppConsts.cs
├── Enums/                 # Domain enums
│   ├── OrderStatus.cs
│   └── UserRole.cs
├── Dtos/                  # Shared DTOs (used by all layers)
│   ├── ProductDto.cs
│   └── OrderDto.cs
└── MyAppDomainSharedModule.cs  # ABP module definition
```

## Purpose

- **No Dependencies**: This layer depends on nothing else
- **Used Everywhere**: Referenced by Domain, Application, and Frontend
- **Stable**: Changes here affect many projects
- **Simple Types**: Only contains data classes, no business logic

## Example DTO

```csharp
public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}
```

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
