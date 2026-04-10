using Volo.Abp.Application;
using Volo.Abp.Modularity;

namespace MyApp.Application.Contracts;

/// <summary>
/// Application.Contracts module - contains DTOs and service interfaces
/// Has no dependencies on other app layers
/// </summary>
[DependsOn(typeof(AbpDddApplicationContractsModule))]
[DependsOn(typeof(MyApp.Domain.Shared.MyAppDomainSharedModule))]
public class MyAppApplicationContractsModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);
    }
}
