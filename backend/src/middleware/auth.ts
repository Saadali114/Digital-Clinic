import type { Request, Response, NextFunction } from 'express';
import { verifySessionToken } from '../utils/token.js';
import { AppError } from './errorHandler.js';

export const SESSION_COOKIE_NAME = 'mediconnect_session';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const cookieToken = req.cookies?.[SESSION_COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const token = cookieToken || headerToken;

  if (token) {
    const payload = await verifySessionToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    throw new AppError('Authentication required. Please sign in.', 401);
  }
  next();
}
