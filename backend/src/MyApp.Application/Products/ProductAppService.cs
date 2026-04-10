using AutoMapper;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

using MyApp.Application.Contracts.Products;
using MyApp.Domain.Products;

namespace MyApp.Application.Products;

/// <summary>
/// Product application service
/// Orchestrates domain logic and repository access
/// Never calls DbContext directly - only uses repositories
/// </summary>
public class ProductAppService : ApplicationService, IProductAppService
{
    private readonly IRepository<Product, Guid> _productRepository;
    private readonly IMapper _mapper;

    public ProductAppService(
        IRepository<Product, Guid> productRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Get products with pagination and filtering
    /// </summary>
    public async Task<ProductListDto> GetProductsAsync(GetProductsInput input)
    {
        input.Validate();

        // Build query
        var query = await _productRepository.GetQueryableAsync();

        // Apply filters
        if (!string.IsNullOrEmpty(input.SearchTerm))
        {
            query = query.Where(p => p.Name.Contains(input.SearchTerm));
        }

        if (input.IsActive.HasValue)
        {
            query = query.Where(p => p.IsActive == input.IsActive.Value);
        }

        // Apply sorting
        query = input.SortBy?.ToLower() switch
        {
            "price" => input.SortOrder == "descending"
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price),
            "creationtime" => input.SortOrder == "descending"
                ? query.OrderByDescending(p => p.CreationTime)
                : query.OrderBy(p => p.CreationTime),
            _ => input.SortOrder == "descending"
                ? query.OrderByDescending(p => p.Name)
                : query.OrderBy(p => p.Name),
        };

        // Get total count
        var totalCount = query.Count();

        // Apply pagination
        var items = await AsyncQueryableExtensions.ToListAsync(
            query.Skip((input.Page - 1) * input.PageSize).Take(input.PageSize)
        );

        // Map to DTOs
        var dtos = items.Select(p => _mapper.Map<ProductDto>(p)).ToList();

        return new ProductListDto
        {
            TotalCount = totalCount,
            CurrentPage = input.Page,
            PageSize = input.PageSize,
            Items = dtos
        };
    }

    /// <summary>
    /// Get single product by ID
    /// </summary>
    public async Task<ProductDto> GetProductAsync(Guid id)
    {
        var product = await _productRepository.GetAsync(id);
        return _mapper.Map<ProductDto>(product);
    }

    /// <summary>
    /// Create a new product
    /// </summary>
    public async Task<ProductDto> CreateProductAsync(CreateProductDto input)
    {
        // Create domain entity (business logic is in the entity constructor)
        var product = new Product(GuidGenerator.Create(), input.Name, input.Price)
        {
            Description = input.Description,
            StockQuantity = input.StockQuantity,
            IsActive = input.IsActive
        };

        // Persist using repository
        await _productRepository.InsertAsync(product);

        // Return DTO
        return _mapper.Map<ProductDto>(product);
    }

    /// <summary>
    /// Update an existing product
    /// </summary>
    public async Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductDto input)
    {
        // Get the entity
        var product = await _productRepository.GetAsync(id);

        // Update fields (domain logic is called by domain methods)
        if (!string.IsNullOrEmpty(input.Name))
            product.Name = input.Name;

        if (input.Description != null)
            product.Description = input.Description;

        if (input.Price.HasValue)
            product.UpdatePrice(input.Price.Value);

        if (input.StockQuantity.HasValue)
            product.UpdateStock(input.StockQuantity.Value);

        if (input.IsActive.HasValue)
            product.IsActive = input.IsActive.Value;

        // Update using repository
        await _productRepository.UpdateAsync(product);

        // Return updated DTO
        return _mapper.Map<ProductDto>(product);
    }

    /// <summary>
    /// Delete a product
    /// </summary>
    public async Task DeleteProductAsync(Guid id)
    {
        await _productRepository.DeleteAsync(id);
    }
}
