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
