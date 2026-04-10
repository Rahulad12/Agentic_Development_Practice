using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.SqlServer;
using Volo.Abp.Modularity;

using MyApp.Domain;
using MyApp.Domain.Products;
using MyApp.EntityFrameworkCore.Products;

namespace MyApp.EntityFrameworkCore;

/// <summary>
/// Entity Framework Core module
/// Configures DbContext, repositories, and migrations
/// </summary>
[DependsOn(typeof(AbpEntityFrameworkCoreSqlServerModule))]
[DependsOn(typeof(MyAppDomainModule))]
public class MyAppEntityFrameworkCoreModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);

        // Configure DbContext
        context.Services.AddAbpDbContext<MyAppDbContext>(options =>
        {
            options.AddDefaultRepositories(includeAllEntities: true);

            // Register custom repositories
            options.AddRepository<Product, ProductRepository>();
        });

        // Configure Entity Framework Core
        context.Services.Configure<AbpDbContextOptions>(options =>
        {
            options.UseSqlServer();
        });
    }
}
