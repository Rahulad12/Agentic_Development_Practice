# Design: .NET ABP → Node.js/Express Backend Conversion

**Date:** 2026-04-17  
**Status:** Approved  
**Project:** AMNIL Research Claude  

---

## Executive Summary

Convert the existing .NET 9 + ABP Framework backend to **Node.js/Express with TypeScript, PostgreSQL, and Prisma**. The new backend will maintain **exact API parity** with the existing implementation while adopting Node.js best practices and feature-based modular architecture.

**Key Changes:**
- Database: SQL Server → PostgreSQL
- ORM: EF Core → Prisma
- Architecture: Strict layering → Feature-based modules
- Auth: ABP built-in → OAuth2 with JWT tokens
- Testing: xUnit → Jest

---

## Architecture Design

### Directory Structure

```
backend-node/
├── src/
│   ├── features/                           # Feature modules
│   │   ├── products/
│   │   │   ├── product.routes.ts          # Express route definitions
│   │   │   ├── product.controller.ts      # Request handlers (thin)
│   │   │   ├── product.service.ts         # Business logic & repository calls
│   │   │   ├── product.types.ts           # DTOs, interfaces, response types
│   │   │   ├── product.validation.ts      # Input validation schemas
│   │   │   └── index.ts                   # Barrel export
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── index.ts
│   │   └── [future-features]/...
│   │
│   ├── database/
│   │   ├── schema.prisma                  # Prisma schema definition
│   │   ├── migrations/                    # Auto-generated migrations
│   │   ├── seed.ts                        # Database seeding script
│   │   └── client.ts                      # Prisma client singleton
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts             # OAuth2 token verification
│   │   ├── error-handler.ts               # Global error handling
│   │   ├── request-logging.ts             # Request/response logging
│   │   └── validation-error.ts            # Validation error formatting
│   │
│   ├── lib/
│   │   ├── oauth.ts                       # OAuth2 token utils
│   │   ├── logger.ts                      # Winston/Pino logging setup
│   │   ├── error.ts                       # Custom error classes
│   │   ├── pagination.ts                  # Pagination utilities
│   │   └── utils.ts                       # General helpers
│   │
│   ├── config/
│   │   └── env.ts                         # Validated env variables
│   │
│   ├── app.ts                             # Express app factory
│   └── server.ts                          # Server entry point
│
├── test/
│   ├── features/
│   │   ├── products/
│   │   │   └── product.service.test.ts
│   │   └── auth/
│   │       └── auth.service.test.ts
│   ├── integration/
│   │   └── products.api.test.ts
│   └── helpers/
│       ├── test-setup.ts                  # Jest configuration
│       ├── test-db.ts                     # Test DB initialization
│       └── factories.ts                   # Test data factories
│
├── .env.example                           # Environment variable template
├── .env.test                              # Test environment variables
├── .dockerignore
├── Dockerfile                             # Multi-stage Docker build
├── docker-compose.yml                     # Local dev with PostgreSQL
├── jest.config.js                         # Jest configuration
├── tsconfig.json                          # TypeScript configuration
├── package.json
├── package-lock.json
└── README.md
```

---

## API Endpoint Mapping (Exact Parity)

All endpoints from the .NET backend are recreated with identical contracts.

### Products Feature

| Method | Endpoint | Function | Status Code |
|--------|----------|----------|-------------|
| GET | `/api/app/products` | List with pagination, filtering, sorting | 200 / 400 |
| GET | `/api/app/products/{id}` | Get single product | 200 / 404 |
| POST | `/api/app/products` | Create product | 201 / 400 / 401 |
| PUT | `/api/app/products/{id}` | Update product | 200 / 400 / 404 / 401 |
| DELETE | `/api/app/products/{id}` | Delete product | 204 / 404 / 401 |

### Request/Response Contracts (Unchanged)

**GET /api/app/products**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "Description",
      "price": 99.99,
      "stockQuantity": 10,
      "isActive": true,
      "creationTime": "2026-04-17T10:30:00Z"
    }
  ],
  "totalCount": 100,
  "currentPage": 1,
  "pageSize": 10,
  "totalPages": 10,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

**POST /api/app/products**
```json
{
  "name": "New Product",
  "description": "Description",
  "price": 99.99,
  "stockQuantity": 10
}
```

---

