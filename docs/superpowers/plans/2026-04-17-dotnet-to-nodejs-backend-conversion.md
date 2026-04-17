# .NET ABP → Node.js/Express Backend Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the .NET ABP backend to Node.js/Express with PostgreSQL, maintaining exact API parity and clean architecture principles.

**Architecture:** Feature-based modular structure with Express routes, controllers, services, and Prisma ORM. Each feature (Products, Auth) lives in its own folder with clear separation of concerns.

**Tech Stack:** Node.js 20, Express 4.x, TypeScript 5.x, PostgreSQL, Prisma ORM, Zod validation, JWT/OAuth2, Jest testing, Winston logging.

---

## File Structure Overview

**New backend directory:**
```
backend-api/
├── src/
│   ├── features/
│   │   ├── products/
│   │   │   ├── product.types.ts
│   │   │   ├── product.validation.ts
│   │   │   ├── product.service.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── product.routes.ts
│   │   │   └── index.ts
│   │   ├── health/
│   │   │   ├── health.controller.ts
│   │   │   ├── health.routes.ts
│   │   │   └── index.ts
│   │   └── auth/
│   │       ├── auth.types.ts
│   │       ├── auth.validation.ts
│   │       ├── auth.service.ts
│   │       ├── auth.controller.ts
│   │       ├── auth.routes.ts
│   │       └── index.ts
│   ├── database/
│   │   ├── schema.prisma
│   │   └── client.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error-handler.ts
│   │   └── validation-error.ts
│   ├── lib/
│   │   ├── error.ts
│   │   ├── logger.ts
│   │   ├── pagination.ts
│   │   └── oauth.ts
│   ├── config/
│   │   └── env.ts
│   ├── app.ts
│   └── server.ts
├── test/
│   ├── features/
│   │   ├── products/
│   │   │   └── product.service.test.ts
│   │   └── auth/
│   │       └── auth.service.test.ts
│   └── helpers/
│       ├── test-setup.ts
│       └── factories.ts
├── .env.example
├── .dockerignore
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## PHASE 1: Project Setup & Infrastructure

### Task 1: Initialize Node.js Project Structure

**Files:**
- Create: `backend-api/package.json`
- Create: `backend-api/tsconfig.json`
- Create: `backend-api/.gitignore`
- Create: `backend-api/.env.example`

- [ ] **Step 1: Create backend-node directory and package.json**

```bash
mkdir -p backend-node
cd backend-node
```

Create `package.json`:
```json
{
  "name": "myapp-backend",
  "version": "1.0.0",
  "description": "Node.js/Express backend converted from .NET ABP",
  "main": "dist/server.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:studio": "prisma studio"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.21.0",
    "typescript": "^5.3.3",
    "@prisma/client": "^5.8.0",
    "zod": "^3.22.4",
    "jsonwebtoken": "^9.1.2",
    "bcrypt": "^5.1.1",
    "winston": "^3.11.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.11",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/bcrypt": "^5.0.2",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "prisma": "^5.8.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
.env
.env.local
.env.*.local
*.log
.DS_Store
coverage/
.prisma/
.vscode/
.idea/
```

- [ ] **Step 4: Create .env.example**

```
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp_db

# JWT/OAuth
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRATION=24h
OAUTH_PROVIDER=github
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=info
```

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json .gitignore .env.example
git commit -m "chore: initialize Node.js project structure"
```

---

### Task 2: Setup Express App & Middleware Foundation

**Files:**
- Create: `backend-api/src/config/env.ts`
- Create: `backend-api/src/lib/error.ts`
- Create: `backend-api/src/lib/logger.ts`
- Create: `backend-api/src/middleware/error-handler.ts`
- Create: `backend-api/src/middleware/validation-error.ts`
- Create: `backend-api/src/app.ts`
- Create: `backend-api/src/server.ts`

- [ ] **Step 1: Create env.ts for environment variables**

Create `src/config/env.ts`:
```typescript
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/myapp_db',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  OAUTH_PROVIDER: process.env.OAUTH_PROVIDER || 'github',
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || '',
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
```

- [ ] **Step 2: Create error.ts for custom error classes**

Create `src/lib/error.ts`:
```typescript
export class AppException extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppException';
  }
}

export class ValidationException extends AppException {
  constructor(
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationException';
  }
}

export class NotFoundException extends AppException {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundException';
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenException';
  }
}
```

- [ ] **Step 3: Create logger.ts for Winston logging**

Create `src/lib/logger.ts`:
```typescript
import winston from 'winston';
import { env } from '@/config/env';

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'myapp-backend' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

export default logger;
```

- [ ] **Step 4: Create error-handler middleware**

Create `src/middleware/error-handler.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import { AppException, ValidationException } from '@/lib/error';
import logger from '@/lib/logger';

export const errorHandler = (
  err: Error | AppException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ValidationException) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.fields || null,
        timestamp: new Date().toISOString(),
      },
    });
  }

  if (err instanceof AppException) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: null,
        timestamp: new Date().toISOString(),
      },
    });
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      details: null,
      timestamp: new Date().toISOString(),
    },
  });
};
```

- [ ] **Step 5: Create validation-error middleware**

Create `src/middleware/validation-error.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const validationErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    err.errors.forEach((error) => {
      const path = error.path.join('.');
      if (!fields[path]) {
        fields[path] = [];
      }
      fields[path].push(error.message);
    });

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: fields,
        timestamp: new Date().toISOString(),
      },
    });
  }
  next(err);
};
```

- [ ] **Step 6: Create app.ts**

Create `src/app.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import { env } from '@/config/env';
import { errorHandler } from '@/middleware/error-handler';
import { validationErrorHandler } from '@/middleware/validation-error';
import logger from '@/lib/logger';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes will be registered here in later tasks

  // Error handling
  app.use(validationErrorHandler);
  app.use(errorHandler);

  return app;
};
```

- [ ] **Step 7: Create server.ts**

Create `src/server.ts`:
```typescript
import { createApp } from '@/app';
import { env } from '@/config/env';
import logger from '@/lib/logger';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on http://localhost:${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});
```

- [ ] **Step 8: Commit**

```bash
git add src/config/ src/lib/ src/middleware/ src/app.ts src/server.ts
git commit -m "feat: setup Express app with middleware and error handling"
```

---

### Task 3: Setup Prisma & PostgreSQL

**Files:**
- Create: `backend-api/prisma/schema.prisma`
- Create: `backend-api/src/database/client.ts`
- Create: `backend-api/docker-compose.yml`

- [ ] **Step 1: Install Prisma CLI**

```bash
npm install
npx prisma init
```

- [ ] **Step 2: Create Prisma schema**

Create `prisma/schema.prisma`:
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id              String    @id @default(uuid())
  name            String    @db.VarChar(255)
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

- [ ] **Step 3: Create Prisma client singleton**

Create `src/database/client.ts`:
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
```

- [ ] **Step 4: Create docker-compose.yml for PostgreSQL**

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: myapp-postgres
    environment:
      POSTGRES_USER: myapp_user
      POSTGRES_PASSWORD: myapp_password
      POSTGRES_DB: myapp_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U myapp_user']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

- [ ] **Step 5: Update .env with PostgreSQL connection**

Edit `.env`:
```
DATABASE_URL=postgresql://myapp_user:myapp_password@localhost:5432/myapp_db
```

- [ ] **Step 6: Start PostgreSQL and run migrations**

```bash
docker-compose up -d
npx prisma migrate dev --name init
```

- [ ] **Step 7: Commit**

```bash
git add prisma/schema.prisma src/database/client.ts docker-compose.yml .env
git commit -m "feat: setup Prisma and PostgreSQL database"
```

---

## PHASE 2: Core Product Feature

### Task 4: Product Types & Validation

**Files:**
- Create: `backend-api/src/features/products/product.types.ts`
- Create: `backend-api/src/features/products/product.validation.ts`

- [ ] **Step 1: Create product.types.ts**

Create `src/features/products/product.types.ts`:
```typescript
// DTOs (matching .NET backend)
export interface ProductDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  creationTime: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  isActive?: boolean;
}

