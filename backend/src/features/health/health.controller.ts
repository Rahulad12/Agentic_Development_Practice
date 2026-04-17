import { Request, Response } from 'express';
import { prisma } from '@/database/client';

export class HealthController {
  async check(req: Request, res: Response) {
    try {
      // Check database connectivity
      await prisma.$queryRaw`SELECT 1`;

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const healthController = new HealthController();
