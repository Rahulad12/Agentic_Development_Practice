namespace MyApp.Application.Contracts.Products;

/// <summary>
/// Input DTO for getting products with pagination and filtering
/// </summary>
public class GetProductsInput
{
    /// <summary>
    /// Page number (1-based)
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// Page size
    /// </summary>
    public int PageSize { get; set; } = 10;

    /// <summary>
    /// Search filter for product name
    /// </summary>
    public string? SearchTerm { get; set; }

    /// <summary>
    /// Filter by active status (null = all)
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Sort field (Name, Price, CreationTime)
    /// </summary>
    public string? SortBy { get; set; }

    /// <summary>
    /// Sort direction (ascending/descending)
    /// </summary>
    public string SortOrder { get; set; } = "ascending";

    /// <summary>
    /// Validate and normalize input
    /// </summary>
    public void Validate()
    {
        if (Page < 1) Page = 1;
        if (PageSize < 1) PageSize = 10;
        if (PageSize > 100) PageSize = 100; // Max 100 items per page

        if (!string.IsNullOrEmpty(SortOrder))
            SortOrder = SortOrder.ToLower() == "desc" ? "descending" : "ascending";
    }
}
