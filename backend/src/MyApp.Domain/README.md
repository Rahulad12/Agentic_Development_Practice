# MyApp.Domain

Domain Layer - Contains entities, aggregates, and domain logic.

## Structure

```
MyApp.Domain/
├── Entities/              # Domain entities and aggregate roots
│   ├── Product.cs
│   └── Order.cs
├── Repositories/          # Repository interfaces (implementations in EntityFrameworkCore)
│   └── IProductRepository.cs
├── DomainServices/        # Domain services with business logic
│   └── ProductDomainService.cs
├── ValueObjects/          # Value objects
│   └── Money.cs
├── Exceptions/            # Custom domain exceptions
│   └── InsufficientStockException.cs
└── MyAppDomainModule.cs   # ABP module definition
```

## Key Principles

- **Business Logic**: All business logic lives HERE, not in application services
- **Entities**: Inherit from `Entity<TKey>` or `AggregateRoot<TKey>`
- **No Dependencies**: This layer has NO dependencies on other layers
- **Immutability**: Use private setters and exposed methods for state changes

## Example Entity

```csharp
public class Product : AuditedAggregateRoot<Guid>
{
    public string Name { get; private set; }
    public decimal Price { get; private set; }

    public void UpdatePrice(decimal newPrice)
    {
        if (newPrice <= 0)
            throw new DomainException("Price must be positive");
        Price = newPrice;
    }
}
```

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