## Technology Stack

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.21 | Web framework |
| `typescript` | ^5.3 | Type safety |
| `@prisma/client` | ^5.x | ORM |
| `zod` | ^3.x | Input validation |
| `jsonwebtoken` | ^9.x | JWT token handling |
| `bcrypt` | ^5.x | Password hashing |
| `winston` | ^3.x | Logging |
| `cors` | ^2.8 | CORS handling |
| `dotenv` | ^16.x | Environment variables |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `jest` | ^29.x | Unit & integration testing |
| `@types/jest` | ^29.x | Jest types |
| `ts-jest` | ^29.x | Jest + TypeScript |
| `@types/express` | ^4.x | Express types |
| `nodemon` | ^3.x | Development auto-reload |
| `ts-node` | ^10.x | TypeScript execution |
| `prisma` | ^5.x | Schema & migrations |

---

## Conversion Mapping Details

### Layer Equivalents

| .NET Component | Node.js Equivalent | Example |
|---|---|---|
| `ProductAppService` (app service) | `product.service.ts` | Business logic, repository calls, pagination |
| `ProductController` (thin handler) | `product.controller.ts` | Extracts request data, calls service, formats response |
| `ProductDto`, `CreateProductDto` | `product.types.ts` | TypeScript interfaces and Zod schemas |
| `IProductRepository` (interface) | Prisma model methods + service | `prisma.product.findUnique()` |
| Validation attributes `[Required]` | `zod` schema | `z.object({ name: z.string().min(1) })` |
| `IMapper` (AutoMapper) | Manual mapping | Simple object assignments in service |
| `IRepository<T>` injection | Function imports | `const service = new ProductService(prisma)` |
| ABP's DependsOn modules | ES6 imports | Feature index files re-export items |

### Entity Mapping

