# MyApp.Application.Tests

Application Layer Unit Tests - Tests for application services.

## Purpose

- **Service Logic**: Test orchestration and business flows
- **DTOs**: Test input validation and mapping
- **Repository Usage**: Test data access patterns

## Structure

```
MyApp.Application.Tests/
├── Services/              # Application service tests
│   └── ProductAppServiceTests.cs
├── Fixtures/              # Test helpers and builders
│   └── ProductDtoBuilder.cs
└── Base/                  # Base test classes
    └── MyAppApplicationTestBase.cs
```

## Example Test

```csharp
public class ProductAppService_Tests : MyAppApplicationTestBase
{
    [Fact]
    public async Task CreateAsync_ShouldCreateProduct()
    {
        var service = GetRequiredService<IProductAppService>();
        var input = new CreateProductDto { Name = "Test", Price = 99.99m };
        
        var result = await service.CreateAsync(input);
        
        result.Id.ShouldNotBe(Guid.Empty);
        result.Name.ShouldBe("Test");
    }
}
```

## Running Tests

```bash
cd backend
dotnet test test/MyApp.Application.Tests
```

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