export interface GetProductsInput {
  skipCount?: number;
  maxResultCount?: number;
  sorting?: string;
  filter?: string;
}

export interface ProductListDto {
  items: ProductDto[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Internal types
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  skip: number;
  take: number;
}
```

- [ ] **Step 2: Create product.validation.ts**

Create `src/features/products/product.validation.ts`:
```typescript
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  description: z.string().optional(),
  price: z
    .number()
    .positive('Price must be positive'),
  stockQuantity: z
    .number()
    .int()
    .nonnegative('Stock quantity must be non-negative'),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters')
    .optional(),
  description: z.string().optional(),
  price: z
    .number()
    .positive('Price must be positive')
    .optional(),
  stockQuantity: z
    .number()
    .int()
    .nonnegative('Stock quantity must be non-negative')
    .optional(),
  isActive: z.boolean().optional(),
});

export const getProductsInputSchema = z.object({
  skipCount: z.number().int().nonnegative().optional().default(0),
  maxResultCount: z.number().int().positive().optional().default(10),
  sorting: z.string().optional(),
  filter: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsInputType = z.infer<typeof getProductsInputSchema>;
```

- [ ] **Step 3: Commit**

```bash
git add src/features/products/product.types.ts src/features/products/product.validation.ts
git commit -m "feat: add product types and validation schemas"
```

---

### Task 5: Product Service (Business Logic)

**Files:**
- Create: `backend-api/src/features/products/product.service.ts`
- Create: `backend-api/src/lib/pagination.ts`

- [ ] **Step 1: Create pagination.ts utility**

Create `src/lib/pagination.ts`:
```typescript
export interface PaginationParams {
  skip: number;
  take: number;
}

export interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const calculatePaginationMeta = (
  totalCount: number,
  skip: number,
  take: number
): PaginationMeta => {
  const pageSize = take;
  const currentPage = Math.floor(skip / take) + 1;
  const totalPages = Math.ceil(totalCount / take);

  return {
    totalCount,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};
```

- [ ] **Step 2: Create product.service.ts**

Create `src/features/products/product.service.ts`:
```typescript
import { prisma } from '@/database/client';
import { NotFoundException } from '@/lib/error';
import { calculatePaginationMeta } from '@/lib/pagination';
import {
  ProductDto,
  CreateProductDto,
  UpdateProductDto,
  GetProductsInput,
  ProductListDto,
} from './product.types';

export class ProductService {
  async getProducts(input: GetProductsInput): Promise<ProductListDto> {
    const skipCount = input.skipCount || 0;
    const maxResultCount = input.maxResultCount || 10;

    // Build where clause for filtering
    const where = input.filter
      ? {
          OR: [
            { name: { contains: input.filter, mode: 'insensitive' } },
            { description: { contains: input.filter, mode: 'insensitive' } },
          ],
        }
      : {};

    // Get total count
    const totalCount = await prisma.product.count({ where });

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      skip: skipCount,
      take: maxResultCount,
      orderBy: {
        createdAt: 'desc', // Default sorting
      },
    });

    const pagination = calculatePaginationMeta(
      totalCount,
      skipCount,
      maxResultCount
    );

    return {
      items: products.map(this.mapToDto),
      ...pagination,
    };
  }

  async getProductById(id: string): Promise<ProductDto> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.mapToDto(product);
  }

  async createProduct(input: CreateProductDto): Promise<ProductDto> {
    const product = await prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        stockQuantity: input.stockQuantity,
        isActive: true,
      },
    });

    return this.mapToDto(product);
  }

  async updateProduct(
    id: string,
    input: UpdateProductDto
  ): Promise<ProductDto> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.price !== undefined && { price: input.price }),
        ...(input.stockQuantity !== undefined && { stockQuantity: input.stockQuantity }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
      },
    });

    return this.mapToDto(updated);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await prisma.product.delete({
      where: { id },
    });
  }

  private mapToDto(product: any): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toNumber(),
      stockQuantity: product.stockQuantity,
      isActive: product.isActive,
      creationTime: product.createdAt.toISOString(),
    };
  }
}

