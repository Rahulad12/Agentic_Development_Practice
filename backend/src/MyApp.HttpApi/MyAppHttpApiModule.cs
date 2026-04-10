using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Modularity;

using MyApp.Application.Contracts;

namespace MyApp.HttpApi;

/// <summary>
/// HttpApi module - contains controllers
/// Depends on Application.Contracts
/// </summary>
[DependsOn(typeof(AbpAspNetCoreMvcModule))]
[DependsOn(typeof(MyAppApplicationContractsModule))]
public class MyAppHttpApiModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);

        // Controllers are auto-discovered
    }
}
