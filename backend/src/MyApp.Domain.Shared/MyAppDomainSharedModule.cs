using Volo.Abp.Modularity;

namespace MyApp.Domain.Shared;

/// <summary>
/// Domain.Shared module - contains only constants, enums, shared DTOs
/// No dependencies on other layers
/// </summary>
[DependsOn(typeof(AbpCoreModule))]
public class MyAppDomainSharedModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);
    }
}
