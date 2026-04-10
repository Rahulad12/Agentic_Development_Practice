# Backend Setup Instructions

## Initialize ABP Project

This backend project structure is ready, but the .NET source files need to be created using the ABP CLI.

### Step 1: Install ABP CLI (if not already installed)

```bash
dotnet tool install -g Volo.Abp.Cli
```

### Step 2: Create ABP Project

From the `backend/` directory, run:

```bash
abp new MyApp -d ef --database-provider Entity-Framework-Core --ui-framework angular --no-git
```

This will create:
- `src/` folder with all layer projects
- `test/` folder with test projects
- `MyApp.sln` solution file

### Step 3: Configure Database

Edit `src/MyApp.HttpApi.Host/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MyAppDb;User Id=sa;Password=YourPassword;"
  }
}
```

Options:
- **SQL Server** (default): `Server=localhost;Database=MyAppDb;User Id=sa;Password=Password;`
- **PostgreSQL**: `Server=localhost;Port=5432;Database=myappdb;User Id=postgres;Password=Password;`

### Step 4: Run Migrations

```bash
cd src/MyApp.DbMigrator
dotnet run
```

This creates the database and applies all migrations.

### Step 5: Start Backend

```bash
cd src/MyApp.HttpApi.Host
dotnet run
```

API available at: `https://localhost:44300`  
Swagger docs: `https://localhost:44300/swagger`

## Project Structure (After ABP Creation)

```
backend/
├── src/
│   ├── MyApp.Domain/              ← Entities & business logic
│   ├── MyApp.Domain.Shared/       ← Constants, enums, shared DTOs
│   ├── MyApp.Application/         ← App services & orchestration
│   ├── MyApp.Application.Contracts/ ← Interfaces & DTOs
│   ├── MyApp.EntityFrameworkCore/ ← Data access & migrations
│   ├── MyApp.HttpApi/             ← Controllers
│   ├── MyApp.HttpApi.Host/        ← Startup & configuration
│   └── MyApp.DbMigrator/          ← Migration runner
│
├── test/
│   ├── MyApp.Domain.Tests/        ← Domain layer tests
│   ├── MyApp.Application.Tests/   ← App layer tests
│   └── MyApp.HttpApi.Tests/       ← Integration tests
│
└── MyApp.sln                       ← Visual Studio solution
```

## Common Commands

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run tests
dotnet test

# Create migration (from EntityFrameworkCore project)
cd src/MyApp.EntityFrameworkCore
dotnet ef migrations add MigrationName

# Apply migrations
cd src/MyApp.DbMigrator
dotnet run

# Start development server
cd src/MyApp.HttpApi.Host
dotnet run
```

## Next Steps

1. ✅ Run `abp new` to create project files
2. ✅ Configure database connection
3. ✅ Run migrations to create database
4. ✅ Start developing features

See `../../knowledge/wiki/backend.md` for detailed development guide.
