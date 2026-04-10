# MyApp.EntityFrameworkCore

Infrastructure Layer - Contains EF Core configuration, migrations, and repository implementations.

## Structure

```
MyApp.EntityFrameworkCore/
├── DbContexts/            # EF Core DbContext
│   └── MyAppDbContext.cs
├── Repositories/          # Repository implementations
│   └── ProductRepository.cs
├── EntityConfigurations/  # EF Core fluent configurations
│   └── ProductConfiguration.cs
├── Migrations/            # Database migrations
│   └── 2026_04_10_001_Initial.cs
└── MyAppEntityFrameworkCoreModule.cs  # ABP module definition
```

## Purpose

- **Data Access**: Implements repositories
- **Migrations**: Database schema management
- **ORM Configuration**: Entity mappings and relationships

## Example Repository

```csharp
public class ProductRepository : RepositoryBase<Product, Guid>, IProductRepository
{
    public async Task<List<Product>> GetByPriceAsync(decimal minPrice)
    {
        return await (await GetQueryableAsync())
            .Where(p => p.Price >= minPrice)
            .ToListAsync();
    }
}
```

## Database Setup

```bash
# Create migration
cd backend/src/MyApp.EntityFrameworkCore
dotnet ef migrations add MigrationName

# Apply migrations
cd ../MyApp.DbMigrator
dotnet run
```

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
