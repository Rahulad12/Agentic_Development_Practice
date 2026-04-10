using Serilog;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Autofac;

using MyApp.EntityFrameworkCore;
using MyApp.HttpApi;

var builder = WebApplication.CreateBuilder(args);

// Add Serilog
builder.Host.AddAppSettingsSecretsJson()
    .UseAutofac()
    .UseSerilog((context, configuration) => configuration
        .MinimumLevel.Information()
        .WriteTo.Console()
        .WriteTo.File("logs/app-.txt", rollingInterval: RollingInterval.Day));

// Add ABP
builder.Services.AddApplication<MyAppHttpApiHostModule>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

// Enable CORS for frontend development
app.UseCors(policy =>
{
    policy
        .WithOrigins("http://localhost:5173")  // Vite dev server
        .WithOrigins("https://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
});

app.UseAbpRequestLocalization();
app.UseAbpSecurityHeaders();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.InitializeApplication();
await app.RunAsync();
