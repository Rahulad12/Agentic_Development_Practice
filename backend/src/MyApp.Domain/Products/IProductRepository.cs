using Volo.Abp.Domain.Repositories;

namespace MyApp.Domain.Products;

/// <summary>
/// Product repository interface
/// Implemented by EntityFrameworkCore layer
/// </summary>
public interface IProductRepository : IRepository<Product, Guid>
{
    /// <summary>
    /// Get product by name
    /// </summary>
    Task<Product?> GetByNameAsync(string name, CancellationToken cancellationToken = default);

    /// <summary>
    /// Get all active products
    /// </summary>
    Task<List<Product>> GetActiveProductsAsync(CancellationToken cancellationToken = default);
}