**Product.cs (C#)**
```csharp
public class Product : AuditedAggregateRoot<Guid>
{
    public string Name { get; private set; }
    public string? Description { get; set; }
    public decimal Price { get; private set; }
    public int StockQuantity { get; private set; }
    public bool IsActive { get; set; }
    public void UpdatePrice(decimal newPrice) { ... }
    public void UpdateStock(int quantity) { ... }
    public void DeductStock(int quantity) { ... }
}
```

**Product (Prisma)**
```prisma
model Product {
  id              String    @id @default(uuid())
  name            String
  description     String?
  price           Decimal   @db.Decimal(18, 2)
  stockQuantity   Int
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([name])
  @@index([isActive])
  @@index([createdAt])
}
```

---

## Database Schema

### PostgreSQL with Prisma

**Connection:** PostgreSQL 15+  
**Migrations:** Auto-generated by Prisma  
**Seeding:** TypeScript seed file  

**Schema Features:**
- UUID primary keys (native)
- Timestamps: `createdAt`, `updatedAt` (automatic)
- Decimal pricing: `Decimal(18, 2)` precision
- Indexes on: name, isActive, createdAt
- Foreign keys for future relations

---

## Authentication & Authorization

### OAuth2 with JWT

**Flow:**
1. Client (React frontend) obtains JWT from OAuth2 provider (configured separately)
2. Client sends JWT in `Authorization: Bearer <token>` header
3. `auth.middleware.ts` extracts & verifies token
4. User context available in `req.user`
5. Protected routes check token validity

**Token Verification:**
- Signature validation using public key
- Expiration check
- Scope/claims validation if needed
- User context injection into request object

**Middleware Integration:**
```typescript
app.use(authenticateToken);
app.use('/api/app/products', authRequired, productRoutes);
```

**Configuration:**
- OAuth2 provider (GitHub, Google, custom) configured via `.env`
- JWT secret for local verification (if applicable)
- Token expiration and refresh logic

---

## Error Handling

### Custom Error Classes

**AppException** (like .NET BusinessException)
```typescript
class AppException extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 400
  ) {}
}
```

**Global Error Handler Middleware**
- Catches all thrown errors
- Formats into consistent JSON response
- Logs errors with context
- Returns appropriate HTTP status codes

**Error Response Format**
```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID not found",
    "details": null,
    "timestamp": "2026-04-17T10:30:00Z"
  }
}
```

---

## Validation Strategy

### Input Validation with Zod

**Validation Layers:**
1. **Route-level:** Zod schema validation middleware
2. **Service-level:** Business logic validation (e.g., negative price)
3. **Database-level:** Prisma schema constraints

**Example:**
```typescript
// product.validation.ts
export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0)
});
```

---

## Testing Strategy

### Jest Configuration

**Test Structure:**
- **Unit Tests:** Service logic, utilities (mocked Prisma)
- **Integration Tests:** API endpoints with test database
- **Test Database:** Separate PostgreSQL database or in-memory SQLite
- **Fixtures:** Factory functions for test data

**Coverage Targets:**
- Services: 80%+ coverage
- Controllers: 70%+ coverage (integration tests)
- Utils: 90%+ coverage

**Test Lifecycle:**
1. Setup test database with migrations
2. Seed test data using factories
3. Run test
4. Cleanup (transactions rollback)

**Example Test:**
```typescript
describe('ProductService', () => {
  it('should get products with pagination', async () => {
    const result = await productService.getProducts({ skip: 0, take: 10 });
    expect(result.items).toHaveLength(10);
    expect(result.totalCount).toBeGreaterThan(0);
  });
});
```

---

## Development Workflow

### Local Development

**1. Setup**
```bash
cd backend-node
npm install
cp .env.example .env
docker-compose up -d              # Start PostgreSQL
npx prisma migrate dev            # Run migrations & seed
npm run dev                        # Start server on port 3000
```

**2. Feature Development**
- Create feature folder under `src/features/`
- Define types in `feature.types.ts`
- Write validation in `feature.validation.ts`
- Implement service in `feature.service.ts`
- Create controller in `feature.controller.ts`
- Define routes in `feature.routes.ts`
- Write tests in `test/features/`
- Export from `feature/index.ts`

**3. Database Changes**
```bash
# Modify src/database/schema.prisma
npx prisma migrate dev --name add_new_field
```

**4. Testing**
```bash
npm test                           # Run all tests
npm test -- --coverage             # With coverage report
npm test -- --watch                # Watch mode during development
```

---

## Deployment

### Docker & Production

**Dockerfile (Multi-stage)**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY prisma ./prisma
EXPOSE 3000
CMD ["npm", "start"]
```

**Environment Variables (Production)**
- `DATABASE_URL` — PostgreSQL connection string
- `NODE_ENV` — "production"
- `JWT_SECRET` — Token verification secret
- `OAUTH_PROVIDER` — OAuth2 provider configuration
- `CORS_ORIGIN` — Frontend URL

**Migrations in CI/CD**
```bash
npx prisma migrate deploy  # Before starting server
npm start
```

---

## Code Organization Principles

### Feature Modules (Modular Design)
Each feature is self-contained with clear boundaries:
- Routes define HTTP interface
- Controller handles requests
- Service contains business logic
- Types define contracts
- Validation ensures input integrity

### Dependency Flow (Clean Architecture)
```
Routes → Controller → Service → Database (Prisma)
                  ↓
            Validation & Errors
```

- Routes don't call database directly
- Services don't expose implementation details
- Controllers stay thin (validation + delegation)
- Database access only through Prisma

### Module Exports (Barrel Pattern)
Each feature's `index.ts` re-exports public API:
```typescript
export * from './product.types';
export * from './product.routes';
export { ProductService } from './product.service';
```

---

## Migration Strategy (from .NET to Node.js)

### Phase 1: Setup & Infrastructure
- Create Node.js project structure
- Configure PostgreSQL + Prisma
- Setup Express app and middleware
- Configure environment variables

### Phase 2: Core Features
- Migrate Product entity & repository
- Implement Product CRUD service
- Create Product API routes & controller
- Write Product tests

### Phase 3: Authentication
- Integrate OAuth2 middleware
- Implement auth routes (login, verify)
- Protect API endpoints
- Test auth flow

### Phase 4: Remaining Features
- Migrate any other entities (as needed)
- Implement feature-specific logic
- Full test coverage
- Documentation

### Phase 5: Integration & Cutover
- Integration testing with React frontend
- Performance testing
- Cutover strategy (parallel run or flag-based)
- Monitoring & logging setup

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| **API Incompatibility** | Maintain exact same request/response contracts, verify with integration tests |
| **Data Loss** | Careful Prisma migration, test migrations thoroughly, backup before production |
| **Performance** | Database indexes match .NET version, N+1 query testing, connection pooling |
| **Authentication** | Test OAuth2 flow extensively, token verification correctness, error handling |
| **Concurrent Requests** | Prisma connection pooling, proper error handling in services, transaction support |

---

## Success Criteria

✅ All Product CRUD endpoints working identically to .NET version  
✅ Database migrated to PostgreSQL with zero data loss  
✅ OAuth2 authentication integrated and tested  
✅ Jest test suite with 80%+ coverage  
✅ Docker deployment working  
✅ React frontend communicates without changes  
✅ Performance comparable to .NET baseline  
✅ Logging & error tracking operational  

---

## Files & Deliverables

By completion:
- ✅ Full Node.js/Express backend codebase
- ✅ PostgreSQL schema via Prisma
- ✅ Jest test suite
- ✅ Docker build & compose files
- ✅ Environment configuration
- ✅ README with setup instructions
- ✅ Migration guide for future features
- ✅ API documentation (OpenAPI/Swagger optional)

---

## References

- Prisma Docs: https://www.prisma.io/docs
- Express Best Practices: https://expressjs.com/en/advanced/best-practice-security.html
- Jest Testing: https://jestjs.io
- PostgreSQL: https://www.postgresql.org/docs
