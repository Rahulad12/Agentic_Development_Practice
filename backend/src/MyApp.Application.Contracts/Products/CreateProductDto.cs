using System.ComponentModel.DataAnnotations;

namespace MyApp.Application.Contracts.Products;

/// <summary>
/// DTO for creating a new product
/// </summary>
public class CreateProductDto
{
    /// <summary>
    /// Product name (required)
    /// </summary>
    [Required(ErrorMessage = "Product name is required")]
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Product name must be between 1 and 100 characters")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Product description (optional)
    /// </summary>
    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    /// <summary>
    /// Product price (required, must be positive)
    /// </summary>
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    /// <summary>
    /// Initial stock quantity
    /// </summary>
    [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
    public int StockQuantity { get; set; } = 0;

    /// <summary>
    /// Is product active on creation
    /// </summary>
    public bool IsActive { get; set; } = true;
}
