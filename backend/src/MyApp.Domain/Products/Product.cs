using Volo.Abp.Domain.Entities.Auditing;

namespace MyApp.Domain.Products;

/// <summary>
/// Product aggregate root
/// Contains all business logic related to products
/// </summary>
public class Product : AuditedAggregateRoot<Guid>
{
    /// <summary>
    /// Product name
    /// </summary>
    public string Name { get; private set; } = string.Empty;

    /// <summary>
    /// Product description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Product price in base currency
    /// </summary>
    public decimal Price { get; private set; }

    /// <summary>
    /// Stock quantity
    /// </summary>
    public int StockQuantity { get; private set; }

    /// <summary>
    /// Is product active/available
    /// </summary>
    public bool IsActive { get; set; }

    private Product()
    {
        // EF Core requires parameterless constructor
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    public Product(Guid id, string name, decimal price)
    {
        Id = id;
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Price = price;
        StockQuantity = 0;
        IsActive = true;
    }

    /// <summary>
    /// Domain logic: Update product price
    /// </summary>
    public void UpdatePrice(decimal newPrice)
    {
        if (newPrice <= 0)
            throw new InvalidOperationException("Price must be positive");

        Price = newPrice;
    }

    /// <summary>
    /// Domain logic: Update stock quantity
    /// </summary>
    public void UpdateStock(int quantity)
    {
        if (quantity < 0)
            throw new InvalidOperationException("Stock quantity cannot be negative");

        StockQuantity = quantity;
    }

    /// <summary>
    /// Domain logic: Deduct from stock when product is sold
    /// </summary>
    public void DeductStock(int quantity)
    {
        if (quantity <= 0)
            throw new InvalidOperationException("Quantity must be positive");

        if (StockQuantity < quantity)
            throw new InvalidOperationException("Insufficient stock");

        StockQuantity -= quantity;
    }
}
