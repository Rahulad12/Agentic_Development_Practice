# MyApp.Domain.Tests

Domain Layer Unit Tests - Tests for entities, aggregates, and domain services.

## Purpose

- **Business Logic**: Test domain entity behavior
- **Validation**: Test business rules and constraints
- **Edge Cases**: Test error conditions

## Structure

```
MyApp.Domain.Tests/
├── Entities/              # Entity tests
│   └── ProductTests.cs
├── Services/              # Domain service tests
│   └── ProductDomainServiceTests.cs
└── Fixtures/              # Test data and builders
    └── ProductBuilder.cs
```

## Example Test

```csharp
public class Product_Tests : IClassFixture<TestDataFixture>
{
    [Fact]
    public void SetPrice_ShouldThrowForNegativePrice()
    {
        var product = new Product("Test", 100);
        
        var exception = Should.Throw<DomainException>(
            () => product.SetPrice(-10)
        );
        
        exception.Message.ShouldContain("positive");
    }
}
```

## Running Tests

```bash
cd backend
dotnet test test/MyApp.Domain.Tests
```

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
