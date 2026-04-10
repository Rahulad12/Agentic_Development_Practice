# Code Conventions & Standards

All code across the monorepo should follow these conventions.

## File & Folder Naming

### General Rule: kebab-case for files and folders

```
✅ Correct:
  - user-profile-card.tsx
  - use-product-form.ts
  - product.service.ts
  - user.types.ts
  - product.entity.cs
  - product-app-service.cs
  - user-repository.cs

❌ Wrong:
  - UserProfileCard.tsx
  - useProductForm.ts
  - ProductService.ts
  - User.types.ts
  - ProductEntity.cs
```

### Folder Structure

```
✅ Correct structure:
  features/
  ├── products/
  │   ├── components/
  │   │   ├── product-list.tsx
  │   │   ├── product-form.tsx
  │   │   └── product-detail.tsx
  │   ├── hooks/
  │   │   └── use-products.ts
  │   ├── services/
  │   │   └── product.service.ts
  │   └── types/
  │       └── product.types.ts

❌ Wrong:
  - ProductComponent/ (use kebab-case)
  - services/ at root (use feature-based organization)
  - components/ProductCard.tsx (use kebab-case)
```

## Naming Conventions by Language/Type

### TypeScript/React

```typescript
// ✅ Components (PascalCase)
export function UserProfileCard() { }
export const ProductForm = memo(function ProductForm() { })
export function Button() { }

// ✅ Hooks (camelCase, use prefix)
export function useUserProfile() { }
export const useProductForm = () => { }
export function useLocalStorage(key: string) { }

// ✅ Services (camelCase, Service suffix)
export const userService = { ... }
export const productService = { ... }
export const authService = { ... }

// ✅ Types/Interfaces (PascalCase, Dto/Type suffix)
type UserProfileDto = { }
interface UserProfileDto { }
type ProductFormState = { }
interface ApiResponse<T> { }

// ✅ Enums (PascalCase)
enum OrderStatus { Pending, Shipped, Delivered }
enum UserRole { Admin, User, Guest }

// ✅ Constants (UPPER_SNAKE_CASE)
const MAX_RETRIES = 3
const API_TIMEOUT_MS = 5000
const DEFAULT_PAGE_SIZE = 20

// ✅ React Query Keys (nested object structure)
const productQueryKeys = {
  all: ['products'],
  lists: () => [...productQueryKeys.all, 'list'],
  list: (filters) => [...productQueryKeys.lists(), { filters }],
  details: () => [...productQueryKeys.all, 'detail'],
  detail: (id) => [...productQueryKeys.details(), id],
}

// ✅ React Query Hooks (use prefix, Query/Mutation suffix optional)
export function useProducts() { }
export function useProduct(id) { }
export function useCreateProduct() { }
export function useUpdateProduct() { }
export function useDeleteProduct() { }

// ✅ Variables/Functions (camelCase)
let currentUser = null
const handleClick = () => { }
async function fetchProducts() { }
```

### C# / .NET

```csharp
// ✅ Classes (PascalCase)
public class Product { }
public class ProductAppService { }
public class OrderDomainService { }

// ✅ Interfaces (PascalCase, I prefix)
public interface IProductAppService { }
public interface IOrderRepository { }
public interface INotificationService { }

// ✅ Methods (PascalCase)
public async Task<ProductDto> GetAsync(Guid id) { }
public void ProcessOrder(Order order) { }
private decimal CalculateTotal() { }

// ✅ Properties (PascalCase)
public string Name { get; set; }
public decimal Price { get; private set; }
public List<OrderLine> Lines { get; } = new();

// ✅ Private fields (_camelCase)
private readonly IRepository<Product> _repository;
private string _internalState;

// ✅ Constants (PascalCase or UPPER_SNAKE_CASE)
public const int MaxNameLength = 256;
public const string DEFAULT_CURRENCY = "USD";

// ✅ Enums (PascalCase members)
public enum OrderStatus
{
    Pending,
    Shipped,
    Delivered
}

// ✅ Async Methods (Async suffix)
public async Task<ProductDto> CreateAsync(CreateProductDto input) { }
public async Task ProcessOrderAsync(Order order) { }
```

