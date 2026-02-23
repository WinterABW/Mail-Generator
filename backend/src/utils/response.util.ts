import type { ApiResponse } from '../types/index.d.ts';

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(error: string, statusCode: number = 400): ApiResponse {
  return {
    success: false,
    error,
  };
}

export function notFoundResponse(resource: string): ApiResponse {
  return {
    success: false,
    error: `${resource} not found`,
  };
}

export function unauthorizedResponse(message: string = 'Unauthorized'): ApiResponse {
  return {
    success: false,
    error: message,
  };
}
