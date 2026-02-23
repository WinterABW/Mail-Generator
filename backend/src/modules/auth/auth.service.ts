import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config/app.config.ts';
import type { User, AuthPayload } from '../../types/index.d.ts';
import type { RegisterRequest, LoginRequest, AuthResponse } from './auth.types.ts';
import { logInfo, logError } from '../../utils/logger.util.ts';

const users: Map<string, User> = new Map();

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const { username, password } = data;

    const existingUser = Array.from(users.values()).find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.set(user.id, user);

    logInfo('User registered', { userId: user.id, username });

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const { username, password } = data;

    const user = Array.from(users.values()).find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    logInfo('User logged in', { userId: user.id, username });

    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  verifyToken(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, appConfig.jwt.secret) as AuthPayload;
      return decoded;
    } catch (error) {
      logError('Token verification failed', { error });
      throw new Error('Invalid token');
    }
  }

  private generateToken(user: User): string {
    const payload: AuthPayload = {
      userId: user.id,
      username: user.username,
    };

    return jwt.sign(payload, appConfig.jwt.secret, {
      expiresIn: appConfig.jwt.expiresIn,
    });
  }

  getUserById(userId: string): User | undefined {
    return users.get(userId);
  }
}

export const authService = new AuthService();