## Import/Export Ordering

### TypeScript Imports (in this order)

```typescript
// 1. External packages
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'

// 2. Internal absolute imports (@/...)
import { Button } from '@/components/ui/button'
import { useProducts } from '@/features/products/hooks/use-products'
import { useUIStore } from '@/stores/ui.store'
import { apiClient } from '@/services/api-client'
import type { ProductDto } from '@/types/api.types'

// 3. Relative imports (../, ./)
import { utils } from './utils'
import type { LocalProduct } from '../types'

// 4. Side effects
import './product-list.css'
```

**Note:** React Query hooks (useQuery, useMutation) take precedence over direct service calls or Zustand for server data.

### C# Using Statements (in this order)

```csharp
// 1. System namespaces
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// 2. External packages
using Volo.Abp.Domain.Entities;
using Volo.Abp.Application.Services;
using AutoMapper;

// 3. Internal namespaces (company)
using MyApp.Domain;
using MyApp.Application.Contracts.Dtos;
```

## Code Formatting

### Max Line Length: 100 characters

```typescript
// ✅ Good
const handleClick = () => {
  console.log('User clicked button')
}

// ❌ Bad (too long)
const handleClick = () => console.log('User clicked button and this is a very long line that exceeds max')
```

### Braces & Indentation

**TypeScript/JavaScript:**
```typescript
// Opening brace on same line (Allman style not used)
if (condition) {
  doSomething()
}

function example() {
  // 2 spaces indentation
  if (true) {
    statement()
  }
}
```

**C#:**
```csharp
public class Example
{
    // 4 spaces indentation
    public void Method()
    {
        if (condition)
        {
            DoSomething();
        }
    }
}
```

## Comments & Documentation

### When to Comment

✅ Write comments for:
- **Why** (not what) — complex business logic
- **Non-obvious** decisions
- **Edge cases** and workarounds
- **External dependencies** or system integration points

❌ Don't comment:
- Obvious code that reads itself
- Already documented in methods/properties
- Fixed code (remove instead)

### Comment Style

**TypeScript:**
```typescript
// Single line comment for brief explanations
const maxRetries = 3 // Why: API is flaky on Mondays

/*
 * Multi-line for longer explanations
 * Use this for complex business logic
 */

/**
 * JSDoc for public functions/components
 * @param id - The product ID
 * @returns The product details
 */
export function getProduct(id: string) { }
```

**C#:**
```csharp
// Single line comment
private readonly IRepository<Product> _repository;

/// <summary>
/// XML documentation for public members
/// </summary>
/// <param name="id">The product ID</param>
/// <returns>The product details</returns>
public async Task<ProductDto> GetAsync(Guid id) { }
```

## Type Annotations

### TypeScript

```typescript
// ✅ Always annotate function parameters and returns
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ Use type for simple unions, interface for object contracts
type Status = 'pending' | 'complete' | 'failed'
interface UserDto { id: string; name: string }

// ✅ Avoid any
// ❌ const data: any = response.data
// ✅ const data: ProductDto = response.data

// ✅ Use strict null checking
const user: User | null = await getUser(id)
if (user) {
  console.log(user.name)
}
```

### C#

```csharp
// ✅ Always specify types explicitly (C# is not Python)
public async Task<ProductDto> CreateAsync(CreateProductDto input)
{
    var product = new Product(input.Name, input.Price);
    await _repository.InsertAsync(product);
    return _mapper.Map<ProductDto>(product);
}

// ✅ Use nullable reference types
public string? OptionalValue { get; set; }

// ✅ Use appropriate visibility modifiers
public string PublicProperty { get; set; }
private readonly string _privateField;
```

## Error Handling

### TypeScript

```typescript
// ✅ Handle errors explicitly
try {
  const data = await productService.list()
  setProducts(data)
} catch (error) {
  if (error instanceof AxiosError) {
    showError(error.response?.data?.message)
  } else {
    showError('An unexpected error occurred')
  }
}

// ✅ Type error with proper guard
if (error instanceof Error) {
  console.error('Error:', error.message)
}
```

