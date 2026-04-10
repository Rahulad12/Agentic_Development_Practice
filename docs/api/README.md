# API Documentation

## Overview

The backend provides a RESTful API for all client operations. API documentation is auto-generated and available at:

```
https://localhost:44300/swagger
```

## Base URL

Development: `https://localhost:44300/api/app`

## Authentication

All endpoints (except login) require JWT Bearer token authentication:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "1q2w3E*"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

## Response Format

All endpoints return JSON responses:

### Success Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Product Name",
  "price": 99.99
}
```

### Error Response
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "price": "Price must be greater than 0"
    }
  }
}
```

## Standard Endpoints

All resources follow REST conventions:

```
GET    /api/app/[resource]           - List all (with pagination)
GET    /api/app/[resource]/{id}      - Get single
POST   /api/app/[resource]           - Create new
PUT    /api/app/[resource]/{id}      - Update
DELETE /api/app/[resource]/{id}      - Delete
```

### Example: Products API

#### List Products
```
GET /api/app/products?skip=0&take=10

Response:
{
  "items": [
    { "id": "...", "name": "...", "price": ... },
    ...
  ],
  "totalCount": 25
}
```

#### Get Product by ID
```
GET /api/app/products/{id}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Product Name",
  "price": 99.99,
  "description": "...",
  "createdAt": "2026-04-10T10:30:00Z"
}
```

#### Create Product
```
POST /api/app/products
Content-Type: application/json

{
  "name": "New Product",
  "price": 49.99
}

Response: 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "New Product",
  "price": 49.99
}
```

#### Update Product
```
PUT /api/app/products/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 59.99
}

Response: 200 OK
```

#### Delete Product
```
DELETE /api/app/products/{id}

Response: 204 No Content
```

## Pagination

List endpoints support pagination:

```
GET /api/app/products?skip=0&take=10&sorting=name

Query Parameters:
- skip: Number of items to skip (default: 0)
- take: Number of items to return (default: 10, max: 100)
- sorting: Sort field and direction (e.g., "name", "-name" for desc)
- filter: Optional filter expression (depends on resource)
```

## Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `CONFLICT` | 409 | Business logic violation |
| `INTERNAL_ERROR` | 500 | Server error |

## CORS

CORS is configured to allow:
- **Origin:** `http://localhost:5173` (frontend dev)
- **Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Headers:** Content-Type, Authorization

## Rate Limiting

Rate limiting may be applied in production. Check response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1712754600
```

## Versioning

API versions are managed via URL paths:

```
/api/app/v1/products    - Version 1
/api/app/v2/products    - Version 2 (if applicable)
```

Currently only v1 is available.

## Swagger Documentation

For interactive API documentation and testing:

```
https://localhost:44300/swagger
```

Features:
- Live API documentation
- Try out endpoints directly
- Schema exploration
- Generate client code

## Pagination Example (Frontend)

```typescript
const fetchProducts = async (page: number = 1) => {
  const skip = (page - 1) * 10
  const response = await apiClient.get('/api/app/products', {
    params: { skip, take: 10 }
  })
  return response.data
}
```

## Authentication Flow (Frontend)

```typescript
// 1. Login and get token
const loginResponse = await apiClient.post('/api/auth/login', {
  username: 'admin',
  password: 'password'
})

// 2. Store token
localStorage.setItem('access_token', loginResponse.data.accessToken)

// 3. Add to all requests
apiClient.defaults.headers.common['Authorization'] = 
  `Bearer ${loginResponse.data.accessToken}`

// 4. Subsequent requests automatically include token
const products = await apiClient.get('/api/app/products')
```

## Entity Relationships

Document any relationships between entities:

```
Product
├── Name (string)
├── Price (decimal)
└── Category (reference to Category entity)

Category
├── Name (string)
└── Products (list of Product entities)
```

## WebSocket Endpoints (if applicable)

Not currently implemented. Future consideration for real-time updates.

## Deprecated Endpoints

None currently. When deprecating, endpoints will be marked and provided with migration path.

## See Also

- [Architecture Overview](../architecture.md)
- [Backend Guide](../../knowledge/wiki/backend.md)
- [ABP API Documentation](https://abp.io/docs/latest/framework/fundamentals/api-versioning)
