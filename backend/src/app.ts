import express from 'express';
import cors from 'cors';
import { env } from '@/config/env';
import { errorHandler } from '@/middleware/error-handler';
import { validationErrorHandler } from '@/middleware/validation-error';
import { authenticateToken } from '@/middleware/auth.middleware';
import logger from '@/lib/logger';
import { productRoutes } from '@/features/products';
import { healthRoutes } from '@/features/health';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());

  // Authentication middleware (optional, extracts token if present)
  app.use(authenticateToken);

  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // Health check
  app.use('/health', healthRoutes);

  // Routes
  app.use('/api/app/products', productRoutes);

  // Error handling
  app.use(validationErrorHandler);
  app.use(errorHandler);

  return app;
};