### C#

```csharp
// ✅ Use domain exceptions for expected failures
public void SetPrice(decimal newPrice)
{
    if (newPrice <= 0)
        throw new BusinessException("Price must be greater than 0");
    
    Price = newPrice;
}

// ✅ Catch specific exceptions
try
{
    await _repository.DeleteAsync(id);
}
catch (EntityNotFoundException)
{
    throw new BusinessException("Product not found");
}
```

## Git Commit Messages

Format: `<type>: <subject>`

```
✅ Good:
  feat: add product filter by price range
  fix: resolve race condition in checkout
  refactor: extract common validation logic
  docs: update API documentation
  test: add missing tests for OrderService

❌ Bad:
  fixed bug
  changes to product page
  update stuff
  WIP: something
```

### Commit Types
- **feat:** New feature
- **fix:** Bug fix
- **refactor:** Code restructuring (no behavior change)
- **docs:** Documentation updates
- **test:** Test additions/updates
- **chore:** Build, deps, tooling

### Commit Subject Line
- Start with lowercase
- Imperative mood ("add" not "added")
- No period at end
- 50 characters max

## PR Guidelines

### Title Format
```
[Type] Brief description (50 chars max)

Examples:
  [feat] Add product filter UI
  [fix] Fix race condition in cart
  [docs] Update deployment guide
```

### Description Template
```markdown
## Summary
Brief overview of changes (1-2 sentences)

## Changes
- Bullet point 1
- Bullet point 2
- Bullet point 3

## Testing
How to verify these changes work

## Related Issues
Closes #123
```

## Linting & Formatting

### Frontend (ESLint + Prettier)
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Backend (StyleCop)
Follow standard C# conventions with:
- StyleCop.Analyzers enabled
- Format on save
- 4 space indentation

## Testing Standards

### TypeScript
- Use `@testing-library/react` for component tests
- Prefer integration tests over unit tests
- Test behavior, not implementation

### C#
- Use xUnit for unit tests
- Arrange-Act-Assert pattern
- One assertion per test when possible
- Use `Should` (Shouldly) for assertions

## Accessibility (Frontend)

```typescript
// ✅ Semantic HTML
<button onClick={handleClick}>Click me</button>

// ✅ ARIA labels where needed
<button aria-label="Close dialog">×</button>

// ✅ Keyboard navigation
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick()
  }
}

// ✅ Color contrast
// Use tools to verify WCAG AA compliance
```

## Performance Considerations

### Frontend
- Lazy load components: `lazy(() => import('./Component'))`
- Memoize expensive components: `memo(Component)`
- Use `useCallback` for stable function references
- Avoid creating objects in render

### Backend
- Use async/await (never blocking)
- Index frequently queried columns
- Batch database operations
- Cache appropriately (Redis for heavy queries)
- Use pagination for large datasets

## Security Best Practices

### Frontend
- Never store secrets in code or localStorage
- Sanitize user input (XSS prevention)
- Use HTTPS in production
- Validate on both client and server

### Backend
- Validate all inputs (even from frontend)
- Use parameterized queries (prevent SQL injection)
- Never expose stack traces to clients
- Implement rate limiting
- Use strong password hashing (bcrypt, PBKDF2)
- Implement CORS properly

## Documentation Requirements

**Every public class/function should have documentation:**

```typescript
/**
 * Fetches a product by ID from the backend API
 * @param id - The unique product identifier
 * @returns Promise resolving to ProductDto
 * @throws AxiosError if product not found
 */
export async function getProduct(id: string): Promise<ProductDto> { }
```

```csharp
/// <summary>
/// Calculates the total price including tax
/// </summary>
/// <param name="basePrice">Price before tax</param>
/// <param name="taxRate">Tax percentage (e.g., 0.1 for 10%)</param>
/// <returns>Total price with tax</returns>
public decimal CalculateTotalWithTax(decimal basePrice, decimal taxRate)
{
    return basePrice * (1 + taxRate);
}
```