export const productService = new ProductService();
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/pagination.ts src/features/products/product.service.ts
git commit -m "feat: implement ProductService with CRUD operations"
```

---

### Task 6: Product Controller & Routes

**Files:**
- Create: `backend-api/src/features/products/product.controller.ts`
- Create: `backend-api/src/features/products/product.routes.ts`
- Create: `backend-api/src/features/products/index.ts`
- Modify: `backend-api/src/app.ts`

- [ ] **Step 1: Create product.controller.ts**

Create `src/features/products/product.controller.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import { productService } from './product.service';
import { getProductsInputSchema, createProductSchema, updateProductSchema } from './product.validation';

export class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const input = getProductsInputSchema.parse(req.query);
      const result = await productService.getProducts(input);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const input = createProductSchema.parse(req.body);
      const product = await productService.createProduct(input);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const input = updateProductSchema.parse(req.body);
      const product = await productService.updateProduct(req.params.id, input);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
```

- [ ] **Step 2: Create product.routes.ts**

Create `src/features/products/product.routes.ts`:
```typescript
import { Router } from 'express';
import { productController } from './product.controller';

export const productRoutes = Router();

productRoutes.get('/', (req, res, next) =>
  productController.getProducts(req, res, next)
);

productRoutes.get('/:id', (req, res, next) =>
  productController.getProduct(req, res, next)
);

