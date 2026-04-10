using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.MultiTenancy;
using Volo.Abp.AspNetCore.Serilog;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;
using Volo.Abp.Swashbuckle;

using MyApp.Application;
using MyApp.EntityFrameworkCore;
using MyApp.HttpApi;

namespace MyApp.HttpApi.Host;

/// <summary>
/// HttpApi.Host module - the actual ASP.NET Core application startup
/// Aggregates all other modules and configures the full application
/// </summary>
[DependsOn(
    typeof(AbpAutofacModule),
    typeof(AbpAspNetCoreMvcModule),
    typeof(AbpAspNetCoreSerilogModule),
    typeof(AbpSwashbuckleModule),
    typeof(MyAppHttpApiModule),
    typeof(MyAppApplicationModule),
    typeof(MyAppEntityFrameworkCoreModule)
)]
public class MyAppHttpApiHostModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ChangeControllerApiExplorerGroupName = false;
        });
    }

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        base.ConfigureServices(context);

        var configuration = context.Services.GetConfiguration();

        // Configure Swagger/OpenAPI
        context.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new()
            {
                Title = "AMNIL Research Claude API",
                Version = "v1.0",
                Description = "API documentation for AMNIL Research Claude backend"
            });
        });

        // Add CORS
        context.Services.AddCors(options =>
        {
            options.AddPolicy("Frontend", policy =>
            {
                policy
                    .WithOrigins(
                        "http://localhost:5173",
                        "https://localhost:5173")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        // Configure ABP options
        Configure<AbpAspNetCoreMvcOptions>(options =>
        {
            options.ConventionalControllers.Create(typeof(MyAppHttpApiModule).Assembly);
        });
    }

    public override void OnApplicationInitialization(ApplicationInitializationContext context)
    {
        var app = context.GetApplicationBuilder();
        var env = context.GetEnvironment();

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseAbpRequestLocalization();

        if (!env.IsDevelopment())
        {
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();

        app.UseCors("Frontend");

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "AMNIL Research Claude API v1");
        });

        app.UseAuditing();
        app.UseAbpSerilogEnrichers();
        app.UseConfiguredEndpoints();
    }
}
