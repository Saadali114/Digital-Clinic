import type { Request, Response, NextFunction } from 'express';
import type { Role, SessionPayload } from '../types/index.js';
import { AppError } from './errorHandler.js';

export function isRoleAllowed(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

export function requireRole(allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    if (!isRoleAllowed(req.user.role, allowedRoles)) {
      throw new AppError(
        `Access denied. Role '${req.user.role}' is not authorized. Required: ${allowedRoles.join(', ')}`,
        403
      );
    }

    next();
  };
}

export function assertPatientOwnership(session: SessionPayload, targetUserId: string): void {
  if (session.role === 'ADMIN' || session.role === 'SUPER_ADMIN') {
    return;
  }
  if (session.role === 'PATIENT' && session.userId === targetUserId) {
    return;
  }
  throw new AppError('Access denied: You cannot view or modify another patient profile.', 403);
}

export function assertDoctorOwnership(session: SessionPayload, targetUserId: string): void {
  if (session.role === 'SUPER_ADMIN') {
    return;
  }
  if (session.role === 'DOCTOR' && session.userId === targetUserId) {
    return;
  }
  throw new AppError('Access denied: You cannot modify another doctor profile.', 403);
}
