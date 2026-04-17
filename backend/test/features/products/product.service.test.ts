import { productService } from '@/features/products';
import { prisma } from '@/database/client';
import { productFactory } from '../../../test/helpers/factories';
import { NotFoundException } from '@/lib/error';

describe('ProductService', () => {
  afterEach(async () => {
    await productFactory.cleanup();
  });

  describe('getProducts', () => {
    it('should return paginated products with correct metadata', async () => {
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

    it('should return products with proper DTO format', async () => {
      // Arrange
      const created = await productFactory.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stockQuantity: 5,
      });

      // Act
      const result = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
      });

      // Assert
      expect(result.items).toHaveLength(1);
      const product = result.items[0];
      expect(product.id).toBe(created.id);
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test Description');
      expect(product.price).toBe(99.99);
      expect(product.stockQuantity).toBe(5);
      expect(product.isActive).toBe(true);
      expect(product.creationTime).toBeDefined();
    });

    it('should handle pagination correctly with offset', async () => {
      // Arrange
      await productFactory.createMany(25);

      // Act
      const page1 = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
      });

      const page2 = await productService.getProducts({
        skipCount: 10,
        maxResultCount: 10,
      });

      const page3 = await productService.getProducts({
        skipCount: 20,
        maxResultCount: 10,
      });

      // Assert
      expect(page1.items).toHaveLength(10);
      expect(page1.currentPage).toBe(1);
      expect(page1.hasNextPage).toBe(true);
      expect(page1.hasPreviousPage).toBe(false);

      expect(page2.items).toHaveLength(10);
      expect(page2.currentPage).toBe(2);
      expect(page2.hasNextPage).toBe(true);
      expect(page2.hasPreviousPage).toBe(true);

      expect(page3.items).toHaveLength(5);
      expect(page3.currentPage).toBe(3);
      expect(page3.hasNextPage).toBe(false);
      expect(page3.hasPreviousPage).toBe(true);
      expect(page3.totalPages).toBe(3);
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
      expect(result.items[0].name).toContain('Test Product');
      expect(result.items[1].name).toContain('Test Product');
    });

    it('should filter products by description (case-insensitive)', async () => {
      // Arrange
      await productFactory.create({
        name: 'Product 1',
        description: 'Premium Widget',
      });
      await productFactory.create({
        name: 'Product 2',
        description: 'Budget Widget',
      });
      await productFactory.create({
        name: 'Product 3',
        description: 'Other Item',
      });

      // Act
      const result = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
        filter: 'widget',
      });

      // Assert
      expect(result.items).toHaveLength(2);
      expect(result.totalCount).toBe(2);
    });

    it('should return empty list when no products match filter', async () => {
      // Arrange
      await productFactory.createMany(5);

      // Act
      const result = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
        filter: 'NonExistent',
      });

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('should return products ordered by most recent first', async () => {
      // Arrange
      const product1 = await productFactory.create({ name: 'Product 1' });
      await new Promise((resolve) => setTimeout(resolve, 10));
      const product2 = await productFactory.create({ name: 'Product 2' });

      // Act
      const result = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
      });

      // Assert
      expect(result.items[0].id).toBe(product2.id);
      expect(result.items[1].id).toBe(product1.id);
    });

    it('should use default pagination values', async () => {
      // Arrange
      await productFactory.createMany(15);

      // Act
      const result = await productService.getProducts({});

      // Assert
      expect(result.items).toHaveLength(10); // Default maxResultCount
      expect(result.totalCount).toBe(15);
    });
  });

  describe('getProductById', () => {
    it('should return product by id with correct DTO format', async () => {
      // Arrange
      const created = await productFactory.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 149.99,
        stockQuantity: 20,
      });

      // Act
      const result = await productService.getProductById(created.id);

      // Assert
      expect(result.id).toBe(created.id);
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.price).toBe(149.99);
      expect(result.stockQuantity).toBe(20);
      expect(result.isActive).toBe(true);
      expect(result.creationTime).toBeDefined();
    });

    it('should throw NotFoundException for non-existent product', async () => {
      // Act & Assert
      await expect(
        productService.getProductById('non-existent-id')
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException with correct message', async () => {
      // Act & Assert
      await expect(
        productService.getProductById('missing-id-123')
      ).rejects.toThrow('not found');
    });
  });

  describe('createProduct', () => {
    it('should create product with all required fields', async () => {
      // Arrange
      const input = {
        name: 'New Product',
        description: 'New Description',
        price: 99.99,
        stockQuantity: 10,
      };

      // Act
      const result = await productService.createProduct(input);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.name).toBe('New Product');
      expect(result.description).toBe('New Description');
      expect(result.price).toBe(99.99);
      expect(result.stockQuantity).toBe(10);
      expect(result.isActive).toBe(true);
      expect(result.creationTime).toBeDefined();
    });

    it('should persist product to database', async () => {
      // Arrange
      const input = {
        name: 'Persisted Product',
        description: 'Should be in DB',
        price: 199.99,
        stockQuantity: 5,
      };

      // Act
      const created = await productService.createProduct(input);

      // Assert - Verify it's in the database
      const fromDb = await prisma.product.findUnique({
        where: { id: created.id },
      });
      expect(fromDb).not.toBeNull();
      expect(fromDb?.name).toBe('Persisted Product');
    });

    it('should create product with zero stock', async () => {
      // Arrange
      const input = {
        name: 'Out of Stock',
        description: 'Zero stock',
        price: 50,
        stockQuantity: 0,
      };

      // Act
      const result = await productService.createProduct(input);

      // Assert
      expect(result.stockQuantity).toBe(0);
    });

    it('should create product with optional description', async () => {
      // Arrange
      const input = {
        name: 'Minimal Product',
        price: 25,
        stockQuantity: 1,
      };

      // Act
      const result = await productService.createProduct(input);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Minimal Product');
      expect(result.price).toBe(25);
    });
  });

  describe('updateProduct', () => {
    it('should update product name', async () => {
      // Arrange
      const product = await productFactory.create({ name: 'Old Name' });

      // Act
      const result = await productService.updateProduct(product.id, {
        name: 'New Name',
      });

      // Assert
      expect(result.id).toBe(product.id);
      expect(result.name).toBe('New Name');
    });

    it('should update product price', async () => {
      // Arrange
      const product = await productFactory.create({ price: 99.99 });

      // Act
      const result = await productService.updateProduct(product.id, {
        price: 149.99,
      });

      // Assert
      expect(result.id).toBe(product.id);
      expect(result.price).toBe(149.99);
    });

    it('should update multiple fields at once', async () => {
      // Arrange
      const product = await productFactory.create({
        name: 'Old Name',
        price: 99.99,
        stockQuantity: 10,
        isActive: true,
      });

      // Act
      const result = await productService.updateProduct(product.id, {
        name: 'New Name',
        price: 149.99,
        stockQuantity: 20,
        isActive: false,
      });

      // Assert
      expect(result.id).toBe(product.id);
      expect(result.name).toBe('New Name');
      expect(result.price).toBe(149.99);
      expect(result.stockQuantity).toBe(20);
      expect(result.isActive).toBe(false);
    });

    it('should update stock quantity to zero', async () => {
      // Arrange
      const product = await productFactory.create({ stockQuantity: 10 });

      // Act
      const result = await productService.updateProduct(product.id, {
        stockQuantity: 0,
      });

      // Assert
      expect(result.stockQuantity).toBe(0);
    });

    it('should update isActive status', async () => {
      // Arrange
      const product = await productFactory.create({ isActive: true });

      // Act
      const result = await productService.updateProduct(product.id, {
        isActive: false,
      });

      // Assert
      expect(result.isActive).toBe(false);
    });

    it('should preserve unchanged fields when updating', async () => {
      // Arrange
      const original = await productFactory.create({
        name: 'Original Name',
        description: 'Original Description',
        price: 99.99,
        stockQuantity: 10,
      });

      // Act
      const result = await productService.updateProduct(original.id, {
        name: 'Updated Name',
      });

      // Assert
      expect(result.name).toBe('Updated Name');
      expect(result.description).toBe('Original Description');
      expect(result.price).toBe(99.99);
      expect(result.stockQuantity).toBe(10);
    });

    it('should persist changes to database', async () => {
      // Arrange
      const product = await productFactory.create({ name: 'Original' });

      // Act
      await productService.updateProduct(product.id, { name: 'Updated' });

      // Assert - Verify in database
      const updated = await prisma.product.findUnique({
        where: { id: product.id },
      });
      expect(updated?.name).toBe('Updated');
    });

    it('should throw NotFoundException for non-existent product', async () => {
      // Act & Assert
      await expect(
        productService.updateProduct('non-existent-id', { name: 'New' })
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException with correct message', async () => {
      // Act & Assert
      await expect(
        productService.updateProduct('missing-id-456', { price: 100 })
      ).rejects.toThrow('not found');
    });

    it('should handle empty update (no fields provided)', async () => {
      // Arrange
      const product = await productFactory.create();

      // Act
      const result = await productService.updateProduct(product.id, {});

      // Assert
      expect(result.id).toBe(product.id);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product from database', async () => {
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
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException with correct message', async () => {
      // Act & Assert
      await expect(
        productService.deleteProduct('missing-id-789')
      ).rejects.toThrow('not found');
    });

    it('should delete only the specified product', async () => {
      // Arrange
      const product1 = await productFactory.create();
      const product2 = await productFactory.create();

      // Act
      await productService.deleteProduct(product1.id);

      // Assert
      const remaining = await productFactory.count();
      expect(remaining).toBe(1);

      const stillExists = await prisma.product.findUnique({
        where: { id: product2.id },
      });
      expect(stillExists).not.toBeNull();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle products with very long names', async () => {
      // Arrange
      const longName = 'A'.repeat(255);

      // Act
      const result = await productService.createProduct({
        name: longName,
        price: 99.99,
        stockQuantity: 1,
      });

      // Assert
      expect(result.name).toBe(longName);
    });

    it('should handle very large stock quantities', async () => {
      // Arrange
      const largeStock = 999999;

      // Act
      const result = await productService.createProduct({
        name: 'Large Stock Product',
        price: 1,
        stockQuantity: largeStock,
      });

      // Assert
      expect(result.stockQuantity).toBe(largeStock);
    });

    it('should handle decimal prices with many decimal places', async () => {
      // Arrange
      const input = {
        name: 'Decimal Product',
        price: 123.4567,
        stockQuantity: 1,
      };

      // Act
      const result = await productService.createProduct(input);

      // Assert
      expect(result.price).toBe(123.4567);
    });

    it('should handle products created in rapid succession', async () => {
      // Act
      const promises = Array.from({ length: 5 }, () =>
        productService.createProduct({
          name: 'Rapid Product',
          price: 50,
          stockQuantity: 1,
        })
      );
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(5);
      const allIds = results.map((r) => r.id);
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(5); // All IDs should be unique
    });

    it('should return correct pagination for single product', async () => {
      // Arrange
      await productFactory.create();

      // Act
      const result = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
      });

      // Assert
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('should return correct pagination for no products', async () => {
      // Act
      const result = await productService.getProducts({
        skipCount: 0,
        maxResultCount: 10,
      });

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.totalCount).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });
});
