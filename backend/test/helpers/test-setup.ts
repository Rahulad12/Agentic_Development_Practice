import { prisma } from '@/database/client';

/**
 * Jest setup file - runs before all tests
 * Handles database initialization and cleanup
 */

beforeAll(async () => {
  // Ensure database connection is available
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
});

afterEach(async () => {
  // Clean up test data after each test
  // We'll use a transaction-based approach to rollback changes
  // This ensures data isolation between tests
});

afterAll(async () => {
  // Disconnect from database after all tests
  await prisma.$disconnect();
  console.log('Database disconnected');
});

// Global test timeout
jest.setTimeout(10000);
