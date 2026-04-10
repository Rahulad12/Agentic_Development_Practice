# MyApp.HttpApi

HTTP API Layer - Contains REST API controllers.

## Structure

```
MyApp.HttpApi/
├── Controllers/           # REST API controllers (thin)
│   └── ProductController.cs
├── Hubs/                  # SignalR hubs (if using real-time)
│   └── NotificationHub.cs
└── MyAppHttpApiModule.cs  # ABP module definition
```

## Purpose

- **Thin Controllers**: Only delegate to application services
- **Route Handling**: Map HTTP requests to actions
- **Authorization**: Apply [Authorize] and permission attributes

## Example Controller

```csharp
[Route("api/app/products")]
public class ProductController : AbpController, IProductAppService
{
    private readonly IProductAppService _productAppService;

    [HttpPost]
    public async Task<ProductDto> CreateAsync(CreateProductDto input)
        => await _productAppService.CreateAsync(input);

    [HttpGet("{id}")]
    public async Task<ProductDto> GetAsync(Guid id)
        => await _productAppService.GetAsync(id);
}
```

## Rules

- ✅ Keep controllers thin
- ✅ Delegate all logic to application services
- ✅ Use [Authorize] for protected endpoints
- ❌ Never put business logic in controllers
- ❌ Never access repositories directly

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
