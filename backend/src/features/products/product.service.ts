import { prisma } from '@/database/client';
import { Prisma } from '@prisma/client';
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
    const where: Prisma.ProductWhereInput = input.filter
      ? {
          OR: [
            { name: { contains: input.filter, mode: Prisma.QueryMode.insensitive } },
            { description: { contains: input.filter, mode: Prisma.QueryMode.insensitive } },
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
        createdAt: 'desc',
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
