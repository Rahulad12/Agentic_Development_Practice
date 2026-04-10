namespace MyApp.Application.Contracts.Products;

/// <summary>
/// Product data transfer object for API responses
/// </summary>
public class ProductDto
{
    /// <summary>
    /// Product ID
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Product name
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Product description
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Product price
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Stock quantity
    /// </summary>
    public int StockQuantity { get; set; }

    /// <summary>
    /// Is product active
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Creation timestamp
    /// </summary>
    public DateTime CreationTime { get; set; }

    /// <summary>
    /// Last modification timestamp
    /// </summary>
    public DateTime? LastModificationTime { get; set; }
}
