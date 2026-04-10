namespace MyApp.Application.Contracts.Products;

/// <summary>
/// Paginated list of products
/// </summary>
public class ProductListDto
{
    /// <summary>
    /// Total number of items (before pagination)
    /// </summary>
    public int TotalCount { get; set; }

    /// <summary>
    /// Current page number
    /// </summary>
    public int CurrentPage { get; set; }

    /// <summary>
    /// Page size
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total pages
    /// </summary>
    public int TotalPages => (TotalCount + PageSize - 1) / PageSize;

    /// <summary>
    /// Product items in this page
    /// </summary>
    public List<ProductDto> Items { get; set; } = [];

    /// <summary>
    /// Check if has next page
    /// </summary>
    public bool HasNextPage => CurrentPage < TotalPages;

    /// <summary>
    /// Check if has previous page
    /// </summary>
    public bool HasPreviousPage => CurrentPage > 1;
}
