import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.ts';
import emailRoutes from './modules/email/email.routes.ts';
import { rateLimiter } from './middleware/rate-limit.middleware.ts';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.ts';
import { logInfo } from './utils/logger.util.ts';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(rateLimiter);

  app.get('/health', (req, res) => {
    res.json({ success: true, message: 'API is running' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/emails', emailRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  logInfo('Express app created');

  return app;
}
