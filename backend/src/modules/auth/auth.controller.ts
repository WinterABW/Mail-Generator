import type { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service.ts';
import { successResponse, errorResponse } from '../../utils/response.util.ts';
import type { RegisterRequest, LoginRequest } from './auth.types.ts';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as RegisterRequest;

      if (!data.username || !data.password) {
        res.status(400).json(errorResponse('Username and password are required'));
        return;
      }

      if (data.password.length < 6) {
        res.status(400).json(errorResponse('Password must be at least 6 characters'));
        return;
      }

      const result = await authService.register(data);

      res.status(201).json(successResponse(result, 'User registered successfully'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json(errorResponse(message));
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as LoginRequest;

      if (!data.username || !data.password) {
        res.status(400).json(errorResponse('Username and password are required'));
        return;
      }

      const result = await authService.login(data);

      res.json(successResponse(result, 'Login successful'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      res.status(401).json(errorResponse(message));
    }
  }
}

export const authController = new AuthController();
