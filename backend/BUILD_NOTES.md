# Backend Build Notes

**Created:** 2026-04-10  
**Status:** Project structure complete, ready for build

---

## NuGet Package Resolution

### Current Environment

The build environment does not have internet access to NuGet package sources. When you run on your machine:

```bash
cd backend
dotnet restore
```

This will download all ABP Framework packages from `nuget.org`.

### Expected Behavior

✅ **On your machine (with internet):**
```bash
dotnet restore    # Downloads ~200MB of packages
dotnet build      # Compiles successfully
```

### If you get "Unable to find package Volo.Abp.*"

**Solution 1: Check internet connection**
```bash
# Test connectivity
ping nuget.org
```

**Solution 2: Clear NuGet cache**
```bash
nuget locals all -clear
dotnet nuget locals all --clear
```

**Solution 3: Force restore**
```bash
dotnet restore --force
```

**Solution 4: Add NuGet source explicitly**
```bash
dotnet nuget add source https://api.nuget.org/v3/index.json -n nuget.org
```

### NuGet Packages Required

All package versions are pinned in `.csproj` files:

| Package | Version | Layer |
|---------|---------|-------|
| `Volo.Abp.Core` | 8.1.3 | Domain.Shared |
| `Volo.Abp.Domain` | 8.1.3 | Domain |
| `Volo.Abp.Ddd.Domain` | 8.1.3 | Domain |
| `Volo.Abp.Application.Contracts` | 8.1.3 | Application.Contracts |
| `Volo.Abp.Application` | 8.1.3 | Application |
| `Volo.Abp.EntityFrameworkCore` | 8.1.3 | EntityFrameworkCore |
| `Volo.Abp.EntityFrameworkCore.SqlServer` | 8.1.3 | EntityFrameworkCore |
| `Volo.Abp.AspNetCore.Mvc` | 8.1.3 | HttpApi |
| `Volo.Abp.AspNetCore.Serilog` | 8.1.3 | HttpApi.Host |
| `Volo.Abp.Autofac` | 8.1.3 | HttpApi.Host |
| `Volo.Abp.Swashbuckle` | 8.1.3 | HttpApi.Host |
| `Microsoft.EntityFrameworkCore` | 9.0.0 | EntityFrameworkCore |
| `Microsoft.EntityFrameworkCore.SqlServer` | 9.0.0 | EntityFrameworkCore |
| `Microsoft.EntityFrameworkCore.Design` | 9.0.0 | EntityFrameworkCore |
| `Microsoft.EntityFrameworkCore.Tools` | 9.0.0 | EntityFrameworkCore |
| `AutoMapper` | 13.0.1 | Application |
| `Serilog.AspNetCore` | 8.0.0 | HttpApi.Host |
| `Serilog.Sinks.Console` | 5.0.0 | HttpApi.Host, DbMigrator |
| `Serilog.Sinks.File` | 5.0.0 | HttpApi.Host, DbMigrator |

---

## Build Commands

### Full build
```bash
cd backend
dotnet build
```

### Build specific project
```bash
dotnet build src/MyApp.Application/MyApp.Application.csproj
```

### Clean & rebuild
```bash
dotnet clean
dotnet build
```

### Publish for production
```bash
dotnet publish src/MyApp.HttpApi.Host/MyApp.HttpApi.Host.csproj -c Release -o ./publish
```

---

## Common Build Issues

### 1. "project file does not exist"

**Issue:** Path to .csproj is wrong

**Solution:** Verify file exists
```bash
ls src/MyApp.Domain/MyApp.Domain.csproj
```

### 2. ".NET SDK version not found"

**Issue:** Machine has older .NET SDK

**Solution:** Install .NET 9
```bash
# Download from https://dotnet.microsoft.com/download/dotnet/9.0
dotnet --version  # Verify 9.x.x
```

### 3. "Target framework not installed"

**Issue:** net9.0 SDK missing

**Solution:** Update global.json or install SDK
```bash
cat backend/global.json
```

Should show:
```json
{
  "sdk": {
    "version": "9.0.0"
  }
}
```

---

## Project Structure Verification

To verify all projects are correctly structured:

```bash
cd backend

# List all projects
dotnet sln list

# Check specific project
dotnet list src/MyApp.Domain/MyApp.Domain.csproj dependencies
```

### Expected output
```
Project reference(s)
MyApp.Domain -> MyApp.Domain.Shared
MyApp.Application -> MyApp.Domain + MyApp.Application.Contracts
MyApp.EntityFrameworkCore -> MyApp.Domain
MyApp.HttpApi -> MyApp.Application.Contracts
MyApp.HttpApi.Host -> MyApp.HttpApi + MyApp.Application + MyApp.EntityFrameworkCore
```

---

## Build Configuration

### Debug build (default)
```bash
dotnet build                    # Default = Debug
dotnet build -c Debug          # Explicit
```

### Release build
```bash
dotnet build -c Release        # Optimized for production
```

### Restore without build
```bash
dotnet restore                 # Just download packages
```

---

## Docker Build

Once build succeeds locally, create Docker image:

```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder
WORKDIR /app
COPY . .
RUN dotnet build
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=builder /app/out .
EXPOSE 80 443
ENTRYPOINT ["dotnet", "MyApp.HttpApi.Host.dll"]
```

Build:
```bash
docker build -t myapp-backend:latest -f Dockerfile .
```

---

## Next Steps

1. **Run on your machine:**
   ```bash
   cd backend
   dotnet restore  # Get packages
   dotnet build    # Compile
   ```

2. **Verify build succeeds** before running

3. **Run migrations:**
   ```bash
   cd src/MyApp.DbMigrator
   dotnet run
   ```

4. **Start server:**
   ```bash
   cd src/MyApp.HttpApi.Host
   dotnet run
   ```

---

## Troubleshooting Checklist

- [ ] .NET 9 SDK installed (`dotnet --version`)
- [ ] Internet connection available (for NuGet)
- [ ] No firewall blocking nuget.org
- [ ] Project files exist (`ls src/*/`)
- [ ] global.json uses .NET 9
- [ ] All .csproj files reference correct versions
- [ ] `dotnet restore` succeeds
- [ ] `dotnet build` succeeds
- [ ] No build warnings or errors

If all pass, you're ready to run! 🚀
