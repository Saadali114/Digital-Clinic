import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../src/modules/auth/auth.validation.js';

describe('Backend Registration & Public Role Escalation Defenses', () => {
  it('should accept valid patient registration', () => {
    const input = {
      name: 'John Patient',
      email: 'john@example.com',
      password: 'ValidPassword123',
      role: 'PATIENT',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should accept valid doctor registration with specialization', () => {
    const input = {
      name: 'Dr. Sarah Connor',
      email: 'sarah@clinic.com',
      password: 'DoctorPass2026',
      role: 'DOCTOR',
      specialization: 'Cardiology',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should REJECT doctor registration when specialization is missing', () => {
    const input = {
      name: 'Dr. No Spec',
      email: 'nospec@clinic.com',
      password: 'DoctorPass2026',
      role: 'DOCTOR',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.specialization).toBeDefined();
    }
  });

  it('SECURITY: should REJECT public registration attempting to assign ADMIN role', () => {
    const maliciousInput = {
      name: 'Malicious Actor',
      email: 'hacker@example.com',
      password: 'HackerPass2026',
      role: 'ADMIN',
    };

    const result = registerSchema.safeParse(maliciousInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.role).toBeDefined();
    }
  });

  it('SECURITY: should REJECT public registration attempting to assign SUPER_ADMIN role', () => {
    const maliciousInput = {
      name: 'Malicious Super Admin',
      email: 'superhacker@example.com',
      password: 'SuperPass2026',
      role: 'SUPER_ADMIN',
    };

    const result = registerSchema.safeParse(maliciousInput);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.role).toBeDefined();
    }
  });

  it('should reject passwords shorter than 8 characters', () => {
    const input = {
      name: 'Weak Pass',
      email: 'weak@example.com',
      password: 'Pass1',
      role: 'PATIENT',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email formats', () => {
    const input = {
      name: 'Bad Email',
      email: 'not-an-email',
      password: 'Password123',
      role: 'PATIENT',
    };

    const result = registerSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('loginSchema should validate email and required password', () => {
    expect(loginSchema.safeParse({ email: 'valid@example.com', password: 'secret' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'invalid', password: 'secret' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'valid@example.com', password: '' }).success).toBe(false);
  });
});
