using Volo.Abp.Application.Services;

namespace MyApp.Application.Contracts.Products;

/// <summary>
/// Product application service interface
/// Defines API contracts for product operations
/// </summary>
public interface IProductAppService : IApplicationService
{
    /// <summary>
    /// Get products with pagination
    /// </summary>
    Task<ProductListDto> GetProductsAsync(GetProductsInput input);

    /// <summary>
    /// Get single product by ID
    /// </summary>
    Task<ProductDto> GetProductAsync(Guid id);

    /// <summary>
    /// Create a new product
    /// </summary>
    Task<ProductDto> CreateProductAsync(CreateProductDto input);

    /// <summary>
    /// Update an existing product
    /// </summary>
    Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto input);

    /// <summary>
    /// Delete a product
    /// </summary>
    Task DeleteProductAsync(Guid id);
}
