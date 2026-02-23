import { config } from 'dotenv';

config();

export const appConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  guerrilla: {
    defaultDomain: process.env.GUERRILLA_DEFAULT_DOMAIN || 'guerrillamail.com',
    apiUrl: 'http://api.guerrillamail.com/ajax.php',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  logLevel: process.env.LOG_LEVEL || 'info',
};

export const GUERRILLA_DOMAINS = [
  'guerrillamail.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
] as const;

export type GuerrillaDomain = typeof GUERRILLA_DOMAINS[number];
