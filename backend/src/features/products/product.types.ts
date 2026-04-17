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
