import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { logError } from '../utils/logger.util.ts';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logError('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
}
