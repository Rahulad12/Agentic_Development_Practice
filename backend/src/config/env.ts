import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/myapp_db',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  OAUTH_PROVIDER: process.env.OAUTH_PROVIDER || 'github',
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || '',
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
} as const;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}
