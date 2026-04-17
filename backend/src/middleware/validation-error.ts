import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const validationErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const fields: Record<string, string[]> = {};
    err.errors.forEach((error) => {
      const path = error.path.join('.');
      if (!fields[path]) {
        fields[path] = [];
      }
      fields[path].push(error.message);
    });

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: fields,
        timestamp: new Date().toISOString(),
      },
    });
  }
  next(err);
};
