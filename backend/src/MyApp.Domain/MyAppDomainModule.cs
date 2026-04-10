using Volo.Abp.Domain;
using Volo.Abp.Modularity;

namespace MyApp.Domain;

/// <summary>
/// Domain module - contains entities, aggregates, domain services, repository interfaces
/// Depends only on Domain.Shared
/// </summary>
[DependsOn(typeof(AbpDddDomainModule))]
[DependsOn(typeof(MyApp.Domain.Shared.MyAppDomainSharedModule))]
public class MyAppDomainModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);
    }
}
