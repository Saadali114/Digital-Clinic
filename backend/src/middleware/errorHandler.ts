import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod request validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Known application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  // Handle Prisma Database connection errors (P1001)
  if (err.message && err.message.includes('P1001')) {
    res.status(503).json({
      error: 'Database unavailable',
      message: 'Could not connect to PostgreSQL database. Please ensure PostgreSQL service is running.',
    });
    return;
  }

  // Fallback internal server error
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.',
  });
}