productRoutes.post('/', (req, res, next) =>
  productController.createProduct(req, res, next)
);

productRoutes.put('/:id', (req, res, next) =>
  productController.updateProduct(req, res, next)
);

productRoutes.delete('/:id', (req, res, next) =>
  productController.deleteProduct(req, res, next)
);
```

- [ ] **Step 3: Create products feature index.ts**

Create `src/features/products/index.ts`:
```typescript
export * from './product.types';
export * from './product.validation';
export * from './product.service';
export * from './product.controller';
export { productRoutes } from './product.routes';
```

- [ ] **Step 4: Update app.ts to register product routes**

Edit `src/app.ts` - add after the health check route:
```typescript
// Routes
import { productRoutes } from '@/features/products';

app.use('/api/app/products', productRoutes);
```

Full updated section should look like:
```typescript
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Routes
  import { productRoutes } from '@/features/products';
  app.use('/api/app/products', productRoutes);

  // Error handling
  app.use(validationErrorHandler);
  app.use(errorHandler);

  return app;
};
```

- [ ] **Step 5: Commit**

```bash
git add src/features/products/
git commit -m "feat: add Product controller, routes, and feature module"
```

---

## PHASE 3: Testing Setup

### Task 7: Jest Configuration & Test Helpers

**Files:**
- Create: `backend-api/jest.config.js`
- Create: `backend-api/test/helpers/test-setup.ts`
- Create: `backend-api/test/helpers/factories.ts`
- Modify: `backend-api/package.json`

- [ ] **Step 1: Create jest.config.js**

Create `jest.config.js`:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/test/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.types.ts',
    '!src/**/*.validation.ts',
    '!src/server.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/test/helpers/test-setup.ts'],
};
```

- [ ] **Step 2: Create test-setup.ts**

Create `test/helpers/test-setup.ts`:
```typescript
import { prisma } from '@/database/client';

beforeAll(async () => {
  // Run migrations for test database
  // This assumes you have a separate test database
  // or use the same database with transaction rollback
});

afterEach(async () => {
  // Clean up after each test
  // In production, you'd use transactions for rollback
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

- [ ] **Step 3: Create factories.ts for test data**

Create `test/helpers/factories.ts`:
```typescript
import { prisma } from '@/database/client';
import { Decimal } from '@prisma/client/runtime/library';

export const productFactory = {
  async create(overrides: any = {}) {
    return prisma.product.create({
      data: {
        name: 'Test Product',
        description: 'Test Description',
        price: new Decimal('99.99'),
        stockQuantity: 10,
        isActive: true,
        ...overrides,
      },
    });
  },

  async createMany(count: number, overrides: any = {}) {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(
        await prisma.product.create({
          data: {
            name: `Test Product ${i + 1}`,
            description: 'Test Description',
            price: new Decimal('99.99'),
            stockQuantity: 10,
            isActive: true,
            ...overrides,
          },
        })
      );
    }
    return products;
  },

  async cleanup() {
    await prisma.product.deleteMany();
  },
};
```

- [ ] **Step 4: Commit**

```bash
git add jest.config.js test/helpers/
git commit -m "test: setup Jest configuration and test helpers"
```

---

### Task 8: Product Service Unit Tests

**Files:**
- Create: `backend-api/test/features/products/product.service.test.ts`

- [ ] **Step 1: Write test for getProducts**

Create `test/features/products/product.service.test.ts`:
```typescript
import { productService } from '@/features/products';
import { prisma } from '@/database/client';
import { productFactory } from '@/test/helpers/factories';

