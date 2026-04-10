# MyApp.HttpApi.Host

ASP.NET Core Host - Application startup, configuration, and middleware setup.

## Structure

```
MyApp.HttpApi.Host/
├── appsettings.json           # Development configuration
├── appsettings.Development.json  # Dev-specific (NOT committed)
├── appsettings.Production.json   # Prod-specific (NOT committed)
├── Program.cs                 # Startup and DI configuration
├── MyAppHttpApiHostModule.cs  # ABP module definition
├── Properties/
│   └── launchSettings.json    # Launch profiles
└── wwwroot/                   # Static files
```

## Configuration

Edit `appsettings.json` for database and runtime settings:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=MyAppDb;User Id=sa;Password=YourPassword;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

## Running

```bash
cd backend/src/MyApp.HttpApi.Host
dotnet run
```

Server listens on:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:44300`

## Swagger / OpenAPI

API documentation automatically available at:
- `https://localhost:44300/swagger`

## Middleware Setup

Common middleware in Program.cs:
- CORS configuration
- Authentication (JWT)
- Swagger/OpenAPI
- Error handling
- Logging

## See Also

- [Backend Development Guide](../../knowledge/wiki/backend.md)
- [Architecture](../../docs/architecture.md)
