import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Public registration is strictly restricted to PATIENT or DOCTOR.
// Privileged roles (ADMIN, SUPER_ADMIN) are strictly forbidden from public registration.
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  password: passwordSchema,
  role: z.enum(['PATIENT', 'DOCTOR'], {
    errorMap: () => ({ message: 'Public registration only permits PATIENT or DOCTOR roles' }),
  }),
  specialization: z.string().trim().optional(),
}).refine(
  (data) => {
    if (data.role === 'DOCTOR') {
      return Boolean(data.specialization && data.specialization.length >= 2);
    }
    return true;
  },
  {
    message: 'Doctors must specify a medical specialization (min 2 characters)',
    path: ['specialization'],
  }
);

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
