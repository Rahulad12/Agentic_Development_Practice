using Volo.Abp.AspNetCore.Mvc;

using MyApp.Application.Contracts.Products;

namespace MyApp.HttpApi.Products;

/// <summary>
/// Product API controller
/// Thin controller - delegates to application service
/// </summary>
[Area("app")]
[ControllerName("Product")]
[Route("api/app/products")]
public class ProductController : AbpController
{
    private readonly IProductAppService _productAppService;

    public ProductController(IProductAppService productAppService)
    {
        _productAppService = productAppService;
    }

    /// <summary>
    /// Get products with pagination and filtering
    /// </summary>
    /// <remarks>
    /// GET /api/app/products?page=1&pageSize=10&searchTerm=test&isActive=true&sortBy=name&sortOrder=ascending
    /// </remarks>
    [HttpGet]
    public async Task<ProductListDto> GetAsync([FromQuery] GetProductsInput input)
    {
        return await _productAppService.GetProductsAsync(input);
    }

    /// <summary>
    /// Get single product by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ProductDto> GetAsync(Guid id)
    {
        return await _productAppService.GetProductAsync(id);
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    [HttpPost]
    public async Task<ProductDto> PostAsync([FromBody] CreateProductDto input)
    {
        return await _productAppService.CreateProductAsync(input);
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ProductDto> PutAsync(Guid id, [FromBody] UpdateProductDto input)
    {
        return await _productAppService.UpdateProductAsync(id, input);
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    [HttpDelete("{id}")]
    public async Task DeleteAsync(Guid id)
    {
        await _productAppService.DeleteProductAsync(id);
    }
}
