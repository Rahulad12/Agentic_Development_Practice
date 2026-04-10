using AutoMapper;
using Volo.Abp.Application;
using Volo.Abp.Modularity;

using MyApp.Domain;

namespace MyApp.Application;

/// <summary>
/// Application module - contains app services and DTOs
/// Depends on Domain layer
/// </summary>
[DependsOn(typeof(AbpDddApplicationModule))]
[DependsOn(typeof(MyAppDomainModule))]
public class MyAppApplicationModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);

        // Configure AutoMapper
        context.Services.AddAutoMapper(GetType().Assembly);
    }
}