describe('ProductService', () => {
  afterEach(async () => {
    await productFactory.cleanup();
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      // Arrange
      await productFactory.createMany(15);

      // Act
      const result = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
      });

      // Assert
      expect(result.items).toHaveLength(10);
      expect(result.totalCount).toBe(15);
      expect(result.currentPage).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(2);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('should filter products by name', async () => {
      // Arrange
      await productFactory.create({ name: 'Test Product A' });
      await productFactory.create({ name: 'Test Product B' });
      await productFactory.create({ name: 'Other Product' });

      // Act
      const result = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
        filter: 'Test Product',
      });

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });
  });

  describe('getProductById', () => {
    it('should return product by id', async () => {
      // Arrange
      const created = await productFactory.create({ name: 'Test Product' });

      // Act
      const result = await productService.getProductById(created.id);

      // Assert
      expect(result.id).toBe(created.id);
      expect(result.name).toBe('Test Product');
    });

    it('should throw NotFoundException for non-existent product', async () => {
      // Act & Assert
      await expect(
        productService.getProductById('non-existent-id')
      ).rejects.toThrow('not found');
    });
  });

  describe('createProduct', () => {
    it('should create product', async () => {
      // Arrange
      const input = {
        name: 'New Product',
        description: 'Description',
        price: 99.99,
        stockQuantity: 10,
      };

      // Act
      const result = await productService.createProduct(input);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.name).toBe('New Product');
      expect(result.price).toBe(99.99);
      expect(result.isActive).toBe(true);
    });
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      // Arrange
      const product = await productFactory.create({ name: 'Old Name' });

      // Act
      const result = await productService.updateProduct(product.id, {
        name: 'New Name',
        price: 149.99,
      });

      // Assert
      expect(result.id).toBe(product.id);
      expect(result.name).toBe('New Name');
      expect(result.price).toBe(149.99);
    });

    it('should throw NotFoundException for non-existent product', async () => {
      // Act & Assert
      await expect(
        productService.updateProduct('non-existent-id', { name: 'New' })
      ).rejects.toThrow('not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product', async () => {
      // Arrange
      const product = await productFactory.create();

      // Act
      await productService.deleteProduct(product.id);

      // Assert
      const deleted = await prisma.product.findUnique({
        where: { id: product.id },
      });
      expect(deleted).toBeNull();
    });

    it('should throw NotFoundException for non-existent product', async () => {
      // Act & Assert
      await expect(
        productService.deleteProduct('non-existent-id')
      ).rejects.toThrow('not found');
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- test/features/products/product.service.test.ts
```

Expected output: All tests pass

- [ ] **Step 3: Commit**

```bash
git add test/features/products/product.service.test.ts
git commit -m "test: add ProductService unit tests"
```

---

## PHASE 4: Authentication & Health Feature

### Task 9: Health Check Feature

**Files:**
- Create: `backend-api/src/features/health/health.controller.ts`
- Create: `backend-api/src/features/health/health.routes.ts`
- Create: `backend-api/src/features/health/index.ts`

- [ ] **Step 1: Create health.controller.ts**

Create `src/features/health/health.controller.ts`:
```typescript
import { Request, Response } from 'express';
import { prisma } from '@/database/client';

export class HealthController {
  async check(req: Request, res: Response) {
    try {
      // Check database connectivity
      await prisma.$queryRaw`SELECT 1`;
      
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const healthController = new HealthController();
```

- [ ] **Step 2: Create health.routes.ts**

Create `src/features/health/health.routes.ts`:
```typescript
import { Router } from 'express';
import { healthController } from './health.controller';

export const healthRoutes = Router();

healthRoutes.get('/', (req, res) =>
  healthController.check(req, res)
);
```

- [ ] **Step 3: Create health feature index.ts**

Create `src/features/health/index.ts`:
```typescript
export { healthController } from './health.controller';
export { healthRoutes } from './health.routes';
```

- [ ] **Step 4: Update app.ts to register health routes**

Edit `src/app.ts` - replace the health check route:
```typescript
import { healthRoutes } from '@/features/health';

app.use('/health', healthRoutes);
```

Remove the old `/health` route that was defined inline.

- [ ] **Step 5: Commit**

```bash
git add src/features/health/
git commit -m "feat: add health check feature"
```

---

### Task 10: OAuth2 Authentication Middleware (Placeholder)

**Files:**
- Create: `backend-api/src/middleware/auth.middleware.ts`
- Create: `backend-api/src/lib/oauth.ts`

- [ ] **Step 1: Create oauth.ts utility**

Create `src/lib/oauth.ts`:
```typescript
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { UnauthorizedException } from '@/lib/error';

export interface JwtPayload {
  sub: string;
  email?: string;
  iat: number;
  exp: number;
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return payload;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
};

export const generateToken = (userId: string, expiresIn: string = env.JWT_EXPIRATION): string => {
  return jwt.sign(
    { sub: userId },
    env.JWT_SECRET,
    { expiresIn }
  );
};
```

- [ ] **Step 2: Create auth.middleware.ts**

Create `src/middleware/auth.middleware.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '@/lib/oauth';
import { UnauthorizedException } from '@/lib/error';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    // Token not required for all routes, only for protected endpoints
    return next();
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new UnauthorizedException('Authentication required'));
  }
  next();
};
```

- [ ] **Step 3: Update app.ts to use auth middleware**

Edit `src/app.ts` - add after CORS setup:
```typescript
import { authenticateToken } from '@/middleware/auth.middleware';

// Authentication middleware (optional, extracts token if present)
app.use(authenticateToken);
```

- [ ] **Step 4: Commit**

```bash
git add src/middleware/auth.middleware.ts src/lib/oauth.ts
git commit -m "feat: add OAuth2 authentication middleware"
```

---

## PHASE 5: Final Setup & Documentation

### Task 11: Docker & Production Setup

**Files:**
- Create: `backend-api/Dockerfile`
- Create: `backend-api/.dockerignore`
- Modify: `backend-api/package.json` (build script)

- [ ] **Step 1: Create Dockerfile**

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["npm", "start"]
```

- [ ] **Step 2: Create .dockerignore**

Create `.dockerignore`:
```
node_modules
npm-debug.log
dist
.env
.env.local
.git
.gitignore
README.md
.vscode
.idea
coverage
test
*.test.ts
logs
```

- [ ] **Step 3: Verify build script in package.json**

```bash
npm run build
```

Expected: `dist/` folder created with compiled JavaScript

- [ ] **Step 4: Verify Docker build works**

```bash
docker build -t myapp-backend:latest .
```

Expected: Docker image builds successfully

- [ ] **Step 5: Commit**

```bash
git add Dockerfile .dockerignore
git commit -m "chore: add Docker configuration"
```

---

### Task 12: README & Documentation

**Files:**
- Create: `backend-api/README.md`

- [ ] **Step 1: Create comprehensive README.md**

Create `README.md`:
```markdown
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
cd backend-node
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add comprehensive README"
```

---

### Task 13: Environment Setup & Verification

**Files:**
- Update: `.env.example`
- Modify: `Dockerfile` (optional improvements)

- [ ] **Step 1: Ensure .env.example is complete**

Verify `.env.example` includes all variables:
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://myapp_user:myapp_password@localhost:5432/myapp_db
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRATION=24h
OAUTH_PROVIDER=github
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

- [ ] **Step 2: Verify development setup works end-to-end**

```bash
# Stop any existing services
docker-compose down

# Start fresh PostgreSQL
docker-compose up -d

# Install dependencies
npm install

# Run migrations
npx prisma migrate dev

# Run dev server
npm run dev
```

Expected: Server starts on port 3000, responds to health check

- [ ] **Step 3: Test API endpoints**

```bash
# Health check
curl http://localhost:3000/health

# List products
curl http://localhost:3000/api/app/products

# Create product
curl -X POST http://localhost:3000/api/app/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":99.99,"stockQuantity":10}'
```

Expected: All endpoints return proper responses

- [ ] **Step 4: Run test suite**

```bash
npm test
```

Expected: All tests pass

- [ ] **Step 5: Commit final setup**

```bash
git add .env.example
git commit -m "chore: finalize environment setup"
```

---

## Summary Checklist

- [ ] Project initialized with Node.js, Express, TypeScript
- [ ] Express app with middleware and error handling
- [ ] Prisma ORM configured with PostgreSQL
- [ ] Product feature complete (CRUD operations)
- [ ] Health check endpoint
- [ ] OAuth2/JWT authentication middleware
- [ ] Jest tests for services
- [ ] Docker configuration
- [ ] Environment variables and README
- [ ] All tests passing
- [ ] API endpoints verified working

---

## Next Steps (Out of Scope)

1. **Auth feature:** Implement login/register with OAuth2 provider
2. **Integration tests:** API endpoint tests with real database
3. **Additional features:** Implement remaining .NET features as needed
4. **Frontend integration:** Test React frontend with new backend
5. **Performance testing:** Load testing and optimization
6. **Monitoring:** Add APM, error tracking, logging aggregation

---

## Git Commits Made

```
✅ chore: initialize Node.js project structure
✅ feat: setup Express app with middleware and error handling
✅ feat: setup Prisma and PostgreSQL database
✅ feat: add product types and validation schemas
✅ feat: implement ProductService with CRUD operations
✅ feat: add Product controller, routes, and feature module
✅ test: setup Jest configuration and test helpers
✅ test: add ProductService unit tests
✅ feat: add health check feature
✅ feat: add OAuth2 authentication middleware
✅ chore: add Docker configuration
✅ docs: add comprehensive README
✅ chore: finalize environment setup
```

Total commits: **13 commits** ready for GitLab/GitHub
