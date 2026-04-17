# MyApp Backend - Node.js/Express

Production-grade backend API built with Node.js, Express, TypeScript, PostgreSQL, and Prisma ORM.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Installation

1. Clone and setup:
```bash
cd backend-api
npm install
cp .env.example .env
```

2. Start PostgreSQL:
```bash
docker-compose up -d
```

3. Run migrations:
```bash
npx prisma migrate dev
```

4. Start development server:
```bash
npm run dev
```

Server will run on http://localhost:3000

## 📁 Project Structure

```
src/
├── features/         # Feature modules (products, auth, etc.)
├── database/         # Prisma client & schema
├── middleware/       # Express middleware
├── lib/              # Utilities & helpers
├── config/           # Environment configuration
├── app.ts            # Express app factory
└── server.ts         # Server entry point
```

## 🏗️ Architecture

**Layered Feature-Based Architecture:**
- **Routes** → **Controller** → **Service** → **Database**
- Each feature is self-contained
- Clean separation of concerns
- Type-safe with TypeScript & Zod validation

## 📚 API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/app/products` | List products with pagination |
| GET | `/api/app/products/:id` | Get single product |
| POST | `/api/app/products` | Create product |
| PUT | `/api/app/products/:id` | Update product |
| DELETE | `/api/app/products/:id` | Delete product |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check (with DB status) |

## 🔒 Authentication

API uses **OAuth2 with JWT tokens**. Protected endpoints require:

```
Authorization: Bearer <jwt_token>
```

Token verification is handled by `auth.middleware.ts`.

## 🗄️ Database

PostgreSQL with Prisma ORM. Migrations are version-controlled.

### Run migrations:
```bash
npx prisma migrate dev
```

### View database:
```bash
npx prisma studio
```

## 🧪 Testing

Tests are written with Jest.

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test:coverage
```

## 🐳 Docker

Build and run in Docker:

```bash
docker build -t myapp-backend:latest .
docker run -p 3000:3000 --env-file .env myapp-backend:latest
```

Or use Docker Compose with PostgreSQL:

```bash
docker-compose up
```

## 📝 Environment Variables

See `.env.example` for all available variables:

- `NODE_ENV` — Development/production
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT signing secret
- `CORS_ORIGIN` — Frontend URL
- `LOG_LEVEL` — Logging verbosity

## 🔧 Scripts

```bash
npm run dev              # Start development server
npm run build           # Compile TypeScript
npm start               # Run compiled version
npm test               # Run tests
npm test:coverage      # Tests with coverage
npx prisma migrate dev # Create/run migrations
npx prisma studio     # Open Prisma Studio
```

## 📖 Conventions

### File Naming
- Components: `kebab-case.ts` (e.g., `product.service.ts`)
- Classes: `PascalCase` in files (e.g., `ProductService`)

### Folder Structure
- Each feature gets its own folder
- Exports via `index.ts` barrel file
- Types in `.types.ts`
- Validation in `.validation.ts`
- Business logic in `.service.ts`
- Request handling in `.controller.ts`
- Routes in `.routes.ts`

### Error Handling
- Throw custom exceptions from `src/lib/error.ts`
- Controller catches and passes to Express error handler
- Global middleware formats response

### Type Safety
- Zod schemas for validation
- TypeScript interfaces for types
- No `any` types (strict mode enabled)

## 🚢 Deployment

Prepare for production:

1. Set `NODE_ENV=production`
2. Provide `DATABASE_URL` for production PostgreSQL
3. Set strong `JWT_SECRET`
4. Run `npm run build`
5. Run migrations: `npx prisma migrate deploy`
6. Start with `npm start`

## 📚 Resources

- [Express Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Testing Framework](https://jestjs.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## 🤝 Contributing

When adding new features:

1. Create feature folder under `src/features/`
2. Define types in `feature.types.ts`
3. Add validation in `feature.validation.ts`
4. Implement service in `feature.service.ts`
5. Create controller in `feature.controller.ts`
6. Define routes in `feature.routes.ts`
7. Write tests in `test/features/feature/`
8. Export from `feature/index.ts`
9. Register in `src/app.ts`

## 📄 License

ISC
