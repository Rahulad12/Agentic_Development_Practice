# MyApp.HttpApi.Tests

HTTP API Integration Tests - Tests for REST API endpoints.

## Purpose

- **Endpoints**: Test API routes and responses
- **Integration**: Test full request/response cycle
- **Auth**: Test authentication and authorization
- **Error Handling**: Test error responses and status codes

## Structure

```
MyApp.HttpApi.Tests/
├── Controllers/           # Controller/endpoint tests
│   └── ProductControllerTests.cs
├── Fixtures/              # Test clients and builders
│   └── HttpClientFixture.cs
└── Base/                  # Base integration test classes
    └── HttpApiTestBase.cs
```

## Example Test

```csharp
public class ProductController_Tests : HttpApiTestBase
{
    [Fact]
    public async Task CreateProduct_ShouldReturnCreatedStatus()
    {
        var input = new CreateProductDto { Name = "Test", Price = 99.99m };
        var response = await Client.PostAsJsonAsync("/api/app/products", input);
        
        response.StatusCode.ShouldBe(HttpStatusCode.Created);
        var result = await response.Content.ReadAsAsync<ProductDto>();
        result.Name.ShouldBe("Test");
    }
}
```

## Running Tests

```bash
cd backend
dotnet test test/MyApp.HttpApi.Tests
```

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
