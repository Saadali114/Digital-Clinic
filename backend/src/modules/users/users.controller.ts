import type { Request, Response, NextFunction } from 'express';
import { assertPatientOwnership } from '../../middleware/rbac.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../config/db.js';

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const { id } = req.params;

    // Enforce patient ownership: users cannot view another patient's profile
    assertPatientOwnership(req.user, id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        patientProfile: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}
