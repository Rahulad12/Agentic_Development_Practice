using AutoMapper;
using MyApp.Application.Contracts.Products;
using MyApp.Domain.Products;

namespace MyApp.Application.Mapping;

/// <summary>
/// AutoMapper configuration for object mapping
/// Maps between domain entities and DTOs
/// </summary>
public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Product mappings
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.StockQuantity))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive))
            .ForMember(dest => dest.CreationTime, opt => opt.MapFrom(src => src.CreationTime))
            .ForMember(dest => dest.LastModificationTime, opt => opt.MapFrom(src => src.LastModificationTime));

        CreateMap<CreateProductDto, Product>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreationTime, opt => opt.Ignore())
            .ForMember(dest => dest.CreatorId, opt => opt.Ignore());

        CreateMap<UpdateProductDto, Product>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}
