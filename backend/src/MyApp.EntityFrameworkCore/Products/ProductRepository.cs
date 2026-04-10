using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

using MyApp.Domain.Products;

namespace MyApp.EntityFrameworkCore.Products;

/// <summary>
/// Product repository implementation using Entity Framework Core
/// Inherits from EfCoreRepository for ABP integration
/// </summary>
public class ProductRepository : EfCoreRepository<MyAppDbContext, Product, Guid>, IProductRepository
{
    public ProductRepository(IDbContextProvider<MyAppDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    /// <summary>
    /// Get product by name
    /// </summary>
    public async Task<Product?> GetByNameAsync(string name, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.Products.FirstOrDefaultAsync(p => p.Name == name, cancellationToken);
    }

    /// <summary>
    /// Get all active products
    /// </summary>
    public async Task<List<Product>> GetActiveProductsAsync(CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.Products
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .ToListAsync(cancellationToken);
    }
}
