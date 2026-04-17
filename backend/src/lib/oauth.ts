import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { UnauthorizedException } from '@/lib/error';

export interface JwtPayload {
  sub: string;
  email?: string;
  iat: number;
  exp: number;
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return payload;
  } catch (error) {
    throw new UnauthorizedException('Invalid or expired token');
  }
};

export const generateToken = (
  userId: string,
  expiresIn: string = env.JWT_EXPIRATION
): string => {
  const options = {
    expiresIn,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign({ sub: userId }, env.JWT_SECRET, options as any);
};
