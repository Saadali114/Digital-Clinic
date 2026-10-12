import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../src/utils/password.js';
import { createSessionToken, verifySessionToken } from '../src/utils/token.js';
import type { SessionPayload } from '../src/types/index.js';

describe('Backend Auth Utilities', () => {
  describe('Password Hashing (bcrypt)', () => {
    it('should hash passwords into standard bcrypt format', async () => {
      const password = 'SecurePassword123!';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('should verify correct password', async () => {
      const password = 'ClinicDoctor2026!';
      const hash = await hashPassword(password);
      const isMatch = await verifyPassword(password, hash);

      expect(isMatch).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'ClinicDoctor2026!';
      const hash = await hashPassword(password);
      const isMatch = await verifyPassword('WrongPassword123!', hash);

      expect(isMatch).toBe(false);
    });
  });

  describe('Session Token Management (Jose HS256 JWT)', () => {
    const mockPayload: SessionPayload = {
      userId: 'user-uuid-1234',
      email: 'doctor@mediconnect.local',
      name: 'Dr. Jane Smith',
      role: 'DOCTOR',
      status: 'ACTIVE',
    };

    it('should sign and verify valid session token', async () => {
      const token = await createSessionToken(mockPayload);
      expect(token).toBeDefined();

      const verified = await verifySessionToken(token);
      expect(verified).not.toBeNull();
      expect(verified?.userId).toBe(mockPayload.userId);
      expect(verified?.email).toBe(mockPayload.email);
      expect(verified?.role).toBe('DOCTOR');
    });

    it('should reject tampered tokens', async () => {
      const token = await createSessionToken(mockPayload);
      const tampered = token.slice(0, -6) + 'abcdef';

      const verified = await verifySessionToken(tampered);
      expect(verified).toBeNull();
    });

    it('should reject malformed non-JWT strings', async () => {
      const verified = await verifySessionToken('invalid.token.here');
      expect(verified).toBeNull();
    });
  });
});
