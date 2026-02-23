import { createApp } from './app.ts';
import { appConfig } from './config/app.config.ts';
import { logger } from './utils/logger.util.ts';

const app = createApp();

const server = app.listen(appConfig.port, () => {
  logger.info(`Server running on port ${appConfig.port}`);
  logger.info(`Environment: ${appConfig.nodeEnv}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});
