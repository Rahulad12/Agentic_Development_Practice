using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

using MyApp.Application;
using MyApp.EntityFrameworkCore;

namespace MyApp.DbMigrator;

/// <summary>
/// DbMigrator module - runs database migrations and seed data
/// </summary>
[DependsOn(
    typeof(AbpAutofacModule),
    typeof(MyAppEntityFrameworkCoreModule),
    typeof(MyAppApplicationModule)
)]
public class DbMigratorModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);

        context.Services.AddTransient<DbMigratorService>();
    }
}
