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
