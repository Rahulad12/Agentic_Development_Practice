import { Router } from 'express';
import { healthController } from './health.controller';

export const healthRoutes = Router();

healthRoutes.get('/', (req, res) => healthController.check(req, res));
