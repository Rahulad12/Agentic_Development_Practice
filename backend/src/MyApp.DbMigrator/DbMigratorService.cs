using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;

using MyApp.EntityFrameworkCore;

namespace MyApp.DbMigrator;

/// <summary>
/// Database migration service
/// Applies migrations and seeds initial data
/// </summary>
public class DbMigratorService : ITransientDependency
{
    private readonly ILogger<DbMigratorService> _logger;
    private readonly MyAppDbContext _dbContext;

    public DbMigratorService(
        ILogger<DbMigratorService> logger,
        MyAppDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Run migrations and seed data
    /// </summary>
    public async Task MigrateAsync()
    {
        _logger.LogInformation("Starting database migration...");

        try
        {
            // Apply pending migrations
            await _dbContext.Database.MigrateAsync();
            _logger.LogInformation("Database migration completed successfully.");

            // Seed initial data (if needed)
            await SeedDataAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Database migration failed!");
            throw;
        }
    }

    /// <summary>
    /// Seed initial data to database
    /// </summary>
    private async Task SeedDataAsync()
    {
        _logger.LogInformation("Seeding initial data...");

        // Check if data already exists
        if (await _dbContext.Products.AnyAsync())
        {
            _logger.LogInformation("Data already seeded.");
            return;
        }

        // Seed sample products
        // Note: In a real application, use the application service instead
        // This is just a simple example

        _logger.LogInformation("Data seeding completed.");
        await _dbContext.SaveChangesAsync();
    }
}
