import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '@/lib/oauth';
import { UnauthorizedException } from '@/lib/error';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    // Token not required for all routes, only for protected endpoints
    return next();
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new UnauthorizedException('Authentication required'));
  }
  next();
};
