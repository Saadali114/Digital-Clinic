import type { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from './auth.validation.js';
import { hashPassword, verifyPassword } from '../../utils/password.js';
import { createSessionToken } from '../../utils/token.js';
import { SESSION_COOKIE_NAME } from '../../middleware/auth.js';
import { AppError } from '../../middleware/errorHandler.js';
import { prisma } from '../../config/db.js';
import { env } from '../../config/env.js';
import type { SessionPayload } from '../../types/index.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role, specialization } = validatedData;

    // Duplicate account check
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409);
    }

    const passwordHash = await hashPassword(password);

    // Create user and profile in transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          status: 'ACTIVE',
        },
      });

      if (role === 'PATIENT') {
        await tx.patientProfile.create({
          data: {
            userId: user.id,
          },
        });
      } else if (role === 'DOCTOR') {
        await tx.doctorProfile.create({
          data: {
            userId: user.id,
            specialization: specialization || 'General Practice',
            verificationStatus: 'PENDING',
          },
        });
      }

      return user;
    });

    const sessionPayload: SessionPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      status: newUser.status,
    };

    const token = await createSessionToken(sessionPayload);
    res.cookie(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      user: sessionPayload,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Anti-enumeration: Generic error message for non-existent user or wrong password
    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError('Your account has been suspended. Please contact clinic administration.', 403);
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401);
    }

    const sessionPayload: SessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    };

    const token = await createSessionToken(sessionPayload);
    res.cookie(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      user: sessionPayload,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  _req: Request,
  res: Response
): Promise<void> {
  res.cookie(SESSION_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        patientProfile: true,
        doctorProfile: {
          include: {
            credentials: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User profile not found.', 404);
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}
