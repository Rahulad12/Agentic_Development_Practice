# MyApp.DbMigrator

Database Migration Runner - Applies pending EF Core migrations and seeds initial data.

## Purpose

- **Migrations**: Applies pending database migrations
- **Seed Data**: Seeds initial reference data
- **CI/CD**: Runs automatically in deployment pipelines

## Running Migrations

```bash
cd backend/src/MyApp.DbMigrator
dotnet run
```

This will:
1. Apply pending migrations
2. Run seed data contributors
3. Create/update database schema

## Data Seeding

Implement `IDataSeedContributor` to seed data:

```csharp
public class ProductDataSeeder : IDataSeedContributor
{
    private readonly IRepository<Product, Guid> _repository;

    public async Task SeedAsync(DataSeedContext context)
    {
        if (await _repository.CountAsync() > 0)
            return; // Already seeded

        await _repository.InsertAsync(new Product("Product 1", 99.99m));
        await _repository.InsertAsync(new Product("Product 2", 149.99m));
    }
}
```

## In Production

Always run migrations before deploying:

```bash
# Before deploying app
dotnet run --project src/MyApp.DbMigrator
```

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
