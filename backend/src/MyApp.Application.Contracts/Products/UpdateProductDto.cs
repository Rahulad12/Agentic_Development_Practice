using System.ComponentModel.DataAnnotations;

namespace MyApp.Application.Contracts.Products;

/// <summary>
/// DTO for updating an existing product
/// </summary>
public class UpdateProductDto
{
    /// <summary>
    /// Product name
    /// </summary>
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Product name must be between 1 and 100 characters")]
    public string? Name { get; set; }

    /// <summary>
    /// Product description
    /// </summary>
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    /// <summary>
    /// Product price (must be positive if provided)
    /// </summary>
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal? Price { get; set; }

    /// <summary>
    /// Stock quantity
    /// </summary>
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
    public int? StockQuantity { get; set; }

    /// <summary>
    /// Is product active
    /// </summary>
    public bool? IsActive { get; set; }
}
