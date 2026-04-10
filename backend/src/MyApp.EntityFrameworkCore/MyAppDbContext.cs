using Microsoft.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.EntityFrameworkCore;

using MyApp.Domain.Products;

namespace MyApp.EntityFrameworkCore;

/// <summary>
/// Application DbContext
/// Inherits from AbpDbContext for ABP framework integration
/// Maps domain entities to database tables
/// </summary>
[ConnectionStringName("Default")]
public class MyAppDbContext : AbpDbContext<MyAppDbContext>
{
    public DbSet<Product> Products => Set<Product>();

    public MyAppDbContext(DbContextOptions<MyAppDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Product entity
        builder.Entity<Product>(b =>
        {
            b.ToTable("Products", schema: "app");

            b.HasKey(p => p.Id);

            b.Property(p => p.Name)
                .IsRequired()
                .HasMaxLength(100);

            b.Property(p => p.Description)
                .HasMaxLength(500);

            b.Property(p => p.Price)
                .HasPrecision(18, 2);

            b.Property(p => p.StockQuantity)
                .IsRequired();

            b.Property(p => p.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            // Indexes for common queries
            b.HasIndex(p => p.Name);
            b.HasIndex(p => p.IsActive);
            b.HasIndex(p => p.CreationTime);
        });
    }
}
