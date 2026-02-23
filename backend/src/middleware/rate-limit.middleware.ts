import rateLimit from 'express-rate-limit';
import { appConfig } from '../config/app.config.ts';

export const rateLimiter = rateLimit({
  windowMs: appConfig.rateLimit.windowMs,
  max: appConfig.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
});
