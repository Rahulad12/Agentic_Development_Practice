import { prisma } from '@/database/client';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Test data factories for creating consistent test data
 * Each factory provides:
 * - create() - Create a single record with defaults
 * - createMany() - Create multiple records
 * - cleanup() - Delete all records (for test isolation)
 */

export const productFactory = {
  /**
   * Create a single product with optional overrides
   * @param overrides - Partial product data to override defaults
   * @returns Created product
   */
  async create(overrides: {
    name?: string;
    description?: string;
    price?: Decimal | number;
    stockQuantity?: number;
    isActive?: boolean;
  } = {}) {
    return prisma.product.create({
      data: {
        name: overrides.name || 'Test Product',
        description: overrides.description || 'Test Description',
        price: overrides.price ? new Decimal(overrides.price.toString()) : new Decimal('99.99'),
        stockQuantity: overrides.stockQuantity ?? 10,
        isActive: overrides.isActive ?? true,
      },
    });
  },

  /**
   * Create multiple products
   * @param count - Number of products to create
   * @param overrides - Partial product data to override defaults
   * @returns Array of created products
   */
  async createMany(
    count: number,
    overrides: {
      name?: string;
      description?: string;
      price?: Decimal | number;
      stockQuantity?: number;
      isActive?: boolean;
    } = {}
  ) {
    const products = [];
    for (let i = 0; i < count; i++) {
      products.push(
        await prisma.product.create({
          data: {
            name: overrides.name || `Test Product ${i + 1}`,
            description: overrides.description || 'Test Description',
            price: overrides.price
              ? new Decimal(overrides.price.toString())
              : new Decimal('99.99'),
            stockQuantity: overrides.stockQuantity ?? 10,
            isActive: overrides.isActive ?? true,
          },
        })
      );
    }
    return products;
  },

  /**
   * Delete all products from database
   * Use this in afterEach() or afterAll() for test cleanup
   */
  async cleanup() {
    await prisma.product.deleteMany();
  },

  /**
   * Get count of all products
   * Useful for assertions
   */
  async count() {
    return prisma.product.count();
  },
};

/**
 * Cleanup helper to reset all test data
 * Call this in afterEach() to ensure test isolation
 */
export async function cleanupAllTestData() {
  await productFactory.cleanup();
}
