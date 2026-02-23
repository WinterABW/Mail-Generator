import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.ts';
import { unauthorizedResponse } from '../../utils/response.util.ts';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(unauthorizedResponse('No token provided'));
      return;
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyToken(token);

    req.user = payload;
    next();
  } catch {
    res.status(401).json(unauthorizedResponse('Invalid token'));
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
      };
    }
  }
}
