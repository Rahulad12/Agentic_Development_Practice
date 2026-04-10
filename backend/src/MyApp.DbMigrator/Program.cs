using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Volo.Abp;
using Volo.Abp.Autofac;

using MyApp.Application;
using MyApp.DbMigrator;
using MyApp.EntityFrameworkCore;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/migration-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    var builder = Host.CreateDefaultBuilder(args);

    builder.AddAppSettingsSecretsJson()
        .UseAutofac()
        .UseSerilog();

    builder.ConfigureServices((context, services) =>
    {
        services.AddApplication<DbMigratorModule>();
    });

    var host = builder.Build();

    using (var scope = host.Services.CreateScope())
    {
        await scope.ServiceProvider
            .GetRequiredService<DbMigratorService>()
            .MigrateAsync();
    }

    return 0;
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly!");
    return 1;
}
finally
{
    Log.CloseAndFlush();
}
